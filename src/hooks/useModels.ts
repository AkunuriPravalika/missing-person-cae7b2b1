import { useState, useEffect } from "react";
import { loadModels } from "@/lib/faceDetection";

export function useModels() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModels()
      .then(() => {
        setLoaded(true);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { loaded, loading, error };
}
