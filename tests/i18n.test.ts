import { test } from "node:test";
import assert from "node:assert/strict";
import { translateText } from "../lib/i18n/translate.ts";
import { mk } from "../lib/i18n/mk.ts";
import { sanitizePreferences } from "../lib/preferences-model.ts";
import { safetyLessons } from "../lib/safenest/lessons.ts";
test("language validates old and malformed preferences without losing learning choices", () => {
  assert.equal(sanitizePreferences({}).language, "en");
  assert.equal(
    sanitizePreferences({
      language: "mk",
      learningProgress: { "bath-water": { step: 2, completed: true } },
    }).learningProgress["bath-water"]?.completed,
    true,
  );
  for (const language of ["xx", null, {}, false])
    assert.equal(sanitizePreferences({ language }).language, "en");
  assert.equal(sanitizePreferences({ language: "mk" }).language, "mk");
});
test("translation preserves fragments and handles counts and accessible action labels", () => {
  assert.equal(translateText("  Home ", "en"), "  Home ");
  assert.equal(translateText("  Home ", "mk"), "  Почетна ");
  assert.equal(
    translateText("Save Care Academy", "mk"),
    "Зачувај Академија за нега",
  );
  assert.equal(
    translateText("2 Studio lessons explored", "mk"),
    "2 истражени лекции во Студиото",
  );
  assert.equal(
    translateText("Review status: Water-safety guidance", "mk"),
    "Состојба на прегледот: Насоки за безбедност покрај вода",
  );
  assert.equal(translateText("constructor", "mk"), "constructor");
});
test("every sourced safety comparison has authored translation with unchanged numbers", () => {
  for (const lesson of Object.values(safetyLessons))
    for (const text of [lesson.avoid, lesson.safer, lesson.action]) {
      assert.ok(Object.hasOwn(mk, text), text);
      assert.match(mk[text], /[А-Яа-яЃѓЌќ]/);
      assert.deepEqual(mk[text].match(/\d+/g), text.match(/\d+/g));
    }
  assert.match(mk[safetyLessons["sleep-space"].safer], /на грб/);
  assert.match(
    mk[safetyLessons["bath-water"].safer],
    /земете го детето со себе/,
  );
  assert.match(
    mk[safetyLessons["living-entry"].safer],
    /не се соодветни на врвот/,
  );
});
