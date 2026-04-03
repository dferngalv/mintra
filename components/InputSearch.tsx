import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";
import useFilteredVideos from "@/hooks/useFilteredProducts";
import { globalStyles } from "@/styles/global-styles";
import { globalStylesDark } from "@/styles/global-styles-dark";
import { useContext } from "react";
import { TextInput } from "react-native";

interface Data {
    onChange:any,
}

function InputSearch({onChange} : Data){

    const {theme, toggleTheme} = useTheme();
    const isDark = theme === "dark";

    return(
        <TextInput style={[isDark ? globalStylesDark.textbox : globalStyles.textbox, globalStyles.textSmall, globalStyles.regular]} keyboardType="default" onChange={onChange} placeholder="Buscar..." placeholderTextColor="gray"/>
    );
}

export default InputSearch;