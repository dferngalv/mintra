import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { useContextUser } from "@/contexts/ThemeProvider";
import { router, usePathname } from "expo-router";
import { commonStyles } from "@/components/styles/commonStyles";

export default function Register() {

  const { userData, setUserData } = useContextUser();

  const pathname = usePathname();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
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

  const handleSignUp = async () => {

    if (disable) return;

    setDisable(true);

    try {
      await signUp();
    } finally {
      setDisable(false);
    }
  };

  const signUp = async () => {

    setErrors({
      name: "",
      email: "",
      password: ""
    });

    try {

      let exit = false;

      let { name, email, password } = formData;

      let newErrors = { name: "", email: "", password: "" };

      if (name) {
        name = name.trim();
      }

      if (email) {
        email = email.toLowerCase().trim();
      }

      setFormData({ name: name, email: email, password: password });

      console.log(formData);

      if (name === "") {
        newErrors.name = "No se ha insertado ningún carácter en el nombre";
        exit = true;
      }

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
        await preregister();
      }

    } catch (e) {
      setErrors({ name: "", email: "Error de registro", password: "" });
    } finally {

    }
  }

  const preregister = async () => {

    register();
  }

  const register = () => {

    fetch(`${API_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uname: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        upassword: formData.password,
      }),
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
            `Error de registro ${response.status}`;

          throw new Error(message);
        }

        return dataResult;
      })
      .then(() => {
        console.log("llega");
        return fetch(`${API_URL}/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email.toLowerCase().trim(),
            upassword: formData.password,
          })
        });
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

        let newError = { name: "Error al registrarse, quizás ya haya una cuenta con el correo insertado.", email: "", password: "" };
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerInner}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Icon Box */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBox}>
              <Image
                source={require("../../assets/images/logo_mintra.png")}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Registration Title */}
          <Text style={styles.registrationTitle}>Registration</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Username <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#ccc"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              autoCapitalize="none"
            />
            {(errors.name != "") && (
              <Text style={styles.required}>
                {errors.name}
              </Text>
            )}
          </View>



          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              E-Mail <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {(errors.email != "") && (
              <Text style={styles.required}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#ccc"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {(errors.password != "") && (
              <Text style={styles.required}>
                {errors.password}
              </Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              disable ? { backgroundColor: "#c9c9c9" } : { backgroundColor: "#000" }
            ]}
            onPress={handleSignUp}
            activeOpacity={0.7}
            disabled={disable}
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyles.footer}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerInner: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 100,
    height: 100,
  },
  registrationTitle: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  required: {
    color: "#e74c3c",
    fontWeight: "700",
  },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  passwordInputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    paddingRight: 44,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
  },
  signUpButton: {
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#000",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signInText: {
    fontSize: 14,
    color: "#666",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
