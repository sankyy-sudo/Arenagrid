import { z } from "zod";

export const publicProjectSchema = z.object({
  gallery: z.array(z.object({ url: z.string(), altText: z.string().nullable() })).optional(),
  id: z.string(), name: z.string(), slug: z.string(), location: z.string().nullable(),
  surface: z.string().nullish(), use: z.string().nullish(),
  description: z.string().nullable(), beforeImageUrl: z.string().nullable(), afterImageUrl: z.string().nullable(),
  progress: z.number().int().min(0).max(100)
});
export const publicProjectsSchema = z.object({ items: z.array(publicProjectSchema) });
export type PublicProject = z.infer<typeof publicProjectSchema>;
