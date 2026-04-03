import { Text } from "@react-navigation/elements";
import { MaterialTopTabBar, MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { View } from "react-native";

export default function CustomTabBar(props:MaterialTopTabBarProps) {
  return (
    <View>
      <View>
        <Text>Parte de arriba</Text>
      </View>
      <MaterialTopTabBar {...props} />
    </View>
  );
}