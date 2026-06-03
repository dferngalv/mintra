import { commonStyles } from "@/components/styles/commonStyles";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

interface Data {
    onChange:any,
}

function InputSearch({onChange} : Data){
    const { t } = useTranslation();
    const commonStyles = useCommonStyles();
    const colors = useThemeColors();

    return(
        <TextInput style={[commonStyles.textbox, {color: colors.text}]} keyboardType="default" onChange={onChange} placeholder={t('inputSearch.placeholder')} placeholderTextColor={colors.textSecondary}/>
    );
}

export default InputSearch;
