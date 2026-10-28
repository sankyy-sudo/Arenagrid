// VITE_API_BASE_URL names the admin API; public endpoints share its /api root.
export const ADMIN_API_BASE = (import.meta.env?.VITE_API_BASE_URL || "/api/admin").replace(/\/$/, "");
export const PUBLIC_API_BASE = ADMIN_API_BASE.replace(/\/admin$/, "");

export function mediaUrl(url: string): string {
  return /^https?:\/\//.test(ADMIN_API_BASE) && url.startsWith("/uploads/")
    ? new URL(url, ADMIN_API_BASE).href
    : url;
}
