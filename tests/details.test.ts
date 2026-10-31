import assert from "node:assert/strict";
import { test } from "node:test";
import { detailHref, itemSlug, productDetail, projectDetail, sportDetail, industryDetail } from "../src/ui/data/catalog";
import { parseDetailItems } from "../src/ui/hooks/useDetailItems";

test("details reuse published fields, deduplicate galleries and preserve specifications", () => {
  const product = { id: "p", name: "Acrylic Courts", slug: "acrylic-courts", mainImageUrl: "/images/main.jpg", fullDescription: "Full text", shortDescription: "Tagline", features: ["Grip"], bestFor: ["Schools"], category: null, sports: [], specifications: [{ name: "Layers", value: "5", unit: null }], gallery: [{ url: "/images/main.jpg", altText: null }, { url: "/images/second.jpg", altText: "Court detail" }] };
  const detail = productDetail(product);
  assert.equal(detailHref("products", product), "/products/acrylic-courts");
  assert.equal(detail.images.length, 2); assert.equal(detail.images[1].alt, "Court detail");
  assert.deepEqual(detail.specs, [{ name: "Layers", value: "5" }]);
  assert.equal(detail.description, "Full text"); assert.deepEqual(detail.features, ["Grip"]);
  assert.deepEqual(detail.applications, ["Schools"]);
  assert.deepEqual(parseDetailItems("products", { items: [product] }), [detail]);
  assert.equal(itemSlug({ id: "fallback", name: "Indoor / Multi Sport" }), "indoor-multi-sport");
});

test("all section adapters handle optional content without inventing specifications", () => {
  const item = { id: "one", name: "Test", slug: "test" };
  const project = projectDetail({ ...item, location: "Delhi", description: null, beforeImageUrl: "/images/before.jpg", afterImageUrl: "/images/after.jpg", progress: 100 });
  assert.equal(project.images.length, 2); assert.equal(project.specs[1].value, "Completed");
  const sport = sportDetail({ ...item, shortDescription: null, longDescription: null, heroImageUrl: null });
  assert.deepEqual(sport.images, []); assert.deepEqual(sport.features, []);
  const industry = industryDetail({ ...item, description: "Description", imageUrl: null, solution: "Solution" });
  assert.equal(industry.solution, "Solution"); assert.deepEqual(industry.specs, []);
  assert.deepEqual(parseDetailItems("projects", { items: [] }), []);
  assert.throws(() => parseDetailItems("sports", { items: [{ ...item }] }));
});


test("product details fall back from empty editor markup without treating summary as category", () => {
  const item = { id: "p", name: "Turf", slug: "turf", mainImageUrl: null, fullDescription: "<p><br></p>", shortDescription: "Legacy product description.", features: [], bestFor: [], category: null, sports: [], specifications: [] };
  const detail = productDetail(item);
  assert.equal(detail.description, "Legacy product description.");
  assert.equal(detail.tagline, "");
  assert.equal(productDetail({ ...item, fullDescription: "<p>Full editor content.</p>" }).description, "<p>Full editor content.</p>");
});

test("project details preserve before/after roles and build specifications from structured fields", () => {
  const input = { id: "p", name: "Demo: Community Court", slug: "demo-court", location: "Bengaluru ? illustrative location", description: "<p>Rich description</p>", beforeImageUrl: "/before.jpg", afterImageUrl: null, progress: 0, surface: "Acrylic", use: "Training" };
  const detail = projectDetail(input);
  assert.equal(detail.name, "Community Court");
  assert.deepEqual(detail.project, { beforeImageUrl: "/before.jpg", afterImageUrl: null, isDemo: true, status: "Ongoing", location: "Bengaluru" });
  assert.deepEqual(detail.specs, [{ name: "Location", value: "Bengaluru" }, { name: "Status", value: "Ongoing" }, { name: "Surface", value: "Acrylic" }, { name: "Use", value: "Training" }]);
  assert.equal(detail.description, input.description);
  assert.deepEqual(projectDetail({ ...input, name: "Real court", location: null, surface: "  ", use: null }).specs, [{ name: "Status", value: "Ongoing" }]);
  assert.equal(projectDetail({ ...input, name: "Real court" }).project?.isDemo, false);
});
