import type { Prisma } from "@prisma/client";

// Only public fields; unpublished category/sport names must not leak through relationships.
export const publishedProductsQuery = {
  where: { status: "PUBLISHED" },
  orderBy: [{ name: "asc" }, { id: "asc" }],
  select: {
    gallery: { select: { url: true, altText: true }, orderBy: { id: "asc" } },
    id: true, name: true, slug: true, shortDescription: true, fullDescription: true, mainImageUrl: true, features: true, bestFor: true,
    category: { select: { id: true, name: true, slug: true, status: true } },
    specifications: { orderBy: [{ order: "asc" }, { id: "asc" }], select: { name: true, value: true, unit: true } },
    sports: { where: { status: "PUBLISHED" }, orderBy: { name: "asc" }, select: { id: true, name: true } }
  }
} satisfies Prisma.ProductFindManyArgs;

type ProductRow = Prisma.ProductGetPayload<{ select: typeof publishedProductsQuery.select }>;
export function publicProduct(row: ProductRow) {
  const { category, ...product } = row;
  return { ...product, category: category?.status === "PUBLISHED" ? { id: category.id, name: category.name, slug: category.slug } : null };
}
