import { useCallback, useEffect, useState, type ReactNode } from "react";
import { adminApi, setCsrfToken } from "../services/api";
import { AuthContext, type AdminUser } from "./context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get<{ user: AdminUser; csrfToken?: string }>("/auth/me")
      .then((res) => {
        setCsrfToken(res.csrfToken);
        setUser(res.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminApi.post<{ user: AdminUser; csrfToken: string }>("/auth/login", { email, password });
    setCsrfToken(res.csrfToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    await adminApi.post("/auth/logout");
    setCsrfToken(undefined);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

