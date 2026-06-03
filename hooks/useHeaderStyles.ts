import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useThemeColors } from "./useThemeColors";

export function useHeaderStyles() {
  const colors = useThemeColors();

  return useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
          paddingTop: 30,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        logoContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        logoBox: {
          justifyContent: "center",
          alignItems: "center",
        },
        logoImage: {
          width: 48,
          height: 48,
        },
        iconImage: {
          width: 28,
          height: 28,
        },
        brandName: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.text,
        },
        rightIcons: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        iconButton: {
          padding: 8,
        },
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-start",
          paddingTop: 60,
          paddingRight: 12,
        },
        menuContainer: {
          position: "absolute",
          top: 60,
          right: 12,
          backgroundColor: colors.background,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
          minWidth: 150,
        },
        menuItem: {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        menuText: {
          fontSize: 14,
          fontWeight: "500",
          color: colors.text,
        },
      }),
    [colors]
  );
}
