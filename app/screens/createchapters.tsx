import { useContextUser } from "@/contexts/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";

export default function Createchapters() {

    const { seriesId } = useLocalSearchParams();
    const { userData, setUserData, apiDir } = useContextUser();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const colors = useThemeColors();
    const commonStyles = useCommonStyles();
    const styles = getStyles(colors);

    const pathname = usePathname();

    const [formData, setFormData] = useState({
        cnumber: "",
        title: "",
    });

    const [images, setImages] = useState<Array<{ uri: string; mimeType: string }>>([]);

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

    const uploadImage = async (chapter_id: number) => {
        for (let i = 0; i < images.length; i++) {
            const form = new FormData();
            const imageItem = images[i];
            let mimeType = imageItem.mimeType || "image/jpeg";
            let fileName = `page_${i + 1}.jpg`;
            if (mimeType === "image/png") {
                fileName = `page_${i + 1}.png`;
            }

            if (Platform.OS === "web") {
                const blob = await fetch(imageItem.uri).then((res) => res.blob());
                const blobType = blob.type || mimeType;
                const name = blobType === "image/png" ? `page_${i + 1}.png` : `page_${i + 1}.jpg`;
                form.append("image", blob, name);
            } else {
                form.append("image", {
                    uri: imageItem.uri,
                    name: fileName,
                    type: mimeType,
                } as any);
            }

            if (userData) {
                try {
                    const response = await fetch(`${apiDir}/chapter/upload/${chapter_id}/${i + 1}`, {
                        method: "POST",
                        body: form,
                    });

                    if (!response.ok) {
                        throw new Error(t("createchapters.errors.imageUploadError"));
                    }

                    const url = await response.text();
                    await continueUpdate(url, chapter_id, i);
                } catch (error) {
                    console.error("Error:", error);
                    setError(t("createchapters.errors.imageSaveError"));
                    setLoading(false);
                    return;
                }
            }
        }
    }

    const createChapter = async () => {

        setError("");

        if (loading) return;

        setLoading(true);

        if (formData.cnumber !== "") {

            await llamadaApiComprobacion();

            fetch(`${apiDir}/chapter/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cnumber: parseInt(formData.cnumber),
                    title: (formData.title !== "") ? formData.title : ("Chapter " + formData.cnumber),
                    series: {
                        "seriesId": seriesId
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

                    if (images.length > 0) {
                        await uploadImage(data.chapterId);
                    }
                    else{
                        setError(t("createchapters.submitted"));
                        setLoading(false);
                    }
                })
                .catch((error) => {

                    setError(t("createchapters.errors.chapterSaveError"));
                    setLoading(false);
                }
                );
        }
        else {

            setError(t("createchapters.errors.numberRequired"));
            setLoading(false);
        }

    };

    const continueUpdate = async (picture: string, chapter_id: number, i: number) => {

        if (userData) {
            fetch(`${apiDir}/picture/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    porder: i + 1,
                    url: picture,
                    chapter : {
                        chapterId : chapter_id
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
                }
                );
        }

        setLoading(false);
    };

    const pickImage = async () => {

        if (Platform.OS === "web") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".png,.jpg,.jpeg,image/png,image/jpeg";

            input.onchange = (e) => {

                const target = e.currentTarget as HTMLInputElement;

                if (!target || !target.files || target.files.length === 0) {
                    setError(t("createchapters.errors.noFileSelected"));
                    return;
                }

                const file = target.files[0];

                if (!file) {
                    setError(t("createchapters.errors.invalidFile"));
                    return;
                }

                const isValid =
                    file.type === "image/png" ||
                    file.type === "image/jpeg";

                if (isValid) {
                    const url = URL.createObjectURL(file);
                    setImages([...images, { uri: url, mimeType: file.type }]);
                    setError(null);
                } else {
                    setError(t("createchapters.errors.imageFormatError"));
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
            const type = asset.mimeType;

            const isImage =
                type?.startsWith("image/") ||
                uri.match(/\.(jpg|jpeg|png)$/i);

            if (isImage) {
                setImages([...images, { uri, mimeType: type ?? "image/jpeg" }]);
                setError(null);
            } else {
                setError(t("createchapters.errors.imageFormatError"));
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
                    <Text style={commonStyles.title}>{t("createchapters.title")}</Text>
                    <View style={styles.chapterFields}> 
                        <View style={styles.chapterField}>
                            <Text style={commonStyles.label}>{t("createchapters.chapterNumberLabel")}</Text>
                            <TextInput
                                style={commonStyles.passwordInput}
                                placeholder={formData.cnumber}
                        placeholderTextColor={colors.textSecondary}
                                value={formData.cnumber}
                                onChangeText={(text) => {
                                    let numeric = text.replace(/[^0-9]/g, "");
                                    numeric = numeric.replace(/^0+/, "");
                                    numeric = numeric.slice(0, 4);
                                    if (numeric === "" || parseInt(numeric) > 0) {
                                        setFormData(prev => ({
                                            ...prev,
                                            cnumber: numeric
                                        }));
                                    }
                                }}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.chapterField}>
                            <Text style={commonStyles.label}>{t("createchapters.titleOptionalLabel")}</Text>
                            <TextInput
                                style={commonStyles.passwordInput}
                                placeholder={formData.title}
                        placeholderTextColor={colors.textSecondary}
                                value={formData.title}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {images.map((img, index) => (
                        <View key={index} style={{ width: "100%" }}>
                            <Image source={{ uri: img.uri }} style={[commonStyles.iconImage, { marginTop: 20, height: "100%", width: "80%", alignSelf: "center", aspectRatio: 3 / 4, }]} />
                        </View>
                    ))}

                    {images.length > 0 &&
                        <TouchableOpacity style={[commonStyles.iconContainer, {marginTop:20}]} onPress={() => { setImages([]) }}>
                            <Text style={commonStyles.textLinkLink}>{t("createchapters.deleteAllImages")}</Text>
                        </TouchableOpacity>
                    }

                    <View style={styles.imageUploadSection}>
                        <TouchableOpacity style={[commonStyles.iconBox, styles.uploadBox]} onPress={pickImage}>
                        <Ionicons name="image-outline" size={80} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={commonStyles.subtitle}>{t("createchapters.uploadPrompt")}</Text>
                    </View>

                    {error &&
                        <Text style={[commonStyles.required, { textAlign: "center" }]}>{error}</Text>
                    }

                    <TouchableOpacity
                        style={[commonStyles.iconBox, commonStyles.formButton, { marginTop: 20 }]}
                        onPress={createChapter}
                        disabled={loading}
                    >
                        <Text>{t("createchapters.saveBtn")}</Text>
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        style={[commonStyles.iconBox, commonStyles.formButton, { marginTop: 20 }]}
                        onPress={() => router.push("/")}
                        disabled={loading}
                    >
                        <Text>{t("createchapters.backBtn")}</Text>
                    </TouchableOpacity>
                    <View style={commonStyles.footer} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
    chapterFields: {
        width: '100%',
        gap: 14,
        marginTop: 10,
    },
    chapterField: {
        width: '100%',
    },
    imageUploadSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        gap: 8,
    },
    uploadBox: {
        width: '100%',
        maxWidth: 220,
        minHeight: 140,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: colors.cardItem,
        borderWidth: 1,
        borderColor: colors.borderLight,
        padding: 16,
    },
});