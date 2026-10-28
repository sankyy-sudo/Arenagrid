import assert from "node:assert/strict";
import { test } from "node:test";
import { envSchema } from "../shared/config";

const base = { DATABASE_URL: "postgresql://localhost/arenagrid", JWT_SECRET: "test-only-secret-that-is-long-enough" };

test("configuration matches the PostgreSQL schema and validates ports", () => {
  assert.equal(envSchema.parse(base).PORT, 4000);
  assert.equal(envSchema.parse(base).TRUST_PROXY_HOPS, 0);
  assert.equal(envSchema.safeParse({ ...base, DATABASE_URL: "file:./dev.db" }).success, false);
  assert.equal(envSchema.safeParse({ ...base, PORT: 65536 }).success, false);
  assert.equal(envSchema.safeParse({ ...base, JWT_SECRET: "short" }).success, false);
});
