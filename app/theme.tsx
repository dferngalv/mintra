import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { globalStyles } from "@/styles/global-styles";
import { globalStylesDark } from "@/styles/global-styles-dark";
import { Switch, Text, View } from "react-native";

export default function ThemeScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View style={[{flex: 1, padding: 20}, isDark ? globalStylesDark.defaultcontainer : globalStyles.defaultcontainer]}>
      <Text style={[{ fontSize: 26, fontWeight: "bold"}, { color: isDark ? Colors.white : Colors.black} ]}>
        Tema
      </Text>

      <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center" }}>
        <Text style={[{ fontSize: 18}, { color: isDark ? Colors.white : Colors.black}]}>
          Modo oscuro
        </Text>

        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}
