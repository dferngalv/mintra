import FontAwesome from "@expo/vector-icons/FontAwesome5";
import { Text } from "@react-navigation/elements";
import { View } from "react-native";

interface TabIconLabelProps {
  iconName: string;
  label: string;
  color: string;
}

export default function MenuLabelView({iconName, label, color} : TabIconLabelProps) {

    return(
        <View style={{ alignItems: 'center' }}>
            <FontAwesome size={28} name={iconName} color={color}/>
            <Text style={{ color, fontSize: 12 }}>{label}</Text>
        </View>
    );
}