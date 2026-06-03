import { useContextUser } from "@/contexts/ThemeProvider";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";
import { useCommonStyles } from "@/hooks/useCommonStyles";

interface CreatorInfo {
  user_id?: number;
  id?: number;
  register_date?: string;
  date?: string;
}

interface SeriesItem {
  series_id: number;
  title: string;
  front_picture: string;
  creation_date?: string;
  update_date?: string;
  user_creation_date?: string;
  user_id_fk?: number;
  register_date?: string;
  user_register_date?: string;
  user?: CreatorInfo;
}

const getCreatorRegisterDate = (item: SeriesItem) => {
  return (
    item.user_register_date ||
    item.user_creation_date ||
    item.register_date ||
    item.user?.register_date ||
    item.user?.date ||
    item.creation_date ||
    item.update_date ||
    ""
  );
};

const getNewCreators = (items: SeriesItem[]) => {
  return [...items].sort((a, b) => {
    return new Date(getCreatorRegisterDate(b)).getTime() - new Date(getCreatorRegisterDate(a)).getTime();
  });
};

export default function Home() {
  const router = useRouter();
  const { apiDir } = useContextUser();
  const [recentSeries, setRecentSeries] = useState<SeriesItem[]>([]);
  const [newCreators, setNewCreators] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [recentRows, setRecentRows] = useState(2);
  const [creatorRows, setCreatorRows] = useState(2);
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const colors = useThemeColors();
  const commonStyles = useCommonStyles();
  const styles = getStyles(colors);

  const columns = useMemo(() => {
    if (width < 520) return 3;
    if (width < 760) return 4;
    if (width < 980) return 5;
    return 6;
  }, [width]);

  const itemWidth = useMemo(() => {
    const horizontalPadding = 24;
    const spacing = (columns - 1) * 12;
    const available = Math.max(width - horizontalPadding - spacing, 0);
    return Math.floor(available / columns);
  }, [width, columns]);

  useEffect(() => {
    if (!apiDir) {
      setRecentSeries([]);
      setNewCreators([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchRecent = async () => {
      try {
        const response = await fetch(`${apiDir}/series/recent`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        const data = await response.json();
        const items = Array.isArray(data) ? data : [];
        setRecentSeries(items);
        setNewCreators(getNewCreators(items));
      } catch {
        try {
          const fallbackResponse = await fetch(`${apiDir}/series/search?query=`);
          if (!fallbackResponse.ok) {
            throw new Error(`Fallback error ${fallbackResponse.status}`);
          }
          const fallbackData = await fallbackResponse.json();
          const items = Array.isArray(fallbackData) ? fallbackData : [];
          setRecentSeries(items);
          setNewCreators(getNewCreators(items));
          if (!items.length) {
            setError(t("home.unableToLoad"));
          }
        } catch {
          setError(t("home.unableToLoad"));
          setRecentSeries([]);
          setNewCreators([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [apiDir, t]);

  const placeholderUrl = apiDir ? `${apiDir}/images/placeholder/placeholder.png` : undefined;

  const getImageUrl = (picture: string | undefined) => {
    if (!picture || picture === "null" || picture.trim() === "") return placeholderUrl;
    if (picture.startsWith("http")) {
      return picture;
    }
    return apiDir ? `${apiDir}${picture}` : placeholderUrl;
  };

  const handlePress = (item: SeriesItem) => {
    router.push(`/series/${item.series_id}`);
  };

  const visibleRecent = recentSeries.slice(0, recentRows * columns);
  const visibleCreators = newCreators.slice(0, creatorRows * columns);

  const renderSeriesItem = (item: SeriesItem) => (
    <TouchableOpacity style={styles.cardItem} onPress={() => handlePress(item)} activeOpacity={0.8}>
      <View style={commonStyles.cardCoverBox}>
        <Image
          source={{ uri: imageErrors[item.series_id] ? placeholderUrl : getImageUrl(item.front_picture) }}
          style={commonStyles.cardCoverImage}
          onError={() => setImageErrors((prev) => ({ ...prev, [item.series_id]: true }))}
        />
      </View>
      <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderGrid = (data: SeriesItem[]) => (
    <View style={[styles.grid, { paddingHorizontal: 12, justifyContent: width >= 900 ? "center" : "flex-start" }]}> 
      {data.map((item) => (
        <View key={item.series_id.toString()} style={{ width: itemWidth }}>
          {renderSeriesItem(item)}
        </View>
      ))}
    </View>
  );

  const renderRecentSection = () => {
    if (loading) return <ActivityIndicator size="large" color={colors.text} style={styles.loading} />;
    if (error) return <Text style={styles.emptyText}>{error}</Text>;
    if (recentSeries.length === 0) return <Text style={styles.emptyText}>{t("home.noRecentAvailable")}</Text>;

    return (
      <>
        {renderGrid(visibleRecent)}
        {visibleRecent.length < recentSeries.length ? (
          <TouchableOpacity style={styles.showMoreButton} onPress={() => setRecentRows((prev) => prev + 2)}>
            <Text style={styles.showMoreText}>{t("home.showMore")}</Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  const renderCreatorsSection = () => {
    if (loading) return <ActivityIndicator size="large" color={colors.text} style={styles.loading} />;
    if (newCreators.length === 0) return <Text style={styles.emptyText}>{t("home.noNewCreators")}</Text>;

    return (
      <>
        {renderGrid(visibleCreators)}
        {visibleCreators.length < newCreators.length ? (
          <TouchableOpacity style={styles.showMoreButton} onPress={() => setCreatorRows((prev) => prev + 2)}>
            <Text style={styles.showMoreText}>{t("home.showMore")}</Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{t("home.recentlyCreated")}</Text>
      </View>
      <View style={styles.resultsContainer}>{renderRecentSection()}</View>

      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{t("home.newCreators")}</Text>
      </View>
      <View style={styles.resultsContainer}>{renderCreatorsSection()}</View>
    </ScrollView>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 16 : 24,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  resultsContainer: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  listContent: {
    paddingBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    columnGap: 12,
    rowGap: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardItem: {
    backgroundColor: colors.cardItem,
    borderRadius: 16,
    overflow: "hidden",
  },
  coverBox: {
    width: "100%",
    aspectRatio: 0.68,
    backgroundColor: colors.placeholder,
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.placeholder,
  },
  coverPlaceholderText: {
    color: colors.textSecondary,
  },
  cardTitle: {
    padding: 12,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    overflow: "hidden",
  },
  emptyText: {
    marginTop: 32,
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 16,
  },
  showMoreButton: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.text,
    borderRadius: 999,
  },
  showMoreText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 14,
  },
  loading: {
    marginTop: 32,
  },
});
