import type { Prisma } from "@prisma/client";

export const publishedProjectsQuery = {
  where: { status: "PUBLISHED" }, orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  select: { gallery: { select: { url: true, altText: true }, orderBy: { id: "asc" } }, id: true, name: true, slug: true, location: true, surface: true, use: true, description: true, beforeImageUrl: true, afterImageUrl: true, progress: true }
} satisfies Prisma.ProjectFindManyArgs;
