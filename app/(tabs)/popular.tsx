import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";

export default function Popular() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>{t('popular.title')}</Text>
      </View>
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: colors.text,
  },
});
