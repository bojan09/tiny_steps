import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validMonth,
  validReadMonths,
  chapters,
  copy,
  chapterForPosition,
} from "../lib/first-year/content.ts";
import { sanitizePreferences } from "../lib/preferences-model.ts";

test("reading state rejects corrupt input without creating false progress", () => {
  for (const v of [-1, 13, 1.5, "2", null, NaN]) assert.equal(validMonth(v), 0);
  assert.deepEqual(
    validReadMonths([2, 2, 0, 12, 13, -1, "1", null]),
    [0, 2, 12],
  );
  assert.deepEqual(validReadMonths({ length: 13 }), []);
  const older = sanitizePreferences({ theme: "peach" });
  assert.equal(older.firstYearLanguage, "en");
  assert.deepEqual(older.firstYearRead, []);
});
test("day and week navigation stays inside the year at both boundaries", () => {
  assert.equal(chapterForPosition(1, "day"), 0);
  assert.equal(chapterForPosition(365, "day"), 12);
  assert.equal(chapterForPosition(1, "week"), 0);
  assert.equal(chapterForPosition(53, "week"), 12);
  for (let day = 1; day <= 365; day++) {
    const chapter = chapterForPosition(day, "day");
    assert.ok(chapter >= 0 && chapter <= 12);
    if (day > 1) assert.ok(chapter >= chapterForPosition(day - 1, "day"));
  }
  for (const value of [0, -1, 366, 1.5, NaN])
    assert.equal(chapterForPosition(value, "day"), 0);
});
test("all 13 chapters have complete English and Macedonian reading content", () => {
  assert.equal(chapters.length, 13);
  for (const chapter of chapters)
    for (const lang of ["en", "mk"] as const) {
      assert.equal(chapter[lang].length, 4);
      for (const field of chapter[lang]) assert.ok(field.trim().length > 10);
    }
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.mk).sort());
});

test("every chapter resolves to a sourced reference without inventing monthly deadlines", async () => {
  const { developmentStages, developmentForMonth, developmentCopy } =
    await import("../lib/first-year/development.ts");
  assert.deepEqual(
    developmentStages.map((s) => s.referenceAge),
    [2, 4, 6, 9, 12],
  );
  for (let month = 0; month <= 12; month++) {
    const matches = developmentStages.filter(
      (s) => month >= s.from && month <= s.to,
    );
    assert.equal(
      matches.length,
      1,
      `chapter ${month} has exactly one reference`,
    );
    const stage = developmentForMonth(month);
    assert.equal(stage, matches[0]);
    assert.ok(
      stage.referenceAge >= month,
      "younger chapters must label content as looking ahead",
    );
    assert.equal(new URL(stage.source).hostname, "www.cdc.gov");
    for (const lang of ["en", "mk"] as const) {
      assert.equal(stage[lang].examples.length, 3);
      assert.ok(stage[lang].activity.length > 30);
      for (const example of stage[lang].examples)
        assert.ok(example.length > 20);
    }
  }
  assert.deepEqual(
    Object.keys(developmentCopy.en).sort(),
    Object.keys(developmentCopy.mk).sort(),
  );
});
