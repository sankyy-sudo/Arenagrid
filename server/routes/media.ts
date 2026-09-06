import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import { Router } from "express";
import multer from "multer";
import { requireRole, type AuthenticatedRequest } from "../middleware/auth";
import { prisma } from "../db";
import { env } from "../config";
import { ApiError } from "../errors";
import { logActivity } from "../lib/audit";
import { mediaUpdateSchema } from "../../shared/validation";

export const mediaRouter = Router();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf"
]);

const READ_ROLES = [
  "SUPER_ADMIN",
  "SEO_MANAGER",
  "CONTENT_MANAGER",
  "SALES_MANAGER",
  "SALES_USER",
  "PROJECT_MANAGER",
  "EDITOR"
] as const;
const WRITE_ROLES = ["SUPER_ADMIN", "CONTENT_MANAGER", "EDITOR", "PROJECT_MANAGER"] as const;
const DELETE_ROLES = ["SUPER_ADMIN", "CONTENT_MANAGER"] as const;

const storage = multer.diskStorage({
  destination: async (_request, _file, callback) => {
    await fs.mkdir(env.MEDIA_STORAGE_PATH, { recursive: true });
    callback(null, env.MEDIA_STORAGE_PATH);
  },
  filename: (_request, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: env.MEDIA_MAX_FILE_MB * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
      return;
    }
    callback(null, true);
  }
});

mediaRouter.get("/", requireRole([...READ_ROLES]), async (_request, response) => {
  const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  response.json({ items });
});

mediaRouter.post(
  "/",
  requireRole([...WRITE_ROLES]),
  upload.single("file"),
  async (request: AuthenticatedRequest, response) => {
    if (!request.file) throw new ApiError(400, "No file uploaded");

    const title = typeof request.body.title === "string" && request.body.title.trim() ? request.body.title.trim() : request.file.originalname;

    const asset = await prisma.mediaAsset.create({
      data: {
        title,
        altText: typeof request.body.altText === "string" ? request.body.altText : undefined,
        category: typeof request.body.category === "string" ? request.body.category : undefined,
        url: `/uploads/${request.file.filename}`,
        mimeType: request.file.mimetype,
        sizeBytes: request.file.size
      }
    });

    await logActivity(request, "media", asset.id, "CREATE", undefined, asset);
    response.status(201).json({ item: asset });
  }
);

mediaRouter.put("/:id", requireRole([...WRITE_ROLES]), async (request: AuthenticatedRequest, response) => {
  const id = String(request.params.id);
  const before = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!before) throw new ApiError(404, "Media asset not found");

  const data = mediaUpdateSchema.parse(request.body);
  const asset = await prisma.mediaAsset.update({ where: { id }, data });

  await logActivity(request, "media", asset.id, "UPDATE", before, asset);
  response.json({ item: asset });
});

mediaRouter.delete("/:id", requireRole([...DELETE_ROLES]), async (request: AuthenticatedRequest, response) => {
  const id = String(request.params.id);
  const before = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!before) throw new ApiError(404, "Media asset not found");

  await prisma.mediaAsset.delete({ where: { id } });

  const filePath = path.join(env.MEDIA_STORAGE_PATH, path.basename(before.url));
  await fs.rm(filePath, { force: true });

  await logActivity(request, "media", id, "DELETE", before, undefined);
  response.status(204).send();
});