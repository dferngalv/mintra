import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useThemeColors } from "./useThemeColors";

export function useCommonStyles() {
  const colors = useThemeColors();

  return useMemo(
    () =>
      StyleSheet.create({
        // Contenedores generales
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

        // Iconos y logos
        iconContainer: {
          alignItems: "center",
          alignSelf: "center",
          marginBottom: 40,
        },
        iconBox: {
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        },
        iconImage: {
          width: 100,
          height: 100,
        },

        // Títulos
        title: {
          fontSize: 32,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 40,
          color: colors.text,
        },
        subtitle: {
          fontSize: 16,
          color: colors.textSecondary,
          textAlign: "center",
        },

        // Grupos de input
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

        // Inputs
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
        textbox: {
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: 6,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 16,
          color: colors.text,
          backgroundColor: colors.inputBackground,
          marginBottom: 10,
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

        // Enlaces
        link: {
          color: "#007AFF",
          fontSize: 14,
          fontWeight: "500",
          textDecorationLine: "underline",
        },
        linkContainer: {
          marginBottom: 32,
        },

        // Botones
        button: {
          borderRadius: 6,
          paddingVertical: 14,
          paddingHorizontal: 24,
          alignItems: "center",
          marginTop: 8,
          borderWidth: 2,
          borderColor: colors.border,
        },
        buttonText: {
          color: colors.text, // Modificado dinámicamente o sobreescrito si es primario
          fontSize: 16,
          fontWeight: "600",
        },
        formButton: {
          borderWidth: 1,
          borderColor: colors.border,
          padding: 5,
          backgroundColor: colors.cardBackground,
        },

        // Contenedores de texto con enlaces
        textLinkContainer: {
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 24,
        },
        textLinkText: {
          fontSize: 14,
          color: colors.textSecondary,
        },
        textLinkLink: {
          fontSize: 14,
          fontWeight: "600",
          color: "#007AFF",
          textDecorationLine: "underline",
        },

        // Footers
        footer: {
          marginBottom: 30,
        },
        cardCoverBox: {
          width: "100%",
          aspectRatio: 0.68,
          backgroundColor: colors.placeholder,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
          overflow: "hidden",
        },
        cardCoverImage: {
          width: "100%",
          height: "100%",
          resizeMode: "cover",
        },
      }),
    [colors]
  );
}
