/* Full document navigation lets the service worker serve the offline fallback; Next RSC navigation cannot. */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useEffect, useState } from "react";
import { Localize } from "./localize";

export function PwaStatus() {
  const [offline, setOffline] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  useEffect(() => {
    const connection = () => setOffline(!navigator.onLine);
    connection();
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    let stopped = false;
    let registration: ServiceWorkerRegistration | undefined;
    let worker: ServiceWorker | null = null;
    const check = () => {
      if (!stopped) setUpdateReady(!!registration?.waiting);
    };
    const installing = () => {
      worker?.removeEventListener("statechange", check);
      worker = registration?.installing || null;
      worker?.addEventListener("statechange", check);
      check();
    };
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((value) => {
          if (stopped) return;
          registration = value;
          registration.addEventListener("updatefound", installing);
          installing();
        })
        .catch(() => {});
    }
    return () => {
      stopped = true;
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
      registration?.removeEventListener("updatefound", installing);
      worker?.removeEventListener("statechange", check);
    };
  }, []);
  if (!offline && !updateReady) return null;
  return (
    <aside className="connection-notice" aria-label="TinySteps" role="status">
      <Localize>
        {offline
          ? "You’re offline. Account changes cannot be saved. Open the read-only safety guide for prepared content."
          : "An update is ready. Finish saving your work, then close all TinySteps tabs and reopen the app to use it."}
      </Localize>
      {offline && (
        <a href="/offline">
          <Localize>Open offline guide</Localize>
        </a>
      )}
    </aside>
  );
}
