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

export const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const idArray = z.array(z.string()).optional();
const optionalId = z.string().nullable().optional();
const shortText = (max: number) => z.string().max(max).optional();

export const productCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  sku: z.string().max(80).optional(),
  shortDescription: z.string().max(300).optional(),
  fullDescription: z.string().optional(),
  categoryId: optionalId,
  mainImageUrl: z.string().url().optional(),
  status: publishStatusSchema.default("DRAFT"),
  sportIds: idArray,
  serviceIds: idArray,
  galleryIds: idArray,
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
export const productUpdateSchema = productCreateSchema.partial();

export const productCategoryCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  description: shortText(500),
  status: publishStatusSchema.default("DRAFT")
});
export const productCategoryUpdateSchema = productCategoryCreateSchema.partial();

export const sportCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  shortDescription: shortText(300),
  longDescription: z.string().optional(),
  heroImageUrl: z.string().url().optional(),
  status: publishStatusSchema.default("DRAFT"),
  productIds: idArray,
  serviceIds: idArray
});
export const sportUpdateSchema = sportCreateSchema.partial();

export const serviceCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  category: shortText(120),
  shortDescription: shortText(300),
  fullDescription: z.string().optional(),
  status: publishStatusSchema.default("DRAFT"),
  productIds: idArray,
  sportIds: idArray,
  industryIds: idArray
});
export const serviceUpdateSchema = serviceCreateSchema.partial();

export const industryCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  description: shortText(500),
  status: publishStatusSchema.default("DRAFT"),
  serviceIds: idArray
});
export const industryUpdateSchema = industryCreateSchema.partial();

export const projectCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  client: shortText(160),
  location: shortText(160),
  city: shortText(80),
  state: shortText(80),
  country: shortText(80),
  projectType: shortText(80),
  area: shortText(80),
  completionDate: z.string().datetime().optional(),
  description: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  outcome: z.string().optional(),
  status: publishStatusSchema.default("DRAFT"),
  sportIds: idArray,
  productIds: idArray,
  serviceIds: idArray,
  industryIds: idArray,
  galleryIds: idArray
});
export const projectUpdateSchema = projectCreateSchema.partial();

export const caseStudyCreateSchema = z.object({
  title: z.string().min(2).max(200),
  slug: slugSchema,
  client: shortText(160),
  challenge: z.string().optional(),
  requirement: z.string().optional(),
  solution: z.string().optional(),
  implementation: z.string().optional(),
  outcome: z.string().optional(),
  projectId: optionalId,
  status: publishStatusSchema.default("DRAFT"),
  productIds: idArray,
  sportIds: idArray,
  serviceIds: idArray
});
export const caseStudyUpdateSchema = caseStudyCreateSchema.partial();

export const blogPostCreateSchema = z.object({
  title: z.string().min(2).max(200),
  slug: slugSchema,
  excerpt: shortText(400),
  content: z.string().optional(),
  category: shortText(120),
  tags: shortText(300),
  publishedAt: z.string().datetime().optional(),
  status: publishStatusSchema.default("DRAFT"),
  productIds: idArray,
  sportIds: idArray
});
export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export const resourceCreateSchema = z.object({
  title: z.string().min(2).max(200),
  slug: slugSchema,
  description: shortText(500),
  category: shortText(120),
  fileId: optionalId,
  accessType: z.enum(["PUBLIC", "GATED"]).default("PUBLIC"),
  status: publishStatusSchema.default("DRAFT"),
  productIds: idArray,
  sportIds: idArray
});
export const resourceUpdateSchema = resourceCreateSchema.partial();

export const faqCreateSchema = z.object({
  question: z.string().min(2).max(300),
  answer: z.string().min(2),
  category: shortText(120),
  order: z.number().int().default(0),
  status: publishStatusSchema.default("DRAFT"),
  productIds: idArray,
  sportIds: idArray,
  serviceIds: idArray
});
export const faqUpdateSchema = faqCreateSchema.partial();

export const pageCreateSchema = z.object({
  title: z.string().min(2).max(200),
  slug: slugSchema,
  content: z.string().optional(),
  blocks: z.string().optional(),
  status: publishStatusSchema.default("DRAFT")
});
export const pageUpdateSchema = pageCreateSchema.partial();

export const menuItemCreateSchema = z.object({
  label: z.string().min(1).max(120),
  url: z.string().min(1).max(300),
  parentId: optionalId,
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isMega: z.boolean().default(false)
});
export const menuItemUpdateSchema = menuItemCreateSchema.partial();

export const userCreateSchema = z.object({
  name: z.string().min(2).max(160),
  email: z.string().email(),
  password: z.string().min(10).max(200),
  role: z.enum([
    "SUPER_ADMIN",
    "SEO_MANAGER",
    "CONTENT_MANAGER",
    "SALES_MANAGER",
    "SALES_USER",
    "PROJECT_MANAGER",
    "EDITOR"
  ]),
  isActive: z.boolean().default(true)
});
export const userUpdateSchema = z.object({
  name: z.string().min(2).max(160).optional(),
  password: z.string().min(10).max(200).optional(),
  role: userCreateSchema.shape.role.optional(),
  isActive: z.boolean().optional()
});

export const leadUpdateSchema = z.object({
  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "SITE_VISIT",
    "QUOTATION_SENT",
    "NEGOTIATION",
    "WON",
    "LOST",
    "SPAM_INVALID"
  ]).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).optional(),
  assignedUserId: optionalId
});

export const mediaUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  altText: shortText(300),
  caption: shortText(500),
  category: shortText(80)
});