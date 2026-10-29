"use client";
import { useAccount } from "./account-provider";
import { useState } from "react";
import { Check, Sun, Moon, Monitor, RotateCcw, Leaf } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { paletteColors } from "@/lib/appearance";
import { themes, backgrounds, type Preferences } from "@/lib/preferences-model";
import { Botanical } from "./art";
const descriptions = [
  "Calm & natural",
  "Warm & cozy",
  "Soothing & gentle",
  "Fresh & airy",
  "Modern & soft",
  "Warm & elegant",
  "Rich & grounded",
  "Cool & peaceful",
  "Golden & gentle",
  "Open & breezy",
  "Earthy & warm",
  "Soft & thoughtful",
  "Your own touch",
];
export function PreferencesPanel() {
  const auth = useAccount();
  const p = usePreferences((s) => s.preferences);
  const set = usePreferences((s) => s.setPreferences);
  const reset = usePreferences((s) => s.reset);
  const [notice, setNotice] = useState("");
  return (
    <div className="settings-layout">
      <div className="paper settings-panel">
        <div className="panel-heading">
          <span className="round-icon">
            <Leaf size={20} />
          </span>
          <div>
            <h2>Make yourself at home</h2>
            <p>Little changes, a different feeling.</p>
          </div>
        </div>
        <fieldset className="settings-controls" disabled={auth.loading}>
          <fieldset>
            <legend>Your palette</legend>
            <p className="field-help">
              Choose the colors that feel most like you.
            </p>
            <div className="theme-grid">
              {themes.map((theme, i) => (
                <button
                  key={theme}
                  style={{
                    backgroundColor: paletteColors[theme] + "18",
                    color: "var(--ink)",
                  }}
                  aria-pressed={p.theme === theme}
                  onClick={() => {
                    set({ theme });
                    setNotice(
                      auth.account
                        ? "Appearance updated."
                        : "Palette saved on this device.",
                    );
                  }}
                  className={
                    "theme-option theme-" +
                    theme +
                    (p.theme === theme ? " selected" : "")
                  }
                >
                  <span className="theme-leaf">
                    <Leaf size={26} />
                  </span>
                  <strong>{theme[0].toUpperCase() + theme.slice(1)}</strong>
                  <small>{descriptions[i]}</small>
                  {p.theme === theme && (
                    <Check className="theme-check" size={15} />
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          {p.theme === "custom" && (
            <div className="custom-color">
              <label htmlFor="custom-color">Your accent color</label>
              <input
                id="custom-color"
                type="color"
                value={p.customColor}
                onChange={(e) => set({ customColor: e.target.value })}
              />
              <span>{p.customColor.toUpperCase()}</span>
              <p className="field-help">
                We adjust the shade for readable text in light and dark mode.
              </p>
            </div>
          )}
          <fieldset>
            <legend>A light for every moment</legend>
            <div className="segmented">
              {(["light", "dark", "system"] as const).map((mode, i) => {
                const ModeIcon = [Sun, Moon, Monitor][i];
                return (
                  <button
                    key={mode}
                    aria-pressed={p.mode === mode}
                    className={p.mode === mode ? "selected" : ""}
                    onClick={() => set({ mode })}
                  >
                    <ModeIcon size={16} />
                    {mode === "system"
                      ? "Auto"
                      : mode[0].toUpperCase() + mode.slice(1)}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>Set the scene</legend>
            <div className="background-grid">
              {backgrounds.map((background) => (
                <button
                  key={background}
                  aria-pressed={p.background === background}
                  onClick={() => set({ background })}
                  className={
                    "background-option " +
                    background +
                    (p.background === background ? " selected" : "")
                  }
                >
                  <span>
                    {background === "botanical" ? <Botanical /> : null}
                  </span>
                  <strong>
                    {background === "botanical"
                      ? "Botanical"
                      : background === "sunlight"
                        ? "Soft sunlight"
                        : (
                            {
                              solid: "Quiet canvas",
                              meadow: "Morning meadow",
                              coast: "Coastal calm",
                              twilight: "Twilight",
                              home: "Cozy home",
                              garden: "Garden retreat",
                            } as const
                          )[background]}
                  </strong>
                  {p.background === background && <Check size={16} />}
                </button>
              ))}
            </div>
            <label className="range-label" htmlFor="intensity">
              Background intensity <output>{p.intensity}%</output>
            </label>
            <input
              id="intensity"
              type="range"
              min="0"
              max="100"
              value={p.intensity}
              onChange={(e) => set({ intensity: Number(e.target.value) })}
            />
          </fieldset>
          <div className="setting-row">
            <div>
              <label htmlFor="motion">Motion level</label>
              <p>Your device’s reduced-motion setting always comes first.</p>
            </div>
            <select
              id="motion"
              value={p.motion}
              onChange={(e) =>
                set({ motion: e.target.value as Preferences["motion"] })
              }
            >
              <option value="cinematic">Cinematic</option>
              <option value="balanced">Balanced</option>
              <option value="minimal">Minimal</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div className="setting-row">
            <div>
              <label htmlFor="text-size">Text size</label>
              <p>A little more room to read.</p>
            </div>
            <select
              id="text-size"
              value={p.textSize}
              onChange={(e) =>
                set({ textSize: e.target.value as Preferences["textSize"] })
              }
            >
              <option value="standard">Standard</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="setting-row">
            <div>
              <label htmlFor="companion">Your potato companion</label>
              <p>A friendly face, whenever you’d like.</p>
            </div>
            <input
              id="companion"
              type="checkbox"
              checked={p.companion}
              onChange={(e) => set({ companion: e.target.checked })}
            />
          </div>
          <div className="settings-footer">
            <button
              className="button secondary"
              onClick={() => {
                reset();
                setNotice("Appearance reset to the original Sage theme.");
              }}
            >
              <RotateCcw size={16} />
              Reset appearance
            </button>
            {auth.message &&
              !/^(Saved|Saving|Profile saved|Bookmark saved)/.test(
                auth.message,
              ) && (
                <button
                  className="text-link"
                  onClick={() => void auth.reload()}
                >
                  Reload saved account settings
                </button>
              )}
            <p role="status">
              {auth.message ||
                notice ||
                (auth.account
                  ? "Changes save to your account."
                  : "Changes save automatically on this device.")}
            </p>
          </div>
        </fieldset>
      </div>
      <aside className="settings-preview paper">
        <span className="eyebrow">YOUR LITTLE PREVIEW</span>
        <Botanical className="preview-botanical" />
        <h2>
          A gentler
          <br />
          beginning.
        </h2>
        <p>Small steps, a brighter tomorrow.</p>
        <span className="preview-button">
          Made for you <HeartMark />
        </span>
        <div className="preview-footnote">
          <Check size={16} /> Your colors, throughout TinySteps
        </div>
        <p className="local-note">
          {auth.account
            ? "Your appearance follows your account across devices."
            : "Preferences stay in this browser. Sign in from your profile to save an account appearance."}
        </p>
      </aside>
    </div>
  );
}
function HeartMark() {
  return <Leaf size={16} />;
}
