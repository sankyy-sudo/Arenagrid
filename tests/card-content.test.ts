import assert from "node:assert/strict";
import test from "node:test";
import { cardSummary, cleanTitle } from "../src/ui/data/cardContent";

test("card titles remove Sample but preserve demo disclosures", () => {
  assert.equal(cleanTitle("Sample: Synthetic Turf"), "Synthetic Turf");
  assert.equal(cleanTitle("Demo: Training facility"), "Demo: Training facility");
});
test("card summaries keep complete sentences and omit truncated placeholder copy", () => {
  assert.equal(cardSummary({ description: "Durable flooring for training. The sample scope includes..." }), "Durable flooring for training.");
  assert.equal(cardSummary({ description: "Durable flooring for training. Incomplete sentence..." }), "Durable flooring for training.");
});
test("admin-authored summaries take precedence over seeded copy", () => {
  assert.equal(cardSummary({ slug: "sample-football-surface", shortDescription: "Updated turf for schools." }), "Updated turf for schools.");
});
