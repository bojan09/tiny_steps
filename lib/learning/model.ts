export const lessonIds = [
  "sleep-space",
  "furniture",
  "nursery-sharing",
  "kitchen-storage",
  "kitchen-heat",
  "kitchen-sharing",
  "bath-water",
  "bath-storage",
  "bath-sharing",
  "living-furniture",
  "living-cords",
  "living-entry",
] as const;
export type LessonId = (typeof lessonIds)[number];
export type LessonState = { step: number; completed: boolean };
export type LearningProgress = Partial<Record<LessonId, LessonState>>;
export function validLesson(value: unknown): LessonId {
  return lessonIds.includes(value as LessonId)
    ? (value as LessonId)
    : lessonIds[0];
}
export function validLearningProgress(value: unknown): LearningProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: LearningProgress = {};
  for (const id of lessonIds) {
    const raw = (value as Record<string, unknown>)[id];
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const v = raw as Record<string, unknown>;
    if (!Number.isInteger(v.step) || Number(v.step) < 0 || Number(v.step) > 2)
      continue;
    const completed = v.completed === true;
    result[id] = { step: Number(v.step), completed };
  }
  return result;
}
export function lessonStatus(
  state: LessonState | undefined,
): "Not started" | "In progress" | "Explored" {
  return state?.completed ? "Explored" : state ? "In progress" : "Not started";
}
