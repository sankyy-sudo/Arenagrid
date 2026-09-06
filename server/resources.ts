import type { Role } from "@prisma/client";
import { createResourceRouter, toManyRelation, toOneRelation, type ResourceConfig } from "./lib/resource";
import * as v from "../shared/validation";

const ALL_ROLES: Role[] = [
  "SUPER_ADMIN",
  "SEO_MANAGER",
  "CONTENT_MANAGER",
  "SALES_MANAGER",
  "SALES_USER",
  "PROJECT_MANAGER",
  "EDITOR"
];
const CONTENT_WRITE: Role[] = ["SUPER_ADMIN", "CONTENT_MANAGER", "EDITOR"];
const CONTENT_DELETE: Role[] = ["SUPER_ADMIN", "CONTENT_MANAGER"];

function extractRelations<T extends Record<string, unknown>>(
  data: T,
  relationKeys: string[]
): { core: Record<string, unknown>; relations: Record<string, unknown> } {
  const core: Record<string, unknown> = { ...data };
  const relations: Record<string, unknown> = {};
  for (const key of relationKeys) {
    if (key in core) {
      relations[key] = core[key];
      delete core[key];
    }
  }
  return { core, relations };
}

const productConfig: ResourceConfig = {
  name: "products",
  module: "products",
  model: "product",
  createSchema: v.productCreateSchema,
  updateSchema: v.productUpdateSchema,
  include: { category: true, specifications: true, sports: true, services: true, gallery: true },
  searchFields: ["name", "sku"],
  roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, [
      "categoryId",
      "sportIds",
      "serviceIds",
      "galleryIds",
      "specifications"
    ]);
    return {
      ...core,
      category: toOneRelation(relations.categoryId, "connect"),
      sports: toManyRelation(relations.sportIds, "connect"),
      services: toManyRelation(relations.serviceIds, "connect"),
      gallery: toManyRelation(relations.galleryIds, "connect"),
      specifications: relations.specifications ? { create: relations.specifications } : undefined
    };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["categoryId", "sportIds", "serviceIds", "galleryIds"]);
    return {
      ...core,
      category: toOneRelation(relations.categoryId, "set"),
      sports: toManyRelation(relations.sportIds, "set"),
      services: toManyRelation(relations.serviceIds, "set"),
      gallery: toManyRelation(relations.galleryIds, "set")
    };
  }
};

const productCategoryConfig: ResourceConfig = {
  name: "product-categories",
  module: "product-categories",
  model: "productCategory",
  createSchema: v.productCategoryCreateSchema,
  updateSchema: v.productCategoryUpdateSchema,
  include: { products: false },
  searchFields: ["name"],
  roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE }
};

const sportConfig: ResourceConfig = {
  name: "sports",
  module: "sports",
  model: "sport",
  createSchema: v.sportCreateSchema,
  updateSchema: v.sportUpdateSchema,
  include: { products: true, services: true },
  searchFields: ["name"],
  roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, ["productIds", "serviceIds"]);
    return {
      ...core,
      products: toManyRelation(relations.productIds, "connect"),
      services: toManyRelation(relations.serviceIds, "connect")
    };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["productIds", "serviceIds"]);
    return {
      ...core,
      products: toManyRelation(relations.productIds, "set"),
      services: toManyRelation(relations.serviceIds, "set")
    };
  }
};

const serviceConfig: ResourceConfig = {
  name: "services",
  module: "services",
  model: "service",
  createSchema: v.serviceCreateSchema,
  updateSchema: v.serviceUpdateSchema,
  include: { products: true, sports: true, industries: true },
  searchFields: ["name", "category"],
  roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, ["productIds", "sportIds", "industryIds"]);
    return {
      ...core,
      products: toManyRelation(relations.productIds, "connect"),
      sports: toManyRelation(relations.sportIds, "connect"),
      industries: toManyRelation(relations.industryIds, "connect")
    };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["productIds", "sportIds", "industryIds"]);
    return {
      ...core,
      products: toManyRelation(relations.productIds, "set"),
      sports: toManyRelation(relations.sportIds, "set"),
      industries: toManyRelation(relations.industryIds, "set")
    };
  }
};

