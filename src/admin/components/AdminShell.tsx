import { AdminLayout } from "./AdminLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export function AdminShell() {
  return <ProtectedRoute><AdminLayout /></ProtectedRoute>;
}
