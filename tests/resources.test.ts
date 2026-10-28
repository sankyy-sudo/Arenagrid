import assert from "node:assert/strict";
import { test } from "node:test";
process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgresql://localhost/arenagrid_test";
process.env.JWT_SECRET = "test-only-secret-that-is-long-enough";
const { resourceConfigs } = await import("../server/resources");
const { toOneRelation, toManyRelation } = await import("../server/lib/resource");
const { resourceDefs } = await import("../src/admin/resourceConfig");

const products = resourceConfigs.find((resource) => resource.name === "products")!;

test("product specifications use nested Prisma writes and preserve omitted fields", () => {
  const specs = [{ name: "Warranty", value: "5 years" }];
  assert.deepEqual(products.beforeUpdate!({ specifications: specs }).specifications, {
    deleteMany: {}, create: specs
  });
  assert.equal(products.beforeUpdate!({ name: "Updated turf" }).specifications, undefined);
  assert.deepEqual(products.beforeUpdate!({ specifications: [] }).specifications, {
    deleteMany: {}, create: []
  });
  // Zod partial schemas must not inject defaults that erase existing specifications.
  const parsed = products.updateSchema.parse({ name: "Updated turf" }) as Record<string, unknown>;
  assert.equal(parsed.specifications, undefined);
});

test("partial updates do not apply creation defaults to untouched fields", () => {
  for (const config of resourceConfigs) {
    assert.deepEqual(config.updateSchema.parse({}), {}, config.name);
  }
});

test("optional relationships distinguish omission, clearing and replacement", () => {
  assert.equal(toOneRelation(undefined, "set"), undefined);
  assert.deepEqual(toOneRelation(null, "set"), { disconnect: true });
  assert.deepEqual(toOneRelation("category-id", "set"), { connect: { id: "category-id" } });
  assert.deepEqual(toManyRelation([], "set"), { set: [] });
});

test("lead reads explicitly select safe assignee fields and forbid admin creation", () => {
  const leads = resourceConfigs.find((resource) => resource.name === "leads")!;
  assert.deepEqual(leads.include, { assignedUser: { select: { id: true, name: true } } });
  assert.equal(leads.allowCreate, false);
});

test("CMS navigation and delete buttons use the same permissions as the API", () => {
  for (const definition of resourceDefs) {
    const config = resourceConfigs.find((resource) => resource.name === definition.key);
    assert.ok(config, definition.key);
    assert.deepEqual(definition.roles, config.roles, definition.key);
  }
});
