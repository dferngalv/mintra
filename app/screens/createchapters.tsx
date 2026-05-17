import { commonStyles } from "@/components/styles/commonStyles";
import { useContextUser } from "@/contexts/ThemeProvider";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function Createchapters() {

    const { seriesId } = useLocalSearchParams();
    const { userData, setUserData, apiDir } = useContextUser();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pathname = usePathname();

    const [formData, setFormData] = useState({
        cnumber: "",
        title: "",
    });

    const [image, setImage] = useState<string[]>([]);

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

        for (let i = 0; i < image.length; i++) {
            const form = new FormData();

            if (Platform.OS === "web") {
                const blob = await fetch(image[i]).then(res => res.blob());
                form.append("image", blob, "front.jpg");
            } else {
                form.append("image", {
                    uri: image,
                    name: "front.jpg",
                    type: "image/jpeg",
                } as any);
            }

            if (userData) {

                fetch(`${apiDir}/chapter/upload/${chapter_id}/${i + 1}`, {
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

                        continueUpdate(url, chapter_id, i);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        setError("An error ocurred loading the images.");
                        setLoading(false);
                    });
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

                    if (image.length > 0) {

                        await uploadImage(data.chapterId);
                    }
                    else{
                        setError("CHAPTER SUBMITTED.");
                        setLoading(false);
                    }
                })
                .catch((error) => {

                    setError("An error ocurred saving the chapter. Probably, there's a chapter with the same chapter number for this series.");
                    setLoading(false);
                }
                );
        }
        else {

            setError("Chapter number must have a chapter number.");
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

                    return dataResult;
                })
                .then((data) => {

                    setError("CHAPTER SUBMITTED.");
                    setLoading(false);
                })
                .catch((error) => {

                    setError("An error ocurred saving the images.");
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
                    setError("Any file selected.");
                    return;
                }

                const file = target.files[0];

                if (!file) {
                    setError("The uploaded file is not valid.");
                    return;
                }

                const isValid =
                    file.type === "image/png" ||
                    file.type === "image/jpeg";

                if (isValid) {
                    const url = URL.createObjectURL(file);
                    setImage([...image, url]);
                    setError(null);
                } else {
                    setError("Only JPG/JPEG or PNG");
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
                setImage([...image, uri]);
                setError(null);
            } else {
                setError("Only JPG/JPEG or PNG");
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
                    <Text style={commonStyles.title}>Add chapters</Text>
                    <View style={{ flexDirection: "row", gap: 10, height: 70 }}>
                        <View style={{ flex: 1 }}>
                            <Text>Chapter number:</Text>
                            <TextInput
                                style={commonStyles.passwordInput}
                                placeholder={formData.cnumber}
                                placeholderTextColor="#ccc"
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

                        <View style={{ flex: 1 }}>
                            <Text>Title (optional):</Text>
                            <TextInput
                                style={commonStyles.passwordInput}
                                placeholder={formData.title}
                                placeholderTextColor="#ccc"
                                value={formData.title}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {image.map((img, index) => (
                        <View style={{ width: "100%" }}>
                            <Image key={index} source={{ uri: img }} style={[commonStyles.iconImage, { marginTop: 20, height: "100%", width: "80%", alignSelf: "center", aspectRatio: 3 / 4, }]} />
                        </View>
                    ))}

                    {image.length > 0 &&
                        <TouchableOpacity style={[commonStyles.iconContainer, {marginTop:20}]} onPress={() => { setImage([]) }}>
                            <Text style={commonStyles.textLinkLink}>Delete all images</Text>
                        </TouchableOpacity>
                    }

                    <TouchableOpacity style={[commonStyles.iconBox, { marginTop: 20 }]} onPress={pickImage}>
                        <Ionicons name="image-outline" size={100} color="#000" />
                    </TouchableOpacity>

                    <Text style={commonStyles.subtitle}>Click the icon to upload a new chapter picture</Text>

                    {error &&
                        <Text style={[commonStyles.required, { textAlign: "center" }]}>{error}</Text>
                    }

                    <TouchableOpacity
                        style={[commonStyles.iconBox, commonStyles.formButton, { marginTop: 20 }]}
                        onPress={createChapter}
                        disabled={loading}
                    >
                        <Text>Save chapter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[commonStyles.iconBox, commonStyles.formButton, { marginTop: 20 }]}
                        onPress={() => router.push("/")}
                        disabled={loading}
                    >
                        <Text>Go back to menu</Text>
                    </TouchableOpacity>
                    <View style={commonStyles.footer} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}