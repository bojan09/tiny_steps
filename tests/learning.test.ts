import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validLesson,
  validLearningProgress,
  lessonStatus,
  lessonIds,
} from "../lib/learning/model.ts";
import {
  learningPaths,
  learningLessons,
  nextLearningLesson,
} from "../lib/learning/content.ts";
import { sanitizePreferences } from "../lib/preferences-model.ts";
test("lesson progress accepts only bounded known reading states", () => {
  for (const v of [null, [], "done", 42])
    assert.deepEqual(validLearningProgress(v), {});
  assert.deepEqual(
    validLearningProgress({
      unknown: { step: 2, completed: true },
      furniture: { step: 9, completed: true },
      "sleep-space": { step: 1, completed: "yes" },
      "bath-water": { step: 2, completed: true },
    }),
    {
      "sleep-space": { step: 1, completed: false },
      "bath-water": { step: 2, completed: true },
    },
  );
  assert.equal(validLesson("unknown"), "sleep-space");
  assert.deepEqual(sanitizePreferences({}).learningProgress, {});
  assert.equal(lessonStatus(undefined), "Not started");
  assert.equal(lessonStatus({ step: 0, completed: false }), "In progress");
  assert.equal(lessonStatus({ step: 0, completed: true }), "Explored");
});
test("all twelve sourced lessons appear exactly once on the map", () => {
  assert.deepEqual(
    learningPaths.flatMap((p) => p.ids),
    [...lessonIds],
  );
  assert.equal(learningLessons.length, 12);
  for (const lesson of learningLessons) {
    assert.ok(lesson.title.length > 10);
    assert.ok(lesson.action.length > 20);
    assert.equal(new URL(lesson.source.url).protocol, "https:");
  }
});
test("resume prefers unfinished work and all-explored stays revisitable", () => {
  assert.equal(nextLearningLesson({}, "furniture"), "sleep-space");
  assert.equal(
    nextLearningLesson(
      { furniture: { step: 1, completed: false } },
      "furniture",
    ),
    "furniture",
  );
  assert.equal(
    nextLearningLesson(
      { "sleep-space": { step: 2, completed: true } },
      "sleep-space",
    ),
    "furniture",
  );
  const all = Object.fromEntries(
    lessonIds.map((id) => [id, { step: 2, completed: true }]),
  );
  assert.equal(nextLearningLesson(all, "bath-water"), "bath-water");
});
