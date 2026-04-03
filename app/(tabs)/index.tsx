import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";
import { globalStyles } from "@/styles/global-styles";
import { useContext } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { globalStylesDark } from "@/styles/global-styles-dark";

export default function Index() {

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === "dark";

  return (
    <View style={isDark ? globalStylesDark.defaultcontainer : globalStyles.defaultcontainer}>
      <Text style={[globalStyles.bold, globalStyles.textMedium, { color: isDark ? Colors.white : Colors.black}]}>Tab Home</Text>
    </View>
  );
}
