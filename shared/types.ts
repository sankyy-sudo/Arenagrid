export const publicRoutes = [
  "/",
  "/about",
  "/products",
  "/sports",
  "/services",
  "/industries",
  "/projects",
  "/case-studies",
  "/resources",
  "/blog",
  "/gallery",
  "/contact"
] as const;

export const adminModules = [
  "dashboard",
  "leads",
  "products",
  "productCategories",
  "sports",
  "services",
  "industries",
  "projects",
  "caseStudies",
  "testimonials",
  "partners",
  "blog",
  "resources",
  "gallery",
  "faqs",
  "pages",
  "landingPages",
  "forms",
  "menus",
  "seo",
  "analytics",
  "users",
  "activityLogs",
  "settings"
] as const;

export type AdminModule = (typeof adminModules)[number];
