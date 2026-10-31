import { usePublicCatalog } from "./usePublicCatalog";

export function useProducts() {
  const { data, loading, error, retry } = usePublicCatalog("products");
  return { products: data ?? [], loading, error: error ? "Products could not be loaded. Please try again." : null, retry };
}
