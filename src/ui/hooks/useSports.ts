import { usePublicCatalog } from "./usePublicCatalog";

export function useSports() {
  const { data, loading, error, retry } = usePublicCatalog("sports");
  return { sports: data ?? [], loading, error: error ? "Sports could not be loaded. Please try again." : null, retry };
}
