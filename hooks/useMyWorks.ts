import { useContextUser } from "@/contexts/ThemeProvider";
import { useState } from "react";

export default function useMyWorks() {
  const { userData, apiDir } = useContextUser();
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!apiDir || !userData) {
      return;
    }

    const userId = parseInt(userData.toString(), 10);
    if (Number.isNaN(userId)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiDir}/series/by-user/${userId}`);
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || `Error ${response.status}`);
      }
      const data = text ? JSON.parse(text) : [];
      const seriesList = Array.isArray(data) ? data : [];

      const enriched = await Promise.all(
        seriesList.map(async (work: any) => {
          try {
            const chapterResponse = await fetch(`${apiDir}/chapter/by-series/${work.seriesId}`);
            const chapterText = await chapterResponse.text();
            if (!chapterResponse.ok) {
              return { ...work, chapterCount: 0 };
            }
            const chapterData = chapterText ? JSON.parse(chapterText) : [];
            return { ...work, chapterCount: Array.isArray(chapterData) ? chapterData.length : 0 };
          } catch {
            return { ...work, chapterCount: 0 };
          }
        })
      );

      setWorks(enriched);
    } catch (err) {
      setError("No se pudieron cargar las obras.");
    } finally {
      setLoading(false);
    }
  };

  return { works, loading, error, refresh };
}
