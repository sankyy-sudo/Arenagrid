import { usePublicCatalog } from "./usePublicCatalog";

export function useIndustries() {
  const { data, loading, error, retry } = usePublicCatalog("industries");
  return { industries: data ?? [], loading, error: error ? "Industries could not be loaded. Please try again." : null, retry };
}
