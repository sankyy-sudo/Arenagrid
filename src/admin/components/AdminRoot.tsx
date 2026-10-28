import { Outlet } from "react-router-dom";
import { AuthProvider } from "../auth/AuthProvider";
import "../admin.css";

export function AdminRoot() {
  return <AuthProvider><Outlet /></AuthProvider>;
}
