"use client";
import Link from "next/link";
import { ArrowRight, Check, Circle, BookOpen } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { useAccount } from "./account-provider";
import {
  learningPaths,
  lessonById,
  lessonHref,
  nextLearningLesson,
} from "@/lib/learning/content";
import { lessonIds, lessonStatus } from "@/lib/learning/model";
import { LearningCompanion } from "./learning-companion";
import { StillLife } from "./art";

export function LearningStudio({
  map = false,
  companion = false,
}: {
  map?: boolean;
  companion?: boolean;
}) {
  const p = usePreferences((s) => s.preferences);
  const { loading, account, message } = useAccount();
  const next = nextLearningLesson(p.learningProgress, p.activeLearningLesson);
  const explored = lessonIds.filter(
    (id) => p.learningProgress[id]?.completed,
  ).length;
  return (
    <div className="page-content learning-studio">
      <header className="studio-hero paper">
        <div>
          <p className="eyebrow">LEARN, NOTICE, RETURN</p>
          <h1>
            {map
              ? "Your Learning Map"
              : companion
                ? "Your learning companion"
                : "Care Academy"}
          </h1>
          <p>
            {map
              ? "Four connected paths. Follow an order or choose the question that matters today."
              : companion
                ? "Sprout helps you find your place in reviewed learning. Guidance is built into the lessons; no questions are sent to an AI service."
                : "Welcome to the Learning Studio. Twelve guided lessons turn reviewed safety topics into small moments of learning."}
          </p>
          {loading ? (
            <p role="status">Loading your learning choices…</p>
          ) : (
            <>
              <Link className="button primary" href={lessonHref(next)}>
                {p.learningProgress[next]
                  ? "Return to your lesson"
                  : "Start a lesson"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <p className="field-help">
                {explored} / 12 lessons explored ·{" "}
                {account
                  ? "Uses your account settings"
                  : "Choices stay in this browser"}
              </p>
            </>
          )}
          <p className="field-help">
            Explored records your learning, never care proficiency or a home’s
            safety.
          </p>
          <Link className="text-link" href="/care-academy/getting-started">
            {map
              ? "Revisit the app introduction"
              : "New here? Begin your introduction"}
          </Link>
        </div>
        <div className="studio-art" aria-hidden="true">
          <StillLife kind="care" />
        </div>
      </header>
      {message && (
        <p className="release-note" role="status">
          {message}
        </p>
      )}
      <LearningCompanion />
      <nav className="studio-view-links" aria-label="Learning views">
        <Link href="/care-academy">Learning Studio</Link>
        <Link href="/learning-map">Learning Map</Link>
        <Link href="/ai-assistant">Companion guidance</Link>
      </nav>
      <div
        className={map ? "learning-paths learning-paths-map" : "learning-paths"}
      >
        {learningPaths.map((path, i) => (
          <section
            className="learning-path paper"
            key={path.id}
            aria-labelledby={"path-" + path.id}
          >
            <div className="learning-path-heading">
              <span className="studio-path-number" aria-hidden="true">
                0{i + 1}
              </span>
              <div>
                <h2 id={"path-" + path.id}>{path.title}</h2>
                <p>{path.note}</p>
              </div>
            </div>
            <ol>
              {path.ids.map((id) => {
                const state = loading ? undefined : p.learningProgress[id];
                return (
                  <li key={id} data-status={lessonStatus(state)}>
                    <span className="path-node" aria-hidden="true">
                      {state?.completed ? (
                        <Check size={18} />
                      ) : state ? (
                        <BookOpen size={18} />
                      ) : (
                        <Circle size={18} />
                      )}
                    </span>
                    <Link href={lessonHref(id)}>
                      <strong>{lessonById(id)?.title}</strong>
                      <span>{loading ? "Loading…" : lessonStatus(state)}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <p className="field-help">
              {loading
                ? "Loading…"
                : `${path.ids.filter((id) => p.learningProgress[id]?.completed).length} of 3 explored`}
            </p>
          </section>
        ))}
      </div>
      <p className="release-note">
        These twelve lessons use the sourced SafeNest material. The broader
        eight-collection, 64-lesson curriculum is a separate content delivery.{" "}
        <Link href="/safenest">Explore the room-by-room references</Link>.
      </p>
    </div>
  );
}
