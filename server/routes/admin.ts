import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { prisma } from "../db";
import { mountResourceRouters } from "../resources";
import { usersRouter } from "./users";
import { mediaRouter } from "./media";

export const adminRouter = Router();

// Every route below this line requires a valid session.
adminRouter.use(requireAuth);

adminRouter.get(
  "/dashboard",
  requireRole(["SUPER_ADMIN", "SALES_MANAGER", "CONTENT_MANAGER", "SEO_MANAGER", "PROJECT_MANAGER"]),
  async (_request, response) => {
    const [leadCount, productCount, projectCount, newLeadCount, mediaCount] = await Promise.all([
      prisma.lead.count(),
      prisma.product.count(),
      prisma.project.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.mediaAsset.count()
    ]);

    response.json({ leadCount, productCount, projectCount, newLeadCount, mediaCount });
  }
);

adminRouter.use("/users", usersRouter);
adminRouter.use("/media", mediaRouter);
mountResourceRouters(adminRouter);