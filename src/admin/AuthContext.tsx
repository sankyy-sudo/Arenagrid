import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { adminApi, ApiClientError } from "./api";

export type Role =
  | "SUPER_ADMIN"
  | "SEO_MANAGER"
  | "CONTENT_MANAGER"
  | "SALES_MANAGER"
  | "SALES_USER"
  | "PROJECT_MANAGER"
  | "EDITOR";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get<{ user: AdminUser }>("/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminApi.post<{ user: AdminUser }>("/auth/login", { email, password });
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.post("/auth/logout");
    } catch {
      // Even if the request fails, drop local state so the UI reflects logged-out.
    }
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiClientError && (error.status === 401 || error.status === 403);
}