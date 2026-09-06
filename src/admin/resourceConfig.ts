import type { Role } from "./AuthContext";

export type FieldType =
  | "text"
  | "textarea"
  | "slug"
  | "select"
  | "multiselect"
  | "boolean"
  | "number"
  | "date"
  | "status"
  | "specifications";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  /** For select/multiselect: which resource key to load {id, label} options from */
  optionsResource?: string;
  required?: boolean;
  help?: string;
}

export interface ColumnDef {
  key: string; // supports dot-paths, e.g. "category.name"
  label: string;
}

export interface ResourceDef {
  key: string; // URL segment under /api/admin/
  label: string;
  singularLabel: string;
  titleField: string; // field used as the row/page title
  columns: ColumnDef[];
  fields: FieldDef[];
  roles: { read: Role[]; write: Role[] };
}

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
const PROJECT_WRITE: Role[] = ["SUPER_ADMIN", "PROJECT_MANAGER", "CONTENT_MANAGER"];

const statusField: FieldDef = { key: "status", label: "Status", type: "status" };

export const resourceDefs: ResourceDef[] = [
  {
    key: "products",
    label: "Products",
    singularLabel: "Product",
    titleField: "name",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE },
    columns: [
      { key: "name", label: "Name" },
      { key: "sku", label: "SKU" },
      { key: "category.name", label: "Category" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "sku", label: "SKU", type: "text" },
      { key: "categoryId", label: "Category", type: "select", optionsResource: "product-categories" },
      { key: "shortDescription", label: "Short description", type: "textarea" },
      { key: "fullDescription", label: "Full description", type: "textarea" },
      { key: "sportIds", label: "Related sports", type: "multiselect", optionsResource: "sports" },
      { key: "serviceIds", label: "Related services", type: "multiselect", optionsResource: "services" },
      { key: "specifications", label: "Specifications", type: "specifications" },
      statusField
    ]
  },
  {
    key: "product-categories",
    label: "Product Categories",
    singularLabel: "Category",
    titleField: "name",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE },
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "description", label: "Description", type: "textarea" },
      statusField
    ]
  },
  {
    key: "sports",
    label: "Sports",
    singularLabel: "Sport",
    titleField: "name",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE },
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "shortDescription", label: "Short description", type: "textarea" },
      { key: "longDescription", label: "Long description", type: "textarea" },
      { key: "productIds", label: "Related products", type: "multiselect", optionsResource: "products" },
      { key: "serviceIds", label: "Related services", type: "multiselect", optionsResource: "services" },
      statusField
    ]
  },
  {
    key: "services",
    label: "Services",
    singularLabel: "Service",
    titleField: "name",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE },
    columns: [
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "category", label: "Category label", type: "text" },
      { key: "shortDescription", label: "Short description", type: "textarea" },
      { key: "fullDescription", label: "Full description", type: "textarea" },
      { key: "productIds", label: "Related products", type: "multiselect", optionsResource: "products" },
      { key: "sportIds", label: "Related sports", type: "multiselect", optionsResource: "sports" },
      { key: "industryIds", label: "Related industries", type: "multiselect", optionsResource: "industries" },
      statusField
    ]
  },
  {
    key: "industries",
    label: "Industries",
    singularLabel: "Industry",
    titleField: "name",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE },
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "serviceIds", label: "Related services", type: "multiselect", optionsResource: "services" },
      statusField
    ]
  },
  {
    key: "projects",
    label: "Projects",
    singularLabel: "Project",
    titleField: "name",
    roles: { read: ALL_ROLES, write: PROJECT_WRITE },
    columns: [
      { key: "name", label: "Name" },
      { key: "client", label: "Client" },
      { key: "city", label: "City" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "client", label: "Client", type: "text" },
      { key: "city", label: "City", type: "text" },
      { key: "state", label: "State", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "projectType", label: "Project type", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "challenge", label: "Challenge", type: "textarea" },
      { key: "solution", label: "Solution", type: "textarea" },
      { key: "outcome", label: "Outcome", type: "textarea" },
      { key: "sportIds", label: "Sports", type: "multiselect", optionsResource: "sports" },
      { key: "productIds", label: "Products", type: "multiselect", optionsResource: "products" },
      { key: "serviceIds", label: "Services", type: "multiselect", optionsResource: "services" },
      { key: "industryIds", label: "Industries", type: "multiselect", optionsResource: "industries" },
      statusField
    ]
  },
  {
    key: "case-studies",
    label: "Case Studies",
    singularLabel: "Case Study",
    titleField: "title",
    roles: { read: ALL_ROLES, write: PROJECT_WRITE },
    columns: [
      { key: "title", label: "Title" },
      { key: "client", label: "Client" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "client", label: "Client", type: "text" },
      { key: "projectId", label: "Linked project", type: "select", optionsResource: "projects" },
      { key: "challenge", label: "Challenge", type: "textarea" },
      { key: "requirement", label: "Requirement", type: "textarea" },
      { key: "solution", label: "Solution", type: "textarea" },
      { key: "implementation", label: "Implementation", type: "textarea" },
      { key: "outcome", label: "Outcome", type: "textarea" },
      { key: "productIds", label: "Products", type: "multiselect", optionsResource: "products" },
      { key: "sportIds", label: "Sports", type: "multiselect", optionsResource: "sports" },
      { key: "serviceIds", label: "Services", type: "multiselect", optionsResource: "services" },
      statusField
    ]
  },
  {
    key: "blog-posts",
    label: "Blog & News",
    singularLabel: "Post",
    titleField: "title",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE },
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "content", label: "Content", type: "textarea" },
      { key: "category", label: "Category", type: "text" },
      { key: "tags", label: "Tags (comma separated)", type: "text" },
      { key: "productIds", label: "Related products", type: "multiselect", optionsResource: "products" },
      { key: "sportIds", label: "Related sports", type: "multiselect", optionsResource: "sports" },
      statusField
    ]
  },
  {
    key: "resources",
    label: "Resources",
    singularLabel: "Resource",
    titleField: "title",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE },
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "category", label: "Category", type: "text" },
      { key: "fileId", label: "File", type: "select", optionsResource: "media" },
      { key: "productIds", label: "Related products", type: "multiselect", optionsResource: "products" },
      { key: "sportIds", label: "Related sports", type: "multiselect", optionsResource: "sports" },
      statusField
    ]
  },
  {
    key: "faqs",
    label: "FAQs",
    singularLabel: "FAQ",
    titleField: "question",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE },
    columns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "question", label: "Question", type: "text", required: true },
      { key: "answer", label: "Answer", type: "textarea", required: true },
      { key: "category", label: "Category", type: "text" },
      { key: "order", label: "Sort order", type: "number" },
      { key: "productIds", label: "Related products", type: "multiselect", optionsResource: "products" },
      { key: "sportIds", label: "Related sports", type: "multiselect", optionsResource: "sports" },
      { key: "serviceIds", label: "Related services", type: "multiselect", optionsResource: "services" },
      statusField
    ]
  },
  {
    key: "pages",
    label: "Pages",
    singularLabel: "Page",
    titleField: "title",
    roles: { read: ALL_ROLES, write: ["SUPER_ADMIN", "CONTENT_MANAGER", "SEO_MANAGER"] },
    columns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "content", label: "Content", type: "textarea" },
      statusField
    ]
  },
  {
    key: "menu-items",
    label: "Menus",
    singularLabel: "Menu Item",
    titleField: "label",
    roles: { read: ALL_ROLES, write: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
    columns: [
      { key: "label", label: "Label" },
      { key: "url", label: "URL" },
      { key: "order", label: "Order" }
    ],
    fields: [
      { key: "label", label: "Label", type: "text", required: true },
      { key: "url", label: "URL", type: "text", required: true },
      { key: "order", label: "Sort order", type: "number" },
      { key: "isActive", label: "Active", type: "boolean" },
      { key: "isMega", label: "Mega menu", type: "boolean" }
    ]
  }
];

export function getResourceDef(key: string): ResourceDef | undefined {
  return resourceDefs.find((r) => r.key === key);
}