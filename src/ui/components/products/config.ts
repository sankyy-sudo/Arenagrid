import type { PublicProduct } from "../../../../shared/products";
import { mediaUrl } from "../../../services/apiConfig";

export type Product = {
  id: string; title: string; tagline: string; description: string; fullDescription: string;
  features: string[]; bestFor: string[]; category: string; categoryId: string;
  image: string; imagePosition: string; alt: string; learnMoreHref: string;
};

export function toProductCard(product: PublicProduct): Product {
  return {
    id: product.id, title: product.name, tagline: product.category?.name ?? "",
    description: product.fullDescription || product.shortDescription || "",
    fullDescription: product.fullDescription || product.shortDescription || "",
    features: product.features,
    bestFor: product.bestFor,
    category: product.category?.name ?? "Surface system", categoryId: product.category?.id ?? "",
    image: product.mainImageUrl ? mediaUrl(product.mainImageUrl) : "", imagePosition: "50% 50%",
    alt: product.name, learnMoreHref: `#details-${product.id}`
  };
}
