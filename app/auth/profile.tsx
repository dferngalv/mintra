import { useContextUser } from "@/contexts/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function Profile() {

    const { userData, setUserData, apiDir } = useContextUser();
    const [error, setError] = useState<string | null>(null);
    const [image, setImage] = useState("null");
    const { t } = useTranslation();

    const pathname = usePathname();

    const commonStyles = useCommonStyles();
    const colors = useThemeColors();

    const [formData, setFormData] = useState({
        picture: "null",
        uname: "",
        email: "",
        bio: "",
        date: "",
        type: ""
    });

    useEffect(() => {

        if (userData === undefined) return;

        if (!userData) {
            router.replace("/");
        }
        else {

            if (apiDir) {

                llamadaApi();
            }
        }
    }, [userData, pathname, apiDir]);

    const llamadaApi = () => {

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
                            `Error al iniciar sesión ${response.status}`;

                        throw new Error(message);
                    }

                    return dataResult;
                })
                .then((data) => {
                    if (data === null) {
                        logout();
                    }
                    else {

                        setFormData(prev => ({
                            ...prev,
                            picture: (data.picture !== null) ? data.picture : "null",
                            uname: data.uname,
                            email: data.email,
                            bio: data.bio,
                            date: data.register_date,
                            type: data.utype
                        }));
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

    const uploadImage = async () => {

        const form = new FormData();

        let respuesta = "null";

        if (Platform.OS === "web") {
            const blob = await fetch(image).then(res => res.blob());
            form.append("image", blob, "avatar.jpg");
        } else {
            form.append("image", {
                uri: image,
                name: "avatar.jpg",
                type: "image/jpeg",
            } as any);
        }

        if (userData) {

            fetch(`${apiDir}/user/upload/${userData}`, {
                method: "POST",
                body: form,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(t("profile.errors.imageUploadError"));
                    }
                    return response.text();
                })
                .then((url) => {

                    if (url !== null) {
                        //return setFormData(prev => ({ ...prev, picture: url }));
                        continueUpdate(url);
                    }
                    else {

                        logout();
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setError(t("profile.errors.imageSaveError"));
                });
        }
    }

    const updateUser = async () => {

        if (userData) {

            if (image !== "null") {

                await uploadImage();
            }
            else {

                if(formData.picture === "null"){
                    
                    fetch(`${apiDir}/user/delete/${userData}`, {
                        method: "DELETE",
                    })
                        .then((data) => {
                            if (data === null) {

                                logout();
                            }
                        })
                        .catch(() => {
                            setError(t("profile.errors.imageSaveError"));
                        });

                    continueUpdate("null");
                }
                else{

                    continueUpdate(formData.picture);
                }
            }
        }
    };

    const continueUpdate = async (picture: string) => {

        if (userData) {
            fetch(`${apiDir}/user/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData,
                    uname: formData.uname,
                    bio: formData.bio,
                    picture: (picture !== "null") ? picture : "null"
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
                            `Error al iniciar sesión ${response.status}`;

                        throw new Error(message);
                    }

                    return dataResult;
                })
                .then((data) => {

                    if (data !== null) {
                        //guardarDatos();
                        router.push("/");
                    }
                    else {
                        logout();
                    }
                })
                .catch((error) => {
                    setError(t("profile.errors.imageSaveError"));
                }
                );
        }
    };

    const pickImage = async () => {

        if (Platform.OS === "web") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";

            input.onchange = (e) => {

                const target = e.currentTarget as HTMLInputElement;

                if (!target || !target.files || target.files.length === 0) {
                    setError(t("profile.errors.noFileSelected"));
                    return;
                }

                const file = target.files[0];

                if (!file) {
                    setError(t("profile.errors.invalidFile"));
                    return;
                }

                if (file.type.startsWith("image/")) {
                    const url = URL.createObjectURL(file);
                    setImage(url);
                    setError(null);
                } else {
                    setError(t("profile.errors.imageFormatError"));
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
                setImage(uri);
                setError(null);
            } else {
                setError(t("profile.errors.imageFormatError"));
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
                    <Text style={commonStyles.title}>{t("profile.title")}</Text>
                    <Text style={commonStyles.subtitle}>{t("profile.subtitle")}</Text>

                    {error &&
                        <Text style={[commonStyles.required, { textAlign: "center" }]}>{error}</Text>
                    }

                    {(image !== "null" || formData.picture !== "null") ? (
                        <>
                            <TouchableOpacity style={[commonStyles.iconBox]} onPress={pickImage}>
                                <Image source={{ uri: image !== "null" ? image : `${apiDir}${formData.picture}?t=${Date.now()}` }} style={[commonStyles.iconImage, { marginTop: 20, height: 100, width: 100 }]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={commonStyles.iconContainer} onPress={() => { setImage("null"); setFormData(prev => ({ ...prev, picture: "null" })) }}>
                                <Text style={commonStyles.textLinkLink}>{t("profile.deleteImage")}</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={[commonStyles.iconBox, { marginTop: 20 }]} onPress={pickImage}>
                            <Ionicons name="person-circle" size={100} color={colors.text} />
                        </TouchableOpacity>
                    )
                    }

                    <Text style={commonStyles.subtitle}>{t("profile.profilePicture")}</Text>
                    <Text style={[commonStyles.title, { marginTop: 20 }]}>{t("profile.accountInformation")}</Text>

                    <View style={{ alignSelf: "center", width: "100%" }}>
                        <View style={{ flexDirection: "row", gap: 10, height: 70 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text }}>{t("profile.username")}</Text>
                                <TextInput
                                    style={commonStyles.passwordInput}
                                    placeholder={formData.uname}
                                    placeholderTextColor={colors.placeholder}
                                    value={formData.uname}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, uname: text }))}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text }}>{t("profile.email")}</Text>
                                <ScrollView
                                    style={[commonStyles.passwordInput, { backgroundColor: colors.borderLight }]}
                                >
                                    <Text style={{ color: colors.text }}>
                                        {formData.email}
                                    </Text>
                                </ScrollView>
                                {/*
                                <TextInput
                                    style={[commonStyles.passwordInput, { backgroundColor: "lightgray" }]}
                                    placeholder={formData.email}
                                    placeholderTextColor="#ccc"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                                    autoCapitalize="none"
                                    editable={false}
                                    scrollEnabled={true}
                                />
                                */}
                            </View>
                        </View>
                        <View style={{ flexDirection: "column", marginTop: 10, height: 70 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text }}>{t("profile.bio")}</Text>
                                <TextInput
                                    style={commonStyles.passwordInput}
                                    placeholder={formData.bio}
                                    placeholderTextColor={colors.placeholder}
                                    value={formData.bio}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 90, marginTop: 10 }}>
                            <View>
                                <Text style={{ color: colors.text }}>{t("profile.accountCreated")}</Text>
                                <Text style={{ color: colors.textSecondary }}>{formData.date}</Text>
                            </View>

                            <View>
                                <View>
                                    <Text style={{ color: colors.text }}>{t("profile.role")}</Text>
                                    <Text style={{ color: colors.textSecondary }}>{formData.type}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={[commonStyles.iconBox, commonStyles.formButton, { marginTop: 20 }]} onPress={updateUser}>
                            <Text style={{ color: colors.text }}>{t("profile.saveChanges")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={commonStyles.footer}/>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}