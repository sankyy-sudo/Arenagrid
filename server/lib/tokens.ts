import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "../config";

export const SESSION_COOKIE = "agi_session";
export const CSRF_COOKIE = "agi_csrf";

export interface SessionPayload {
  sub: string;
  role: Role;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: `${env.ADMIN_SESSION_MINUTES}m`
  });
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, env.JWT_SECRET) as SessionPayload;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    maxAge: env.ADMIN_SESSION_MINUTES * 60 * 1000,
    path: "/"
  };
}

export function csrfCookieOptions() {
  return {
    httpOnly: false,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    maxAge: env.ADMIN_SESSION_MINUTES * 60 * 1000,
    path: "/"
  };
}