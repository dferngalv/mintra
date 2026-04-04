import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import { globalStyles } from "@/styles/global-styles";
import { globalStylesDark } from "@/styles/global-styles-dark";
import FontAwesome from "@expo/vector-icons/FontAwesome5";
import { Text } from "@react-navigation/elements";
import { MaterialTopTabBar, MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { Image, Pressable, View } from "react-native";

export default function CustomTabBar(props:MaterialTopTabBarProps) {
  
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === "dark";

  return (
    <View>
      <View style={[{flexDirection: 'row', alignItems: "center", padding:20, flex:1, flexWrap: 'wrap'}, isDark ? globalStylesDark.defaultcontainer : globalStyles.defaultcontainer]}>
        <View style={{flexDirection: 'row', alignItems: "center"}}>
          <Image source={require('@/assets/images/Mintra_Logo.png')} accessibilityLabel="Logo" style={[globalStyles.imagenIcono]} resizeMode="contain"/>
          <Text style={[globalStyles.bold, globalStyles.textMedium, { color: isDark ? Colors.white : Colors.black}]}>Mintra</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: "center", marginLeft: 'auto'}}>
          <Pressable style={{backgroundColor: Colors.terciaryColor, borderRadius: 30, padding: 5, marginRight: 30}}>
            <FontAwesome size={20} name="search" color={isDark ? Colors.white : Colors.black}/>
          </Pressable>
          <Pressable style={{marginRight: 30}}>
            <FontAwesome size={40} name="language" color={isDark ? Colors.white : Colors.black}/>
          </Pressable>
          <Pressable style={{backgroundColor: Colors.terciaryColor, borderRadius: 30, padding: 5}}>
            <FontAwesome size={20} name="user" color={isDark ? Colors.white : Colors.black}/>
          </Pressable>
        </View>
      </View>
      <MaterialTopTabBar {...props} />
    </View>
  );
}