import { useContextUser } from "@/contexts/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, usePathname } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";

export default function Createseries() {

    const { userData, setUserData, apiDir } = useContextUser();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const colors = useThemeColors();
    const commonStyles = useCommonStyles();
    const styles = getStyles(colors);

    const pathname = usePathname();

    const [formData, setFormData] = useState({
        title: "",
        sdescription: "",
        front_picture: "null",
        front_picture_type: "image/jpeg",
        sstatus: "completed",
        artists: "",
        creation_date: "",
    });

    useEffect(() => {

        if (userData === undefined) return;

        if (!userData) {
            router.replace("/");
        }
    }, [userData, pathname]);

    const llamadaApiComprobacion = async () => {

        if (userData) {

            fetch(`${apiDir}/user/${userData}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(async (response) => {

                    const text = await response.text();

                    console.log(text);

                    let dataResult = null;

                    try {
                        dataResult = text ? JSON.parse(text) : null;
                    } catch (e) {

                        dataResult = null;
                    }

                    if (!response.ok) {

                        const message =
                            text ||
                            `Error ${response.status}`;

                        throw new Error(message);
                    }

                    return dataResult;
                })
                .then((data) => {
                    if (data === null) {
                        logout();
                    }
                })
                .catch((error) => {

                    console.error(error);
                    router.replace("/");
                }
                );
        }
    }

    const logout = async () => {

        try {

            if (Platform.OS === "web") {

                localStorage.removeItem("user_id");
            }
            else {
                await SecureStore.deleteItemAsync('user_id');
            }
            setUserData(null);
            router.replace("/");
        } catch (error) {
            console.error('Error al borrar los datos', error);
        }
    };

    const uploadImage = async (series_id: number) => {

        const form = new FormData();

        if (Platform.OS === "web") {
            const blob = await fetch(formData.front_picture).then(res => res.blob());
            form.append("image", blob, "front" + (blob.type === "image/png" ? ".png" : ".jpg"));
        } else {
            form.append("image", {
                uri: formData.front_picture,
                name: formData.front_picture_type === "image/png" ? "front.png" : "front.jpg",
                type: formData.front_picture_type,
            } as any);
        }

        if (userData) {

            fetch(`${apiDir}/series/upload/${series_id}`, {
                method: "POST",
                body: form,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(t("createseries.errors.imageUploadError"));
                    }
                    return response.text();
                })
                .then((url) => {

                    continueUpdate(url, series_id);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setError(t("createseries.errors.imageLoadError"));
                    setLoading(false);
                });
        }
    }

    const createSeries = async () => {

        if (loading) return;

        setLoading(true);

        if (formData.title !== "") {

            await llamadaApiComprobacion();

            fetch(`${apiDir}/series/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "title": formData.title,
                    "sdescription": formData.sdescription,
                    "sstatus": formData.sstatus,
                    "artists": formData.artists,
                    "user": {
                        "userId": userData
                    }
                })
            })
                .then(async (response) => {

                    const text = await response.text();

                    console.log(text);

                    let dataResult = null;

                    try {
                        dataResult = text ? JSON.parse(text) : null;
                    } catch (e) {

                        dataResult = null;
                    }

                    if (!response.ok) {

                        const message =
                            text ||
                            `Error ${response.status}`;

                        throw new Error(message);
                    }

                    return dataResult;
                })
                .then(async (data) => {

                    if (formData.front_picture !== "null") {

                        await uploadImage(data.seriesId);
                    }
                    else {

                        continueUpdate("null", data.seriesId);
                    }
                })
                .catch((error) => {

                    setError(t("createseries.errors.imageSaveError"));
                    setLoading(false);
                }
                );
        }
        else {

            setError(t("createseries.errors.titleRequired"));
            setLoading(false);
        }

    };

    const continueUpdate = async (picture: string, series_id: number) => {

        if (userData) {
            fetch(`${apiDir}/series/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    seriesId: series_id,
                    front_picture: (picture !== "null") ? picture : "null"
                })
            })
                .then(async (response) => {

                    const text = await response.text();

                    console.log(text);

                    let dataResult = null;

                    try {
                        dataResult = text ? JSON.parse(text) : null;
                    } catch (e) {

                        dataResult = null;
                    }

                    if (!response.ok) {

                        const message =
                            text ||
                            `Error ${response.status}`;

                        throw new Error(message);
                    }

                    return dataResult;
                })
                .then((data) => {

                    router.push({
                        pathname: "/screens/createchapters",
                        params: {
                            seriesId: series_id.toString(),
                        }
                    });
                })
                .catch((error) => {

                    setError(t("createseries.errors.imageSaveError"));
                    setLoading(false);
                }
                );
        }
    };

    const pickImage = async () => {

        if (Platform.OS === "web") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".png,.jpg,.jpeg,image/png,image/jpeg";

            input.onchange = (e) => {

                const target = e.currentTarget as HTMLInputElement;

                if (!target || !target.files || target.files.length === 0) {
                    setError(t("createseries.errors.noFileSelected"));
                    return;
                }

                const file = target.files[0];

                if (!file) {
                    setError(t("createseries.errors.invalidFile"));
                    return;
                }

                const isValid =
                    file.type === "image/png" ||
                    file.type === "image/jpeg";

                if (isValid) {
                    const url = URL.createObjectURL(file);
                    setFormData(prev => ({ ...prev, front_picture: url, front_picture_type: file.type }));
                    setError(null);
                } else {
                    setError(t("createseries.errors.imageFormatError"));
                }
            };

            input.click();
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            const uri = asset.uri;
            const type = asset.mimeType ?? "image/jpeg";

            const isImage =
                type?.startsWith("image/") ||
                uri.match(/\.(jpg|jpeg|png)$/i);

            if (isImage) {
                setFormData(prev => ({ ...prev, front_picture: uri, front_picture_type: type }));
                setError(null);
            } else {
                setError(t("createseries.errors.imageFormatError"));
            }
        }
    };

    return (
        <View style={commonStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={commonStyles.containerInner}
            >
                <ScrollView
                    contentContainerStyle={commonStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={commonStyles.title}>{t("createseries.title")}</Text>

                    <View style={styles.formTopSection}>
                        <View style={styles.coverSection}>
                            <Text style={commonStyles.label}>{t("createseries.coverImageLabel")}</Text>
                            <Text style={styles.coverHint}>{t("createseries.coverImageHint")}</Text>
                            {(formData.front_picture !== "null") ? (
                                <>
                                    <TouchableOpacity style={[commonStyles.iconBox, styles.coverUploadBox]} onPress={pickImage}>
                                        <Image source={{ uri: formData.front_picture }} style={styles.coverImagePreview} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={commonStyles.iconContainer} onPress={() => { setFormData(prev => ({ ...prev, front_picture: "null" })) }}>
                                        <Text style={commonStyles.textLinkLink}>{t("createseries.deleteImage")}</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity style={[commonStyles.iconBox, styles.coverUploadBox]} onPress={pickImage}>
                                    <Ionicons name="image-outline" size={80} color={colors.text} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.fieldsSection}>
                            <View style={styles.fieldRow}>
                                <Text style={commonStyles.label}>{t("createseries.titleLabel")}</Text>
                                <TextInput
                                    style={commonStyles.input}
                                    placeholder={t("createseries.titleLabel")}
                                    placeholderTextColor={colors.textSecondary}
                                    value={formData.title}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.fieldRow}>
                                <Text style={commonStyles.label}>{t("createseries.artistsLabel")}</Text>
                                <TextInput
                                    style={commonStyles.input}
                                    placeholder={t("createseries.artistsLabel")}
                                    placeholderTextColor={colors.textSecondary}
                                    value={formData.artists}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, artists: text }))}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.fieldRow}>
                                <Text style={commonStyles.label}>{t("createseries.statusLabel")}</Text>
                                <View style={styles.pickerWrapper}>
                                    <RNPickerSelect
                                        value={formData.sstatus}
                                        placeholder={{}}
                                        onValueChange={(text) => setFormData(prev => ({ ...prev, sstatus: text }))}
                                        items={[
                                            { label: t("createseries.ongoing"), value: "ongoing" },
                                            { label: t("createseries.completed"), value: "completed" },
                                        ]}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={commonStyles.label}>{t("createseries.descriptionLabel")}</Text>
                        <TextInput
                            style={[commonStyles.textbox, styles.descriptionInput]}
                            placeholder={t("createseries.descriptionPlaceholder")}
                            placeholderTextColor={colors.textSecondary}
                            value={formData.sdescription}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, sdescription: text }))}
                            autoCapitalize="none"
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                        />
                    </View>

                    {error &&
                        <Text style={[commonStyles.required, { textAlign: "center" }]}>{error}</Text>
                    }

                    <TouchableOpacity
                        style={[commonStyles.iconBox, commonStyles.formButton, { marginTop: 20 }]}
                        onPress={createSeries}
                        disabled={loading}
                    >
                        <Text>{t("createseries.saveBtn")}</Text>
                    </TouchableOpacity>
                    <View style={commonStyles.footer} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>

    );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
    coverPickerContainer: {
        marginTop: 20,
        alignItems: 'flex-start',
    },
    coverHint: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 12,
        maxWidth: '90%',
    },
    coverUploadBox: {
        marginTop: 10,
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.cardItem,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    coverImagePreview: {
        marginTop: 0,
        width: 140,
        height: 180,
        borderRadius: 12,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    },
    descriptionInput: {
        minHeight: 130,
        borderRadius: 10,
        backgroundColor: colors.background,
    },
    formTopSection: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    coverSection: {
        flex: 1,
    },
    fieldsSection: {
        flex: 2,
        gap: 12,
    },
    fieldRow: {
        gap: 4,
    },
});