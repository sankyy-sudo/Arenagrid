import { PrismaClient, PublishStatus, type Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "ChangeMe123!";

async function seedUser(name: string, email: string, role: Role) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash, role }
  });
}

async function main() {
  // One demo login per role so RBAC can be exercised end to end.
  // All demo accounts share the password above - rotate before any shared/staging use.
  const admin = await seedUser("Arena Grid Admin", "admin@arenagridinfra.local", "SUPER_ADMIN");
  await seedUser("Priya SEO", "seo@arenagridinfra.local", "SEO_MANAGER");
  const contentManager = await seedUser("Rahul Content", "content@arenagridinfra.local", "CONTENT_MANAGER");
  await seedUser("Sales Manager", "sales-mgr@arenagridinfra.local", "SALES_MANAGER");
  await seedUser("Sales Rep", "sales@arenagridinfra.local", "SALES_USER");
  await seedUser("Project Lead", "projects@arenagridinfra.local", "PROJECT_MANAGER");
  await seedUser("Content Editor", "editor@arenagridinfra.local", "EDITOR");

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

  const trackCategory = await prisma.productCategory.upsert({
    where: { slug: "athletic-tracks" },
    update: {},
    create: {
      name: "Athletic Tracks",
      slug: "athletic-tracks",
      description: "IAAF-grade synthetic running track systems.",
      status: PublishStatus.PUBLISHED
    }
  });

  const footballTurf = await prisma.product.upsert({
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

  const runningTrack = await prisma.product.upsert({
    where: { slug: "iaaf-running-track" },
    update: {},
    create: {
      name: "IAAF Certified Running Track",
      slug: "iaaf-running-track",
      sku: "AGI-TRACK-IAAF",
      shortDescription: "Full-depth polyurethane track systems built to IAAF Class 1 spec.",
      categoryId: trackCategory.id,
      status: PublishStatus.PUBLISHED,
      specifications: {
        create: [
          { name: "Lanes", value: "8" },
          { name: "Certification", value: "IAAF Class 1" }
        ]
      }
    }
  });

  const football = await prisma.sport.upsert({
    where: { slug: "football-futsal" },
    update: {},
    create: {
      name: "Football & Futsal",
      slug: "football-futsal",
      shortDescription: "End-to-end football and futsal facility planning, surface installation and maintenance.",
      status: PublishStatus.PUBLISHED,
      products: { connect: [{ id: footballTurf.id }] }
    }
  });

  const athletics = await prisma.sport.upsert({
    where: { slug: "athletics" },
    update: {},
    create: {
      name: "Athletics",
      slug: "athletics",
      shortDescription: "Track and field facility design, construction and certification support.",
      status: PublishStatus.PUBLISHED,
      products: { connect: [{ id: runningTrack.id }] }
    }
  });

  const designBuild = await prisma.service.upsert({
    where: { slug: "design-build" },
    update: {},
    create: {
      name: "Design & Build",
      slug: "design-build",
      category: "Delivery",
      shortDescription: "Turnkey design and construction for sports infrastructure.",
      status: PublishStatus.PUBLISHED,
      sports: { connect: [{ id: football.id }, { id: athletics.id }] }
    }
  });

  const maintenance = await prisma.service.upsert({
    where: { slug: "maintenance-amc" },
    update: {},
    create: {
      name: "Maintenance & AMC",
      slug: "maintenance-amc",
      category: "Aftercare",
      shortDescription: "Annual maintenance contracts to protect surface performance and warranty.",
      status: PublishStatus.PUBLISHED
    }
  });

  const education = await prisma.industry.upsert({
    where: { slug: "education" },
    update: {},
    create: {
      name: "Education",
      slug: "education",
      description: "Schools, colleges and universities building or upgrading sports infrastructure.",
      status: PublishStatus.PUBLISHED,
      services: { connect: [{ id: designBuild.id }] }
    }
  });

  await prisma.industry.upsert({
    where: { slug: "government-public" },
    update: {},
    create: {
      name: "Government & Public Sector",
      slug: "government-public",
      description: "State sports authorities and municipal infrastructure programs.",
      status: PublishStatus.PUBLISHED,
      services: { connect: [{ id: designBuild.id }, { id: maintenance.id }] }
    }
  });

  const project = await prisma.project.upsert({
    where: { slug: "greenview-university-stadium" },
    update: {},
    create: {
      name: "Greenview University Stadium",
      slug: "greenview-university-stadium",
      client: "Greenview University",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      projectType: "Multi-sport stadium",
      description: "A multi-sport stadium combining an IAAF-certified track with a synthetic football pitch.",
      status: PublishStatus.PUBLISHED,
      sports: { connect: [{ id: football.id }, { id: athletics.id }] },
      products: { connect: [{ id: footballTurf.id }, { id: runningTrack.id }] },
      services: { connect: [{ id: designBuild.id }] },
      industries: { connect: [{ id: education.id }] }
    }
  });

  await prisma.caseStudy.upsert({
    where: { slug: "greenview-university-stadium-case-study" },
    update: {},
    create: {
      title: "Delivering a Certified Multi-Sport Stadium in 9 Months",
      slug: "greenview-university-stadium-case-study",
      client: "Greenview University",
      challenge:
        "The university needed an IAAF-certifiable track and a FIFA-quality pitch on a compressed academic-year timeline.",
      solution: "Parallel-tracked design and construction with a dedicated turf and track crew.",
      outcome: "Delivered on schedule with IAAF Class 1 certification on first inspection.",
      projectId: project.id,
      status: PublishStatus.PUBLISHED,
      products: { connect: [{ id: footballTurf.id }, { id: runningTrack.id }] },
      sports: { connect: [{ id: football.id }, { id: athletics.id }] }
    }
  });

  await prisma.blogPost.upsert({
    where: { slug: "choosing-the-right-turf-density" },
    update: {},
    create: {
      title: "Choosing the Right Turf Density for Multi-Sport Use",
      slug: "choosing-the-right-turf-density",
      excerpt: "Pile height and density trade-offs for facilities hosting more than one sport.",
      category: "Guides",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      sports: { connect: [{ id: football.id }] }
    }
  });

  await prisma.fAQ.upsert({
    where: { id: "seed-faq-warranty" },
    update: {},
    create: {
      id: "seed-faq-warranty",
      question: "What warranty comes with a synthetic turf installation?",
      answer:
        "Warranty terms are project-specific and are confirmed at the design stage based on usage load and product spec.",
      category: "Products",
      order: 1,
      status: PublishStatus.PUBLISHED,
      products: { connect: [{ id: footballTurf.id }] }
    }
  });

  await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      title: "About Arena Grid Infra",
      slug: "about",
      content: "Arena Grid Infra designs, builds and maintains sports infrastructure across India.",
      status: PublishStatus.PUBLISHED
    }
  });

  await prisma.menuItem.upsert({
    where: { id: "seed-menu-products" },
    update: {},
    create: { id: "seed-menu-products", label: "Products", url: "/products", order: 1 }
  });
  await prisma.menuItem.upsert({
    where: { id: "seed-menu-sports" },
    update: {},
    create: { id: "seed-menu-sports", label: "Sports", url: "/sports", order: 2 }
  });

  await prisma.lead.upsert({
    where: { id: "seed-lead-demo" },
    update: {},
    create: {
      id: "seed-lead-demo",
      type: "Enquiry",
      firstName: "Demo",
      lastName: "Lead",
      company: "Sample Sports Trust",
      email: "demo-lead@example.com",
      city: "Mumbai",
      message: "Interested in a football turf quotation for a school ground.",
      status: "NEW",
      assignedUserId: admin.id
    }
  });

  await prisma.websiteSetting.upsert({
    where: { key: "contact_email" },
    update: {},
    create: { key: "contact_email", value: "hello@arenagridinfra.com" }
  });

  await prisma.activityLog.create({
    data: {
      userId: contentManager.id,
      module: "seed",
      action: "SEED",
      newValue: "Initial demo dataset created"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });