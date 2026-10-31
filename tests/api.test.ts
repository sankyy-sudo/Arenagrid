import assert from "node:assert/strict";
import { once } from "node:events";
import { after, test } from "node:test";
import type { AddressInfo } from "node:net";
import { mkdtemp, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgresql://localhost/arenagrid_test";
process.env.JWT_SECRET = "test-only-secret-that-is-long-enough";
const mediaDirectory = await mkdtemp(join(tmpdir(), "arenagrid-api-test-"));
process.env.MEDIA_STORAGE_PATH = mediaDirectory;
await writeFile(join(mediaDirectory, "fixture.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
const { app } = await import("../server/app");
const { prisma } = await import("../server/db");
const { signSession } = await import("../server/lib/tokens");
const server = app.listen(0, "127.0.0.1");
await once(server, "listening");
const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

after(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await prisma.$disconnect();
  await unlink(join(mediaDirectory, "fixture.svg"));
  await rmdir(mediaDirectory);
});

test("live HTTP health and unknown API routes return JSON", async () => {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).ok, true);
  const missing = await fetch(`${base}/api/missing`);
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get("content-type")!, /application\/json/);
});

test("anonymous admin reads and CSRF-free mutations are rejected", async () => {
  assert.equal((await fetch(`${base}/api/admin/products`)).status, 401);
  assert.equal((await fetch(`${base}/api/admin/products`, { method: "POST" })).status, 403);
  assert.equal((await fetch(`${base}/api/admin/auth/logout`, { method: "POST" })).status, 401);
});

test("uploaded media is served with a sandbox policy and auth responses are not cached", async () => {
  const media = await fetch(`${base}/uploads/fixture.svg`);
  assert.equal(media.status, 200);
  assert.match(media.headers.get("content-security-policy")!, /sandbox/);
  assert.match(await media.text(), /<svg/);
  const session = await fetch(`${base}/api/admin/auth/me`);
  assert.equal(session.headers.get("cache-control"), "no-store");
});

test("removed Resources API returns 404 even for an authenticated administrator", async () => {
  const userLookup = prisma.user.findUnique;
  prisma.user.findUnique = (async () => ({
    id: "test-admin", role: "SUPER_ADMIN", isActive: true
  })) as unknown as typeof prisma.user.findUnique;
  const token = signSession({ sub: "test-admin", role: "SUPER_ADMIN" });
  const headers = { Cookie: `agi_session=${token}; agi_csrf=test-csrf`, "X-CSRF-Token": "test-csrf" };
  try {
    for (const [method, path] of [
      ["GET", "/api/admin/resources"], ["POST", "/api/admin/resources"],
      ["GET", "/api/admin/resources/removed-id"], ["PUT", "/api/admin/resources/removed-id"],
      ["DELETE", "/api/admin/resources/removed-id"]
    ]) {
      const response = await fetch(`${base}${path}`, { method, headers });
      assert.equal(response.status, 404, `${method} ${path}`);
      assert.equal((await response.json()).error, "API route not found");
    }
  } finally {
    prisma.user.findUnique = userLookup;
  }
});

test("bad JSON and invalid lead input return 400 without a database query", async () => {
  const invalidJson = await fetch(`${base}/api/leads`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{"
  });
  assert.equal(invalidJson.status, 400);
  assert.equal((await invalidJson.json()).error, "Invalid JSON body");
  const invalidLead = await fetch(`${base}/api/leads`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{}"
  });
  assert.equal(invalidLead.status, 400);
  assert.ok((await invalidLead.json()).details.length > 0);
});

