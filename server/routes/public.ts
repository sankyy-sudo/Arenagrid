import { Router } from "express";
import { prisma } from "../db";
import { leadCreateSchema } from "../../shared/validation";

export const publicRouter = Router();

publicRouter.get("/health", (_request, response) => {
  response.json({ ok: true, service: "arena-grid-infra-api" });
});

publicRouter.get("/catalog", async (_request, response) => {
  const [products, sports, services, projects] = await Promise.all([
    prisma.product.findMany({ where: { status: "PUBLISHED" }, include: { category: true, specifications: true } }),
    prisma.sport.findMany({ where: { status: "PUBLISHED" } }),
    prisma.service.findMany({ where: { status: "PUBLISHED" } }),
    prisma.project.findMany({ where: { status: "PUBLISHED" } })
  ]);

  response.json({ products, sports, services, projects });
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
