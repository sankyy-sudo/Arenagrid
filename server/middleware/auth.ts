import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { ApiError } from "../errors";
import { prisma } from "../db";
import { CSRF_COOKIE, SESSION_COOKIE, verifySession } from "../lib/tokens";

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: Role;
  };
};

/**
 * Reads the session cookie, verifies the JWT, and confirms the user still
 * exists and is active. Does NOT reject unauthenticated requests on its own
 * (public routes are mounted separately) - pair with requireAuth/requireRole.
 */
export async function authenticate(request: AuthenticatedRequest, _response: Response, next: NextFunction) {
  const token = request.cookies?.[SESSION_COOKIE];
  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifySession(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (user && user.isActive) {
      request.user = { id: user.id, role: user.role };
    }
  } catch {
    // Invalid/expired token: leave request.user unset, downstream guards reject it.
  }

  next();
}

/**
 * Double-submit CSRF check for state-changing admin requests. The login
 * response sets a readable (non-httpOnly) csrf cookie; the SPA must echo it
 * back in the X-CSRF-Token header on every mutating call.
 */
export function requireCsrf(request: Request, _response: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    next();
    return;
  }

  const cookieToken = request.cookies?.[CSRF_COOKIE];
  const headerToken = request.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw new ApiError(403, "CSRF validation failed");
  }

  next();
}

export function requireAuth(request: AuthenticatedRequest, _response: Response, next: NextFunction) {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  next();
}

export function requireRole(roles: Role[]) {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!roles.includes(request.user.role)) {
      throw new ApiError(403, "Insufficient permission");
    }

    next();
  };
}