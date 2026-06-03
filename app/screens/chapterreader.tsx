import { useContextUser } from "@/contexts/ThemeProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { ThemeColors, useThemeColors } from "@/hooks/useThemeColors";

interface ChapterReaderData {
  chapterId: number;
  cnumber?: number;
  title?: string;
  images?: string[];
  pictures?: Array<string | { url?: string }>;
  text?: string;
  previousChapterId?: number;
  nextChapterId?: number;
}

const normalizeChapter = (data: any): ChapterReaderData => {
  const raw = data?.chapter ?? data ?? {};
  return {
    chapterId: Number(raw.chapterId ?? raw.chapter_id ?? raw.id ?? 0),
    cnumber: raw.cnumber ?? raw.number,
    title: raw.title ?? raw.name,
    images: Array.isArray(raw.images) ? raw.images : undefined,
    pictures: Array.isArray(raw.pictures) ? raw.pictures : undefined,
    text: raw.text ?? raw.description ?? raw.body ?? raw.content,
    previousChapterId: raw.previousChapterId ?? raw.previous_chapter_id,
    nextChapterId: raw.nextChapterId ?? raw.next_chapter_id,
  };
};

export default function ChapterReaderScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const { apiDir, userData } = useContextUser();
  const [chapter, setChapter] = useState<ChapterReaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"cascade" | "paged">("cascade");
  const [showTopBar, setShowTopBar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const hideBarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation();

  const commonStyles = useCommonStyles();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const chapterImages = useMemo(() => {
    if (!chapter) return [] as string[];
    const images: string[] = Array.isArray(chapter.images) ? [...chapter.images] : [];

    if (Array.isArray(chapter.pictures)) {
      chapter.pictures.forEach((item) => {
        if (typeof item === "string") {
          images.push(item);
        } else if (item?.url) {
          images.push(item.url);
        }
      });
    }

    return images.filter((img): img is string => Boolean(img));
  }, [chapter?.images, chapter?.pictures]);

  useEffect(() => {
    if (showTopBar && !menuOpen) {
      scheduleHideBar();
    }
    return () => {
      if (hideBarTimeoutRef.current !== null) {
        clearTimeout(hideBarTimeoutRef.current);
      }
    };
  }, [showTopBar, menuOpen]);

  const cancelHideBar = () => {
    if (hideBarTimeoutRef.current !== null) {
      clearTimeout(hideBarTimeoutRef.current);
      hideBarTimeoutRef.current = null;
    }
  };

  const scheduleHideBar = () => {
    cancelHideBar();
    if (menuOpen) return;
    hideBarTimeoutRef.current = globalThis.setTimeout(() => {
      setShowTopBar(false);
      hideBarTimeoutRef.current = null;
    }, 2000);
  };

  const showTopBarTemporarily = () => {
    setShowTopBar(true);
    scheduleHideBar();
  };

  const setPageIndexWithSave = (nextIndex: number) => {
    setPageIndex(nextIndex);
    showTopBarTemporarily();
  };

  const switchMode = (nextMode: "cascade" | "paged") => {
    setMode(nextMode);
    setMenuOpen(false);
    setShowTopBar(true);
    scheduleHideBar();
  };

  useEffect(() => {
    if (!apiDir || !chapterId) {
      setError(t("reader.notFound"));
      setLoading(false);
      return;
    }

    const chapterIdNumber = Number(chapterId);
    if (!Number.isFinite(chapterIdNumber)) {
      setError(t("reader.notFound"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setPageIndex(0);

    const loadChapterData = async () => {
      try {
        const chapterResponse = await fetch(`${apiDir}/chapter/${chapterId}`);
        if (!chapterResponse.ok) {
          const body = await chapterResponse.text();
          throw new Error(body || `Error ${chapterResponse.status}`);
        }

        const chapterJson = await chapterResponse.json();
        const normalizedChapter = normalizeChapter(chapterJson);

        const pictureResponse = await fetch(`${apiDir}/picture/chapter/${chapterId}`);
        const pictureJson = pictureResponse.ok ? await pictureResponse.json() : [];

        const chapterData = {
          ...normalizedChapter,
          pictures: Array.isArray(pictureJson) ? pictureJson : [],
        };

        setChapter(chapterData);
      } catch {
        setError(t("reader.errorLoading"));
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, [apiDir, chapterId, userData]);

  const getImageUrl = (image: string | undefined) => {
    if (!image) return undefined;
    if (image.startsWith("http")) return image;
    return apiDir ? `${apiDir}${image}` : undefined;
  };

  const goBack = () => router.back();
  function goPrevious() {
    if (chapter?.previousChapterId) {
      router.push(`/screens/chapterreader?chapterId=${chapter.previousChapterId}`);
    }
  }
  function goNext() {
    if (chapter?.nextChapterId) {
      router.push(`/screens/chapterreader?chapterId=${chapter.nextChapterId}`);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error || !chapter) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.messageText}>{error ?? t("reader.notAvailable")}</Text>
        <TouchableOpacity style={[commonStyles.button, styles.backButton]} onPress={goBack}>
          <Text style={styles.buttonText}>{t("reader.back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderGrant={showTopBarTemporarily}
    >
      {showTopBar && (
        <Pressable
          style={styles.topBar}
          onPressIn={showTopBarTemporarily}
          onHoverIn={cancelHideBar}
          onHoverOut={scheduleHideBar}
        >
          <View style={styles.topBarLeft}>
            <TouchableOpacity style={styles.topBarButton} onPress={goBack}>
              <Text style={styles.topBarButtonText}>←</Text>
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.topBarTitle}>{chapter.title ?? `Ch. ${chapter.cnumber ?? "?"}`}</Text>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                setMenuOpen((prev) => {
                  const next = !prev;
                  if (next) {
                    cancelHideBar();
                    setShowTopBar(true);
                  }
                  return next;
                });
              }}
            >
              <Text style={styles.menuButtonText}>⋮</Text>
            </TouchableOpacity>
            {menuOpen ? (
              <View style={styles.menuDropdown}>
                <TouchableOpacity style={styles.menuItem} onPress={() => switchMode("cascade") }>
                  <Text style={styles.menuItemText}>{t("reader.readCascade")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => switchMode("paged")}> 
                  <Text style={styles.menuItemText}>{t("reader.readPaged")}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </Pressable>
      )}

      {mode === "cascade" ? (
        <ScrollView
          style={styles.readerScroll}
          contentContainerStyle={styles.readerContent}
          onTouchStart={showTopBarTemporarily}
          onScrollBeginDrag={showTopBarTemporarily}
          onStartShouldSetResponder={() => true}
          onResponderGrant={showTopBarTemporarily}
        >
          <Text style={styles.chapterTitle}>Ch. {chapter.cnumber ?? "?"}{chapter.title ? ` - ${chapter.title}` : ""}</Text>
          {chapter.text ? <Text style={styles.chapterText}>{chapter.text}</Text> : null}
          {chapterImages.map((image, index) => {
            const uri = getImageUrl(image);
            return (
              <View key={`${index}-${image}`} style={styles.imageWrapper}>
                <Image source={{ uri: uri ?? "" }} style={styles.chapterImage} resizeMode="contain" />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.pagedContainer}>
          {chapterImages.length > 0 ? (
            <>
              <View style={styles.pagedImageWrapper}>
                <Image
                  source={{ uri: getImageUrl(chapterImages[pageIndex]) ?? "" }}
                  style={styles.pagedImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.pageCounter}>{`${pageIndex + 1} / ${chapterImages.length}`}</Text>
              <Pressable
                style={styles.pageZoneLeft}
                onPress={() => {
                  setPageIndexWithSave(Math.max(pageIndex - 1, 0));
                }}
              />
              <Pressable
                style={styles.pageZoneRight}
                onPress={() => {
                  setPageIndexWithSave(Math.min(pageIndex + 1, chapterImages.length - 1));
                }}
              />
            </>
          ) : (
            <View style={[styles.pagedContainer, styles.centered]}>
              <Text style={styles.messageText}>{t("reader.noImages")}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  headerRow: {
    width: "100%",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    zIndex: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    minWidth: 110,
    borderColor: colors.border,
    backgroundColor: colors.text,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "700",
    textAlign: "center",
  },
  readerScroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  readerContent: {
    paddingTop: 72,
    paddingBottom: 32,
    paddingHorizontal: 14,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 12,
    color: colors.text,
  },
  chapterText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  imageWrapper: {
    width: "100%",
    marginBottom: 4,
    alignItems: "center",
  },
  chapterImage: {
    width: "100%",
    aspectRatio: 0.65,
    borderRadius: 12,
    backgroundColor: colors.placeholder,
  },
  topBar: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(15,15,15,0.82)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.14)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  topBarButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
  },
  topBarButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  topBarTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    maxWidth: "72%",
  },
  topBarRight: {
    position: "relative",
  },
  menuButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  menuDropdown: {
    position: "absolute",
    top: 52,
    right: 0,
    backgroundColor: "rgba(25,25,25,0.96)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: "#fff",
    fontSize: 14,
  },
  pagedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  pagedImageWrapper: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 80,
  },
  pagedImage: {
    width: "100%",
    height: "100%",
  },
  pageCounter: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    color: colors.textSecondary,
    fontSize: 14,
    backgroundColor: colors.cardItem,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pageZoneLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "50%",
    zIndex: 10,
  },
  pageZoneRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "50%",
    zIndex: 10,
  },
  messageText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  backButton: {
    borderColor: colors.border,
    backgroundColor: colors.text,
  },
});
