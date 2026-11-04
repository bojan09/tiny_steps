"use client";
import { Localize } from "@/components/localize";
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
            <h2>
              <Localize>{"Make yourself at home"}</Localize>
            </h2>
            <p>
              <Localize>{"Little changes, a different feeling."}</Localize>
            </p>
          </div>
        </div>
        <fieldset className="settings-controls" disabled={auth.loading}>
          <div className="setting-row">
            <div>
              <label htmlFor="app-language">
                <Localize>{"App language"}</Localize>
              </label>
              <p>
                <Localize>
                  {"Choose English or Macedonian throughout TinySteps."}
                </Localize>
              </p>
            </div>
            <select
              id="app-language"
              value={p.language}
              onChange={(e) =>
                set({
                  language: e.target.value as "en" | "mk",
                  firstYearLanguage: e.target.value as "en" | "mk",
                })
              }
            >
              <option value="en">
                <Localize>{"English"}</Localize>
              </option>
              <option value="mk">Македонски</option>
            </select>
          </div>
          <fieldset>
            <legend>
              <Localize>{"Your palette"}</Localize>
            </legend>
            <p className="field-help">
              <Localize>
                {"Choose the colors that feel most like you."}
              </Localize>
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
                  <strong>
                    <Localize>
                      {theme[0].toUpperCase() + theme.slice(1)}
                    </Localize>
                  </strong>
                  <small>
                    <Localize>{descriptions[i]}</Localize>
                  </small>
                  <Localize>
                    {p.theme === theme && (
                      <Check className="theme-check" size={15} />
                    )}
                  </Localize>
                </button>
              ))}
            </div>
          </fieldset>
          <Localize>
            {p.theme === "custom" && (
              <div className="custom-color">
                <label htmlFor="custom-color">
                  <Localize>{"Your accent color"}</Localize>
                </label>
                <input
                  id="custom-color"
                  type="color"
                  value={p.customColor}
                  onChange={(e) => set({ customColor: e.target.value })}
                />
                <span>
                  <Localize>{p.customColor.toUpperCase()}</Localize>
                </span>
                <p className="field-help">
                  <Localize>
                    {
                      "We adjust the shade for readable text in light and dark mode."
                    }
                  </Localize>
                </p>
              </div>
            )}
          </Localize>
          <fieldset>
            <legend>
              <Localize>{"A light for every moment"}</Localize>
            </legend>
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
                    <Localize>
                      {mode === "system"
                        ? "Auto"
                        : mode[0].toUpperCase() + mode.slice(1)}
                    </Localize>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <Localize>{"Set the scene"}</Localize>
            </legend>
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
                    <Localize>
                      {background === "botanical" ? <Botanical /> : null}
                    </Localize>
                  </span>
                  <strong>
                    <Localize>
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
                    </Localize>
                  </strong>
                  <Localize>
                    {p.background === background && <Check size={16} />}
                  </Localize>
                </button>
              ))}
            </div>
            <label className="range-label" htmlFor="intensity">
              <Localize>{"Background intensity "}</Localize>
              <output>
                <Localize>{p.intensity}</Localize>%
              </output>
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
              <label htmlFor="motion">
                <Localize>{"Motion level"}</Localize>
              </label>
              <p>
                <Localize>
                  {
                    "Your device\u2019s reduced-motion setting always comes first."
                  }
                </Localize>
              </p>
            </div>
            <select
              id="motion"
              value={p.motion}
              onChange={(e) =>
                set({ motion: e.target.value as Preferences["motion"] })
              }
            >
              <option value="cinematic">
                <Localize>{"Cinematic"}</Localize>
              </option>
              <option value="balanced">
                <Localize>{"Balanced"}</Localize>
              </option>
              <option value="minimal">
                <Localize>{"Minimal"}</Localize>
              </option>
              <option value="off">
                <Localize>{"Off"}</Localize>
              </option>
            </select>
          </div>
          <div className="setting-row">
            <div>
              <label htmlFor="text-size">
                <Localize>{"Text size"}</Localize>
              </label>
              <p>
                <Localize>{"A little more room to read."}</Localize>
              </p>
            </div>
            <select
              id="text-size"
              value={p.textSize}
              onChange={(e) =>
                set({ textSize: e.target.value as Preferences["textSize"] })
              }
            >
              <option value="standard">
                <Localize>{"Standard"}</Localize>
              </option>
              <option value="large">
                <Localize>{"Large"}</Localize>
              </option>
            </select>
          </div>
          <div className="setting-row">
            <div>
              <label htmlFor="companion">
                <Localize>{"Your potato companion"}</Localize>
              </label>
              <p>
                <Localize>
                  {"A friendly face, whenever you\u2019d like."}
                </Localize>
              </p>
            </div>
            <input
              id="companion"
              type="checkbox"
              checked={p.companion}
              onChange={(e) => set({ companion: e.target.checked })}
            />
          </div>
          <section className="notification-info">
            <h3>
              <Localize>{"Notifications"}</Localize>
            </h3>
            <p>
              <Localize>
                {
                  "Push notifications are not available in this release. TinySteps will not request notification permission."
                }
              </Localize>
            </p>
          </section>
          <div className="settings-footer">
            <button
              className="button secondary"
              onClick={() => {
                reset();
                setNotice("Appearance reset to the original Sage theme.");
              }}
            >
              <RotateCcw size={16} />
              <Localize>{"Reset appearance"}</Localize>
            </button>
            <Localize>
              {auth.message &&
                !/^(Saved|Saving|Profile saved|Bookmark saved)/.test(
                  auth.message,
                ) && (
                  <button
                    className="text-link"
                    onClick={() => void auth.reload()}
                  >
                    <Localize>{"Reload saved account settings"}</Localize>
                  </button>
                )}
            </Localize>
            <p role="status">
              <Localize>
                {auth.message ||
                  notice ||
                  (auth.account
                    ? "Changes save to your account."
                    : "Changes save automatically on this device.")}
              </Localize>
            </p>
          </div>
        </fieldset>
      </div>
      <aside className="settings-preview paper">
        <span className="eyebrow">
          <Localize>{"YOUR LITTLE PREVIEW"}</Localize>
        </span>
        <Botanical className="preview-botanical" />
        <h2>
          <Localize>{"A gentler"}</Localize>
          <br />
          <Localize>{"beginning."}</Localize>
        </h2>
        <p>
          <Localize>{"Small steps, a brighter tomorrow."}</Localize>
        </p>
        <span className="preview-button">
          <Localize>{"Made for you "}</Localize>
          <HeartMark />
        </span>
        <div className="preview-footnote">
          <Check size={16} />
          <Localize>{" Your colors, throughout TinySteps"}</Localize>
        </div>
        <p className="local-note">
          <Localize>
            {auth.account
              ? "Your appearance follows your account across devices."
              : "Preferences stay in this browser. Sign in from your profile to save an account appearance."}
          </Localize>
        </p>
      </aside>
    </div>
  );
}
function HeartMark() {
  return <Leaf size={16} />;
}
