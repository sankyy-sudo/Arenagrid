import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ResourceListPage } from "./pages/ResourceListPage";
import { ResourceFormPage } from "./pages/ResourceFormPage";
import { MediaLibraryPage } from "./pages/MediaLibraryPage";
import { UsersPage } from "./pages/UsersPage";
import { LeadsPage } from "./pages/LeadsPage";
import "./admin.css";

function AdminRoot() {
  return (
    <AuthProvider>
      <AdminOutletSwitch />
    </AuthProvider>
  );
}

// Small helper component so AuthProvider wraps both the login page and the
// protected shell without duplicating <AuthProvider> in the route tree.
function AdminOutletSwitch() {
  return <Outlet />;
}

export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    element: <AdminRoot />,
    children: [
      { path: "login", element: <LoginPage /> },
      {
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "leads", element: <LeadsPage /> },
          { path: "media", element: <MediaLibraryPage /> },
          { path: "users", element: <UsersPage /> },
          { path: ":resourceKey", element: <ResourceListPage /> },
          { path: ":resourceKey/:id", element: <ResourceFormPage /> }
        ]
      }
    ]
  }
];