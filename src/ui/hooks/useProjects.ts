import { usePublicCatalog } from "./usePublicCatalog";

export function useProjects() {
  const { data, loading, error, retry } = usePublicCatalog("projects");
  return { projects: data ?? [], loading, error: error ? "Projects could not be loaded. Please try again." : null, retry };
}
