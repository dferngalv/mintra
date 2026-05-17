import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { commonStyles } from "../../components/styles/commonStyles";
import * as SecureStore from 'expo-secure-store';
import { useContextUser } from "@/contexts/ThemeProvider";
import { router, usePathname } from "expo-router";

export default function Login() {

  const { userData, setUserData } = useContextUser();

  const pathname = usePathname();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const API_URL = "http://192.168.1.45:8083";

  useEffect(() => {

    if (userData === undefined) return;

    if (userData) {
      router.replace("/");
    }
  }, [userData, pathname]);

  const handleLogin = async () => {

    if (disable) return;

    setDisable(true);

    try {
      await processLogin();
    } finally {
      setDisable(false);
    }
  };

  // Función para procesar el login, por ahora solo loggea los datos para probar
  const processLogin = async () => {
    setErrors({
      email: "",
      password: ""
    });

    try {

      let exit = false;

      let { email, password } = formData;

      let newErrors = { email: "", password: "" };

      if (email) {
        email = email.toLowerCase().trim();
        setFormData({ email: email, password: password });
      }

      console.log(formData);

      if (email === "") {
        newErrors.email = "No se ha insertado ningún carácter en el email";
        exit = true;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        newErrors.email = "El email insertado no es válido";
        exit = true;
      }

      if (password === "") {
        newErrors.password = "No se ha insertado ningún carácter en la contraseña";
        exit = true;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/.test(password) || /\s/.test(password)) {
        newErrors.password = "La contraseña insertada no es válida; debe contener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial. No debe tener espacios.";
        exit = true;
      }

      setErrors(newErrors);
      console.log(newErrors);

      if (!exit) {
        await prelogin();
      }

    } catch (e) {
      setErrors({ email: "Error de registro", password: "" });
    } finally {

    }
  };

  const prelogin = async () => {

    login();
  }

  const login = () => {


    fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email.toLowerCase().trim(),
        upassword: formData.password,
      })
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

        if (data !== null) {
          console.log("Login correcto. userId:", data.userId);

          guardarDatos(String(data.userId));
        }
      })
      .catch((error) => {

        let newError = { email: "Error al registrarse, quizás el usuario no existe.", password: "" };
        setErrors(newError);
        console.error(error);
      }
      );
  };

  const guardarDatos = async (userId: (string)) => {

    try {

      if (Platform.OS === "web") {

        localStorage.setItem("user_id", userId);
      }
      else {
        await SecureStore.setItemAsync('user_id', userId);
      }
      setUserData(userId);
    } catch (error) {
      console.error('Error al guardar los datos', error);
    }
  };

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
          {/* Icon Box */}
          <View style={commonStyles.iconContainer}>
            <View style={commonStyles.iconBox}>
              <Image
                source={require("../../assets/images/logo_mintra.png")}
                style={commonStyles.iconImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Login Title */}
          <Text style={commonStyles.title}>Login</Text>

          {/* Email Input */}
          <View style={commonStyles.inputGroup}>
            <Text style={commonStyles.label}>
              E-Mail <Text style={commonStyles.required}>*</Text>
            </Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {(errors.email != "") && (
              <Text style={commonStyles.required}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={commonStyles.inputGroup}>
            <Text style={commonStyles.label}>
              Password <Text style={commonStyles.required}>*</Text>
            </Text>
            <View style={commonStyles.passwordInputContainer}>
              <TextInput
                style={commonStyles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#ccc"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={commonStyles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {(errors.password != "") && (
              <Text style={commonStyles.required}>
                {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity style={commonStyles.linkContainer}>
            <Text style={commonStyles.link}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[commonStyles.button, disable ? { backgroundColor: "#c9c9c9" } : { backgroundColor: "#000" }]}
            onPress={handleLogin}
            activeOpacity={0.7}
            disabled={disable}
          >
            <Text style={commonStyles.buttonText}>Sign in with password</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={commonStyles.textLinkContainer}>
            <Text style={commonStyles.textLinkText}>Don&apos;t have an account? </Text>
            <TouchableOpacity>
              <Text style={commonStyles.textLinkLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyles.footer}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
