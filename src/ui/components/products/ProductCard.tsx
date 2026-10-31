import { InfoCard } from "../InfoCard";
import type { Product } from "./config";

export function ProductCard({ product }: { product: Product }) {
  return <InfoCard to={product.learnMoreHref} title={product.title} shortDescription={product.shortDescription} image={product.image} category={product.category} tags={product.bestFor} imagePosition={product.imagePosition} className="product-card" />;
}
