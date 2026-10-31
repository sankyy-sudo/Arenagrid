import { z } from "zod";

export const publicProductSchema = z.object({
  gallery: z.array(z.object({ url: z.string(), altText: z.string().nullable() })).optional(),
  id: z.string(), name: z.string(), slug: z.string(),
  shortDescription: z.string().nullable(), fullDescription: z.string().nullable(),
  mainImageUrl: z.string().nullable(),
  features: z.array(z.string()), bestFor: z.array(z.string()),
  category: z.object({ id: z.string(), name: z.string(), slug: z.string() }).nullable(),
  specifications: z.array(z.object({ name: z.string(), value: z.string(), unit: z.string().nullable() })),
  sports: z.array(z.object({ id: z.string(), name: z.string() }))
});
export const publicProductsSchema = z.object({ items: z.array(publicProductSchema) });
export type PublicProduct = z.infer<typeof publicProductSchema>;
