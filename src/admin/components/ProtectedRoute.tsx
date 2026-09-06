import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 40 }}>Loading&hellip;</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}