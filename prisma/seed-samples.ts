import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { access, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import samples from "./sample-content.json";
import { productCreateSchema, sportCreateSchema, projectCreateSchema } from "../shared/validation";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");
const fixtures = samples.map(row => ({ ...row,
  sport: sportCreateSchema.parse(row.sport), product: productCreateSchema.parse(row.product), project: projectCreateSchema.parse(row.project)
}));
const imagePaths = [...new Set(samples.flatMap(row => [row.sport.heroImageUrl, row.product.mainImageUrl, row.project.beforeImageUrl, row.project.afterImageUrl]))];

async function main() {
  for (const path of imagePaths) await access(fileURLToPath(new URL(`../public${path}`, import.meta.url)));
  console.log(`Validated ${fixtures.length} sports, ${fixtures.length} products, ${fixtures.length} projects and ${imagePaths.length} local images.`);
  if (!apply) { console.log("Preview only. Use --apply to publish these clearly labelled samples. Existing records are never updated."); return; }
  const before = { sports: await prisma.sport.findMany(), products: await prisma.product.findMany(), projects: await prisma.project.findMany() };
  const created = { sports: 0, products: 0, projects: 0, categories: 0, images: 0 };
  await prisma.$transaction(async tx => {
    for (const path of imagePaths) {
      if (await tx.mediaAsset.findFirst({ where: { url: path } })) continue;
      const file = fileURLToPath(new URL(`../public${path}`, import.meta.url));
      await tx.mediaAsset.create({ data: { title: `Sample reference: ${path.split("/").pop()}`, altText: path.endsWith(".svg") ? "Demo site planning illustration, not a real client site" : "Illustrative sports facility reference, not an Arena Grid project", url: path, mimeType: path.endsWith(".svg") ? "image/svg+xml" : path.endsWith(".webp") ? "image/webp" : "image/jpeg", sizeBytes: (await stat(file)).size, category: "Sample content" } });
      created.images++;
    }
    for (const row of fixtures) {
      const categorySlug = `sample-${row.category.toLowerCase().replaceAll(" ", "-")}`;
      let category = await tx.productCategory.findUnique({ where: { slug: categorySlug } });
      if (!category) { category = await tx.productCategory.create({ data: { name: row.category, slug: categorySlug, description: "Sample product category for website review.", status: "PUBLISHED" } }); created.categories++; }
      let sport = await tx.sport.findUnique({ where: { slug: row.sport.slug } });
      if (!sport) { sport = await tx.sport.create({ data: { name: row.sport.name, slug: row.sport.slug, shortDescription: row.sport.shortDescription, longDescription: row.sport.longDescription, heroImageUrl: row.sport.heroImageUrl, status: "PUBLISHED" } }); created.sports++; }
      let product = await tx.product.findUnique({ where: { slug: row.product.slug } });
      if (!product) { product = await tx.product.create({ data: { name: row.product.name, slug: row.product.slug, shortDescription: row.product.shortDescription, fullDescription: row.product.fullDescription, mainImageUrl: row.product.mainImageUrl, features: row.product.features, bestFor: row.product.bestFor, category: { connect: { id: category.id } }, sports: { connect: { id: sport.id } }, status: "PUBLISHED" } }); created.products++; }
      if (!await tx.project.findUnique({ where: { slug: row.project.slug } })) {
        await tx.project.create({ data: { name: row.project.name, slug: row.project.slug, location: row.project.location, description: row.project.description, beforeImageUrl: row.project.beforeImageUrl, afterImageUrl: row.project.afterImageUrl, progress: row.project.progress, status: "PUBLISHED", products: { connect: { id: product.id } }, sports: { connect: { id: sport.id } } } }); created.projects++;
      }
    }
    // Abort the whole insertion if any pre-existing scalar record changed.
    const after = { sports: await tx.sport.findMany(), products: await tx.product.findMany(), projects: await tx.project.findMany() };
    for (const key of ["sports", "products", "projects"] as const) {
      for (const previous of before[key]) {
        const current = after[key].find(row => row.id === previous.id);
        if (JSON.stringify(previous) !== JSON.stringify(current)) throw new Error(`Existing ${key} record changed; sample transaction rolled back.`);
      }
    }
  }, { timeout: 120000, maxWait: 15000 });
  console.log(JSON.stringify({ created, existingRecordsPreserved: true }, null, 2));
}

main().catch(error => { console.error(error instanceof Error ? error.message : "Sample import failed"); process.exitCode = 1; }).finally(() => prisma.$disconnect());
