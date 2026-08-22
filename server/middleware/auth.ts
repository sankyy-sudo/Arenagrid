import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { ApiError } from "../errors";

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: Role;
  };
};

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
