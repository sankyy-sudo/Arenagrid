import { z } from "zod";

export const publicProjectSchema = z.object({
  id: z.string(), name: z.string(), slug: z.string(), location: z.string().nullable(),
  description: z.string().nullable(), beforeImageUrl: z.string().nullable(), afterImageUrl: z.string().nullable(),
  progress: z.number().int().min(0).max(100)
});
export const publicProjectsSchema = z.object({ items: z.array(publicProjectSchema) });
export type PublicProject = z.infer<typeof publicProjectSchema>;
