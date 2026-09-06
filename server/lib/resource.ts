import { Router } from "express";
import type { ZodTypeAny } from "zod";
import type { Role } from "@prisma/client";
import { prisma } from "../db";
import { requireRole } from "../middleware/auth";
import type { AuthenticatedRequest } from "../middleware/auth";
import { ApiError } from "../errors";
import { logActivity } from "../lib/audit";

export interface ResourceConfig {
  /** URL segment, e.g. "products" -> mounted at /api/admin/products */
  name: string;
  /** Audit log module label */
  module: string;
  /**
   * Prisma client delegate key, e.g. "product" (must match the camelCase
   * model name Prisma generates). Kept as `string` rather than a mapped
   * `keyof typeof prisma` type - the delegate is already accessed
   * dynamically below, and a mapped type here is brittle across
   * environments where the client hasn't been generated yet.
   */
  model: string;
  createSchema: ZodTypeAny;
  updateSchema: ZodTypeAny;
  include?: Record<string, unknown>;
  orderBy?: Record<string, "asc" | "desc">;
  roles: {
    read: Role[];
    write: Role[];
    delete: Role[];
  };
  /** Fields to match against ?q= with a case-insensitive "contains" filter */
  searchFields?: string[];
  /** Transform validated input (e.g. turn relation id arrays into connect/set) before write */
  beforeCreate?: (data: Record<string, unknown>) => Record<string, unknown>;
  beforeUpdate?: (data: Record<string, unknown>) => Record<string, unknown>;
}

export function createResourceRouter(config: ResourceConfig) {
  const router = Router();
  // Prisma's delegate typings don't unify cleanly across 16 different models here,
  // so the delegate is accessed dynamically and cast at the call sites below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = () => (prisma as unknown as Record<string, any>)[config.model];

  router.get("/", requireRole(config.roles.read), async (request, response) => {
    const q = typeof request.query.q === "string" ? request.query.q.trim() : "";
    const where =
      q && config.searchFields?.length
        ? { OR: config.searchFields.map((field) => ({ [field]: { contains: q } })) }
        : undefined;

    const items = await delegate().findMany({
      where,
      include: config.include,
      orderBy: config.orderBy ?? { updatedAt: "desc" }
    });

    response.json({ items });
  });

  router.get("/:id", requireRole(config.roles.read), async (request, response) => {
    const id = String(request.params.id);
    const item = await delegate().findUnique({ where: { id }, include: config.include });
    if (!item) throw new ApiError(404, `${config.name.slice(0, -1)} not found`);
    response.json({ item });
  });

  router.post("/", requireRole(config.roles.write), async (request: AuthenticatedRequest, response) => {
    const parsed = config.createSchema.parse(request.body) as Record<string, unknown>;
    const data = config.beforeCreate ? config.beforeCreate(parsed) : parsed;

    const item = await delegate().create({ data, include: config.include });
    await logActivity(request, config.module, item.id, "CREATE", undefined, item);

    response.status(201).json({ item });
  });

  router.put("/:id", requireRole(config.roles.write), async (request: AuthenticatedRequest, response) => {
    const id = String(request.params.id);
    const before = await delegate().findUnique({ where: { id } });
    if (!before) throw new ApiError(404, `${config.name.slice(0, -1)} not found`);

    const parsed = config.updateSchema.parse(request.body) as Record<string, unknown>;
    const data = config.beforeUpdate ? config.beforeUpdate(parsed) : parsed;

    const item = await delegate().update({ where: { id }, data, include: config.include });
    await logActivity(request, config.module, item.id, "UPDATE", before, item);

    response.json({ item });
  });

  router.delete("/:id", requireRole(config.roles.delete), async (request: AuthenticatedRequest, response) => {
    const id = String(request.params.id);
    const before = await delegate().findUnique({ where: { id } });
    if (!before) throw new ApiError(404, `${config.name.slice(0, -1)} not found`);

    await delegate().delete({ where: { id } });
    await logActivity(request, config.module, id, "DELETE", before, undefined);

    response.status(204).send();
  });

  return router;
}

/** Turns an optional array of related ids into a Prisma relation write. */
export function toManyRelation(ids: unknown, mode: "connect" | "set") {
  if (ids === undefined) return undefined;
  const list = Array.isArray(ids) ? (ids as string[]) : [];
  return { [mode]: list.map((id) => ({ id })) };
}

/** Turns an optional single related id (or null to clear it) into a Prisma relation write. */
export function toOneRelation(id: unknown, mode: "connect" | "set") {
  if (id === undefined) return undefined;
  if (id === null) {
    return mode === "connect" ? undefined : { disconnect: true };
  }
  return { [mode === "connect" ? "connect" : "connect"]: { id: id as string } };
}