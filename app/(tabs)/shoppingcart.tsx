import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeProvider';
import { globalStyles } from '@/styles/global-styles';
import { globalStylesDark } from '@/styles/global-styles-dark';
import { Text, View } from 'react-native';

export default function ShoppingCart() {

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === "dark";

  return (
    <View style={isDark ? globalStylesDark.defaultcontainer : globalStyles.defaultcontainer}>
      <Text style={[globalStyles.bold, globalStyles.textMedium,, { color: isDark ? Colors.white : Colors.black}]}>Tab Shopping Cart</Text>
    </View>
  );
}