import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeProvider';
import { globalStyles } from '@/styles/global-styles';
import { Text, View } from 'react-native';

export default function Settings() {

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <View style={[globalStyles.settingsandthemecontainer, {backgroundColor: isDark ? Colors.black : Colors.white}]}>
        <Text style={[globalStyles.bold, globalStyles.textMedium, { color: isDark ? Colors.white : Colors.black}]}>Tab Settings</Text>
    </View>
    </>
  );
}