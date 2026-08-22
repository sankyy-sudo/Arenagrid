import { PrismaClient, PublishStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@arenagridinfra.local" },
    update: {},
    create: {
      name: "Arena Grid Admin",
      email: "admin@arenagridinfra.local",
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  const category = await prisma.productCategory.upsert({
    where: { slug: "sports-surfaces" },
    update: {},
    create: {
      name: "Sports Surfaces",
      slug: "sports-surfaces",
      description: "Premium surfaces for multi-sport infrastructure projects.",
      status: PublishStatus.PUBLISHED
    }
  });

  await prisma.product.upsert({
    where: { slug: "synthetic-football-turf" },
    update: {},
    create: {
      name: "Synthetic Football Turf",
      slug: "synthetic-football-turf",
      sku: "AGI-TURF-FOOTBALL",
      shortDescription: "Durable turf systems for professional and institutional football facilities.",
      categoryId: category.id,
      status: PublishStatus.PUBLISHED,
      specifications: {
        create: [
          { name: "Application", value: "Football and futsal" },
          { name: "Warranty", value: "Project-specific" }
        ]
      }
    }
  });

  await prisma.sport.upsert({
    where: { slug: "football-futsal" },
    update: {},
    create: {
      name: "Football & Futsal",
      slug: "football-futsal",
      shortDescription: "End-to-end football and futsal facility planning, surface installation and maintenance.",
      status: PublishStatus.PUBLISHED
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
