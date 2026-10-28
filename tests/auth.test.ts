import assert from "node:assert/strict";
import { test } from "node:test";
import type { Request, Response } from "express";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgresql://localhost/arenagrid_test";
process.env.JWT_SECRET = "test-only-secret-that-is-long-enough";
const { requireCsrf } = await import("../server/middleware/auth");

test("CSRF mutations require matching cookie and header tokens", () => {
  const request = { method: "POST", cookies: { agi_csrf: "token" }, headers: {} } as unknown as Request;
  assert.throws(() => requireCsrf(request, {} as Response, () => {}), /CSRF validation failed/);
  request.headers["x-csrf-token"] = "wrong-token";
  assert.throws(() => requireCsrf(request, {} as Response, () => {}), /CSRF validation failed/);
  request.headers["x-csrf-token"] = "token";
  let passed = false;
  requireCsrf(request, {} as Response, () => { passed = true; });
  assert.equal(passed, true);
});
