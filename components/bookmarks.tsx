"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { destinations } from "@/lib/navigation";
import { Icon } from "./icons";
import { browserStorage } from "@/lib/browser-storage";
export function Bookmarks() {
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let values: string[] = [];
    try {
      const raw = JSON.parse(
        browserStorage.getItem("tinysteps-bookmarks-v1") || "[]",
      );
      if (Array.isArray(raw))
        values = raw.filter(
          (v: unknown) =>
            typeof v === "string" && destinations.some((d) => d.id === v),
        );
    } catch {}
    queueMicrotask(() => {
      setSaved(values);
      setReady(true);
    });
  }, []);
  function toggle(id: string) {
    const next = saved.includes(id)
      ? saved.filter((v) => v !== id)
      : [...saved, id];
    setSaved(next);
    try {
      browserStorage.setItem("tinysteps-bookmarks-v1", JSON.stringify(next));
    } catch {}
  }
  return (
    <>
      <p className="release-note">
        Save a collection to return to it easily. Bookmarks are stored on this
        device.
      </p>
      <div className="bookmark-list">
        {destinations.slice(1, 8).map((d) => (
          <div className="paper bookmark-item" key={d.id}>
            <Link href={d.href}>
              <Icon name={d.icon} />
              {d.title}
            </Link>
            <button
              disabled={!ready}
              aria-label={
                (saved.includes(d.id) ? "Remove " : "Save ") + d.title
              }
              aria-pressed={saved.includes(d.id)}
              onClick={() => toggle(d.id)}
            >
              {saved.includes(d.id) ? (
                <Check size={20} />
              ) : (
                <Bookmark size={20} />
              )}
            </button>
          </div>
        ))}
      </div>
      <p className="field-help" role="status">
        {saved.length} saved collections
      </p>
    </>
  );
}
