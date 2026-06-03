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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";

export default function Register() {

  const { userData, setUserData, apiDir } = useContextUser();
  const { t } = useTranslation();

  const pathname = usePathname();

  const commonStyles = useCommonStyles();
  const colors = useThemeColors();
  const styles = getStyles(colors);

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

  const API_URL = apiDir ?? "http://192.168.1.45:8083";

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

      const normalizedFormData = { name: name, email: email, password: password };
      setFormData(normalizedFormData);

      console.log(normalizedFormData);

      if (name === "") {
        newErrors.name = t("register.validation.emptyName");
        exit = true;
      }

      if (email === "") {
        newErrors.email = t("register.validation.emptyEmail");
        exit = true;
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        newErrors.email = t("register.validation.invalidEmail");
        exit = true;
      }

      if (password === "") {
        newErrors.password = t("register.validation.emptyPassword");
        exit = true;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/.test(password) || /\s/.test(password)) {
        newErrors.password = t("register.validation.invalidPassword");
        exit = true;
      }

      setErrors(newErrors);
      console.log(newErrors);

      if (!exit) {
        await registerAndLogin({ name, email, password });
      }

    } catch (e: any) {
      setErrors((prev) => ({ ...prev, email: typeof e?.message === 'string' ? e.message : t('register.validation.generalError') }));
    }
  }

  const preregister = async (data: { name: string; email: string; password: string }) => {
    return register(data);
  }

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uname: data.name,
          email: data.email,
          upassword: data.password,
        }),
      });

      const text = await response.text();
      console.log("register response:", response.status, text);

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
            : text || `${t("register.validation.generalError")} ${response.status}`;
        throw new Error(message);
      }

      return dataResult;
    } catch (error: any) {
      const message = error?.message || t('register.validation.generalError');
      setErrors((prev) => ({ ...prev, email: message }));
      throw error;
    }
  };

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          upassword: data.password,
        }),
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
            : text || `${t("register.validation.generalLoginError")} ${response.status}`;
        throw new Error(message);
      }

      if (dataResult && typeof dataResult === 'object' && 'userId' in dataResult) {
        guardarDatos(String((dataResult as any).userId));
      } else {
        throw new Error(t('register.validation.loginError'));
      }
    } catch (error: any) {
      const message = error?.message || t('register.validation.generalLoginError');
      setErrors((prev) => ({ ...prev, email: message }));
      throw error;
    }
  };

  const registerAndLogin = async (data: { name: string; email: string; password: string }) => {
    try {
      await preregister(data);
      await login(data);
    } catch (error) {
      console.error(error);
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
          <Text style={styles.registrationTitle}>{t('register.title')}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('register.username')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.usernamePlaceholder')}
              placeholderTextColor={colors.placeholder}
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
              {t('register.email')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.emailPlaceholder')}
              placeholderTextColor={colors.placeholder}
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
              {t('register.password')} <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t('register.passwordPlaceholder')}
                placeholderTextColor={colors.placeholder}
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
                  color={colors.textSecondary}
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
              disable ? { backgroundColor: colors.placeholder } : { backgroundColor: colors.text }
            ]}
            onPress={handleSignUp}
            activeOpacity={0.7}
            disabled={disable}
          >
            <Text style={[styles.signUpButtonText, { color: colors.background }]}>{t('register.signUpBtn')}</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>{t('register.alreadyHaveAccount')}</Text>
            <TouchableOpacity>
              <Text style={styles.signInLink}>{t('register.signIn')}</Text>
            </TouchableOpacity>
          </View>
          <View style={commonStyles.footer}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.text,
  },
  required: {
    color: colors.danger,
    fontWeight: "700",
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.inputBackground,
  },
  passwordInputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.inputBackground,
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
    borderColor: colors.border,
  },
  signUpButtonText: {
    color: colors.text,
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
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
