import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { headerStyles } from "./styles/HeaderStyles";
import { useContextUser } from "@/contexts/ThemeProvider";
import * as SecureStore from 'expo-secure-store';

interface HeaderProps {
  showUserMenu?: boolean;
}

export default function Header({ showUserMenu = true }: HeaderProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [image, setImage] = useState("null");

  const router = useRouter();
  const pathname = usePathname();

  const { userData, setUserData, apiDir } = useContextUser();

  {/*
  useEffect(() => {

    if (userData === undefined) return;

    if (!userData) {
      router.replace("/");
    }
    else {

      if(apiDir){

        llamadaApi();
      }
    }
  }, [userData, apiDir]);

  */}

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

  const toggleMenu = () => {
    if (!userData) {
      setIsMenuVisible(!isMenuVisible);
    }
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
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
            setImage((data.picture !== null) ? (apiDir + data.picture) : "null");
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
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="language" size={24} color="#000" />
          </TouchableOpacity>

          {(image !== "null") ? (
            <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
              <Image source={{ uri: image }} style={styles.iconImage} resizeMode="contain" />
            </TouchableOpacity>
          ) :
            (
              <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
                <Ionicons name="person-circle" size={28} color="#000" />
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
                <Text style={styles.menuText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={navigateToRegister}>
                <Text style={styles.menuText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
}

const styles = headerStyles;

