import { validMonth, validReadMonths } from "./first-year/content.ts";
export const themes = [
  "sage",
  "peach",
  "lavender",
  "ocean",
  "sand",
  "rose",
  "forest",
  "mint",
  "honey",
  "sky",
  "clay",
  "plum",
  "custom",
] as const;
export const backgrounds = [
  "botanical",
  "sunlight",
  "solid",
  "meadow",
  "coast",
  "twilight",
  "home",
  "garden",
] as const;
export type Preferences = {
  firstYearMonth: number;
  firstYearRead: number[];
  firstYearLanguage: "en" | "mk";
  learningStage: "all" | "preparing" | "early" | "middle" | "later";
  customColor: string;
  theme: (typeof themes)[number];
  mode: "light" | "dark" | "system";
  background: (typeof backgrounds)[number];
  intensity: number;
  motion: "cinematic" | "balanced" | "minimal" | "off";
  companion: boolean;
  textSize: "standard" | "large";
};
export const defaults: Preferences = {
  firstYearMonth: 0,
  firstYearRead: [],
  firstYearLanguage: "en",
  learningStage: "all",
  customColor: "#345b49",
  theme: "sage",
  mode: "system",
  background: "botanical",
  intensity: 70,
  motion: "balanced",
  companion: true,
  textSize: "standard",
};
export function sanitizePreferences(value: unknown): Preferences {
  const v =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  return {
    firstYearMonth: validMonth(v.firstYearMonth),
    firstYearRead: validReadMonths(v.firstYearRead),
    firstYearLanguage: v.firstYearLanguage === "mk" ? "mk" : "en",
    learningStage: ["all", "preparing", "early", "middle", "later"].includes(
      String(v.learningStage),
    )
      ? (v.learningStage as Preferences["learningStage"])
      : defaults.learningStage,
    customColor:
      typeof v.customColor === "string" &&
      /^#[0-9a-fA-F]{6}$/.test(v.customColor)
        ? v.customColor.toLowerCase()
        : defaults.customColor,
    theme: themes.includes(v.theme as Preferences["theme"])
      ? (v.theme as Preferences["theme"])
      : defaults.theme,
    mode: ["light", "dark", "system"].includes(String(v.mode))
      ? (v.mode as Preferences["mode"])
      : defaults.mode,
    background: backgrounds.includes(v.background as Preferences["background"])
      ? (v.background as Preferences["background"])
      : defaults.background,
    intensity:
      typeof v.intensity === "number" &&
      Number.isFinite(v.intensity) &&
      v.intensity >= 0 &&
      v.intensity <= 100
        ? v.intensity
        : defaults.intensity,
    motion: ["cinematic", "balanced", "minimal", "off"].includes(
      String(v.motion),
    )
      ? (v.motion as Preferences["motion"])
      : defaults.motion,
    companion:
      typeof v.companion === "boolean" ? v.companion : defaults.companion,
    textSize: v.textSize === "large" ? "large" : "standard",
  };
}
