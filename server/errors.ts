import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { MulterError } from "multer";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: "Validation failed",
      details: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }))
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("Database connection failed:", error.errorCode ?? "unavailable");
    response.status(503).json({ error: "Database unavailable" });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const messages: Record<string, [number, string]> = {
      P2002: [409, "A record with that unique value already exists"],
      P2003: [409, "This record references or is referenced by another record"],
      P2025: [404, "Record or related record not found"]
    };
    const mapped = messages[error.code];
    if (mapped) {
      response.status(mapped[0]).json({ error: mapped[1] });
      return;
    }
  }

  if (error instanceof MulterError) {
    response.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ error: error.message });
    return;
  }

  if (error?.type === "entity.parse.failed" || error?.type === "entity.too.large") {
    response.status(error.type === "entity.too.large" ? 413 : 400)
      .json({ error: error.type === "entity.too.large" ? "Request body too large" : "Invalid JSON body" });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Unexpected server error" });
};
