import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validRoom,
  validNestChecks,
  topicIds,
  roomIds,
} from "../lib/safenest/model.ts";
import { sanitizePreferences } from "../lib/preferences-model.ts";

test("SafeNest rejects forged completion and unknown checklist entries", () => {
  for (const value of [null, [], false, "complete"])
    assert.deepEqual(validNestChecks(value), {});
  assert.deepEqual(
    validNestChecks({
      "sleep-space": "safe",
      furniture: "reviewed",
      unknown: "reviewed",
      "bath-water": "follow-up",
    }),
    { furniture: "reviewed", "bath-water": "follow-up" },
  );
  assert.equal(validRoom("attic"), "nursery");
  assert.equal(validRoom("bathroom"), "bathroom");
  assert.deepEqual(
    sanitizePreferences({ safeNestChecks: { "sleep-space": "certified" } })
      .safeNestChecks,
    {},
  );
  assert.equal(sanitizePreferences({}).safeNestRoom, "nursery");
});
test("SafeNest supports only bounded learning states for its known topics", () => {
  const input = Object.fromEntries(topicIds.map((id) => [id, "reviewed"]));
  assert.equal(Object.keys(validNestChecks(input)).length, 12);
  assert.equal(new Set(topicIds).size, 12);
  assert.equal(new Set(roomIds).size, 4);
  for (const value of ["done", "safe", "unsafe", true, 1, {}])
    assert.deepEqual(validNestChecks({ "sleep-space": value }), {});
});
