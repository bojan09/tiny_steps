"use client";
import { Localize, useTranslate } from "@/components/localize";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Bookmark, Check, ArrowRight, BookOpen } from "lucide-react";
import { safetyLessons } from "@/lib/safenest/lessons";
import { SafeNestLesson } from "./safenest-lesson";
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
  const localeText = useTranslate();
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
          <p className="eyebrow">
            <Localize>{"A HOME FOR THOUGHTFUL LEARNING"}</Localize>
          </p>
          <h1>
            <Localize>{"SafeNest"}</Localize>
          </h1>
          <p>
            <Localize>
              {
                "Explore everyday hazards, compare routines, and choose a small action to reduce risk."
              }
            </Localize>
          </p>
        </div>
        <button
          className="button secondary"
          disabled={loading}
          aria-pressed={saved}
          onClick={() => toggleBookmark("safenest")}
        >
          <Bookmark size={16} aria-hidden="true" />
          <Localize>{saved ? "Remove SafeNest" : "Save SafeNest"}</Localize>
        </button>
      </header>
      <div className="nest-intro paper">
        <div>
          <h2>
            <Localize>{"Start with a room."}</Localize>
          </h2>
          <p>
            <Localize>
              {
                "Learn from sourced safety comparisons and keep track of references you review. These examples do not inspect or certify your home. Follow local guidance and product instructions when applying them."
              }
            </Localize>
          </p>
          <p className="field-help">
            <Localize>
              {
                "Reviewed means you read a reference\u2014not that a hazard has been resolved. This is not a complete home-safety checklist."
              }
            </Localize>
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
              alt={localeText("Sprout, your learning companion")}
              width={75}
              height={88}
            />
            <p>
              <Localize>
                {room.id === "bathroom"
                  ? "Stay close throughout bath time. Prepare what you need before you begin."
                  : room.id === "kitchen"
                    ? "A shared routine helps everyone know who is staying beside your child."
                    : room.id === "nursery"
                      ? "A clear sleep space and a shared routine are thoughtful places to begin."
                      : "Think about what a child could reach now, and what they may reach next."}
              </Localize>
            </p>
          </motion.aside>
        )}
      </div>
      <div className="nest-layout">
        <section
          className="nest-map-panel paper"
          aria-labelledby="nest-map-title"
        >
          <h2 id="nest-map-title">
            <Localize>{"Your learning map"}</Localize>
          </h2>
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
                aria-label={localeText("Explore " + r.title)}
                aria-pressed={room.id === r.id}
                aria-controls="nest-room-panel"
                onClick={() => selectRoom(r.id)}
              >
                <Localize>{i + 1}</Localize>
              </button>
            ))}
          </div>
          <p className="field-help">
            <Localize>
              {
                "Decorative map for navigation, not a safety demonstration. The same rooms are listed below."
              }
            </Localize>
          </p>
          <nav className="nest-room-list" aria-label={localeText("Rooms")}>
            {rooms.map((r, i) => (
              <button
                key={r.id}
                disabled={loading}
                aria-pressed={room.id === r.id}
                aria-controls="nest-room-panel"
                onClick={() => selectRoom(r.id)}
              >
                <span aria-hidden="true">
                  0<Localize>{i + 1}</Localize>
                </span>
                <Localize>{r.title}</Localize>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ))}
          </nav>
          <div className="nest-summary" role="status">
            <strong>
              <Localize>{reviewed}</Localize> /{" "}
              <Localize>{topicIds.length}</Localize>
              <Localize>{" references reviewed"}</Localize>
            </strong>
            <p>
              <Localize>{followUp}</Localize>
              <Localize>{" marked for follow-up"}</Localize>
            </p>
          </div>
          <p className="field-help">
            <Localize>
              {account
                ? "Review choices use your account settings."
                : "Guest review choices stay in this browser."}
            </Localize>
          </p>
        </section>
        <section
          id="nest-room-panel"
          className="nest-room-panel"
          aria-labelledby="nest-room-title"
        >
          <header>
            <p className="eyebrow">
              <Localize>{"ROOM BY ROOM, AT YOUR OWN PACE"}</Localize>
            </p>
            <h2
              id="nest-room-title"
              aria-live="polite"
              tabIndex={-1}
              ref={roomHeading}
            >
              <Localize>{room.title}</Localize>
            </h2>
            <p>
              <Localize>{room.subtitle}</Localize>
            </p>
          </header>
          <div className="nest-topics">
            {room.topics.map((topic) => (
              <article className="nest-topic paper" key={topic.id}>
                <h3>
                  <BookOpen size={20} aria-hidden="true" />
                  <Localize>{topic.title}</Localize>
                </h3>
                <SafeNestLesson
                  lesson={safetyLessons[topic.id]}
                  id={topic.id}
                  title={localeText(topic.title)}
                />
                <details>
                  <summary>
                    <Localize>{"A question to take with you"}</Localize>
                  </summary>
                  <p>
                    <Localize>{topic.question}</Localize>
                  </p>
                  <p className="field-help">
                    <Localize>
                      {
                        "No private notes or home details need to be entered here."
                      }
                    </Localize>
                  </p>
                </details>
                <div className="nest-topic-controls">
                  <div>
                    <label htmlFor={"nest-status-" + topic.id}>
                      <Localize>{"Review status: "}</Localize>
                      <Localize>{topic.title}</Localize>
                    </label>
                    <select
                      id={"nest-status-" + topic.id}
                      value={p.safeNestChecks[topic.id] || ""}
                      disabled={loading}
                      onChange={(e) => setStatus(topic.id, e.target.value)}
                    >
                      <option value="">
                        <Localize>{"Not started"}</Localize>
                      </option>
                      <option value="follow-up">
                        <Localize>{"Needs follow-up"}</Localize>
                      </option>
                      <option value="reviewed">
                        <Localize>{"Reference reviewed"}</Localize>
                      </option>
                    </select>
                  </div>
                </div>
                <Localize>
                  {p.safeNestChecks[topic.id] === "reviewed" && (
                    <p className="field-help">
                      <Check size={14} aria-hidden="true" />
                      <Localize>
                        {
                          " Reference review recorded. This does not verify the room\u2019s safety."
                        }
                      </Localize>
                    </p>
                  )}
                </Localize>
              </article>
            ))}
          </div>
          <Localize>
            {message && (
              <p role="status">
                <Localize>{message}</Localize>
              </p>
            )}
          </Localize>
          <aside className="nest-guidance paper">
            <h3>
              <Localize>{"Use guidance that fits your home"}</Localize>
            </h3>
            <p>
              <Localize>
                {
                  "Sources identify their country and review date where available. Local requirements and individual circumstances may differ. This is general education, not medical advice or a complete home inspection. For an emergency, contact local emergency services; do not rely on this learning page."
                }
              </Localize>
            </p>
            <a className="text-link" href={safetyReference.url}>
              <Localize>{safetyReference.title}</Localize>
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link className="text-link" href="/my-journey">
              <Localize>{"Your learning journey"}</Localize>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </section>
      </div>
    </div>
  );
}
