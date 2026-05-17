import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { useContextUser } from "@/contexts/ThemeProvider";

export default function Settings() {

  const { userData, setUserData } = useContextUser();

  const [themeMode, setThemeMode] = useState("light");

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
        <Text style={styles.title}>Settings and profile options</Text>

        {/* Menu Items Section */}
        <View style={styles.menuSection}>
          {/* Languages */}
          <TouchableOpacity style={[styles.menuItem, !userData && styles.lastMenuItem]}>
            <View style={styles.menuItemContent}>
              <View style={styles.iconBoxSmall}>
                <FontAwesome
                  name="language"
                  size={20}
                  color="#000"
                />
              </View>
              <Text style={styles.menuItemText}>Languages</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          {/* Profile */}

          {userData &&
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => {router.push("/auth/profile")}}>
              <View style={styles.menuItemContent}>
                <View style={styles.iconBoxSmall}>
                  <Ionicons name="person" size={20} color="#000" />
                </View>
                <Text style={styles.menuItemText}>Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItem} onPress={() => {router.push("/screens/createseries")}}>
              <View style={styles.menuItemContent}>
                <View style={styles.iconBoxSmall}>
                  <Ionicons name="book" size={20} color="#000" />
                </View>
                <Text style={styles.menuItemText}>Create series and chapters</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          

          {/* Logout */}


            <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={logout}>
              <View style={styles.menuItemContent}>
                <View style={styles.iconBoxSmall}>
                  <FontAwesome
                    name="sign-out"
                    size={20}
                    color="#000"
                  />
                </View>
                <Text style={styles.menuItemText}>Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
            </>
          }
        </View>

        {/* Theme Mode Section */}
        <View style={styles.themeModeSection}>
          <Text style={styles.themeTitle}>Theme mode</Text>

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
              <Text style={styles.radioLabel}>Light</Text>
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
              <Text style={styles.radioLabel}>Dark</Text>
            </TouchableOpacity>

            {/* Darker */}
            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => setThemeMode("darker")}
            >
              <View
                style={[
                  styles.radioButton,
                  themeMode === "darker" && styles.radioButtonSelected,
                ]}
              >
                {themeMode === "darker" && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>Darker</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#000",
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
    borderColor: "#000",
    borderBottomWidth: 0,
    backgroundColor: "#fff",
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
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  themeModeSection: {
    marginTop: 16,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
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
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  radioButtonSelected: {
    borderColor: "#000",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});
