import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { resourceDefs } from "../resourceConfig";

const EXTRA_LINKS = [
  { to: "/admin", label: "Dashboard", end: true, roles: undefined as string[] | undefined },
  { to: "/admin/leads", label: "Leads", roles: ["SUPER_ADMIN", "SALES_MANAGER", "SALES_USER"] },
  { to: "/admin/media", label: "Media Library", roles: undefined },
  { to: "/admin/users", label: "Users", roles: ["SUPER_ADMIN"] }
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const visibleResources = resourceDefs.filter((r) => r.roles.read.includes(user.role));

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h1>Arena Grid Admin</h1>
        <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}>
          Dashboard
        </NavLink>
        {EXTRA_LINKS.filter((l) => l.to !== "/admin").map(
          (link) =>
            (!link.roles || link.roles.includes(user.role)) && (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
              >
                {link.label}
              </NavLink>
            )
        )}
        <div style={{ height: 10 }} />
        {visibleResources.map((r) => (
          <NavLink
            key={r.key}
            to={`/admin/${r.key}`}
            className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
          >
            {r.label}
          </NavLink>
        ))}
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="who">
            {user.name} &middot; {user.role.replace("_", " ")}
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={() => logout()}>
            Log out
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}