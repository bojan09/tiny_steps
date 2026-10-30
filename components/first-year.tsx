"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Check, Leaf } from "lucide-react";
import { useAccount } from "./account-provider";
import { usePreferences } from "@/lib/preferences";
import { chapters, copy, chapterForPosition } from "@/lib/first-year/content";

export function FirstYear() {
  const { account, loading, bookmarks, toggleBookmark, message } = useAccount();
  const p = usePreferences((s) => s.preferences);
  const set = usePreferences((s) => s.setPreferences);
  const language = p.firstYearLanguage;
  const t = copy[language];
  const month = p.firstYearMonth;
  const chapter = chapters[month][language];
  const read = p.firstYearRead.includes(month);
  const saved = bookmarks.includes("first-365-days");
  const [unit, setUnit] = useState<"day" | "week">("week");
  const [position, setPosition] = useState("1");
  const monthLabel = (n: number) =>
    n === 0 ? t.beginning : `${t.monthName} ${n}`;
  return (
    <div className="page-content first-year" lang={language}>
      <header className="year-hero paper">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
          <div className="year-language">
            <label htmlFor="year-language">{t.language}</label>
            <select
              id="year-language"
              value={language}
              disabled={loading}
              onChange={(e) =>
                set({ firstYearLanguage: e.target.value as "en" | "mk" })
              }
            >
              <option value="en" lang="en">
                English
              </option>
              <option value="mk" lang="mk">
                Македонски
              </option>
            </select>
          </div>
        </div>
        <div className="year-art">
          <Image
            src="/images/baby.webp"
            alt=""
            fill
            sizes="(max-width:767px) 100vw, 35vw"
            priority
          />
        </div>
      </header>
      <p className="year-context">{t.note}</p>
      <form
        className="year-jump paper"
        onSubmit={(e) => {
          e.preventDefault();
          set({ firstYearMonth: chapterForPosition(Number(position), unit) });
        }}
      >
        <div>
          <label htmlFor="year-unit">
            {language === "en"
              ? "Find a chapter by"
              : "Најдете поглавје според"}
          </label>
          <select
            id="year-unit"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value as "day" | "week");
              setPosition("1");
            }}
          >
            <option value="week">
              {language === "en" ? "Week" : "Недела"}
            </option>
            <option value="day">{language === "en" ? "Day" : "Ден"}</option>
          </select>
        </div>
        <div>
          <label htmlFor="year-position">
            {unit === "week"
              ? language === "en"
                ? "Week number"
                : "Број на недела"
              : language === "en"
                ? "Day number"
                : "Број на ден"}
          </label>
          <input
            id="year-position"
            type="number"
            min={1}
            max={unit === "week" ? 53 : 365}
            step={1}
            required
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <button className="button secondary" disabled={loading}>
          {language === "en" ? "Open chapter" : "Отвори поглавје"}
        </button>
        <p>
          {language === "en"
            ? "Days and weeks open an approximate monthly chapter. Month lengths vary; these are reading guides, not an age assessment."
            : "Деновите и неделите отвораат приближно месечно поглавје. Месеците имаат различна должина; ова се насоки за читање, а не процена на возраста."}
        </p>
      </form>
      <section
        className="year-explorer"
        aria-label={
          language === "en"
            ? "First year exploration"
            : "Истражување на првата година"
        }
      >
        <nav
          className="year-months paper"
          aria-label={
            language === "en" ? "Month navigation" : "Навигација по месеци"
          }
        >
          <label htmlFor="year-month">{t.month}</label>
          <select
            id="year-month"
            value={month}
            disabled={loading}
            onChange={(e) => set({ firstYearMonth: Number(e.target.value) })}
          >
            {chapters.map((_, i) => (
              <option key={i} value={i}>
                {monthLabel(i)}
              </option>
            ))}
          </select>
          <ol>
            {chapters.map((c, i) => (
              <li key={i}>
                <button
                  disabled={loading}
                  aria-current={i === month ? "step" : undefined}
                  onClick={() => set({ firstYearMonth: i })}
                >
                  <span>{monthLabel(i)}</span>
                  <small>{c[language][0]}</small>
                  {p.firstYearRead.includes(i) && (
                    <Check
                      size={16}
                      aria-label={language === "en" ? "Explored" : "Истражено"}
                    />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div>
          <article
            className="year-chapter paper"
            aria-labelledby="year-chapter-title"
          >
            <div className="year-chapter-meta">
              <span className="eyebrow">{monthLabel(month)}</span>
              <Leaf size={24} aria-hidden="true" />
            </div>
            <h2 id="year-chapter-title" aria-live="polite">
              {chapter[0]}
            </h2>
            <h3>{chapter[1]}</h3>
            <p>{chapter[2]}</p>
            <aside className="year-reflection">
              <p className="eyebrow">{t.reflection}</p>
              <p>{chapter[3]}</p>
              <small>{t.noNotes}</small>
            </aside>
            <div className="year-controls">
              <button
                className="button primary"
                disabled={loading}
                aria-pressed={read}
                onClick={() =>
                  set({
                    firstYearRead: read
                      ? p.firstYearRead.filter((n) => n !== month)
                      : [...p.firstYearRead, month],
                  })
                }
              >
                {read && <Check size={16} aria-hidden="true" />}
                {read ? t.unread : t.read}
              </button>
              <button
                className="button secondary"
                disabled={loading}
                aria-pressed={saved}
                onClick={() => toggleBookmark("first-365-days")}
              >
                <Bookmark size={16} aria-hidden="true" />
                {saved ? t.remove : t.save}
              </button>
            </div>
            <p className="field-help" role="status">
              {p.firstYearRead.length} / 13 {t.progress}
            </p>
            <progress
              value={p.firstYearRead.length}
              max={13}
              aria-label={t.progress}
            />
            <p className="field-help">
              {t.progressNote} {account ? t.account : t.guest}
            </p>
            {message && <p role="status">{message}</p>}
          </article>
          <nav
            className="year-pagination"
            aria-label={
              language === "en"
                ? "Chapter navigation"
                : "Навигација низ поглавјата"
            }
          >
            <button
              className="button secondary"
              disabled={loading || month === 0}
              onClick={() => set({ firstYearMonth: month - 1 })}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {t.previous}
            </button>
            <button
              className="button secondary"
              disabled={loading || month === 12}
              onClick={() => set({ firstYearMonth: month + 1 })}
            >
              {t.next}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </nav>
          <section
            className="year-sources paper"
            aria-labelledby="year-sources-title"
          >
            <h2 id="year-sources-title">{t.sources}</h2>
            <p>{t.sourceNote}</p>
            <ul>
              <li>
                <a href="https://www.cdc.gov/act-early/milestones/index.html">
                  {t.cdc}
                </a>
              </li>
              <li>
                <a href="https://www.nhs.uk/baby/babys-development/">{t.nhs}</a>
              </li>
            </ul>
            <Link className="text-link" href="/care-academy">
              {t.explore}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </section>
    </div>
  );
}
