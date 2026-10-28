import { useCallback, useEffect, useState } from "react";
import { PUBLIC_API_BASE } from "../../services/apiConfig";
import { publicProjectsSchema, type PublicProject } from "../../../shared/projects";

export function useProjects() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const retry = useCallback(() => setVersion(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setProjects([]);
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let active = true;
    fetch(`${PUBLIC_API_BASE}/projects`, { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Projects could not be loaded.");
        return publicProjectsSchema.parse(await response.json());
      })
      .then(data => { if (active) setProjects(data.items); })
      .catch(() => { if (active) setError("Projects could not be loaded. Please try again."); })
      .finally(() => { window.clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [version]);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") retry(); };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [retry]);
  return { projects, loading, error, retry };
}
