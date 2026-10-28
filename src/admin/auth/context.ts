import { createContext } from "react";

export type Role = "SUPER_ADMIN" | "SEO_MANAGER" | "CONTENT_MANAGER" | "SALES_MANAGER" | "SALES_USER" | "PROJECT_MANAGER" | "EDITOR";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);
