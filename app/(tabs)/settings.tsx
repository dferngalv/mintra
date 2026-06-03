import { useContextUser } from "@/contexts/ThemeProvider";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {

  const { userData, setUserData, apiDir, themeMode, setThemeMode } = useContextUser();
  const { t, i18n } = useTranslation();

  const [type, setType] = useState("");
  const [langOpen, setLangOpen] = useState(false);

  const isDark = themeMode === "dark";
  const styles = getStyles(isDark);
  const iconColor = isDark ? "#fff" : "#000";
  const chevronColor = isDark ? "#aaa" : "#999";

  useEffect(() => {
    if (apiDir === undefined) return;
    if (userData && apiDir) {
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
          } else {
            setType(data.utype);
          }
        })
        .catch((error) => {
          console.error(error);
          router.replace("/");
        });
    }
  }, [userData, apiDir]);

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

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Settings Title */}
        <Text style={styles.title}>{t('settings.title')}</Text>

        {/* Menu Items Section */}
        <View style={styles.menuSection}>
          {/* Languages */}
          <TouchableOpacity style={[styles.menuItem, !userData && !langOpen && styles.lastMenuItem]} onPress={() => setLangOpen(o => !o)}>
            <View style={styles.menuItemContent}>
              <View style={styles.iconBoxSmall}>
                <FontAwesome
                  name="language"
                  size={20}
                  color={iconColor}
                />
              </View>
              <Text style={styles.menuItemText}>{t('settings.languages')}</Text>
            </View>
            <Ionicons name={langOpen ? "chevron-down" : "chevron-forward"} size={24} color={chevronColor} />
          </TouchableOpacity>

          {langOpen && (
            <View style={styles.langSubmenu}>
              <TouchableOpacity
                style={[styles.langOption, i18n.language === 'es' && styles.langOptionActive]}
                onPress={() => i18n.changeLanguage('es')}
              >
                <Text style={[styles.langOptionText, i18n.language === 'es' && styles.langOptionTextActive]}>Español</Text>
                {i18n.language === 'es' && <Ionicons name="checkmark" size={18} color={iconColor} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langOption, i18n.language === 'en' && styles.langOptionActive]}
                onPress={() => i18n.changeLanguage('en')}
              >
                <Text style={[styles.langOptionText, i18n.language === 'en' && styles.langOptionTextActive]}>English</Text>
                {i18n.language === 'en' && <Ionicons name="checkmark" size={18} color={iconColor} />}
              </TouchableOpacity>
            </View>
          )}

          {userData && type === "admin" &&
            <TouchableOpacity style={styles.menuItem} onPress={() => { router.push("/screens/adminpanelusers") }}>
              <View style={styles.menuItemContent}>
                <View style={styles.iconBoxSmall}>
                  <Ionicons name="server-outline" size={20} color={iconColor} />
                </View>
                <Text style={styles.menuItemText}>{t('settings.adminPanel')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={chevronColor} />
            </TouchableOpacity>
          }

          {userData && (type === "admin" || type === "creator") &&
            <TouchableOpacity style={styles.menuItem} onPress={() => { router.push("/screens/creatorpanel") }}>
              <View style={styles.menuItemContent}>
                <View style={styles.iconBoxSmall}>
                  <Ionicons name="create-outline" size={20} color={iconColor} />
                </View>
                <Text style={styles.menuItemText}>{t('settings.creatorPanel')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={chevronColor} />
            </TouchableOpacity>
          }

          {/* Profile */}

          {userData &&
            <TouchableOpacity style={styles.menuItem} onPress={() => { router.push("/auth/profile") }}>
              <View style={styles.menuItemContent}>
                <View style={styles.iconBoxSmall}>
                  <Ionicons name="person" size={20} color={iconColor} />
                </View>
                <Text style={styles.menuItemText}>{t('settings.profile')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={chevronColor} />
            </TouchableOpacity>
          }

          {/* Logout */}

          {userData &&
            <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={logout}>
              <View style={styles.menuItemContent}>
                <View style={styles.iconBoxSmall}>
                  <FontAwesome
                    name="sign-out"
                    size={20}
                    color={iconColor}
                  />
                </View>
                <Text style={styles.menuItemText}>{t('settings.logout')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={chevronColor} />
            </TouchableOpacity>
          }
        </View>

        {/* Theme Mode Section */}
        <View style={styles.themeModeSection}>
          <Text style={styles.themeTitle}>{t('settings.themeMode')}</Text>

          <View style={styles.radioGroup}>
            {/* Light */}
            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => setThemeMode("light")}
            >
              <View
                style={[
                  styles.radioButton,
                  themeMode === "light" && styles.radioButtonSelected,
                ]}
              >
                {themeMode === "light" && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>{t('settings.light')}</Text>
            </TouchableOpacity>

            {/* Dark */}
            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => setThemeMode("dark")}
            >
              <View
                style={[
                  styles.radioButton,
                  themeMode === "dark" && styles.radioButtonSelected,
                ]}
              >
                {themeMode === "dark" && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>{t('settings.dark')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? "#121212" : "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: isDark ? "#fff" : "#000",
  },
  menuSection: {
    marginBottom: 32,
    borderRadius: 4,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: isDark ? "#444" : "#000",
    borderBottomWidth: 0,
    backgroundColor: isDark ? "#1e1e1e" : "#fff",
  },
  lastMenuItem: {
    borderBottomWidth: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBoxSmall: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: isDark ? "#444" : "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDark ? "#333" : "#f0f0f0",
    borderRadius: 3,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: isDark ? "#fff" : "#000",
  },
  themeModeSection: {
    marginTop: 16,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: isDark ? "#fff" : "#000",
  },
  radioGroup: {
    gap: 12,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: isDark ? "#fff" : "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDark ? "#121212" : "#fff",
  },
  radioButtonSelected: {
    borderColor: isDark ? "#fff" : "#000",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: isDark ? "#fff" : "#000",
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: isDark ? "#fff" : "#000",
  },
  langSubmenu: {
    borderWidth: 2,
    borderColor: isDark ? "#444" : "#000",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: isDark ? "#1e1e1e" : "#fafafa",
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? "#333" : "#e0e0e0",
  },
  langOptionActive: {
    backgroundColor: isDark ? "#333" : "#f0f0f0",
  },
  langOptionText: {
    fontSize: 15,
    color: isDark ? "#ccc" : "#333",
    fontWeight: "500",
  },
  langOptionTextActive: {
    color: isDark ? "#fff" : "#000",
    fontWeight: "700",
  },
});
