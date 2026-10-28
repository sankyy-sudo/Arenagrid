import { useCallback, useEffect, useState } from "react";
import { PUBLIC_API_BASE } from "../../services/apiConfig";
import { publicSportsSchema, type PublicSport } from "../../../shared/sports";

export function useSports() {
  const [sports, setSports] = useState<PublicSport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const retry = useCallback(() => setVersion(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setSports([]);
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let active = true;
    fetch(`${PUBLIC_API_BASE}/sports`, { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Sports could not be loaded.");
        return publicSportsSchema.parse(await response.json());
      })
      .then(data => { if (active) setSports(data.items); })
      .catch(() => { if (active) setError("Sports could not be loaded. Please try again."); })
      .finally(() => { window.clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [version]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") retry(); };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [retry]);
  return { sports, loading, error, retry };
}
