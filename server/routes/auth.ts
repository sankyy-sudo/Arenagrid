import { randomBytes } from "node:crypto";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../db";
import { ApiError } from "../errors";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";
import { logActivity } from "../lib/audit";
import { CSRF_COOKIE, SESSION_COOKIE, csrfCookieOptions, sessionCookieOptions, signSession } from "../lib/tokens";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// 10 attempts per 15 minutes per IP - slows down credential stuffing / brute force.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." }
});

authRouter.post("/login", loginLimiter, async (request: AuthenticatedRequest, response) => {
  const { email, password } = loginSchema.parse(request.body);

  const user = await prisma.user.findUnique({ where: { email } });
  const genericError = () => new ApiError(401, "Invalid email or password");

  if (!user || !user.isActive) {
    await logActivity(request, "auth", null, "LOGIN_FAILED", undefined, { email });
    throw genericError();
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    await logActivity(request, "auth", user.id, "LOGIN_FAILED");
    throw genericError();
  }

  const token = signSession({ sub: user.id, role: user.role });
  const csrfToken = randomBytes(24).toString("hex");

  response.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  response.cookie(CSRF_COOKIE, csrfToken, csrfCookieOptions());

  request.user = { id: user.id, role: user.role };
  await logActivity(request, "auth", user.id, "LOGIN");

  response.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

authRouter.post("/logout", requireAuth, async (request: AuthenticatedRequest, response) => {
  await logActivity(request, "auth", request.user!.id, "LOGOUT");
  response.clearCookie(SESSION_COOKIE, { path: "/" });
  response.clearCookie(CSRF_COOKIE, { path: "/" });
  response.status(204).send();
});

authRouter.get("/me", requireAuth, async (request: AuthenticatedRequest, response) => {
  const user = await prisma.user.findUnique({ where: { id: request.user!.id } });
  if (!user) throw new ApiError(401, "Authentication required");

  response.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});