import { publishedIndustriesQuery } from "../lib/publicIndustries";
import { publishedProjectsQuery } from "../lib/publicProjects";
import { publishedSportsQuery } from "../lib/publicSports";
import { publishedProductsQuery, publicProduct } from "../lib/publicProducts";
import { Router } from "express";
import { prisma } from "../db";
import { leadCreateSchema } from "../../shared/validation";

export const publicRouter = Router();

publicRouter.get("/health", (_request, response) => {
  response.json({ ok: true, service: "arena-grid-infra-api" });
});

publicRouter.get("/ready", async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`;
  response.json({ ok: true, database: "connected" });
});

publicRouter.get("/industries", async (_request, response) => {
  const items = await prisma.industry.findMany(publishedIndustriesQuery);
  response.setHeader("Cache-Control", "no-store");
  response.json({ items });
});

publicRouter.get("/projects", async (_request, response) => {
  const items = await prisma.project.findMany(publishedProjectsQuery);
  response.setHeader("Cache-Control", "no-store");
  response.json({ items });
});

publicRouter.get("/sports", async (_request, response) => {
  const items = await prisma.sport.findMany(publishedSportsQuery);
  response.setHeader("Cache-Control", "no-store");
  response.json({ items });
});

publicRouter.get("/products", async (_request, response) => {
  const rows = await prisma.product.findMany(publishedProductsQuery);
  response.setHeader("Cache-Control", "no-store");
  response.json({ items: rows.map(publicProduct) });
});

publicRouter.get("/catalog", async (_request, response) => {
  const [products, sports, services, projects] = await Promise.all([
    prisma.product.findMany(publishedProductsQuery),
    prisma.sport.findMany(publishedSportsQuery),
    prisma.service.findMany({ where: { status: "PUBLISHED" } }),
    prisma.project.findMany(publishedProjectsQuery)
  ]);

  response.setHeader("Cache-Control", "no-store");
  response.json({ products: products.map(publicProduct), sports, services, projects });
});

publicRouter.post("/leads", async (request, response) => {
  const data = leadCreateSchema.parse(request.body);

  const lead = await prisma.lead.create({
    data: {
      type: data.type,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      designation: data.designation,
      mobile: data.mobile,
      whatsapp: data.whatsapp,
      email: data.email,
      city: data.city,
      state: data.state,
      country: data.country,
      message: data.message,
      interestJson: data.interest ? JSON.stringify(data.interest) : undefined,
      projectJson: data.project ? JSON.stringify(data.project) : undefined,
      attributionJson: data.attribution ? JSON.stringify(data.attribution) : undefined
    }
  });

  response.status(201).json({ id: lead.id, status: lead.status });
});
