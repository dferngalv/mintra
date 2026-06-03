import { useContextUser } from "@/contexts/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";

interface ChapterItem {
  chapter_id: number;
  cnumber: number;
  title?: string;
  creation_date?: string;
}

interface SeriesDetail {
  series_id: number;
  title: string;
  sdescription?: string;
  front_picture?: string;
  sstatus?: string;
  artists?: string;
  publication_state?: string;
  creation_date?: string;
  update_date?: string;
  user_id_fk?: number;
  average_rating?: number;
  ratings_count?: number;
  chapters?: ChapterItem[];
}

export default function SeriesDetailScreen() {
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  const { apiDir, userData } = useContextUser();
  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const { t } = useTranslation();

  const colors = useThemeColors();
  const commonStyles = useCommonStyles();
  const styles = getStyles(colors);

  useEffect(() => {
    if (!apiDir || !seriesId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${apiDir}/series/${seriesId}`)
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `Error ${response.status}`);
        }
        return response.json();
      })
      .then((data: SeriesDetail) => {
        setSeries(data);
      })
      .catch(() => {
        setError(t("detail.errorLoading"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiDir, seriesId]);

  useEffect(() => {
    if (!apiDir || !seriesId || !userData) {
      return;
    }

    fetch(`${apiDir}/series/followed/${userData}/${seriesId}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Error checking follow status");
        }
        return response.json();
      })
      .then((data: boolean) => {
        setFollowed(Boolean(data));
      })
      .catch(() => {
        setFollowed(false);
      });
  }, [apiDir, seriesId, userData]);

  const placeholderUrl = apiDir ? `${apiDir}/images/placeholder/placeholder.png` : undefined;

  const getImageUrl = (picture: string | undefined) => {
    if (!picture || picture === "null" || picture.trim() === "") return placeholderUrl;
    if (picture.startsWith("http")) {
      return picture;
    }
    return apiDir ? `${apiDir}${picture}` : placeholderUrl;
  };

  const chapters = useMemo(() => {
    if (!series?.chapters) return [];
    return [...series.chapters].sort((a, b) => (b.cnumber ?? 0) - (a.cnumber ?? 0));
  }, [series]);

  const onToggleFollow = async () => {
    if (!apiDir || !userData || !seriesId) return;
    setFollowLoading(true);

    try {
      const method = followed ? "DELETE" : "POST";
      const response = await fetch(`${apiDir}/series/follow/${userData}/${seriesId}`, {
        method,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar seguimiento");
      }
      setFollowed(!followed);
    } catch {
      setError(t("detail.errorLoading"));
    } finally {
      setFollowLoading(false);
    }
  };

  const onShare = async () => {
    if (!series) return;
    try {
      await Share.share({
        message: t("detail.shareMessage", { title: series.title, artists: series.artists ?? t("detail.unknownAuthor") }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{error}</Text>
      </View>
    );
  }

  if (!series) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{t("detail.notFound")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerSection}>
        <View style={styles.coverWrapper}>
          <Image
            source={{ uri: coverError ? placeholderUrl : getImageUrl(series.front_picture) }}
            style={styles.coverImage}
            onError={() => setCoverError(true)}
          />
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.title}>{series.title}</Text>
          <Text style={styles.subTitle}>{series.artists ?? t("detail.unknownAuthor")}</Text>
          <View style={styles.statusRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{series.publication_state ?? series.sstatus ?? t("detail.published")}</Text>
            </View>
          </View>
          <Text style={styles.smallMeta}>{series.update_date ? `${t("detail.updated")} ${new Date(series.update_date).toLocaleDateString()}` : t("detail.noDate")}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        {userData ? (
          <TouchableOpacity
            style={[styles.primaryButton, styles.followButton]}
            onPress={onToggleFollow}
            disabled={followLoading}
          >
            <Text style={[styles.primaryButtonText, followed && styles.primaryButtonTextActive]}>
              {followed ? t("detail.unfollow") : t("detail.follow")}
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={[styles.secondaryButton, styles.shareButton]} onPress={onShare}>
          <Text style={styles.secondaryButtonText}>{t("detail.share")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.sectionTitle}>{t("detail.description")}</Text>
        <Text style={styles.description}>{series.sdescription ?? t("detail.noDescription")}</Text>
      </View>

      <View style={styles.chaptersBox}>
        <Text style={styles.sectionTitle}>{t("detail.chapters")}</Text>
        {chapters.length === 0 ? (
          <Text style={styles.emptyText}>{t("detail.noChapters")}</Text>
        ) : (
          <FlatList
            data={chapters}
            keyExtractor={(item) => item.chapter_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chapterRow}
                onPress={() => router.push(`/screens/chapterreader?chapterId=${item.chapter_id}`)}
              >
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>Ch. {item.cnumber}{item.title ? ` - ${item.title}` : ""}</Text>
                  <Text style={styles.chapterDate}>{item.creation_date ? new Date(item.creation_date).toLocaleDateString() : t("detail.noDate")}</Text>
                </View>
                <View style={styles.chapterBadge}>
                  <Text style={styles.chapterBadgeText}>{t("detail.read")}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background,
  },
  messageText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  headerSection: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  coverWrapper: {
    width: 140,
    height: 210,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.placeholder,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoColumn: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  descriptionBox: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  primaryButtonTextActive: {
    color: colors.background,
  },
  followButton: {
    flex: 1,
  },
  shareButton: {
    flex: 1,
    backgroundColor: colors.cardItem,
  },
  coverPlaceholder: {
    width: "100%",
    height: 360,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.placeholder,
  },
  coverPlaceholderText: {
    color: colors.textSecondary,
  },
  detailsBox: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    color: colors.text,
  },
  subTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: colors.text,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "700",
  },
  badgeOutline: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeOutlineText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  smallMeta: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  ratingStars: {
    fontSize: 18,
    color: "#E2B33B",
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  ratingCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.text,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 140,
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: colors.cardItem,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 120,
  },
  secondaryButtonActive: {
    backgroundColor: colors.text,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButtonTextActive: {
    color: colors.background,
  },
  iconButton: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    justifyContent: "center",
    minWidth: 90,
  },
  iconButtonText: {
    color: colors.text,
    fontWeight: "700",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  chaptersBox: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  chapterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  chapterDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  chapterBadge: {
    backgroundColor: colors.text,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chapterBadgeText: {
    fontSize: 12,
    color: colors.background,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    paddingBottom: 24,
  },
});
