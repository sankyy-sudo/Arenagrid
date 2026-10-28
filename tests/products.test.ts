import assert from "node:assert/strict";
import { test } from "node:test";
import { productCreateSchema, productUpdateSchema } from "../shared/validation";
import { toProductCard } from "../src/ui/components/products/config";
import { publicProduct } from "../server/lib/publicProducts";

test("product image fields accept uploads and safe URLs, reject unsafe schemes, and support clearing", () => {
  for (const mainImageUrl of ["/uploads/image.webp", "/images/products/turf.jpg", "https://example.com/turf.jpg", null, ""]) {
    assert.equal(productCreateSchema.safeParse({ name: "Test product", slug: "test-product", mainImageUrl }).success, true);
  }
  for (const mainImageUrl of ["javascript:alert(1)", "data:image/svg+xml,test", "//external.example/image", "/uploads/../secret", "ftp://example.com/file"]) {
    assert.equal(productUpdateSchema.safeParse({ mainImageUrl }).success, false);
  }
  assert.equal(productUpdateSchema.parse({ name: "Updated" }).mainImageUrl, undefined);
});

test("public product projection excludes unpublished category metadata", () => {
  const row = { id: "one", name: "Turf", slug: "turf", shortDescription: null, fullDescription: null, mainImageUrl: null, features: [], bestFor: [], sports: [], specifications: [], category: { id: "category", name: "Surfaces", slug: "surfaces", status: "DRAFT" as const } };
  assert.equal(publicProduct(row).category, null);
  assert.deepEqual(publicProduct({ ...row, category: { ...row.category, status: "PUBLISHED" } }).category, { id: "category", name: "Surfaces", slug: "surfaces" });
});


test("independent product lists validate, preserve omitted updates and allow clearing", () => {
  const lists = { features: ["  UV resistant  ", "Easy drainage"], bestFor: ["School grounds", "Clubs"] };
  const parsed = productUpdateSchema.parse(lists);
  assert.deepEqual(parsed.features, ["UV resistant", "Easy drainage"]);
  assert.deepEqual(parsed.bestFor, lists.bestFor);
  assert.deepEqual(productUpdateSchema.parse({ features: [], bestFor: [] }), { features: [], bestFor: [] });
  assert.equal(productUpdateSchema.parse({ name: "New name" }).features, undefined);
  assert.equal(productUpdateSchema.parse({ name: "New name" }).bestFor, undefined);
  assert.equal(productUpdateSchema.safeParse({ features: ["   "] }).success, false);
  assert.equal(productUpdateSchema.safeParse({ bestFor: ["x".repeat(161)] }).success, false);
});

test("cards use editable lists rather than related sports or specifications", () => {
  const record = { id: "one", name: "Turf", slug: "turf", category: null, mainImageUrl: null,
    fullDescription: "Product description", shortDescription: "Older short description",
    features: ["UV resistant"], bestFor: ["School grounds"],
    specifications: [{ name: "Legacy", value: "Specification", unit: null }], sports: [{ id: "one", name: "Football" }] };
  const card = toProductCard(record);
  assert.deepEqual(card.features, record.features);
  assert.deepEqual(card.bestFor, record.bestFor);
  assert.equal(card.description, record.fullDescription);
  assert.deepEqual(toProductCard({ ...record, features: [], bestFor: [] }).features, []);
  assert.deepEqual(toProductCard({ ...record, features: [], bestFor: [] }).bestFor, []);
  assert.equal(productUpdateSchema.safeParse({ shortDescription: null, fullDescription: null }).success, true);
});
