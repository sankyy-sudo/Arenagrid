import { Router } from "express";
import bcrypt from "bcryptjs";
import { requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../db";
import { ApiError } from "../errors";
import { logActivity } from "../lib/audit";
import { userCreateSchema, userUpdateSchema } from "../../shared/validation";

export const usersRouter = Router();

const SUPER_ADMIN_ONLY = ["SUPER_ADMIN"] as const;

function toSafeUser(user: { id: string; name: string; email: string; role: string; isActive: boolean; createdAt: Date; updatedAt: Date }) {
  const { id, name, email, role, isActive, createdAt, updatedAt } = user;
  return { id, name, email, role, isActive, createdAt, updatedAt };
}

usersRouter.get("/", requireRole([...SUPER_ADMIN_ONLY]), async (_request, response) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  response.json({ items: users.map(toSafeUser) });
});

usersRouter.post("/", requireRole([...SUPER_ADMIN_ONLY]), async (request: AuthenticatedRequest, response) => {
  const data = userCreateSchema.parse(request.body);
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash, role: data.role, isActive: data.isActive }
  });

  await logActivity(request, "users", user.id, "CREATE", undefined, toSafeUser(user));
  response.status(201).json({ item: toSafeUser(user) });
});

usersRouter.put("/:id", requireRole([...SUPER_ADMIN_ONLY]), async (request: AuthenticatedRequest, response) => {
  const id = String(request.params.id);
  const before = await prisma.user.findUnique({ where: { id } });
  if (!before) throw new ApiError(404, "User not found");

  const data = userUpdateSchema.parse(request.body);

  if (data.isActive === false && id === request.user?.id) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      isActive: data.isActive,
      passwordHash: data.password ? await bcrypt.hash(data.password, 12) : undefined
    }
  });

  await logActivity(request, "users", user.id, "UPDATE", toSafeUser(before), toSafeUser(user));
  response.json({ item: toSafeUser(user) });
});

usersRouter.delete("/:id", requireRole([...SUPER_ADMIN_ONLY]), async (request: AuthenticatedRequest, response) => {
  const id = String(request.params.id);
  if (id === request.user?.id) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const before = await prisma.user.findUnique({ where: { id } });
  if (!before) throw new ApiError(404, "User not found");

  await prisma.user.delete({ where: { id } });
  await logActivity(request, "users", id, "DELETE", toSafeUser(before), undefined);

  response.status(204).send();
});