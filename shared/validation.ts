import { z } from "zod";

export const slugSchema = z
  .string()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");

export const seoSchema = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(170).optional(),
  canonicalUrl: z.string().url().optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
  openGraphTitle: z.string().max(90).optional(),
  openGraphDesc: z.string().max(200).optional(),
  openGraphImage: z.string().url().optional(),
  schemaType: z.string().max(60).optional()
});

export const leadCreateSchema = z.object({
  type: z.string().min(2).max(80),
  firstName: z.string().min(2).max(80),
  lastName: z.string().max(80).optional(),
  company: z.string().max(120).optional(),
  designation: z.string().max(120).optional(),
  mobile: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
  email: z.string().email().optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  country: z.string().max(80).optional(),
  message: z.string().max(2000).optional(),
  interest: z.record(z.string(), z.unknown()).optional(),
  project: z.record(z.string(), z.unknown()).optional(),
  attribution: z.record(z.string(), z.unknown()).optional()
});

export const productCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  sku: z.string().max(80).optional(),
  shortDescription: z.string().max(300).optional(),
  fullDescription: z.string().optional(),
  categoryId: z.string().optional(),
  specifications: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        value: z.string().min(1).max(400),
        unit: z.string().max(40).optional()
      })
    )
    .default([])
});
