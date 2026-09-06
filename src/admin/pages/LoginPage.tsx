import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { ApiClientError } from "../api";

export function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Arena Grid Infra Admin</h1>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="admin-input"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="admin-form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="admin-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="admin-btn admin-btn-primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Signing in\u2026" : "Sign in"}
        </button>
      </form>
    </div>
  );
}