const industryConfig: ResourceConfig = {
  name: "industries",
  module: "industries",
  model: "industry",
  createSchema: v.industryCreateSchema,
  updateSchema: v.industryUpdateSchema,
  include: { services: true },
  searchFields: ["name"],
  roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, ["serviceIds"]);
    return { ...core, services: toManyRelation(relations.serviceIds, "connect") };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["serviceIds"]);
    return { ...core, services: toManyRelation(relations.serviceIds, "set") };
  }
};

const PROJECT_ROLES: Role[] = ["SUPER_ADMIN", "PROJECT_MANAGER", "CONTENT_MANAGER"];

const projectConfig: ResourceConfig = {
  name: "projects",
  module: "projects",
  model: "project",
  createSchema: v.projectCreateSchema,
  updateSchema: v.projectUpdateSchema,
  include: { sports: true, products: true, services: true, industries: true, gallery: true },
  searchFields: ["name", "client", "city"],
  roles: { read: ALL_ROLES, write: PROJECT_ROLES, delete: PROJECT_ROLES },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, [
      "sportIds",
      "productIds",
      "serviceIds",
      "industryIds",
      "galleryIds"
    ]);
    return {
      ...core,
      sports: toManyRelation(relations.sportIds, "connect"),
      products: toManyRelation(relations.productIds, "connect"),
      services: toManyRelation(relations.serviceIds, "connect"),
      industries: toManyRelation(relations.industryIds, "connect"),
      gallery: toManyRelation(relations.galleryIds, "connect")
    };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, [
      "sportIds",
      "productIds",
      "serviceIds",
      "industryIds",
      "galleryIds"
    ]);
    return {
      ...core,
      sports: toManyRelation(relations.sportIds, "set"),
      products: toManyRelation(relations.productIds, "set"),
      services: toManyRelation(relations.serviceIds, "set"),
      industries: toManyRelation(relations.industryIds, "set"),
      gallery: toManyRelation(relations.galleryIds, "set")
    };
  }
};

const caseStudyConfig: ResourceConfig = {
  name: "case-studies",
  module: "case-studies",
  model: "caseStudy",
  createSchema: v.caseStudyCreateSchema,
  updateSchema: v.caseStudyUpdateSchema,
  include: { project: true, products: true, sports: true, services: true },
  searchFields: ["title", "client"],
  roles: { read: ALL_ROLES, write: PROJECT_ROLES, delete: PROJECT_ROLES },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, ["projectId", "productIds", "sportIds", "serviceIds"]);
    return {
      ...core,
      project: toOneRelation(relations.projectId, "connect"),
      products: toManyRelation(relations.productIds, "connect"),
      sports: toManyRelation(relations.sportIds, "connect"),
      services: toManyRelation(relations.serviceIds, "connect")
    };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["projectId", "productIds", "sportIds", "serviceIds"]);
    return {
      ...core,
      project: toOneRelation(relations.projectId, "set"),
      products: toManyRelation(relations.productIds, "set"),
      sports: toManyRelation(relations.sportIds, "set"),
      services: toManyRelation(relations.serviceIds, "set")
    };
  }
};

const blogPostConfig: ResourceConfig = {
  name: "blog-posts",
  module: "blog-posts",
  model: "blogPost",
  createSchema: v.blogPostCreateSchema,
  updateSchema: v.blogPostUpdateSchema,
  include: { products: true, sports: true },
  searchFields: ["title", "category", "tags"],
  roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, ["productIds", "sportIds"]);
    return {
      ...core,
      products: toManyRelation(relations.productIds, "connect"),
      sports: toManyRelation(relations.sportIds, "connect")
    };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["productIds", "sportIds"]);
    return {
      ...core,
      products: toManyRelation(relations.productIds, "set"),
      sports: toManyRelation(relations.sportIds, "set")
    };
  }
};

