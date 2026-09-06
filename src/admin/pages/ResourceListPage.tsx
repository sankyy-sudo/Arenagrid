import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { adminApi, ApiClientError } from "../api";
import { getResourceDef } from "../resourceConfig";
import { useAuth } from "../AuthContext";

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function renderCell(value: unknown): string {
  if (value === null || value === undefined) return "\u2014";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "PUBLISHED" ? "admin-badge-published" : status === "ARCHIVED" ? "admin-badge-archived" : "admin-badge-draft";
  return <span className={`admin-badge ${cls}`}>{status}</span>;
}

export function ResourceListPage() {
  const { resourceKey } = useParams<{ resourceKey: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const def = resourceKey ? getResourceDef(resourceKey) : undefined;

  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!def) return;
    setLoading(true);
    const search = query ? `?q=${encodeURIComponent(query)}` : "";
    adminApi
      .get<{ items: Record<string, unknown>[] }>(`/${def.key}${search}`)
      .then((res) => setItems(res.items))
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, [def, query]);

  if (!def) return <Navigate to="/admin" replace />;
  const canWrite = user ? def.roles.write.includes(user.role) : false;

  async function handleDelete(id: string) {
    if (!def) return;
    if (!window.confirm(`Delete this ${def.singularLabel.toLowerCase()}? This cannot be undone.`)) return;
    try {
      await adminApi.delete(`/${def.key}/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Delete failed.");
    }
  }

  return (
    <div>
      <h2 className="admin-h2">{def.label}</h2>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder={`Search ${def.label.toLowerCase()}\u2026`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {canWrite && (
            <button className="admin-btn admin-btn-primary" onClick={() => navigate(`/admin/${def.key}/new`)}>
              + New {def.singularLabel}
            </button>
          )}
        </div>

        {loading ? (
          <div className="admin-empty">Loading&hellip;</div>
        ) : items.length === 0 ? (
          <div className="admin-empty">No {def.label.toLowerCase()} yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {def.columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={String(item.id)}>
                  {def.columns.map((col) => (
                    <td key={col.key}>
                      {col.key === "status" ? (
                        <StatusBadge status={String(item.status ?? "DRAFT")} />
                      ) : (
                        renderCell(getPath(item, col.key))
                      )}
                    </td>
                  ))}
                  <td>
                    <Link
                      to={`/admin/${def.key}/${item.id}`}
                      className="admin-btn admin-btn-ghost"
                      style={{ padding: "4px 10px", marginRight: 6 }}
                    >
                      {canWrite ? "Edit" : "View"}
                    </Link>
                    {canWrite && (
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: "4px 10px" }}
                        onClick={() => handleDelete(String(item.id))}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}