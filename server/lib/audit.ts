import type { Request } from "express";
import { prisma } from "../db";
import type { AuthenticatedRequest } from "../middleware/auth";

function clientIp(request: Request): string | undefined {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]!.trim();
  }
  return request.socket.remoteAddress ?? undefined;
}

function safeJson(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
}

export async function logActivity(
  request: AuthenticatedRequest,
  module: string,
  recordId: string | null | undefined,
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "LOGIN_FAILED",
  previousValue?: unknown,
  newValue?: unknown
) {
  await prisma.activityLog.create({
    data: {
      userId: request.user?.id,
      module,
      recordId: recordId ?? undefined,
      action,
      previousValue: safeJson(previousValue),
      newValue: safeJson(newValue),
      ipAddress: clientIp(request)
    }
  });
}