import { useContextUser } from "@/contexts/ThemeProvider";

export interface ThemeColors {
  isDark: boolean;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  borderLight: string;
  primary: string;
  cardBackground: string;
  cardItem: string;
  inputBackground: string;
  placeholder: string;
  danger: string;
  iconBg: string;
}

export function useThemeColors(): ThemeColors {
  const { themeMode } = useContextUser();
  const isDark = themeMode === "dark";

  return {
    isDark,
    background: isDark ? "#121212" : "#fff",
    text: isDark ? "#ffffff" : "#000000",
    textSecondary: isDark ? "#aaaaaa" : "#666666",
    border: isDark ? "#444444" : "#000000",
    borderLight: isDark ? "#333333" : "#eeeeee",
    primary: "#CD1064",
    cardBackground: isDark ? "#1e1e1e" : "#fafafa",
    cardItem: isDark ? "#2c2c2c" : "#fafafa",
    inputBackground: isDark ? "#2c2c2c" : "#fff",
    placeholder: isDark ? "#555555" : "#eaeaea",
    danger: "#e74c3c",
    iconBg: isDark ? "#333333" : "#f0f0f0",
  };
}
