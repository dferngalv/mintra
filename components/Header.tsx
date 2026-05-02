import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { headerStyles } from "./styles/HeaderStyles";
import { useContextUser } from "@/contexts/ThemeProvider";

interface HeaderProps {
  showUserMenu?: boolean;
}

export default function Header({ showUserMenu = true }: HeaderProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const router = useRouter();

  const { userData, setUserData } = useContextUser();

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
    if(!userData){
      setIsMenuVisible(!isMenuVisible);
    }
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
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

          {(userData && (userData[2] !== "null")) ? (
            <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
              <Image source={{ uri: userData[2] }} style={styles.iconImage} resizeMode="contain" />
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

