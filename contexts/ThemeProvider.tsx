import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
//import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  userData: any[] | null | undefined; // [token, id, nombre]
  setUserData: (val: any[] | null | undefined) => void;

}

const ThemeContext = createContext<UserContextType>({
  userData: [],
  setUserData: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any[] | null | undefined>(undefined);

  const API_URL = "http://192.168.1.45:8083";

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

      let datos: (string | null)[] = [null, null, null];

      if (Platform.OS === "web") {
        datos = [localStorage.getItem("user_id"), localStorage.getItem("uname"), localStorage.getItem("picture")];
      }
      else {
        datos = [await SecureStore.getItemAsync('user_id'), await SecureStore.getItemAsync('uname'), await SecureStore.getItemAsync('picture')];
      }

      if (datos[0] !== null) {
        setUserData(datos);
        console.log(datos);
      }
      else {
        setUserData(null);
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
        localStorage.removeItem("uname");
        localStorage.removeItem("picture");
      }
      else {
        await SecureStore.deleteItemAsync('user_id');
        await SecureStore.deleteItemAsync('uname');
        await SecureStore.deleteItemAsync('picture');
      }
      setUserData(null);
      router.push("/");
    } catch (error) {
      console.error('Error al borrar los datos', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ userData, setUserData }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useContextUser = () => useContext(ThemeContext);