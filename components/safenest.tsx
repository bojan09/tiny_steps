"use client";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Bookmark, Check, ArrowRight, BookOpen } from "lucide-react";
import { rooms, safetyReference } from "@/lib/safenest/content";
import {
  type TopicId,
  type ReviewState,
  type RoomId,
  topicIds,
} from "@/lib/safenest/model";
import { usePreferences } from "@/lib/preferences";
import { useAccount } from "./account-provider";

export function SafeNest() {
  const { account, loading, bookmarks, toggleBookmark, message } = useAccount();
  const p = usePreferences((s) => s.preferences);
  const set = usePreferences((s) => s.setPreferences);
  const reduced = useReducedMotion();
  const animate = !reduced && ["balanced", "cinematic"].includes(p.motion);
  const room = rooms.find((r) => r.id === p.safeNestRoom)!;
  const reviewed = Object.values(p.safeNestChecks).filter(
    (s) => s === "reviewed",
  ).length;
  const followUp = Object.values(p.safeNestChecks).filter(
    (s) => s === "follow-up",
  ).length;
  const saved = bookmarks.includes("safenest");
  const roomHeading = useRef<HTMLHeadingElement>(null);
  function selectRoom(id: RoomId) {
    set({ safeNestRoom: id });
    requestAnimationFrame(() => {
      roomHeading.current?.focus({ preventScroll: true });
      roomHeading.current?.scrollIntoView({
        behavior: animate ? "smooth" : "auto",
        block: "start",
      });
    });
  }
  function setStatus(id: TopicId, value: string) {
    const next = { ...usePreferences.getState().preferences.safeNestChecks };
    if (value === "") delete next[id];
    else next[id] = value as ReviewState;
    set({ safeNestChecks: next });
  }
  return (
    <div className="page-content nest-page">
      <header className="nest-header">
        <div>
          <p className="eyebrow">A HOME FOR THOUGHTFUL LEARNING</p>
          <h1>SafeNest</h1>
          <p>
            Explore one room, find the guidance you need, and make space for
            your questions.
          </p>
        </div>
        <button
          className="button secondary"
          disabled={loading}
          aria-pressed={saved}
          onClick={() => toggleBookmark("safenest")}
        >
          <Bookmark size={16} aria-hidden="true" />
          {saved ? "Remove SafeNest" : "Save SafeNest"}
        </button>
      </header>
      <div className="nest-intro paper">
        <div>
          <h2>Start with a room.</h2>
          <p>
            This is a reference-review planner. It does not inspect your home or
            certify it as safe. Check current guidance and product instructions;
            ask a qualified professional when you need help applying them.
          </p>
          <p className="field-help">
            Reviewed means you read a reference—not that a hazard has been
            resolved. This is not a complete home-safety checklist.
          </p>
        </div>
        {p.companion && (
          <motion.aside
            className="nest-companion"
            animate={animate ? { y: [0, -4, 0] } : undefined}
            transition={{ duration: 5, repeat: 2, ease: "easeInOut" }}
          >
            <Image
              src="/images/potato.webp"
              alt="Sprout, your learning companion"
              width={75}
              height={88}
            />
            <p>
              One question at a time. There is room to pause and ask for help.
            </p>
          </motion.aside>
        )}
      </div>
      <div className="nest-layout">
        <section
          className="nest-map-panel paper"
          aria-labelledby="nest-map-title"
        >
          <h2 id="nest-map-title">Your learning map</h2>
          <div className="nest-map">
            <Image
              src="/images/house.webp"
              alt=""
              fill
              sizes="(max-width:767px) 100vw, 40vw"
            />
            {rooms.map((r, i) => (
              <button
                key={r.id}
                className={"nest-marker nest-marker-" + i}
                disabled={loading}
                aria-label={"Explore " + r.title}
                aria-pressed={room.id === r.id}
                aria-controls="nest-room-panel"
                onClick={() => selectRoom(r.id)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="field-help">
            Decorative map for navigation, not a safety demonstration. The same
            rooms are listed below.
          </p>
          <nav className="nest-room-list" aria-label="Rooms">
            {rooms.map((r, i) => (
              <button
                key={r.id}
                disabled={loading}
                aria-pressed={room.id === r.id}
                aria-controls="nest-room-panel"
                onClick={() => selectRoom(r.id)}
              >
                <span aria-hidden="true">0{i + 1}</span>
                {r.title}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ))}
          </nav>
          <div className="nest-summary" role="status">
            <strong>
              {reviewed} / {topicIds.length} references reviewed
            </strong>
            <p>{followUp} marked for follow-up</p>
          </div>
          <p className="field-help">
            {account
              ? "Review choices use your account settings."
              : "Guest review choices stay in this browser."}
          </p>
        </section>
        <section
          id="nest-room-panel"
          className="nest-room-panel"
          aria-labelledby="nest-room-title"
        >
          <header>
            <p className="eyebrow">ROOM BY ROOM, AT YOUR OWN PACE</p>
            <h2
              id="nest-room-title"
              aria-live="polite"
              tabIndex={-1}
              ref={roomHeading}
            >
              {room.title}
            </h2>
            <p>{room.subtitle}</p>
          </header>
          <div className="nest-topics">
            {room.topics.map((topic) => (
              <article className="nest-topic paper" key={topic.id}>
                <h3>
                  <BookOpen size={20} aria-hidden="true" />
                  {topic.title}
                </h3>
                <p>{topic.prompt}</p>
                <details>
                  <summary>A question to take with you</summary>
                  <p>{topic.question}</p>
                  <p className="field-help">
                    No private notes or home details need to be entered here.
                  </p>
                </details>
                <div className="nest-topic-controls">
                  <a className="text-link" href={safetyReference.url}>
                    Read NHS safety guidance{" "}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                  <div>
                    <label htmlFor={"nest-status-" + topic.id}>
                      Review status: {topic.title}
                    </label>
                    <select
                      id={"nest-status-" + topic.id}
                      value={p.safeNestChecks[topic.id] || ""}
                      disabled={loading}
                      onChange={(e) => setStatus(topic.id, e.target.value)}
                    >
                      <option value="">Not started</option>
                      <option value="follow-up">Needs follow-up</option>
                      <option value="reviewed">Reference reviewed</option>
                    </select>
                  </div>
                </div>
                {p.safeNestChecks[topic.id] === "reviewed" && (
                  <p className="field-help">
                    <Check size={14} aria-hidden="true" /> Reference review
                    recorded. This does not verify the room’s safety.
                  </p>
                )}
              </article>
            ))}
          </div>
          {message && <p role="status">{message}</p>}
          <aside className="nest-guidance paper">
            <h3>Use guidance that fits your home</h3>
            <p>
              The external NHS resource provides general UK information. Local
              guidance, product instructions and individual circumstances may
              differ. This planner does not replace professional advice,
              supervision or emergency services.
            </p>
            <a className="text-link" href={safetyReference.url}>
              {safetyReference.title}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link className="text-link" href="/my-journey">
              Your learning journey
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </section>
      </div>
    </div>
  );
}
