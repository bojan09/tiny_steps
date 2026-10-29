import type { Preferences } from "./preferences-model.ts";
export const paletteColors: Record<Preferences["theme"], string> = {
  sage: "#345b49",
  peach: "#87503a",
  lavender: "#69517c",
  ocean: "#35697b",
  sand: "#79613e",
  rose: "#864d5a",
  forest: "#28513e",
  mint: "#327363",
  honey: "#80601c",
  sky: "#386b95",
  clay: "#8c503f",
  plum: "#74466f",
  custom: "#345b49",
};
function channels(hex: string) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}
function luminance(hex: string) {
  return channels(hex)
    .map((v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
export function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function mix(a: string, b: string, amount: number) {
  const x = channels(a),
    y = channels(b);
  return (
    "#" +
    x
      .map((v, i) =>
        Math.round(v + (y[i] - v) * amount)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
export function appearanceTokens(p: Preferences, dark: boolean) {
  const base = p.theme === "custom" ? p.customColor : paletteColors[p.theme];
  const paper = dark ? "#252f2a" : "#fffdf8";
  let accent = base;
  for (let step = 0; step <= 100; step++) {
    accent = mix(base, dark ? "#ffffff" : "#000000", step / 100);
    if (
      contrast(accent, paper) >= (dark ? 7 : 4.6) &&
      contrast(accent, dark ? "#172c20" : "#ffffff") >= 4.6
    )
      break;
  }
  return {
    accent,
    soft: mix(accent, paper, dark ? 0.83 : 0.9),
    canvas: dark ? "#1d2621" : mix(base, "#fffdf8", 0.96),
  };
}
