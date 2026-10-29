import { sanitizePreferences, type Preferences } from "./preferences-model.ts";
type Update =
  | { kind: "preferences"; revision: number; preferences: Preferences }
  | { kind: "profile"; displayName: string }
  | { kind: "progress"; step: number; completed: boolean }
  | { kind: "bookmark"; resourceId: string; saved: boolean };
export function validDisplayName(value: unknown): string | null {
  return typeof value === "string" &&
    value.length <= 80 &&
    !/[\x00-\x1f\x7f]/.test(value)
    ? value.trim()
    : null;
}
export function validateAccountUpdate(value: unknown): Update | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const keys: Record<string, string[]> = {
    preferences: ["kind", "revision", "preferences"],
    profile: ["kind", "displayName"],
    progress: ["kind", "step", "completed"],
    bookmark: ["kind", "resourceId", "saved"],
  };
  if (
    typeof v.kind !== "string" ||
    !keys[v.kind] ||
    Object.keys(v).some((k) => !keys[v.kind as string].includes(k))
  )
    return null;
  if (v.kind === "profile") {
    const displayName = validDisplayName(v.displayName);
    return displayName === null ? null : { kind: "profile", displayName };
  }
  if (
    v.kind === "preferences" &&
    Number.isSafeInteger(v.revision) &&
    Number(v.revision) > 0 &&
    v.preferences &&
    typeof v.preferences === "object" &&
    !Array.isArray(v.preferences)
  )
    return {
      kind: "preferences",
      revision: Number(v.revision),
      preferences: sanitizePreferences(v.preferences),
    };
  if (
    v.kind === "progress" &&
    Number.isInteger(v.step) &&
    Number(v.step) >= 0 &&
    Number(v.step) <= 4 &&
    typeof v.completed === "boolean"
  )
    return { kind: "progress", step: Number(v.step), completed: v.completed };
  if (
    v.kind === "bookmark" &&
    typeof v.resourceId === "string" &&
    /^[a-z-]{1,100}$/.test(v.resourceId) &&
    typeof v.saved === "boolean"
  )
    return { kind: "bookmark", resourceId: v.resourceId, saved: v.saved };
  return null;
}
