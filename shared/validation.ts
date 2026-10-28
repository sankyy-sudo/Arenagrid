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

// Accept local media paths or explicit HTTP(S) URLs; allow clearing an image.
export const productImageSchema = z.string().max(2000).refine(value => {
  if (value === "") return true;
  if (/^\/(uploads|images)\/[a-zA-Z0-9_./%-]+$/.test(value) && !value.includes("..")) return true;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
}, "Use an uploaded image, /images/ path or HTTP(S) image URL.").nullable().optional();

export const productCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  shortDescription: z.string().max(300).nullish(),
  fullDescription: z.string().nullish(),
  categoryId: optionalId,
  mainImageUrl: productImageSchema,
  features: z.array(z.string().trim().min(1).max(400)).max(20).optional(),
  bestFor: z.array(z.string().trim().min(1).max(160)).max(30).optional(),
  status: publishStatusSchema.default("DRAFT"),
  sportIds: idArray,
  serviceIds: idArray,
  galleryIds: idArray,
  specifications: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        value: z.string().min(1).max(400),
        unit: z.string().max(40).nullish()
      })
    )
    .default([])
});
export const productUpdateSchema = productCreateSchema.partial().extend({
  status: publishStatusSchema.optional(),
  specifications: productCreateSchema.shape.specifications.removeDefault().optional()
});

export const productCategoryCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  description: shortText(500),
  status: publishStatusSchema.default("DRAFT")
});
export const productCategoryUpdateSchema = productCategoryCreateSchema.partial().extend({ status: publishStatusSchema.optional() });

export const sportCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  shortDescription: shortText(300),
  longDescription: z.string().nullish(),
  heroImageUrl: productImageSchema,
  status: publishStatusSchema.default("DRAFT"),
  productIds: idArray,
  serviceIds: idArray
});
export const sportUpdateSchema = sportCreateSchema.partial().extend({ status: publishStatusSchema.optional() });

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
export const serviceUpdateSchema = serviceCreateSchema.partial().extend({ status: publishStatusSchema.optional() });

export const industryCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  description: z.string().max(10000).nullish(),
  imageUrl: productImageSchema,
  solution: z.string().max(10000).nullish(),
  status: publishStatusSchema.default("DRAFT"),
  serviceIds: idArray
});
export const industryUpdateSchema = industryCreateSchema.partial().extend({ status: publishStatusSchema.optional() });

export const projectCreateSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema,
  client: shortText(160),
  location: z.string().max(160).nullish(),
  city: shortText(80),
  state: shortText(80),
  country: shortText(80),
  projectType: shortText(80),
  area: shortText(80),
  completionDate: z.string().datetime().optional(),
  description: z.string().nullish(),
  beforeImageUrl: productImageSchema,
  afterImageUrl: productImageSchema,
  progress: z.union([z.literal(0), z.literal(100)]).optional(),
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
export const projectUpdateSchema = projectCreateSchema.partial().extend({ status: publishStatusSchema.optional() });

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
export const caseStudyUpdateSchema = caseStudyCreateSchema.partial().extend({ status: publishStatusSchema.optional() });

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
export const blogPostUpdateSchema = blogPostCreateSchema.partial().extend({ status: publishStatusSchema.optional() });

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
export const faqUpdateSchema = faqCreateSchema.partial().extend({
  status: publishStatusSchema.optional(),
  order: faqCreateSchema.shape.order.removeDefault().optional()
});

export const pageCreateSchema = z.object({
  title: z.string().min(2).max(200),
  slug: slugSchema,
  content: z.string().optional(),
  blocks: z.string().optional(),
  status: publishStatusSchema.default("DRAFT")
});
export const pageUpdateSchema = pageCreateSchema.partial().extend({ status: publishStatusSchema.optional() });

export const menuItemCreateSchema = z.object({
  label: z.string().min(1).max(120),
  url: z.string().min(1).max(300),
  parentId: optionalId,
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isMega: z.boolean().default(false)
});
export const menuItemUpdateSchema = menuItemCreateSchema.partial().extend({
  order: menuItemCreateSchema.shape.order.removeDefault().optional(),
  isActive: menuItemCreateSchema.shape.isActive.removeDefault().optional(),
  isMega: menuItemCreateSchema.shape.isMega.removeDefault().optional()
});

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
