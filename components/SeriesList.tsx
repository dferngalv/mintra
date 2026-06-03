import { useContextUser } from "@/contexts/ThemeProvider";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { Alert, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

interface Data {
    data: any[],
    filteredMessage: string
}

export default function SeriesList({data, filteredMessage} : Data){

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

    const deleteSeries = async (seriesId: number) => {
        if (!userData) {
            return;
        }

        try {
            const response = await fetch(`${apiDir}/series/${seriesId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            const text = await response.text();
            if (!response.ok) {
                const message = text || `Error ${response.status}`;
                throw new Error(message);
            }

            router.replace(`/screens/adminpanelseries?refresh=${Date.now()}`);
        } catch (error) {
            console.error(error);
            Alert.alert(t('seriesList.deleteError'));
        }
    };

    return(
        <FlatList
            data={data}
            renderItem={({item}) =>
                <View style={{flex: 1,flexDirection: 'row', flexWrap: "wrap", alignItems: 'center', borderWidth: 2, borderColor: colors.border, padding: 10, gap: 20}}>
                        <Text style={{color: colors.text}}>{t('seriesList.title')}: {item.title}</Text>
                        <Text style={{color: colors.text}}>{t('seriesList.artists')}: {item.artists}</Text>
                        <View style={{marginLeft: 'auto', flexDirection: 'row', flexWrap: "wrap", gap: 10}}>
                            <TouchableOpacity onPress={() => {llamadaApi(); deleteSeries(item.seriesId);}}>
                                <Text style={commonStyles.textLinkLink}>{t('seriesList.deleteSeries')}</Text>
                            </TouchableOpacity>
                        </View>
                </View>}
            ListHeaderComponent={    
                <Text style={[commonStyles.subtitle, {paddingBottom: 10, textAlign: 'center'}]}>{filteredMessage}</Text>
            }
        />
    );
}
