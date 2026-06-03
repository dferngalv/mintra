import CreatorWorkCard from "@/components/CreatorWorkCard";
import { useContextUser } from "@/contexts/ThemeProvider";
import useMyWorks from "@/hooks/useMyWorks";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function CreatorPanel() {
  const { userData, apiDir } = useContextUser();
  const { works, loading, error, refresh } = useMyWorks();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const commonStyles = useCommonStyles();

  useEffect(() => {
    if (apiDir && userData) {
      void refresh();
    }
  }, [apiDir, userData]);

  return (
    <View style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <Text style={commonStyles.title}>{t('creatorPanel.title')}</Text>

        <TouchableOpacity
          style={[commonStyles.button, { backgroundColor: colors.text }]}
          onPress={() => router.push("/screens/createseries")}
        >
          <Text style={[commonStyles.buttonText, { color: colors.background }]}>{t('creatorPanel.createWork')}</Text>
        </TouchableOpacity>

        {error && <Text style={{ marginTop: 20, color: "#c0392b", textAlign: "center" }}>{error}</Text>}

        {loading ? (
          <Text style={{ marginTop: 20, textAlign: "center", color: colors.text }}>{t('creatorPanel.loading')}</Text>
        ) : (
          <View style={{ marginTop: 20, gap: 12 }}>
            {works.length === 0 ? (
              <Text style={{ color: colors.textSecondary, textAlign: "center" }}>{t('creatorPanel.noWorks')}</Text>
            ) : (
              works.map((work) => (
                <CreatorWorkCard
                  key={work.seriesId}
                  work={work}
                  onPress={() => router.push(`/screens/creatorworkviewer?seriesId=${work.seriesId}`)}
                />
              ))
            )}
          </View>
        )}

        <View style={commonStyles.footer} />
      </ScrollView>
    </View>
  );
}
