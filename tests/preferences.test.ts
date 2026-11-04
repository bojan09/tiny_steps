import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizePreferences,
  defaults,
  interfacePreferences,
} from "../lib/preferences-model.ts";
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
test("learning interests validate older settings and reject arbitrary stages", () => {
  assert.equal(sanitizePreferences({}).learningStage, "all");
  assert.equal(
    sanitizePreferences({ learningStage: "early" }).learningStage,
    "early",
  );
  assert.equal(
    sanitizePreferences({ learningStage: "diagnosis" }).learningStage,
    "all",
  );
});

test("identity transitions preserve accessibility choices without carrying private learning", () => {
  const prefs = sanitizePreferences({
    ...defaults,
    language: "mk",
    textSize: "large",
    motion: "off",
    theme: "lavender",
    learningProgress: { "sleep-space": { step: 2, completed: true } },
    firstYearRead: [3],
  });
  const cleared = { ...defaults, ...interfacePreferences(prefs) };
  assert.equal(cleared.textSize, "large");
  assert.equal(cleared.motion, "off");
  assert.equal(cleared.theme, "lavender");
  assert.equal(cleared.language, "mk");
  assert.deepEqual(cleared.learningProgress, {});
  assert.deepEqual(cleared.firstYearRead, []);
});
