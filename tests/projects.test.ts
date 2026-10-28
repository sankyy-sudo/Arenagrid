import assert from "node:assert/strict";
import { test } from "node:test";
import { projectCreateSchema, projectUpdateSchema } from "../shared/validation";
import { publicProjectsSchema } from "../shared/projects";

test("project progress permits only ongoing and completed, image clearing and partial update preservation", () => {
  for (const progress of [0, 100]) assert.equal(projectCreateSchema.safeParse({ name: "Test project", slug: "test-project", progress, beforeImageUrl: "/uploads/before.webp", afterImageUrl: "https://example.com/after.jpg" }).success, true);
  for (const progress of [-1, 35, 50, 99, 101, 1.5, "50", null]) assert.equal(projectUpdateSchema.safeParse({ progress }).success, false);
  assert.deepEqual(projectUpdateSchema.parse({ name: "New title" }), { name: "New title" });
  assert.deepEqual(projectUpdateSchema.parse({ beforeImageUrl: null, afterImageUrl: null }), { beforeImageUrl: null, afterImageUrl: null });
  assert.equal(projectUpdateSchema.safeParse({ beforeImageUrl: "javascript:alert(1)" }).success, false);
  assert.equal(projectUpdateSchema.safeParse({ afterImageUrl: "/uploads/../secret" }).success, false);
  assert.equal(publicProjectsSchema.safeParse({ items: [] }).success, true);
});
