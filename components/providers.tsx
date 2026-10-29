"use client";
import { useEffect, useState } from "react";
import { AccountProvider } from "./account-provider";
import { MotionConfig } from "motion/react";
import { appearanceTokens } from "@/lib/appearance";
import { usePreferences } from "@/lib/preferences";
export function Providers({ children }: { children: React.ReactNode }) {
  const p = usePreferences((s) => s.preferences);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    const warn = () => setStorageWarning(true);
    window.addEventListener("tinysteps-storage-unavailable", warn);
    Promise.resolve(usePreferences.persist.rehydrate()).finally(() =>
      setReady(true),
    );
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production")
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () =>
      window.removeEventListener("tinysteps-storage-unavailable", warn);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const html = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      html.dataset.theme = p.theme;
      html.dataset.mode =
        p.mode === "system" ? (media.matches ? "dark" : "light") : p.mode;
      const tokens = appearanceTokens(p, html.dataset.mode === "dark");
      html.style.setProperty("--accent", tokens.accent);
      html.style.setProperty("--accent-soft", tokens.soft);
      html.style.setProperty("--canvas", tokens.canvas);
      html.dataset.motion = p.motion;
      html.dataset.background = p.background;
      html.dataset.text = p.textSize;
      html.style.setProperty(
        "--background-intensity",
        String(p.intensity / 100),
      );
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [p, ready]);
  return (
    <MotionConfig
      reducedMotion={
        p.motion === "off" || p.motion === "minimal" ? "always" : "user"
      }
    >
      <AccountProvider>{children}</AccountProvider>
      {storageWarning && (
        <div role="status" className="storage-notice">
          Changes work for this visit, but your browser could not save them.
        </div>
      )}
    </MotionConfig>
  );
}
