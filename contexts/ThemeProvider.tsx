import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
//import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  userData: any[] | null | undefined; // [token, id, nombre]
  setUserData: (val: any | null | undefined) => void;
  apiDir: string | null;
  setApiDir: (val: string | null) => void;
  themeMode: string;
  setThemeMode: (val: string) => void;
}

const ThemeContext = createContext<UserContextType>({
  userData: undefined,
  setUserData: () => { },
  apiDir: null,
  setApiDir: () => { },
  themeMode: "light",
  setThemeMode: () => { }
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any | null | undefined>(undefined);
  const [apiDir, setApiDir] = useState<string | null>(null);
  const [themeMode, _setThemeModeState] = useState<string>("light");

  const [text, setText] = useState("");

  const setThemeMode = async (val: string) => {
    _setThemeModeState(val);
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("theme_mode", val);
      } else {
        await SecureStore.setItemAsync('theme_mode', val);
      }
    } catch (e) {
      console.error('Error saving theme', e);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  /*PROBLEMA: No sé cómo hacer que se compruebe en cada momento que el usuario de la bbdd no haya dejado de existir*/
  /*Intenté lo siguiente pero no funciona*/
  /*
  useFocusEffect(
    useCallback(() => {
      if (!userData || userData === undefined) return;
      fetch(`${API_URL}/user/${userData[0]}`, {
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
            // No era JSON
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
        })
        .catch((error) => {

          console.error(error);
        }
        );
    }, [])
  );
  */

  const cargarDatos = async () => {
    try {

      let dato: (string | null) = null;
      let theme: (string | null) = null;

      if (Platform.OS === "web") {
        dato = localStorage.getItem("user_id");
        theme = localStorage.getItem("theme_mode");
      }
      else {
        dato = await SecureStore.getItemAsync('user_id');
        theme = await SecureStore.getItemAsync('theme_mode');
      }

      if (dato !== null) {
        setUserData(dato);
        console.log(dato);
      }
      else {
        setUserData(null);
      }

      if (theme !== null) {
        _setThemeModeState(theme);
      }
    } catch (error) {

      setUserData(null);
      console.error('Error al cargar los datos', error);
    }
  };

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
    <ThemeContext.Provider value={{ userData, setUserData, apiDir, setApiDir, themeMode, setThemeMode }}>
      {children}
      <Modal transparent visible={apiDir == null} animationType="fade">
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
      }}>
        <View style={{
          backgroundColor: "white",
          padding: 20,
          width: 300,
          borderRadius: 10
        }}>
          <Text>Insert the computer's local IP</Text>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder=""
            accessibilityLabel="IP Input"
            style={localStyles.input}
          />

          <TouchableOpacity
            onPress={() => {
              setApiDir("http://" + text + ":8083");
            }}
          >
            <Text style={[localStyles.formButton, {textAlign : "center"}]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </ThemeContext.Provider>
  );
}

export const useContextUser = () => useContext(ThemeContext);

const localStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  formButton: {
    backgroundColor: '#CD1064',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
});