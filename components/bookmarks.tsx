"use client";
import { Localize, useTranslate } from "@/components/localize";
import Link from "next/link";
import { useAccount } from "./account-provider";
import { Bookmark, Check } from "lucide-react";
import { destinations } from "@/lib/navigation";
import { Icon } from "./icons";
export function Bookmarks() {
  const localeText = useTranslate();
  const {
    bookmarks: saved,
    loading,
    account,
    toggleBookmark: toggle,
  } = useAccount();
  const ready = !loading;
  return (
    <>
      <p className="release-note">
        <Localize>{"Save a collection to return to it easily."}</Localize>
        <Localize> </Localize>
        <Localize>
          {account
            ? "Bookmarks are saved to your account."
            : "Bookmarks are stored on this device."}
        </Localize>
      </p>
      <div className="bookmark-list">
        {destinations.slice(1, 8).map((d) => (
          <div className="paper bookmark-item" key={d.id}>
            <Link href={d.href}>
              <Icon name={d.icon} />
              <Localize>{d.title}</Localize>
            </Link>
            <button
              disabled={!ready}
              aria-label={localeText(
                (saved.includes(d.id) ? "Remove " : "Save ") + d.title,
              )}
              aria-pressed={saved.includes(d.id)}
              onClick={() => toggle(d.id)}
            >
              <Localize>
                {saved.includes(d.id) ? (
                  <Check size={20} />
                ) : (
                  <Bookmark size={20} />
                )}
              </Localize>
            </button>
          </div>
        ))}
      </div>
      <p className="field-help" role="status">
        <Localize>{saved.length}</Localize>
        <Localize>{" saved collections"}</Localize>
      </p>
    </>
  );
}
