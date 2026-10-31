import assert from "node:assert/strict";
import test from "node:test";
import { createResourceCache } from "../src/services/resourceCache";

test("concurrent consumers share one request and fresh navigation reuses data", async () => {
  let calls = 0;
  const cache = createResourceCache(async () => { calls++; return ["turf"]; });
  await Promise.all([cache.refresh(), cache.refresh()]);
  await cache.refresh();
  assert.equal(calls, 1);
  assert.deepEqual(cache.getSnapshot(), { data: ["turf"], loading: false, error: false });
});
test("background refresh keeps content visible and publishes edited or deleted records", async () => {
  let data = ["old"];
  const cache = createResourceCache(async () => data);
  await cache.refresh();
  data = ["edited"];
  const pending = cache.refresh(true);
  assert.deepEqual(cache.getSnapshot().data, ["old"]);
  assert.equal(cache.getSnapshot().loading, false);
  await pending;
  assert.deepEqual(cache.getSnapshot().data, ["edited"]);
  data = [];
  await cache.refresh(true);
  assert.deepEqual(cache.getSnapshot().data, []);
});
test("initial failures are retryable and refresh failures preserve prior content", async () => {
  let fail = true;
  const cache = createResourceCache(async () => { if (fail) throw new Error("offline"); return ["court"]; });
  await cache.refresh();
  assert.equal(cache.getSnapshot().error, true);
  fail = false;
  await cache.refresh(true);
  fail = true;
  await cache.refresh(true);
  assert.deepEqual(cache.getSnapshot(), { data: ["court"], loading: false, error: false });
});
