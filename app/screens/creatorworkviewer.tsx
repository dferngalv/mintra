import { useContextUser } from "@/contexts/ThemeProvider";
import useMyChapters from "@/hooks/useMyChapters";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function CreatorWorkViewer() {
  const { apiDir } = useContextUser();
  const params = useLocalSearchParams();
  const rawSeriesId = params.seriesId;
  const seriesId = Number(Array.isArray(rawSeriesId) ? rawSeriesId[0] : rawSeriesId);
  const { t } = useTranslation();

  const colors = useThemeColors();
  const commonStyles = useCommonStyles();

  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { chapters, loading: chaptersLoading, error: chaptersError, refresh: refreshChapters } = useMyChapters(seriesId);

  useEffect(() => {
    const fetchSeries = async () => {
      if (!apiDir || !seriesId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiDir}/series/${seriesId}`);
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || `Error ${response.status}`);
        }
        const data = text ? JSON.parse(text) : null;
        setSeries(data);
      } catch (err) {
        setError(t('creatorWorkViewer.loadError'));
      } finally {
        setLoading(false);
      }
    };

    void fetchSeries();
  }, [apiDir, seriesId]);

  const confirmDeleteWork = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(t('creatorWorkViewer.confirmDeleteWork'));
      if (confirmed) {
        void deleteWork();
      }
      return;
    }

    Alert.alert(t('creatorWorkViewer.deleteTitle'), t('creatorWorkViewer.confirmDeleteWork'), [
      { text: t('creatorWorkViewer.cancel'), style: "cancel" },
      { text: t('creatorWorkViewer.delete'), style: "destructive", onPress: () => { void deleteWork(); } },
    ]);
  };

  const deleteWork = async () => {
    if (!apiDir || Number.isNaN(seriesId)) {
      Alert.alert(t('creatorWorkViewer.error'), t('creatorWorkViewer.invalidId'));
      return;
    }

    try {
      const response = await fetch(`${apiDir}/series/${seriesId}/delete`, { method: "DELETE" });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Error ${response.status}`);
      }
      router.replace("/screens/creatorpanel");
    } catch (err) {
      Alert.alert(t('creatorWorkViewer.error'), t('creatorWorkViewer.deleteError'));
    }
  };

  const deleteChapter = async (chapterId: number) => {
    if (!apiDir) {
      return;
    }

    try {
      const response = await fetch(`${apiDir}/chapter/${chapterId}/delete`, { method: "DELETE" });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Error ${response.status}`);
      }
      refreshChapters();
    } catch (err) {
      Alert.alert(t('creatorWorkViewer.error'), t('creatorWorkViewer.chapterDeleteError'));
    }
  };

  if (loading) {
    return (
      <View style={commonStyles.container}>
        <Text style={[commonStyles.title, { color: colors.text }]}>{t('creatorWorkViewer.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <Text style={commonStyles.title}>{series?.title}</Text>
        {series?.front_picture ? (
          <Image source={{ uri: series.front_picture }} style={{ width: "100%", height: 220, borderRadius: 16, marginBottom: 18 }} />
        ) : (
          <View style={{ width: "100%", height: 220, borderRadius: 16, marginBottom: 18, backgroundColor: colors.placeholder, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: colors.textSecondary }}>{t('creatorWorkViewer.noCover')}</Text>
          </View>
        )}

        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10, color: colors.text }}>{series?.title}</Text>
        <Text style={{ marginBottom: 20, color: colors.textSecondary }}>{series?.sdescription ?? t('creatorWorkViewer.noDescription')}</Text>

        <TouchableOpacity style={[commonStyles.button, { backgroundColor: colors.text }]} onPress={() => router.push(`/screens/editwork?seriesId=${seriesId}`)}>
          <Text style={[commonStyles.buttonText, { color: colors.background }]}>{t('creatorWorkViewer.editWork')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[commonStyles.button, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={confirmDeleteWork}>
          <Text style={[commonStyles.buttonText, { color: colors.text }]}>{t('creatorWorkViewer.deleteWork')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[commonStyles.button, { backgroundColor: colors.text }]} onPress={() => router.push(`/screens/createchapter?seriesId=${seriesId}`)}>
          <Text style={[commonStyles.buttonText, { color: colors.background }]}>{t('creatorWorkViewer.addChapter')}</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 24, marginBottom: 12, color: colors.text }}>{t('creatorWorkViewer.chapters')}</Text>

        {chaptersLoading && <Text style={{ color: colors.text }}>{t('creatorWorkViewer.loadingChapters')}</Text>}
        {chaptersError && <Text style={{ color: "#c0392b" }}>{chaptersError}</Text>}

        {chapters.map((chapter) => (
          <View key={chapter.chapterId} style={{ borderWidth: 2, borderColor: colors.border, borderRadius: 12, padding: 14, marginBottom: 12, backgroundColor: colors.cardItem }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>{chapter.title ?? `${t('creatorWorkViewer.chapter')} ${chapter.cnumber}`}</Text>
            <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{t('creatorWorkViewer.number')}: {chapter.cnumber ?? "?"}</Text>
            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => deleteChapter(chapter.chapterId)}>
              <Text style={{ color: "#c0392b", fontWeight: "700" }}>{t('creatorWorkViewer.deleteChapter')}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={commonStyles.footer} />
      </ScrollView>
    </View>
  );
}
