import type { Prisma } from "@prisma/client";

export const publishedProjectsQuery = {
  where: { status: "PUBLISHED" }, orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  select: { id: true, name: true, slug: true, location: true, description: true, beforeImageUrl: true, afterImageUrl: true, progress: true }
} satisfies Prisma.ProjectFindManyArgs;
