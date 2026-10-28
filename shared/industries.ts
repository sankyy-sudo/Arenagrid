import { z } from "zod";

export const publicIndustrySchema = z.object({
  id: z.string(), name: z.string(), slug: z.string(), imageUrl: z.string().nullable(),
  description: z.string().nullable(), solution: z.string().nullable()
});
export const publicIndustriesSchema = z.object({ items: z.array(publicIndustrySchema) });
export type PublicIndustry = z.infer<typeof publicIndustrySchema>;
