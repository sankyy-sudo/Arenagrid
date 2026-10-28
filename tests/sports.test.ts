import assert from "node:assert/strict";
import { test } from "node:test";
import { sportCreateSchema, sportUpdateSchema } from "../shared/validation";
import { publicSportsSchema } from "../shared/sports";

test("sport image validation supports uploads, URL, clearing and partial edits", () => {
  for (const heroImageUrl of ["/uploads/sport.webp", "/images/products/turf.jpg", "https://example.com/sport.jpg", null, ""]) {
    assert.equal(sportCreateSchema.safeParse({ name: "Tennis", slug: "tennis", heroImageUrl }).success, true);
  }
  for (const heroImageUrl of ["javascript:alert(1)", "//example.com/image", "/uploads/../secret"]) assert.equal(sportUpdateSchema.safeParse({ heroImageUrl }).success, false);
  assert.deepEqual(sportUpdateSchema.parse({ name: "Updated tennis" }), { name: "Updated tennis" });
  assert.equal(sportUpdateSchema.safeParse({ longDescription: null, heroImageUrl: null }).success, true);
  assert.equal(publicSportsSchema.safeParse({ items: [] }).success, true);
  assert.equal(publicSportsSchema.safeParse({ items: [{ name: "Incomplete" }] }).success, false);
});