const resourceConfig: ResourceConfig = {
  name: "resources",
  module: "resources",
  model: "resource",
  createSchema: v.resourceCreateSchema,
  updateSchema: v.resourceUpdateSchema,
  include: { file: true, products: true, sports: true },
  searchFields: ["title", "category"],
  roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, ["fileId", "productIds", "sportIds"]);
    return {
      ...core,
      file: toOneRelation(relations.fileId, "connect"),
      products: toManyRelation(relations.productIds, "connect"),
      sports: toManyRelation(relations.sportIds, "connect")
    };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["fileId", "productIds", "sportIds"]);
    return {
      ...core,
      file: toOneRelation(relations.fileId, "set"),
      products: toManyRelation(relations.productIds, "set"),
      sports: toManyRelation(relations.sportIds, "set")
    };
  }
};

const faqConfig: ResourceConfig = {
  name: "faqs",
  module: "faqs",
  model: "fAQ",
  createSchema: v.faqCreateSchema,
  updateSchema: v.faqUpdateSchema,
  include: { products: true, sports: true, services: true },
  searchFields: ["question", "category"],
  orderBy: { order: "asc" },
  roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, ["productIds", "sportIds", "serviceIds"]);
    return {
      ...core,
      products: toManyRelation(relations.productIds, "connect"),
      sports: toManyRelation(relations.sportIds, "connect"),
      services: toManyRelation(relations.serviceIds, "connect")
    };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["productIds", "sportIds", "serviceIds"]);
    return {
      ...core,
      products: toManyRelation(relations.productIds, "set"),
      sports: toManyRelation(relations.sportIds, "set"),
      services: toManyRelation(relations.serviceIds, "set")
    };
  }
};

const pageConfig: ResourceConfig = {
  name: "pages",
  module: "pages",
  model: "page",
  createSchema: v.pageCreateSchema,
  updateSchema: v.pageUpdateSchema,
  searchFields: ["title"],
  roles: {
    read: ALL_ROLES,
    write: ["SUPER_ADMIN", "CONTENT_MANAGER", "SEO_MANAGER"],
    delete: ["SUPER_ADMIN", "CONTENT_MANAGER"]
  }
};

const menuItemConfig: ResourceConfig = {
  name: "menu-items",
  module: "menu-items",
  model: "menuItem",
  createSchema: v.menuItemCreateSchema,
  updateSchema: v.menuItemUpdateSchema,
  include: { children: true },
  orderBy: { order: "asc" },
  searchFields: ["label"],
  roles: {
    read: ALL_ROLES,
    write: ["SUPER_ADMIN", "CONTENT_MANAGER"],
    delete: ["SUPER_ADMIN", "CONTENT_MANAGER"]
  },
  beforeCreate: (data) => {
    const { core, relations } = extractRelations(data, ["parentId"]);
    return { ...core, parent: toOneRelation(relations.parentId, "connect") };
  },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["parentId"]);
    return { ...core, parent: toOneRelation(relations.parentId, "set") };
  }
};

const SALES_ROLES: Role[] = ["SUPER_ADMIN", "SALES_MANAGER", "SALES_USER"];

const leadConfig: ResourceConfig = {
  name: "leads",
  module: "leads",
  model: "lead",
  createSchema: v.leadUpdateSchema, // leads are created by the public API, admin only updates them
  updateSchema: v.leadUpdateSchema,
  include: { assignedUser: true },
  searchFields: ["firstName", "lastName", "company", "email", "mobile"],
  roles: { read: SALES_ROLES, write: SALES_ROLES, delete: ["SUPER_ADMIN", "SALES_MANAGER"] },
  beforeUpdate: (data) => {
    const { core, relations } = extractRelations(data, ["assignedUserId"]);
    return { ...core, assignedUser: toOneRelation(relations.assignedUserId, "set") };
  }
};

export const resourceConfigs: ResourceConfig[] = [
  productConfig,
  productCategoryConfig,
  sportConfig,
  serviceConfig,
  industryConfig,
  projectConfig,
  caseStudyConfig,
  blogPostConfig,
  resourceConfig,
  faqConfig,
  pageConfig,
  menuItemConfig,
  leadConfig
];

export function mountResourceRouters(adminRouter: import("express").Router) {
  for (const config of resourceConfigs) {
    adminRouter.use(`/${config.name}`, createResourceRouter(config));
  }
}