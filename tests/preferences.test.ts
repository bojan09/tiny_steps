import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizePreferences, defaults } from "../lib/preferences-model.ts";
test("invalid stored values fall back to safe defaults", () => {
  assert.deepEqual(
    sanitizePreferences({
      theme: "unknown",
      mode: "broken",
      intensity: 900,
      motion: "wild",
      companion: "yes",
    }),
    defaults,
  );
});
test("valid preferences survive hydration", () => {
  assert.equal(
    sanitizePreferences({
      theme: "peach",
      mode: "dark",
      intensity: 40,
      companion: false,
    }).theme,
    "peach",
  );
  assert.equal(sanitizePreferences({ companion: false }).companion, false);
});
test("null and corrupted storage shapes are harmless", () => {
  for (const value of [null, [], false, "broken", 42])
    assert.deepEqual(sanitizePreferences(value), defaults);
});
