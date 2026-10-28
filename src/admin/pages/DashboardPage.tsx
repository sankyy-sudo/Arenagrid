import { useEffect, useState } from "react";
import { adminApi } from "../services/api";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface DashboardStats {
  leadCount: number;
  newLeadCount: number;
  productCount: number;
  projectCount: number;
  mediaCount: number;
}

export function DashboardPage() {
  const { user } = useAuth();
  const destination = user?.role === "SALES_USER" ? "/admin/leads"
    : user?.role === "EDITOR" ? "/admin/products" : undefined;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (destination) return;
    adminApi
      .get<DashboardStats>("/dashboard")
      .then(setStats)
      .catch(() => setError("Could not load dashboard stats."));
  }, [destination]);

  if (destination) return <Navigate to={destination} replace />;

  return (
    <div>
      <h2 className="admin-h2">Dashboard</h2>
      {error && <div className="admin-error">{error}</div>}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
          <StatCard label="New leads" value={stats.newLeadCount} />
          <StatCard label="Total leads" value={stats.leadCount} />
          <StatCard label="Products" value={stats.productCount} />
          <StatCard label="Projects" value={stats.projectCount} />
          <StatCard label="Media assets" value={stats.mediaCount} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="admin-card">
      <div style={{ fontSize: 26, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: "#666", marginTop: 4 }}>{label}</div>
    </div>
  );
}
