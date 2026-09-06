import { useEffect, useState, type FormEvent } from "react";
import { adminApi, ApiClientError } from "../api";
import { useAuth } from "../AuthContext";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const ROLES = [
  "SUPER_ADMIN",
  "SEO_MANAGER",
  "CONTENT_MANAGER",
  "SALES_MANAGER",
  "SALES_USER",
  "PROJECT_MANAGER",
  "EDITOR"
];

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  const [saving, setSaving] = useState(false);

  function load() {
    adminApi
      .get<{ items: AdminUserRow[] }>("/users")
      .then((res) => setUsers(res.items))
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Failed to load users."));
  }

  useEffect(load, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.post("/users", { ...form, isActive: true });
      setForm({ name: "", email: "", password: "", role: "EDITOR" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not create user.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(u: AdminUserRow) {
    try {
      await adminApi.put(`/users/${u.id}`, { isActive: !u.isActive });
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Update failed.");
    }
  }

  async function handleDelete(u: AdminUserRow) {
    if (!window.confirm(`Remove ${u.name}? This cannot be undone.`)) return;
    try {
      await adminApi.delete(`/users/${u.id}`);
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Delete failed.");
    }
  }

  return (
    <div>
      <h2 className="admin-h2">Users</h2>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-toolbar">
          <div />
          <button className="admin-btn admin-btn-primary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ New User"}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleCreate}>
            <div className="admin-form-row">
              <label>Name</label>
              <input
                className="admin-input"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="admin-form-row">
              <label>Email</label>
              <input
                className="admin-input"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="admin-form-row">
              <label>Temporary password (min 10 characters)</label>
              <input
                className="admin-input"
                type="text"
                required
                minLength={10}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="admin-form-row">
              <label>Role</label>
              <select
                className="admin-select"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              {saving ? "Creating\u2026" : "Create user"}
            </button>
          </form>
        )}
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th style={{ width: 180 }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role.replace("_", " ")}</td>
                <td>
                  <span className={`admin-badge ${u.isActive ? "admin-badge-published" : "admin-badge-draft"}`}>
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  <button
                    className="admin-btn admin-btn-ghost"
                    style={{ padding: "4px 10px", marginRight: 6 }}
                    disabled={u.id === currentUser?.id}
                    onClick={() => toggleActive(u)}
                  >
                    {u.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    style={{ padding: "4px 10px" }}
                    disabled={u.id === currentUser?.id}
                    onClick={() => handleDelete(u)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}