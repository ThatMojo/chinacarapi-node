// Offline smoke test: key-gating and the client surface, no network.
const assert = require("assert");
const { ChinaCarAPI, ChinaCarAPIError } = require("../src/index.js");

delete process.env.CHINACARAPI_KEY;
assert.throws(() => new ChinaCarAPI(), (e) => e instanceof ChinaCarAPIError && /chinacarapi\.com/.test(e.message));

const client = new ChinaCarAPI("test_key_123");
for (const m of ["catalog", "vehicle", "inspection", "bulk", "changes", "exportCsv", "enums", "models"]) {
  assert.strictEqual(typeof client[m], "function", m);
}
console.log("chinacarapi-node smoke test: OK");
