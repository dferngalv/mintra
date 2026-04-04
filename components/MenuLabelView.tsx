import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { globalStyles } from "@/styles/global-styles";
import FontAwesome from "@expo/vector-icons/FontAwesome5";
import { Text } from "@react-navigation/elements";
import { View } from "react-native";

interface TabIconLabelProps {
  iconName: string;
  label: string;
  color: string;
}

export default function MenuLabelView({iconName, label, color} : TabIconLabelProps) {

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === "dark";

    return(
        <View style={{ alignItems: 'center' }}>
            <FontAwesome size={28} name={iconName} color={color}/>
            <Text style={[globalStyles.regular, globalStyles.textMedium, {color: isDark ? Colors.white : Colors.black}]}>{label}</Text>
        </View>
    );
}