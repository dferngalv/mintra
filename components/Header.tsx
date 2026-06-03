import { useContextUser } from "@/contexts/ThemeProvider";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { useHeaderStyles } from "@/hooks/useHeaderStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

interface HeaderProps {
  showUserMenu?: boolean;
}

export default function Header({ showUserMenu = true }: HeaderProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [image, setImage] = useState("null");
  const { t, i18n } = useTranslation();

  const router = useRouter();
  const pathname = usePathname();

  const { userData, setUserData, apiDir } = useContextUser();
  const styles = useHeaderStyles();
  const colors = useThemeColors();

  const navigateToHome = () => {
    router.push("/");
  };

  const navigateToLogin = () => {
    setIsMenuVisible(false);
    router.push("/auth/login");
  };

  const navigateToRegister = () => {
    setIsMenuVisible(false);
    router.push("/auth/register");
  };

  const navigateToProfile = () => {
    setIsMenuVisible(false);
    router.push("/auth/profile");
  };

  const toggleMenu = () => {
    if (!userData) {
      setIsMenuVisible(!isMenuVisible);
    }
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  const [isLangMenuVisible, setIsLangMenuVisible] = useState(false);

  const openLangMenu = () => {
    setIsLangMenuVisible(true);
  };

  const closeLangMenu = () => {
    setIsLangMenuVisible(false);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    closeLangMenu();
  };

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
            const message = text || `Error al iniciar sesión ${response.status}`;
            throw new Error(message);
          }
          return dataResult;
        })
        .then((data) => {
          if (data === null) {
            logout();
          }
          else {
            setImage((data.picture !== null) ? (apiDir + data.picture) : "null");
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

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoContainer} onPress={navigateToHome} activeOpacity={0.7}>
          <View style={styles.logoBox}>
            <Image source={require("../assets/images/logo_mintra.png")} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={styles.brandName}>Mintra</Text>
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/SearchScreen")}>
            <Ionicons name="search" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={openLangMenu}>
            <FontAwesome name="language" size={24} color={colors.text} />
          </TouchableOpacity>

          {(image !== "null") ? (
            <TouchableOpacity style={styles.iconButton} onPress={userData ? navigateToProfile : toggleMenu}>
              <Image source={{ uri: image }} style={styles.iconImage} resizeMode="contain" />
            </TouchableOpacity>
          ) :
            (
              <TouchableOpacity style={styles.iconButton} onPress={userData ? navigateToProfile : toggleMenu}>
                <Ionicons name="person-circle" size={28} color={colors.text} />
              </TouchableOpacity>
            )
          }
        </View>
      </View>

      {!userData && (
        <Modal visible={isMenuVisible} transparent animationType="fade" onRequestClose={closeMenu}>
          <TouchableOpacity style={styles.overlay} onPress={closeMenu}>
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={navigateToLogin}>
                <Text style={styles.menuText}>{t('header.signIn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={navigateToRegister}>
                <Text style={styles.menuText}>{t('header.signUp')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <Modal visible={isLangMenuVisible} transparent animationType="fade" onRequestClose={closeLangMenu}>
        <TouchableOpacity style={styles.overlay} onPress={closeLangMenu}>
          <View style={[styles.menuContainer, { right: 80 }]}>
            <TouchableOpacity style={styles.menuItem} onPress={() => changeLanguage("es")}>
              <Text style={styles.menuText}>Español</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => changeLanguage("en")}>
              <Text style={styles.menuText}>English</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
