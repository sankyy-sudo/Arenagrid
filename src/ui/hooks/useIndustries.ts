import { useCallback, useEffect, useState } from "react";
import { PUBLIC_API_BASE } from "../../services/apiConfig";
import { publicIndustriesSchema, type PublicIndustry } from "../../../shared/industries";

export function useIndustries() {
  const [industries, setIndustries] = useState<PublicIndustry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const retry = useCallback(() => setVersion(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setIndustries([]);
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let active = true;
    fetch(`${PUBLIC_API_BASE}/industries`, { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Industries could not be loaded.");
        return publicIndustriesSchema.parse(await response.json());
      })
      .then(data => { if (active) setIndustries(data.items); })
      .catch(() => { if (active) setError("Industries could not be loaded. Please try again."); })
      .finally(() => { window.clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [version]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") retry(); };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [retry]);
  return { industries, loading, error, retry };
}
