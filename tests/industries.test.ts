import assert from "node:assert/strict";
import { test } from "node:test";
import { industryCreateSchema, industryUpdateSchema } from "../shared/validation";
import { publicIndustriesSchema } from "../shared/industries";

test("industry image and solution support clearing and preserve omitted updates", () => {
  for (const imageUrl of ["/uploads/school.webp", "/images/home/community-960.webp", "https://example.com/image.jpg", null, ""]) {
    assert.equal(industryCreateSchema.safeParse({ name: "Schools", slug: "schools", imageUrl, description: "School spaces", solution: "Multi-sport courts" }).success, true);
  }
  for (const imageUrl of ["javascript:alert(1)", "//example.com/image", "/uploads/../secret"]) assert.equal(industryUpdateSchema.safeParse({ imageUrl }).success, false);
  assert.deepEqual(industryUpdateSchema.parse({ name: "Updated schools" }), { name: "Updated schools" });
  assert.deepEqual(industryUpdateSchema.parse({ description: null, solution: null, imageUrl: null }), { description: null, solution: null, imageUrl: null });
  assert.equal(industryUpdateSchema.safeParse({ solution: "x".repeat(10001) }).success, false);
  assert.equal(publicIndustriesSchema.safeParse({ items: [] }).success, true);
});
