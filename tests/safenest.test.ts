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

test("all persisted topics have distinct actionable comparisons and attributable sources", async () => {
  const { safetyLessons, safetySources } =
    await import("../lib/safenest/lessons.ts");
  assert.deepEqual(Object.keys(safetyLessons).sort(), [...topicIds].sort());
  for (const lesson of Object.values(safetyLessons)) {
    assert.notEqual(lesson.avoid, lesson.safer);
    for (const value of [lesson.avoid, lesson.safer, lesson.action])
      assert.ok(value.trim().length > 20);
    assert.equal(new URL(lesson.source.url).protocol, "https:");
    assert.ok(lesson.source.jurisdiction.length > 2);
    assert.ok(lesson.source.sourceDate.length > 10);
    assert.ok(Object.values(safetySources).includes(lesson.source));
    assert.ok(!lesson.source.url.includes("safety-and-accidents"));
  }
  assert.match(safetyLessons["bath-water"].safer, /take your child with you/);
  assert.match(
    safetyLessons["living-entry"].safer,
    /pressure-mounted gates are not suitable at the top/,
  );
});
