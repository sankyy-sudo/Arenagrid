import type { Prisma } from "@prisma/client";

export const publishedSportsQuery = {
  where: { status: "PUBLISHED" },
  orderBy: [{ name: "asc" }, { id: "asc" }],
  select: { id: true, name: true, slug: true, shortDescription: true, longDescription: true, heroImageUrl: true }
} satisfies Prisma.SportFindManyArgs;
