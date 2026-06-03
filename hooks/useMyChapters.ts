import { useContextUser } from "@/contexts/ThemeProvider";
import { useEffect, useState } from "react";

export default function useMyChapters(seriesId?: string | number) {
  const { apiDir } = useContextUser();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!apiDir || !seriesId) {
      return;
    }

    const id = typeof seriesId === "string" ? parseInt(seriesId, 10) : seriesId;
    if (id === undefined || Number.isNaN(id)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiDir}/chapter/by-series/${id}`);
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || `Error ${response.status}`);
      }
      const data = text ? JSON.parse(text) : [];
      setChapters(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar los capítulos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [apiDir, seriesId]);

  return { chapters, loading, error, refresh };
}
