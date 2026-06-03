import { useContextUser } from "@/contexts/ThemeProvider";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";

interface SeriesItem {
  series_id: number;
  title: string;
  front_picture: string;
  artists?: string;
  publication_state?: string;
  user_id_fk?: number;
}

export default function SearchScreen() {
  const router = useRouter();
  const { apiDir } = useContextUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const { t } = useTranslation();

  const colors = useThemeColors();
  const commonStyles = useCommonStyles();
  const styles = getStyles(colors);

  const searchText = query.trim();
  const { width } = useWindowDimensions();

  const columns = useMemo(() => {
    if (width < 520) return 3;
    if (width < 760) return 4;
    if (width < 980) return 5;
    return 6;
  }, [width]);

  const itemWidth = useMemo(() => {
    const horizontalPadding = 24; // 12 left + 12 right
    const spacing = (columns - 1) * 12;
    const available = Math.max(width - horizontalPadding - spacing, 0);
    return Math.floor(available / columns);
  }, [width, columns]);

  useEffect(() => {
    if (!apiDir) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      if (searchText.length === 0) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      fetch(`${apiDir}/series/search?query=${encodeURIComponent(searchText)}`)
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Error ${response.status}`);
          }
          return response.json();
        })
        .then((data: SeriesItem[]) => {
          setResults(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setError(t("search.errorLoading"));
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [apiDir, searchText]);

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

  const renderedResults = () => {
    if (searchText.length === 0) {
      return <Text style={styles.emptyText}>{t("search.emptyPrompt")}</Text>;
    }

    if (loading) {
      return <ActivityIndicator size="large" color={colors.text} style={styles.loading} />;
    }

    if (error) {
      return <Text style={styles.emptyText}>{error}</Text>;
    }

    if (!results.length) {
      return <Text style={styles.emptyText}>{t("search.noResults")}</Text>;
    }

    return (
      <FlatList
        data={results}
        keyExtractor={(item) => item.series_id.toString()}
        key={columns}
        numColumns={columns}
        columnWrapperStyle={[styles.columnWrapper, { justifyContent: width >= 900 ? "center" : "flex-start" }]}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: 12 }]}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { width: itemWidth }]} onPress={() => handlePress(item)} activeOpacity={0.8}>
            <View style={styles.coverBox}>
              <Image
                source={{ uri: imageErrors[item.series_id] ? placeholderUrl : getImageUrl(item.front_picture) }}
                style={styles.coverImage}
                onError={() => setImageErrors((prev) => ({ ...prev, [item.series_id]: true }))}
              />
            </View>
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <Text style={styles.title}>{t("search.title")}</Text>
        <TextInput
          placeholder={t("search.placeholder")}
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.resultsContainer}>{renderedResults()}</View>
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 16 : 24,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: colors.cardItem,
    color: colors.text,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    columnGap: 12,
    rowGap: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.cardItem,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
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
    backgroundColor: colors.borderLight,
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
  loading: {
    marginTop: 32,
  },
});