test("product admin CRUD drives the published public list (database adapter mocked)", async (t) => {
  function stub(target: object, key: string, replacement: unknown) {
    const delegate = target as Record<string, unknown>;
    const original = delegate[key];
    delegate[key] = replacement;
    t.after(() => { delegate[key] = original; });
  }
  const rows = new Map<string, Record<string, unknown>>();
  let role = "SUPER_ADMIN";
  stub(prisma.user, "findUnique", async () => ({ id: "product-admin", role, isActive: true }));
  stub(prisma.activityLog, "create", async () => ({}));
  stub(prisma.product, "create", async ({ data }: { data: Record<string, unknown> }) => {
    const row = { features: [], bestFor: [], id: "created-product", shortDescription: null, fullDescription: null, mainImageUrl: null, category: null, sports: [], specifications: [], ...data };
    rows.set(row.id, row); return row;
  });
  stub(prisma.product, "findUnique", async ({ where }: { where: { id: string } }) => rows.get(where.id) ?? null);
  stub(prisma.product, "update", async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
    const row = { ...rows.get(where.id), ...data }; rows.set(where.id, row); return row;
  });
  stub(prisma.product, "delete", async ({ where }: { where: { id: string } }) => { const row = rows.get(where.id); rows.delete(where.id); return row; });
  stub(prisma.product, "findMany", async (query: { where: { status: string }; select: Record<string, unknown> }) => {
    assert.equal(query.where.status, "PUBLISHED");
    assert.equal(query.select.mainImageUrl, true);
    return [...rows.values()].filter(row => row.status === query.where.status).map(row => ({ ...row, specifications: [], category: { id: "draft-category", name: "Hidden", slug: "hidden", status: "DRAFT" }, sports: [] }));
  });
  const token = signSession({ sub: "product-admin", role: "SUPER_ADMIN" });
  const headers = { Cookie: `agi_session=${token}; agi_csrf=product-csrf`, "X-CSRF-Token": "product-csrf", "Content-Type": "application/json" };
  const save = (method: string, body: unknown, path = "/api/admin/products/created-product") => fetch(`${base}${path}`, { method, headers, body: JSON.stringify(body) });
  const list = async () => {
    const response = await fetch(`${base}/api/products`);
    assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store");
    return (await response.json()).items;
  };
  assert.equal((await save("POST", { name: "Draft turf", slug: "draft-turf", mainImageUrl: "/uploads/turf.webp" }, "/api/admin/products")).status, 201);
  assert.deepEqual(await list(), []);
  assert.equal((await save("PUT", { status: "PUBLISHED", shortDescription: "Published copy", features: ["UV resistant"], bestFor: ["School grounds"] })).status, 200);
  assert.equal((await save("PUT", { fullDescription: '<h2>Surface</h2><p onclick="bad()"><strong>Formatted</strong></p><script>bad()</script>' })).status, 200);
  assert.equal((await list())[0].fullDescription, '<h2>Surface</h2><p><strong>Formatted</strong></p>');
  const editedRecord = await fetch(`${base}/api/admin/products/created-product`, { headers });
  assert.equal((await editedRecord.json()).item.fullDescription, '<h2>Surface</h2><p><strong>Formatted</strong></p>');
  let visible = await list(); assert.equal(visible.length, 1); assert.equal(visible[0].category, null); assert.equal(visible[0].mainImageUrl, "/uploads/turf.webp");
  assert.deepEqual(visible[0].features, ["UV resistant"]); assert.deepEqual(visible[0].bestFor, ["School grounds"]);
  assert.equal((await save("PUT", { name: "Updated turf", mainImageUrl: null, features: [], bestFor: [] })).status, 200);
  visible = await list(); assert.deepEqual(visible[0].features, []); assert.deepEqual(visible[0].bestFor, []); assert.equal(visible[0].name, "Updated turf"); assert.equal(visible[0].mainImageUrl, null);
  assert.equal((await save("PUT", { status: "ARCHIVED" })).status, 200); assert.deepEqual(await list(), []);
  assert.equal((await save("PUT", { status: "PUBLISHED" })).status, 200);
  role = "SALES_USER";
  assert.equal((await save("PUT", { name: "Not allowed" })).status, 403);
  assert.equal((await fetch(`${base}/api/admin/products/created-product`, { method: "DELETE", headers })).status, 403);
  role = "SUPER_ADMIN";
  assert.equal((await fetch(`${base}/api/admin/products/created-product`, { method: "DELETE", headers })).status, 204);
  assert.deepEqual(await list(), []);
});


