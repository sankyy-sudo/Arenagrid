import { useMemo } from "react";
import { usePublicCatalog } from "./usePublicCatalog";
import { publicProductsSchema } from "../../../shared/products";
import { publicProjectsSchema } from "../../../shared/projects";
import { publicSportsSchema } from "../../../shared/sports";
import { publicIndustriesSchema } from "../../../shared/industries";
import { productDetail, projectDetail, sportDetail, industryDetail, type DetailItem, type Section } from "../data/catalog";

export function parseDetailItems(section: Section, data: unknown): DetailItem[] {
  switch (section) {
    case "products": return publicProductsSchema.parse(data).items.map(productDetail);
    case "projects": return publicProjectsSchema.parse(data).items.map(projectDetail);
    case "sports": return publicSportsSchema.parse(data).items.map(sportDetail);
    case "industries": return publicIndustriesSchema.parse(data).items.map(industryDetail);
  }
}
export function useDetailItems(section: Section) {
  const { data, loading, error, retry } = usePublicCatalog(section);
  const items = useMemo(() => data ? parseDetailItems(section, { items: data }) : [], [section, data]);
  return { items, loading, error, retry };
}
