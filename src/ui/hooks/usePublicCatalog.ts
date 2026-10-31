import { useCallback, useEffect, useSyncExternalStore } from "react";
import { PUBLIC_API_BASE } from "../../services/apiConfig";
import { createResourceCache } from "../../services/resourceCache";
import { publicProductsSchema } from "../../../shared/products";
import { publicSportsSchema } from "../../../shared/sports";
import { publicProjectsSchema } from "../../../shared/projects";
import { publicIndustriesSchema } from "../../../shared/industries";

function resource<T>(section: string, schema: { parse(data: unknown): { items: T[] } }) {
  return createResourceCache(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${PUBLIC_API_BASE}/${section}`, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load catalogue");
      return schema.parse(await response.json()).items;
    } finally { clearTimeout(timer); }
  });
}
const resources = {
  products: resource("products", publicProductsSchema),
  sports: resource("sports", publicSportsSchema),
  projects: resource("projects", publicProjectsSchema),
  industries: resource("industries", publicIndustriesSchema)
};
export function usePublicCatalog<K extends keyof typeof resources>(section: K) {
  const store = resources[section];
  type Snapshot = ReturnType<(typeof resources)[K]["getSnapshot"]>;
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot as () => Snapshot, store.getServerSnapshot as () => Snapshot);
  const retry = useCallback(() => { void store.refresh(true); }, [store]);
  useEffect(() => {
    void store.refresh();
    const refresh = () => { if (document.visibilityState === "visible") void store.refresh(true); };
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 60_000);
    return () => { window.removeEventListener("focus", refresh); window.clearInterval(timer); };
  }, [store]);
  return { ...state, retry };
}
