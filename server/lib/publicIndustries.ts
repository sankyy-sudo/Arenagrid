import type { Prisma } from "@prisma/client";

export const publishedIndustriesQuery = {
  where: { status: "PUBLISHED" }, orderBy: [{ name: "asc" }, { id: "asc" }],
  select: { id: true, name: true, slug: true, imageUrl: true, description: true, solution: true }
} satisfies Prisma.IndustryFindManyArgs;
