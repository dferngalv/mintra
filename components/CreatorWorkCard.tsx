import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";

interface CreatorWorkCardProps {
  work: any;
  onPress: () => void;
}

export default function CreatorWorkCard({ work, onPress }: CreatorWorkCardProps) {
  const coverUri = work?.front_picture;
  const chapterCount = work?.chapterCount ?? work?.chapters?.length ?? 0;
  const { t } = useTranslation();

  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverText}>{t('creatorWorkCard.noCover')}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{work?.title ?? t('creatorWorkCard.untitled')}</Text>
        <Text style={styles.subtitle}>{t('creatorWorkCard.totalChapters')}: {chapterCount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.cardItem,
    alignItems: "center",
  },
  cover: {
    width: 72,
    height: 72,
    resizeMode: "cover",
  },
  coverPlaceholder: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.placeholder,
  },
  coverText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
