import { useContextUser } from "@/contexts/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function Login() {

  const { userData, setUserData, apiDir } = useContextUser();
  const { t } = useTranslation();

  const pathname = usePathname();

  const commonStyles = useCommonStyles();
  const colors = useThemeColors();

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

  const API_URL = apiDir ?? "http://192.168.1.45:8083";

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

      console.log({ email, password });

      if (email === "") {
        newErrors.email = t("login.validation.emptyEmail");
        exit = true;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        newErrors.email = t("login.validation.invalidEmail");
        exit = true;
      }

      if (password === "") {
        newErrors.password = t("login.validation.emptyPassword");
        exit = true;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/.test(password) || /\s/.test(password)) {
        newErrors.password = t("login.validation.invalidPassword");
        exit = true;
      }

      setErrors(newErrors);
      console.log(newErrors);

      if (!exit) {
        await prelogin({ email, password });
      }

    } catch (e) {
      setErrors({ email: t("login.validation.generalError"), password: "" });
    } finally {

    }
  };

  const prelogin = async (data: { email: string; password: string }) => {
    return login(data);
  }

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          upassword: formData.password,
        })
      });

      const text = await response.text();
      console.log("login response:", response.status, text);

      let dataResult = null;
      if (text) {
        try {
          dataResult = JSON.parse(text);
        } catch (error) {
          dataResult = text;
        }
      }

      if (!response.ok) {
        const message =
          typeof dataResult === 'string'
            ? dataResult
            : text || `${t("login.validation.generalLoginError")} ${response.status}`;
        throw new Error(message);
      }

      if (dataResult && typeof dataResult === 'object' && 'userId' in dataResult) {
        console.log("Login correcto. userId:", (dataResult as any).userId);
        guardarDatos(String((dataResult as any).userId));
      } else {
        throw new Error(t('login.validation.loginError'));
      }
    } catch (error: any) {
      const message = error?.message || t('login.validation.generalLoginError');
      setErrors((prev) => ({ ...prev, email: message }));
      throw error;
    }
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
          <Text style={commonStyles.title}>{t('login.title')}</Text>

          {/* Email Input */}
          <View style={commonStyles.inputGroup}>
            <Text style={commonStyles.label}>
              {t('login.email')} <Text style={commonStyles.required}>*</Text>
            </Text>
            <TextInput
              style={commonStyles.input}
              placeholder={t('login.emailPlaceholder')}
              placeholderTextColor={colors.placeholder}
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
              {t('login.password')} <Text style={commonStyles.required}>*</Text>
            </Text>
            <View style={commonStyles.passwordInputContainer}>
              <TextInput
                style={commonStyles.passwordInput}
                placeholder={t('login.passwordPlaceholder')}
                placeholderTextColor={colors.placeholder}
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
                  color={colors.textSecondary}
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
            <Text style={commonStyles.link}>{t('login.forgotPassword')}</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[commonStyles.button, disable ? { backgroundColor: colors.placeholder } : { backgroundColor: colors.text }]}
            onPress={handleLogin}
            activeOpacity={0.7}
            disabled={disable}
          >
            <Text style={[commonStyles.buttonText, { color: colors.background }]}>{t('login.signInBtn')}</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={commonStyles.textLinkContainer}>
            <Text style={commonStyles.textLinkText}>{t('login.noAccount')}</Text>
            <TouchableOpacity>
              <Text style={commonStyles.textLinkLink}>{t('login.signUp')}</Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyles.footer}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
