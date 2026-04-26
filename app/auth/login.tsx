import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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
import Header from "../../components/Header";
import { commonStyles } from "../../components/styles/commonStyles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Función para procesar el login, por ahora solo loggea los datos para probar
  const processLogin = () => {
    console.log("Sign in with:", { email, password });
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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
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
                value={password}
                onChangeText={setPassword}
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
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity style={commonStyles.linkContainer}>
            <Text style={commonStyles.link}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={commonStyles.button}
            onPress={processLogin}
            activeOpacity={0.7}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
