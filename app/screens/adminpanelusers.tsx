import InputSearch from "@/components/InputSearch";
import UserList from "@/components/UserList";
import { useContextUser } from "@/contexts/ThemeProvider";
import useFilteredUsers from "@/hooks/useFilteredUsers";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, usePathname } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function AdminPanelUsers() {

    const { userData, setUserData, apiDir } = useContextUser();
    const { t } = useTranslation();
    
    const pathname = usePathname();

    const commonStyles = useCommonStyles();
    const colors = useThemeColors();

    const [users, setUsers] = useState<any[]>([]);

    const{useruData, setUseruData, filteredMessage, searchUser} = useFilteredUsers(users);

    useEffect(() => {
        setUseruData(users);
    }, [users]);

    useEffect(() => {
      if (apiDir === undefined) return;
          if (apiDir) {
              llamadaApi();
              obtenerUsers();
          }
      }, [pathname, apiDir]);
    
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
          router.push("/");
        } catch (error) {
          console.error('Error al borrar los datos', error);
        }
      };

      const obtenerUsers = () => {
            if (userData) {
                fetch(`${apiDir}/user/all`, {
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
                        setUsers(data);
                    })
                    .catch((error) => {
                        console.error(error);
                        router.replace("/");
                    }
                    );
            }
        }

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
                    <Text style={commonStyles.title}>{t('adminPanel.title')}</Text>

                    <View style={{flexDirection: "row", alignSelf: "center", gap: 10, marginBottom: 20}}>
                        <View style={{borderWidth: 2, borderColor: colors.border, borderRadius: 10, padding: 5, alignItems: "center", backgroundColor: colors.borderLight}}>
                            <Ionicons name="person" size={20} color={colors.text} />
                            <Text style={{color: colors.text}}>{t('adminPanel.users')}</Text>
                        </View>
                        <TouchableOpacity style={{borderWidth: 2, borderColor: colors.border, borderRadius: 10, padding: 5, alignItems: "center"}} onPress={() => {router.replace("/screens/adminpanelseries")}}>
                            <Ionicons name="book" size={20} color={colors.text} />
                            <Text style={{color: colors.text}}>{t('adminPanel.series')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{width: "95%", height: 425, alignSelf: "center", borderWidth: 2, borderColor: colors.border, borderRadius: 10, padding: 5}}>
                        <InputSearch onChange={searchUser}/>
                        <ScrollView
                            contentContainerStyle={commonStyles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <UserList data={useruData} filteredMessage={filteredMessage}/>
                        </ScrollView>
                    </View>

                    <View style={commonStyles.footer} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
