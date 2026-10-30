export const roomIds = ["nursery", "kitchen", "bathroom", "living"] as const;
export type RoomId = (typeof roomIds)[number];
export const topicIds = [
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
export type TopicId = (typeof topicIds)[number];
export type ReviewState = "follow-up" | "reviewed";
export type NestChecks = Partial<Record<TopicId, ReviewState>>;
export function validRoom(value: unknown): RoomId {
  return roomIds.includes(value as RoomId) ? (value as RoomId) : "nursery";
}
export function validNestChecks(value: unknown): NestChecks {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: NestChecks = {};
  for (const id of topicIds) {
    const status = (value as Record<string, unknown>)[id];
    if (status === "follow-up" || status === "reviewed") result[id] = status;
  }
  return result;
}
