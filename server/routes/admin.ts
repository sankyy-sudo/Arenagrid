import { Router } from "express";
import { requireRole } from "../middleware/auth";
import { prisma } from "../db";
import { productCreateSchema } from "../../shared/validation";

export const adminRouter = Router();

adminRouter.get(
  "/dashboard",
  requireRole(["SUPER_ADMIN", "SALES_MANAGER", "CONTENT_MANAGER", "SEO_MANAGER"]),
  async (_request, response) => {
    const [leadCount, productCount, projectCount] = await Promise.all([
      prisma.lead.count(),
      prisma.product.count(),
      prisma.project.count()
    ]);

    response.json({ leadCount, productCount, projectCount });
  }
);

adminRouter.get("/products", requireRole(["SUPER_ADMIN", "CONTENT_MANAGER", "EDITOR"]), async (_request, response) => {
  const products = await prisma.product.findMany({
    include: { category: true, specifications: true },
    orderBy: { updatedAt: "desc" }
  });

  response.json({ products });
});

adminRouter.post("/products", requireRole(["SUPER_ADMIN", "CONTENT_MANAGER"]), async (request, response) => {
  const data = productCreateSchema.parse(request.body);
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      categoryId: data.categoryId,
      specifications: { create: data.specifications }
    },
    include: { specifications: true }
  });

  response.status(201).json({ product });
});
