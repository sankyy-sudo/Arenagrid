import { z } from "zod";

export const publicSportSchema = z.object({
  id: z.string(), name: z.string(), slug: z.string(),
  shortDescription: z.string().nullable(), longDescription: z.string().nullable(),
  heroImageUrl: z.string().nullable()
});
export const publicSportsSchema = z.object({ items: z.array(publicSportSchema) });
export type PublicSport = z.infer<typeof publicSportSchema>;
