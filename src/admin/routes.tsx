import type { RouteObject } from "react-router-dom";

export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    lazy: async () => ({ Component: (await import("./components/AdminRoot")).AdminRoot }),
    hydrateFallbackElement: <div role="status" style={{ padding: 40 }}>Loading&hellip;</div>,
    children: [
      { path: "login", lazy: async () => ({ Component: (await import("./pages/LoginPage")).LoginPage }) },
      {
        lazy: async () => ({ Component: (await import("./components/AdminShell")).AdminShell }),
        children: [
          { index: true, lazy: async () => ({ Component: (await import("./pages/DashboardPage")).DashboardPage }) },
          { path: "leads", lazy: async () => ({ Component: (await import("./pages/LeadsPage")).LeadsPage }) },
          { path: "media", lazy: async () => ({ Component: (await import("./pages/MediaLibraryPage")).MediaLibraryPage }) },
          { path: "users", lazy: async () => ({ Component: (await import("./pages/UsersPage")).UsersPage }) },
          { path: ":resourceKey", lazy: async () => ({ Component: (await import("./pages/ResourceListPage")).ResourceListPage }) },
          { path: ":resourceKey/:id", lazy: async () => ({ Component: (await import("./pages/ResourceFormPage")).ResourceFormPage }) }
        ]
      }
    ]
  }
];
