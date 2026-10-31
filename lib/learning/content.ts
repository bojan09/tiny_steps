import { lessonIds, type LessonId, type LearningProgress } from "./model.ts";
import { safetyLessons } from "../safenest/lessons.ts";
export const learningPaths = [
  {
    id: "rest",
    title: "Rest & a calmer space",
    note: "Sleep surroundings, furniture and changing routines.",
    image: "baby",
    ids: lessonIds.slice(0, 3),
  },
  {
    id: "mealtimes",
    title: "Everyday mealtime surroundings",
    note: "Storage, hot drinks and being present at meals.",
    image: "care",
    ids: lessonIds.slice(3, 6),
  },
  {
    id: "water",
    title: "Bath-time preparation",
    note: "Presence, storage and preparing the water.",
    image: "house",
    ids: lessonIds.slice(6, 9),
  },
  {
    id: "explore",
    title: "A home ready to explore",
    note: "Furniture, cords and planning for movement.",
    image: "guide",
    ids: lessonIds.slice(9, 12),
  },
];
const titles: Record<LessonId, string> = {
  "sleep-space": "A clear place to sleep",
  furniture: "Furniture that stays put",
  "nursery-sharing": "Choose a changing place",
  "kitchen-storage": "Put products out of reach",
  "kitchen-heat": "Separate hot drinks and cuddles",
  "kitchen-sharing": "Stay together at mealtimes",
  "bath-water": "Stay present around water",
  "bath-storage": "Plan bathroom storage",
  "bath-sharing": "Check the water first",
  "living-furniture": "Secure TVs and furniture",
  "living-cords": "Keep blind cords out of reach",
  "living-entry": "Think ahead to movement",
};
export const learningLessons = lessonIds.map((id) => ({
  id,
  title: titles[id],
  ...safetyLessons[id],
}));
export function lessonById(id: string) {
  return learningLessons.find((l) => l.id === id);
}
export function lessonHref(id: LessonId) {
  return `/care-academy/lessons/${id}`;
}
export function nextLearningLesson(
  progress: LearningProgress,
  active: LessonId,
): LessonId {
  if (progress[active] && !progress[active]?.completed) return active;
  return (
    lessonIds.find((id) => progress[id] && !progress[id]?.completed) ||
    lessonIds.find((id) => !progress[id]?.completed) ||
    active
  );
}
