import { useContextUser } from "@/contexts/ThemeProvider";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

interface Data {
    data: any[],
    filteredMessage: string
}

export default function UserList({data, filteredMessage} : Data){

    const { userData, setUserData, apiDir } = useContextUser();
    const { t } = useTranslation();
    const commonStyles = useCommonStyles();
    const colors = useThemeColors();

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
                    let dataResult = null;
                    try {
                        dataResult = text ? JSON.parse(text) : null;
                    } catch (e) {
                        dataResult = null;
                    }
                    if (!response.ok) {
                        const message = text || `Error ${response.status}`;
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
                });
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
            router.push("/");
        } catch (error) {
            console.error('Error al borrar los datos', error);
        }
    };

    const changeAdmin = async (userId: number, utype: string) => {
        if (userData) {
            fetch(`${apiDir}/user/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    utype: utype === "creator" ? "admin" : "creator",
                })
            })
                .then(async (response) => {
                    const text = await response.text();
                    let dataResult = null;
                    try {
                        dataResult = text ? JSON.parse(text) : null;
                    } catch (e) {
                        dataResult = null;
                    }
                    if (!response.ok) {
                        const message = text || `Error ${response.status}`;
                        throw new Error(message);
                    }
                    return dataResult;
                })
                .then(() => {
                    router.replace("/screens/adminpanelusers");
                })
                .catch((error) => {
                    console.log("An error ocurred saving the data.");
                });
        }
    };

    const deleteUser = async (userId: number) => {
        if (userData) {
            fetch(`${apiDir}/user/${userId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(async (response) => {
                    const text = await response.text();
                    let dataResult = null;
                    try {
                        dataResult = text ? JSON.parse(text) : null;
                    } catch (e) {
                        dataResult = null;
                    }
                    if (!response.ok) {
                        const message = text || `Error ${response.status}`;
                        throw new Error(message);
                    }
                    return dataResult;
                })
                .then(() => {
                    router.replace("/screens/adminpanelusers");
                })
                .catch((error) => {
                    console.log("An error ocurred saving the data.");
                });
        }
    };

    return(
        <FlatList
            data={data}
            renderItem={({item}) =>
                <View style={{flex: 1,flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', borderWidth: 2, borderColor: colors.border, padding: 10, gap: 20}}>
                        <Text style={{color: colors.text}}>{t('userList.username')}: {item.uname}</Text>
                        <Text style={{color: colors.text}}>{t('userList.email')}: {item.email}</Text>
                        <Text style={{color: colors.text}}>{t('userList.userType')}: {item.utype}</Text>
                        { item.userId !== Number(userData) &&
                        <View style={{marginLeft: 'auto', flexDirection: 'row', flexWrap: "wrap", gap: 10}}>
                            <TouchableOpacity onPress={() => {llamadaApi(); deleteUser(item.userId);}}>
                                <Text style={commonStyles.textLinkLink}>{t('userList.deleteUser')}</Text>
                            </TouchableOpacity>
                                <TouchableOpacity onPress={() => {llamadaApi(); changeAdmin(item.userId, item.utype);}}>
                                    <Text style={commonStyles.textLinkLink}>{t('userList.switchAdmin')}</Text>
                                </TouchableOpacity>
                        </View>
                }
                </View>}
            ListHeaderComponent={    
                <Text style={[commonStyles.subtitle, {paddingBottom: 10, textAlign: 'center'}]}>{filteredMessage}</Text>
            }
        />
    );
}
