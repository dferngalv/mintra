import { useContextUser } from "@/contexts/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function EditWork() {
  const { apiDir } = useContextUser();
  const params = useLocalSearchParams();
  const rawSeriesId = params.seriesId;
  const seriesId = Array.isArray(rawSeriesId) ? rawSeriesId[0] : rawSeriesId;
  const { t } = useTranslation();

  const colors = useThemeColors();
  const commonStyles = useCommonStyles();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", sdescription: "", front_picture: "" });

  useEffect(() => {
    const loadSeries = async () => {
      if (!apiDir || !seriesId) return;

      try {
        const response = await fetch(`${apiDir}/series/${seriesId}`);
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || `Error ${response.status}`);
        }
        const data = text ? JSON.parse(text) : null;
        setFormData({
          title: data?.title ?? "",
          sdescription: data?.sdescription ?? "",
          front_picture: data?.front_picture ?? "",
        });
      } catch (err) {
        setError(t('editWork.loadError'));
      }
    };

    void loadSeries();
  }, [apiDir, seriesId]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(t('editWork.permissionDenied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const saveWork = async () => {
    if (!apiDir || !seriesId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        seriesId: Number(seriesId),
        title: formData.title,
        sdescription: formData.sdescription,
      };

      const response = await fetch(`${apiDir}/series/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || `Error ${response.status}`);
      }

      if (selectedImage) {
        const form = new FormData();
        if (Platform.OS === "web") {
          const blob = await fetch(selectedImage).then((res) => res.blob());
          form.append("image", blob, "front.jpg");
        } else {
          form.append("image", {
            uri: selectedImage,
            name: "front.jpg",
            type: "image/jpeg",
          } as any);
        }

        const uploadResponse = await fetch(`${apiDir}/series/upload/${seriesId}`, {
          method: "POST",
          body: form,
        });

        if (!uploadResponse.ok) {
          const textUpload = await uploadResponse.text();
          throw new Error(textUpload || `Error ${uploadResponse.status}`);
        }
      }

      router.replace(`/screens/creatorworkviewer?seriesId=${seriesId}`);
    } catch (err) {
      setError(t('editWork.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={commonStyles.containerInner}>
        <ScrollView contentContainerStyle={commonStyles.scrollContent}>
          <Text style={commonStyles.title}>{t('editWork.title')}</Text>

          {formData.front_picture || selectedImage ? (
            <Image source={{ uri: selectedImage ?? formData.front_picture }} style={{ width: "100%", height: 220, borderRadius: 16, marginBottom: 18 }} />
          ) : (
            <View style={{ width: "100%", height: 220, borderRadius: 16, marginBottom: 18, backgroundColor: colors.placeholder, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: colors.textSecondary }}>{t('editWork.noCover')}</Text>
            </View>
          )}

          <TouchableOpacity style={[commonStyles.button, { backgroundColor: colors.text }]} onPress={pickImage}>
            <Text style={[commonStyles.buttonText, { color: colors.background }]}>{t('editWork.changeCover')}</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 8, fontWeight: "600", color: colors.text }}>{t('editWork.workTitle')}</Text>
            <TextInput
              style={commonStyles.input}
              value={formData.title}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 8, fontWeight: "600", color: colors.text }}>{t('editWork.description')}</Text>
            <TextInput
              style={[commonStyles.textbox, { minHeight: 120 }]}
              multiline
              value={formData.sdescription}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, sdescription: text }))}
            />
          </View>

          {error && <Text style={{ color: "#c0392b", marginTop: 16 }}>{error}</Text>}

          <TouchableOpacity style={[commonStyles.button, { backgroundColor: colors.text }]} onPress={saveWork} disabled={loading}>
            <Text style={[commonStyles.buttonText, { color: colors.background }]}>{loading ? t('editWork.saving') : t('editWork.saveWork')}</Text>
          </TouchableOpacity>

          <View style={commonStyles.footer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
