import type { Role } from "./auth/context";

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
  | "specifications"
  | "image"
  | "text-list"
  | "project-progress";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  /** For select/multiselect: which resource key to load {id, label} options from */
  optionsResource?: string;
  required?: boolean;
  help?: string;
  min?: number;
  max?: number;
  step?: number;
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
  roles: { read: Role[]; write: Role[]; delete: Role[] };
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
const CONTENT_DELETE: Role[] = ["SUPER_ADMIN", "CONTENT_MANAGER"];
const PROJECT_WRITE: Role[] = ["SUPER_ADMIN", "PROJECT_MANAGER", "CONTENT_MANAGER"];

const statusField: FieldDef = { key: "status", label: "Status", type: "status" };

export const resourceDefs: ResourceDef[] = [
  {
    key: "products",
    label: "Products",
    singularLabel: "Product",
    titleField: "name",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
    columns: [
      { key: "name", label: "Name" },
      { key: "category.name", label: "Category" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Product name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "mainImageUrl", label: "Product image", type: "image" },
      { key: "categoryId", label: "Category", type: "select", optionsResource: "product-categories" },
      { key: "fullDescription", label: "Product description", type: "textarea" },
        { key: "features", label: "Features", type: "text-list", help: "Add each feature separately (up to 20)." },
        { key: "bestFor", label: "Best for", type: "text-list", help: "Add uses such as School grounds or Football turfs (up to 30)." },
      statusField
    ]
  },
  {
    key: "product-categories",
    label: "Product Categories",
    singularLabel: "Category",
    titleField: "name",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
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
    roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Sport name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "heroImageUrl", label: "Sport image", type: "image" },
      { key: "longDescription", label: "Description", type: "textarea" },
      statusField
    ]
  },
  {
    key: "services",
    label: "Services",
    singularLabel: "Service",
    titleField: "name",
    roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
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
    roles: { read: ALL_ROLES, write: CONTENT_WRITE, delete: CONTENT_DELETE },
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "imageUrl", label: "Industry image", type: "image" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "solution", label: "Solution", type: "textarea" },
      statusField
    ]
  },
  {
    key: "projects",
    label: "Projects",
    singularLabel: "Project",
    titleField: "name",
    roles: { read: ALL_ROLES, write: PROJECT_WRITE, delete: PROJECT_WRITE },
    columns: [
      { key: "name", label: "Title" },
      { key: "location", label: "Location" },
      { key: "progress", label: "Project progress" },
      { key: "status", label: "Status" }
    ],
    fields: [
      { key: "name", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "beforeImageUrl", label: "Before image", type: "image" },
      { key: "afterImageUrl", label: "After image", type: "image" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "progress", label: "Project status", type: "project-progress" },
      { ...statusField, label: "Publication status" }
    ]
  }
];

export function getResourceDef(key: string): ResourceDef | undefined {
  return resourceDefs.find((r) => r.key === key);
}