test("sport CRUD publishes edited content and respects permissions (database adapter mocked)", async (t) => {
  function stub(target: object, key: string, replacement: unknown) {
    const delegate = target as Record<string, unknown>; const original = delegate[key];
    delegate[key] = replacement; t.after(() => { delegate[key] = original; });
  }
  let role = "SUPER_ADMIN";
  let record: Record<string, unknown> | null = null;
  stub(prisma.user, "findUnique", async () => ({ id: "sport-admin", role, isActive: true }));
  stub(prisma.activityLog, "create", async () => ({}));
  stub(prisma.sport, "create", async ({ data }: { data: Record<string, unknown> }) => {
    record = { id: "sport-one", shortDescription: null, longDescription: null, heroImageUrl: null, ...data }; return record;
  });
  stub(prisma.sport, "findUnique", async () => record);
  stub(prisma.sport, "update", async ({ data }: { data: Record<string, unknown> }) => { record = { ...record, ...data }; return record; });
  stub(prisma.sport, "delete", async () => { const previous = record; record = null; return previous; });
  stub(prisma.sport, "findMany", async (query: { where: { status: string }; select: Record<string, unknown> }) => {
    assert.equal(query.where.status, "PUBLISHED"); assert.equal(query.select.heroImageUrl, true);
    return record?.status === "PUBLISHED" ? [record] : [];
  });
  const token = signSession({ sub: "sport-admin", role: "SUPER_ADMIN" });
  const headers = { Cookie: `agi_session=${token}; agi_csrf=sport-csrf`, "X-CSRF-Token": "sport-csrf", "Content-Type": "application/json" };
  const save = (method: string, data: unknown, path = "/api/admin/sports/sport-one") => fetch(`${base}${path}`, { method, headers, body: JSON.stringify(data) });
  const list = async () => { const response = await fetch(`${base}/api/sports`); assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store"); return (await response.json()).items; };
  assert.equal((await save("POST", { name: "Tennis", slug: "tennis", heroImageUrl: "/uploads/tennis.webp", longDescription: "Court installation" }, "/api/admin/sports")).status, 201);
  assert.deepEqual(await list(), []);
  assert.equal((await save("PUT", { status: "PUBLISHED" })).status, 200);
  let items = await list(); assert.equal(items[0].heroImageUrl, "/uploads/tennis.webp");
  assert.equal((await save("PUT", { name: "Updated tennis", longDescription: "Updated description", heroImageUrl: null })).status, 200);
  items = await list(); assert.equal(items[0].name, "Updated tennis"); assert.equal(items[0].longDescription, "Updated description"); assert.equal(items[0].heroImageUrl, null);
  assert.equal((await save("PUT", { status: "ARCHIVED" })).status, 200); assert.deepEqual(await list(), []);
  assert.equal((await save("PUT", { status: "PUBLISHED" })).status, 200);
  role = "SALES_USER"; assert.equal((await save("PUT", { name: "Denied" })).status, 403);
  assert.equal((await fetch(`${base}/api/admin/sports/sport-one`, { method: "DELETE", headers })).status, 403);
  role = "SUPER_ADMIN"; assert.equal((await fetch(`${base}/api/admin/sports/sport-one`, { method: "DELETE", headers })).status, 204);
  assert.deepEqual(await list(), []);
});

test("project CRUD publishes edited content and respects permissions (database adapter mocked)", async (t) => {
  function stub(target: object, key: string, replacement: unknown) {
    const delegate = target as Record<string, unknown>; const original = delegate[key];
    delegate[key] = replacement; t.after(() => { delegate[key] = original; });
  }
  let role = "SUPER_ADMIN";
  let record: Record<string, unknown> | null = null;
  stub(prisma.user, "findUnique", async () => ({ id: "project-admin", role, isActive: true }));
  stub(prisma.activityLog, "create", async () => ({}));
  stub(prisma.project, "create", async ({ data }: { data: Record<string, unknown> }) => {
    record = { id: "project-one", location: null, description: null, beforeImageUrl: null, afterImageUrl: null, progress: 0, ...data }; return record;
  });
  stub(prisma.project, "findUnique", async () => record);
  stub(prisma.project, "update", async ({ data }: { data: Record<string, unknown> }) => { record = { ...record, ...data }; return record; });
  stub(prisma.project, "delete", async () => { const previous = record; record = null; return previous; });
  stub(prisma.project, "findMany", async (query: { where: { status: string }; select: Record<string, unknown> }) => {
    assert.equal(query.where.status, "PUBLISHED"); assert.equal(query.select.beforeImageUrl, true);
    return record?.status === "PUBLISHED" ? [record] : [];
  });
  const token = signSession({ sub: "project-admin", role: "SUPER_ADMIN" });
  const headers = { Cookie: `agi_session=${token}; agi_csrf=project-csrf`, "X-CSRF-Token": "project-csrf", "Content-Type": "application/json" };
  const save = (method: string, data: unknown, path = "/api/admin/projects/project-one") => fetch(`${base}${path}`, { method, headers, body: JSON.stringify(data) });
  const list = async () => { const response = await fetch(`${base}/api/projects`); assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store"); return (await response.json()).items; };
  assert.equal((await save("POST", { name: "Court project", slug: "court-project", beforeImageUrl: "/uploads/court-project.webp", description: "Court installation", location: "Delhi", afterImageUrl: "/uploads/after.webp", progress: 0 }, "/api/admin/projects")).status, 201);
  assert.deepEqual(await list(), []);
  assert.equal((await save("PUT", { status: "PUBLISHED" })).status, 200);
  let items = await list(); assert.equal(items[0].progress, 0); assert.equal(items[0].location, "Delhi"); assert.equal(items[0].afterImageUrl, "/uploads/after.webp"); assert.equal(items[0].beforeImageUrl, "/uploads/court-project.webp");
  assert.equal((await save("PUT", { name: "Updated court-project", description: "Updated description", beforeImageUrl: null, afterImageUrl: null, progress: 100 })).status, 200);
  items = await list(); assert.equal(items[0].progress, 100); assert.equal(items[0].afterImageUrl, null); assert.equal(items[0].name, "Updated court-project"); assert.equal(items[0].description, "Updated description"); assert.equal(items[0].beforeImageUrl, null);
  assert.equal((await save("PUT", { status: "ARCHIVED" })).status, 200); assert.deepEqual(await list(), []);
  assert.equal((await save("PUT", { status: "PUBLISHED" })).status, 200);
  role = "SALES_USER"; assert.equal((await save("PUT", { name: "Denied" })).status, 403);
  assert.equal((await fetch(`${base}/api/admin/projects/project-one`, { method: "DELETE", headers })).status, 403);
  role = "SUPER_ADMIN"; assert.equal((await fetch(`${base}/api/admin/projects/project-one`, { method: "DELETE", headers })).status, 204);
  assert.deepEqual(await list(), []);
});

test("industry CRUD publishes edited content and respects permissions (database adapter mocked)", async (t) => {
  function stub(target: object, key: string, replacement: unknown) {
    const delegate = target as Record<string, unknown>; const original = delegate[key];
    delegate[key] = replacement; t.after(() => { delegate[key] = original; });
  }
  let role = "SUPER_ADMIN";
  let record: Record<string, unknown> | null = null;
  stub(prisma.user, "findUnique", async () => ({ id: "industry-admin", role, isActive: true }));
  stub(prisma.activityLog, "create", async () => ({}));
  stub(prisma.industry, "create", async ({ data }: { data: Record<string, unknown> }) => {
    record = { id: "industry-one", solution: null, description: null, imageUrl: null, ...data }; return record;
  });
  stub(prisma.industry, "findUnique", async () => record);
  stub(prisma.industry, "update", async ({ data }: { data: Record<string, unknown> }) => { record = { ...record, ...data }; return record; });
  stub(prisma.industry, "delete", async () => { const previous = record; record = null; return previous; });
  stub(prisma.industry, "findMany", async (query: { where: { status: string }; select: Record<string, unknown> }) => {
    assert.equal(query.where.status, "PUBLISHED"); assert.equal(query.select.imageUrl, true);
    return record?.status === "PUBLISHED" ? [record] : [];
  });
  const token = signSession({ sub: "industry-admin", role: "SUPER_ADMIN" });
  const headers = { Cookie: `agi_session=${token}; agi_csrf=industry-csrf`, "X-CSRF-Token": "industry-csrf", "Content-Type": "application/json" };
  const save = (method: string, data: unknown, path = "/api/admin/industries/industry-one") => fetch(`${base}${path}`, { method, headers, body: JSON.stringify(data) });
  const list = async () => { const response = await fetch(`${base}/api/industries`); assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store"); return (await response.json()).items; };
  assert.equal((await save("POST", { name: "Schools", slug: "schools", imageUrl: "/uploads/schools.webp", description: "School facility requirements", solution: "Multi-sport courts and training spaces" }, "/api/admin/industries")).status, 201);
  assert.deepEqual(await list(), []);
  assert.equal((await save("PUT", { status: "PUBLISHED" })).status, 200);
  let items = await list(); assert.equal(items[0].solution, "Multi-sport courts and training spaces"); assert.equal(items[0].imageUrl, "/uploads/schools.webp");
  assert.equal((await save("PUT", { name: "Updated schools", description: "Updated description", imageUrl: null, solution: "Updated solution" })).status, 200);
  items = await list(); assert.equal(items[0].solution, "Updated solution"); assert.equal(items[0].name, "Updated schools"); assert.equal(items[0].description, "Updated description"); assert.equal(items[0].imageUrl, null);
  assert.equal((await save("PUT", { solution: null })).status, 200); assert.equal((await list())[0].solution, null);
  assert.equal((await save("PUT", { status: "ARCHIVED" })).status, 200); assert.deepEqual(await list(), []);
  assert.equal((await save("PUT", { status: "PUBLISHED" })).status, 200);
  role = "SALES_USER"; assert.equal((await save("PUT", { name: "Denied" })).status, 403);
  assert.equal((await fetch(`${base}/api/admin/industries/industry-one`, { method: "DELETE", headers })).status, 403);
  role = "SUPER_ADMIN"; assert.equal((await fetch(`${base}/api/admin/industries/industry-one`, { method: "DELETE", headers })).status, 204);
  assert.deepEqual(await list(), []);
});


test("contact submission appears in authorized admin leads with all form details (database adapter mocked)", async (t) => {
  function stub(target: object, key: string, replacement: unknown) {
    const delegate = target as Record<string, unknown>; const previous = delegate[key];
    delegate[key] = replacement; t.after(() => { delegate[key] = previous; });
  }
  let stored: Record<string, unknown> | undefined;
  let role = "SUPER_ADMIN";
  stub(prisma.lead, "create", async ({ data }: { data: Record<string, unknown> }) => {
    stored = { ...data, id: "contact-lead", status: "NEW", createdAt: new Date().toISOString() }; return stored;
  });
  stub(prisma.lead, "findMany", async (query: { orderBy: unknown }) => {
    assert.deepEqual(query.orderBy, { createdAt: "desc" }); return stored ? [stored] : [];
  });
  stub(prisma.user, "findUnique", async () => ({ id: "leads-admin", role, isActive: true }));
  const submission = { type: "Contact Us", firstName: "Test Visitor", email: "visitor@example.com", mobile: "9000000000", city: "Delhi", message: "Please discuss a tennis court", attribution: { landingPage: "/contact" } };
  const response = await fetch(`${base}/api/leads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submission) });
  assert.equal(response.status, 201); assert.deepEqual(await response.json(), { id: "contact-lead", status: "NEW" });
  const token = signSession({ sub: "leads-admin", role: "SUPER_ADMIN" });
  const headers = { Cookie: `agi_session=${token}` };
  const listing = await fetch(`${base}/api/admin/leads`, { headers }); assert.equal(listing.status, 200);
  const { items } = await listing.json(); assert.equal(items.length, 1);
  for (const field of ["firstName", "email", "mobile", "city", "message", "type"] as const) assert.equal(items[0][field], submission[field]);
  assert.equal(items[0].status, "NEW"); assert.equal(JSON.parse(items[0].attributionJson).landingPage, "/contact");
  role = "EDITOR"; assert.equal((await fetch(`${base}/api/admin/leads`, { headers })).status, 403);
  assert.equal((await fetch(`${base}/api/admin/leads`)).status, 401);
});

test("lead deletion requires authorized role and CSRF, deletes once and audits (database mocked)", async (t) => {
  function stub(target: object, key: string, replacement: unknown) {
    const delegate = target as Record<string, unknown>; const previous = delegate[key];
    delegate[key] = replacement; t.after(() => { delegate[key] = previous; });
  }
  let role = "SALES_USER";
  let exists = true;
  let deleted = 0;
  let audits = 0;
  stub(prisma.user, "findUnique", async () => ({ id: "lead-delete-admin", role, isActive: true }));
  stub(prisma.lead, "findUnique", async () => exists ? { id: "delete-fixture", firstName: "Test" } : null);
  stub(prisma.lead, "delete", async () => { exists = false; deleted++; return { id: "delete-fixture" }; });
  stub(prisma.activityLog, "create", async () => { audits++; return {}; });
  const token = signSession({ sub: "lead-delete-admin", role: "SUPER_ADMIN" });
  const headers = { Cookie: `agi_session=${token}; agi_csrf=delete-csrf`, "X-CSRF-Token": "delete-csrf" };
  const remove = () => fetch(`${base}/api/admin/leads/delete-fixture`, { method: "DELETE", headers });
  assert.equal((await remove()).status, 403); assert.equal(deleted, 0);
  role = "SUPER_ADMIN";
  assert.equal((await fetch(`${base}/api/admin/leads/delete-fixture`, { method: "DELETE", headers: { Cookie: headers.Cookie } })).status, 403);
  assert.equal((await remove()).status, 204); assert.equal(deleted, 1); assert.equal(audits, 1);
  assert.equal((await remove()).status, 404); assert.equal(deleted, 1);
  role = "SALES_MANAGER"; exists = true;
  assert.equal((await remove()).status, 204); assert.equal(audits, 2);
});
