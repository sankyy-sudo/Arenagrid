import { useEffect, useState } from "react";
import { adminApi, ApiClientError } from "../api";

interface Lead {
  id: string;
  firstName: string;
  lastName?: string;
  company?: string;
  email?: string;
  mobile?: string;
  message?: string;
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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    const search = query ? `?q=${encodeURIComponent(query)}` : "";
    adminApi
      .get<{ items: Lead[] }>(`/leads${search}`)
      .then((res) => setLeads(res.items))
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Failed to load leads."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [query]);

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
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search leads\u2026"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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
                <th>Company</th>
                <th>Contact</th>
                <th>Assigned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    {lead.firstName} {lead.lastName ?? ""}
                  </td>
                  <td>{lead.company ?? "\u2014"}</td>
                  <td>{lead.email ?? lead.mobile ?? "\u2014"}</td>
                  <td>{lead.assignedUser?.name ?? "Unassigned"}</td>
                  <td>
                    <select
                      className="admin-select"
                      style={{ width: "auto" }}
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}