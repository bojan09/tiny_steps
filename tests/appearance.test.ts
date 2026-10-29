import test from "node:test";
import assert from "node:assert/strict";
import { appearanceTokens, contrast } from "../lib/appearance.ts";
import {
  defaults,
  themes,
  sanitizePreferences,
  backgrounds,
} from "../lib/preferences-model.ts";
test("every palette and extreme custom color keeps readable accents", () => {
  for (const theme of themes)
    for (const customColor of [
      "#ffffff",
      "#000000",
      "#ffff00",
      "#00ffff",
      "#ff00ff",
    ])
      for (const dark of [false, true]) {
        const t = appearanceTokens({ ...defaults, theme, customColor }, dark);
        assert.ok(
          contrast(t.accent, dark ? "#252f2a" : "#fffdf8") >= 4.5,
          theme,
        );
        assert.ok(
          contrast(t.accent, dark ? "#172c20" : "#ffffff") >= 4.5,
          theme,
        );
      }
});
test("scene choices survive storage and unsafe custom values do not", () => {
  for (const background of backgrounds)
    assert.equal(
      sanitizePreferences({ ...defaults, background }).background,
      background,
    );
  assert.equal(
    sanitizePreferences({ customColor: "url(evil)" }).customColor,
    defaults.customColor,
  );
});
