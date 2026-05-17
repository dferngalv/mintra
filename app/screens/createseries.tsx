import { commonStyles } from "@/components/styles/commonStyles";
import { useContextUser } from "@/contexts/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";

export default function Createseries() {

    const { userData, setUserData, apiDir } = useContextUser();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pathname = usePathname();

    const [formData, setFormData] = useState({
        title: "",
        sdescription: "",
        front_picture: "null",
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
            form.append("image", blob, "front.jpg");
        } else {
            form.append("image", {
                uri: formData.front_picture,
                name: "front.jpg",
                type: "image/jpeg",
            } as any);
        }

        if (userData) {

            fetch(`${apiDir}/series/upload/${series_id}`, {
                method: "POST",
                body: form,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al subir la imagen");
                    }
                    return response.text();
                })
                .then((url) => {

                    continueUpdate(url, series_id);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setError("An error ocurred loading the image.");
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

                    setError("An error ocurred saving the image.");
                    setLoading(false);
                }
                );
        }
        else {

            setError("Title must have data.");
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

                    setError("An error ocurred saving the image.");
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
                    setError("No se seleccionó ningún archivo");
                    return;
                }

                const file = target.files[0];

                if (!file) {
                    setError("Archivo inválido");
                    return;
                }

                const isValid =
                    file.type === "image/png" ||
                    file.type === "image/jpeg";

                if (isValid) {
                    const url = URL.createObjectURL(file);
                    setFormData(prev => ({ ...prev, front_picture: url }));
                    setError(null);
                } else {
                    setError("Solo JPG/JPEG o PNG");
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
                setFormData(prev => ({ ...prev, front_picture: uri }));
                setError(null);
            } else {
                setError("Solo JPG/JPEG o PNG");
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
                    <Text style={commonStyles.title}>Add a new series</Text>

                    <View style={{ flexDirection: "column", alignSelf: "center", justifyContent: "center", width: "100%", gap: 10 }}>
                        <View style={{ flexDirection: "row", flex: 1, gap: 10 }}>
                            <View style={{ flexDirection: "column" }}>
                                {(formData.front_picture !== "null") ? (
                                    <>

                                        <TouchableOpacity style={[commonStyles.iconBox]} onPress={pickImage}>
                                            <Image source={{ uri: formData.front_picture }} style={[commonStyles.iconImage, { marginTop: 20, height: 150, width: 100 }]} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={commonStyles.iconContainer} onPress={() => { setFormData(prev => ({ ...prev, front_picture: "null" })) }}>
                                            <Text style={commonStyles.textLinkLink}>Delete image</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity style={[commonStyles.iconBox, { marginTop: 20, alignSelf: "center" }]} onPress={pickImage}>
                                            <Ionicons name="image-outline" size={100} color="#000" />
                                        </TouchableOpacity>
                                    </>
                                )
                                }
                            </View>

                            <View style={{ flexDirection: "column", flex: 1, gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text>Title:</Text>
                                    <TextInput
                                        style={commonStyles.passwordInput}
                                        placeholder={formData.title}
                                        placeholderTextColor="#ccc"
                                        value={formData.title}
                                        onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text>Artists:</Text>
                                    <TextInput
                                        style={commonStyles.passwordInput}
                                        placeholder={formData.artists}
                                        placeholderTextColor="#ccc"
                                        value={formData.artists}
                                        onChangeText={(text) => setFormData(prev => ({ ...prev, artists: text }))}
                                        autoCapitalize="none"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text>Status:</Text>
                                    <RNPickerSelect
                                        value={formData.sstatus}
                                        placeholder={{}}
                                        onValueChange={(text) => setFormData(prev => ({ ...prev, sstatus: text }))}
                                        items={[
                                            { label: "Ongoing", value: "ongoing" },
                                            { label: "Completed", value: "completed" },
                                        ]}
                                    />
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text>Description:</Text>
                            <TextInput
                                style={[commonStyles.passwordInputLarge]}
                                placeholder={formData.sdescription}
                                placeholderTextColor="#ccc"
                                value={formData.sdescription}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, sdescription: text }))}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {error &&
                        <Text style={[commonStyles.required, { textAlign: "center" }]}>{error}</Text>
                    }

                    <TouchableOpacity
                        style={[commonStyles.iconBox, commonStyles.formButton, { marginTop: 20 }]}
                        onPress={createSeries}
                        disabled={loading}
                    >
                        <Text>Save series and continue to create chapters</Text>
                    </TouchableOpacity>
                    <View style={commonStyles.footer} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>

    );
}