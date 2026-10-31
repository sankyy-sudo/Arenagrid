import { useAuth } from "../hooks/useAuth";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi, ApiClientError } from "../services/api";

interface Lead {
  id: string;
  firstName: string;
  lastName?: string;
  company?: string;
  email?: string;
  mobile?: string;
  message?: string;
  city?: string;
  type: string;
  status: string;
  priority?: string;
  assignedUser?: { id: string; name: string } | null;
  createdAt: string;
}

const STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "SITE_VISIT",
  "QUOTATION_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
  "SPAM_INVALID"
];

export function LeadsPage() {
  const { user } = useAuth();
  const canDelete = user?.role === "SUPER_ADMIN" || user?.role === "SALES_MANAGER";
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const deletionPending = useRef(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);

  const load = useCallback(() => {
    if (deletionPending.current) return;
    const version = ++requestVersion.current;
    setError(null);
    setLoading(true);
    const search = query ? `?q=${encodeURIComponent(query)}` : "";
    adminApi
      .get<{ items: Lead[] }>(`/leads${search}`)
      .then((res) => { if (version === requestVersion.current) setLeads(res.items); })
      .catch((err) => { if (version === requestVersion.current) setError(err instanceof ApiClientError ? err.message : "Failed to load leads."); })
      .finally(() => { if (version === requestVersion.current) setLoading(false); });
  }, [query]);

  const invalidateRequests = useCallback(() => { requestVersion.current++; }, []);

  useEffect(() => {
    load();
    const refresh = () => { if (document.visibilityState === "visible") load(); };
    window.addEventListener("focus", refresh);
    return () => { invalidateRequests(); window.removeEventListener("focus", refresh); };
  }, [load, invalidateRequests]);

  async function deleteLead(lead: Lead) {
    if (!canDelete || deletionPending.current) return;
    const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
    if (!window.confirm(`Delete the lead from ${name}? This cannot be undone.`)) return;
    deletionPending.current = true;
    invalidateRequests();
    setLoading(false);
    setDeletingId(lead.id);
    setError(null);
    setNotice("");
    try {
      await adminApi.delete(`/leads/${lead.id}`);
      setLeads(current => current.filter(item => item.id !== lead.id));
      setNotice("Lead deleted.");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Delete failed. Please try again.");
    } finally {
      deletionPending.current = false;
      setDeletingId(null);
    }
  }

  async function updateStatus(lead: Lead, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    try {
      await adminApi.put(`/leads/${lead.id}`, { status });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Update failed.");
      load();
    }
  }

  return (
    <div>
      <h2 className="admin-h2">Leads</h2>
      {notice && <p role="status">{notice}</p>}
      {error && <div className="admin-error" role="alert">{error}</div>}
      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            disabled={deletingId !== null}
            aria-label="Search leads"
            placeholder="Search leads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="admin-btn admin-btn-ghost" disabled={loading || deletingId !== null} onClick={load}>Refresh leads</button>
        </div>
        {loading ? (
          <div className="admin-empty">Loading&hellip;</div>
        ) : leads.length === 0 ? (
          <div className="admin-empty">No leads yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Enquiry</th>
                <th>Contact</th>
                <th>Assigned</th>
                <th>Status</th>
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    {lead.firstName} {lead.lastName ?? ""}
                  </td>
                  <td>
                    <div>{lead.type}</div>
                    {lead.city && <div>City: {lead.city}</div>}
                    {lead.company && <div>Company: {lead.company}</div>}
                    <small>{new Date(lead.createdAt).toLocaleString()}</small>
                    {lead.message && <details><summary>View message</summary><p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxWidth: 420 }}>{lead.message}</p></details>}
                  </td>
                  <td>{lead.email && <div>{lead.email}</div>}{lead.mobile && <div>{lead.mobile}</div>}{!lead.email && !lead.mobile && "?"}</td>
                  <td>{lead.assignedUser?.name ?? "Unassigned"}</td>
                  <td>
                    <select
                      className="admin-select"
                      style={{ width: "auto" }}
                      aria-label={`Lead status for ${lead.firstName}`}
                      disabled={deletingId !== null}
                      value={lead.status}
                      onChange={(e) => updateStatus(lead, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  {canDelete && <td><button type="button" className="admin-btn admin-btn-danger" disabled={deletingId !== null} aria-label={`Delete lead from ${lead.firstName}`} onClick={() => deleteLead(lead)}>{deletingId === lead.id ? "Deleting..." : "Delete"}</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
