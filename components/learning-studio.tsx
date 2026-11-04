"use client";
import { Localize, useTranslate } from "@/components/localize";
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
  const localeText = useTranslate();
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
          <p className="eyebrow">
            <Localize>{"LEARN, NOTICE, RETURN"}</Localize>
          </p>
          <h1>
            <Localize>
              {map
                ? "Your Learning Map"
                : companion
                  ? "Your learning companion"
                  : "Care Academy"}
            </Localize>
          </h1>
          <p>
            <Localize>
              {map
                ? "Four connected paths. Follow an order or choose the question that matters today."
                : companion
                  ? "Sprout helps you find your place in reviewed learning. Guidance is built into the lessons; no questions are sent to an AI service."
                  : "Welcome to the Learning Studio. Twelve guided lessons turn reviewed safety topics into small moments of learning."}
            </Localize>
          </p>
          <Localize>
            {loading ? (
              <p role="status">
                <Localize>{"Loading your learning choices\u2026"}</Localize>
              </p>
            ) : (
              <>
                <Link className="button primary" href={lessonHref(next)}>
                  <Localize>
                    {p.learningProgress[next]
                      ? "Return to your lesson"
                      : "Start a lesson"}
                  </Localize>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <p className="field-help">
                  <Localize>{explored}</Localize>
                  <Localize>{" / 12 lessons explored \u00B7"}</Localize>
                  <Localize> </Localize>
                  <Localize>
                    {account
                      ? "Uses your account settings"
                      : "Choices stay in this browser"}
                  </Localize>
                </p>
              </>
            )}
          </Localize>
          <p className="field-help">
            <Localize>
              {
                "Explored records your learning, never care proficiency or a home\u2019s safety."
              }
            </Localize>
          </p>
          <Link className="text-link" href="/care-academy/getting-started">
            <Localize>
              {map
                ? "Revisit the app introduction"
                : "New here? Begin your introduction"}
            </Localize>
          </Link>
        </div>
        <div className="studio-art" aria-hidden="true">
          <StillLife kind="care" />
        </div>
      </header>
      <Localize>
        {message && (
          <p className="release-note" role="status">
            <Localize>{message}</Localize>
          </p>
        )}
      </Localize>
      <LearningCompanion />
      <nav
        className="studio-view-links"
        aria-label={localeText("Learning views")}
      >
        <Link href="/care-academy">
          <Localize>{"Learning Studio"}</Localize>
        </Link>
        <Link href="/learning-map">
          <Localize>{"Learning Map"}</Localize>
        </Link>
        <Link href="/ai-assistant">
          <Localize>{"Companion guidance"}</Localize>
        </Link>
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
                0<Localize>{i + 1}</Localize>
              </span>
              <div>
                <h2 id={"path-" + path.id}>
                  <Localize>{path.title}</Localize>
                </h2>
                <p>
                  <Localize>{path.note}</Localize>
                </p>
              </div>
            </div>
            <ol>
              {path.ids.map((id) => {
                const state = loading ? undefined : p.learningProgress[id];
                return (
                  <li key={id} data-status={lessonStatus(state)}>
                    <span className="path-node" aria-hidden="true">
                      <Localize>
                        {state?.completed ? (
                          <Check size={18} />
                        ) : state ? (
                          <BookOpen size={18} />
                        ) : (
                          <Circle size={18} />
                        )}
                      </Localize>
                    </span>
                    <Link href={lessonHref(id)}>
                      <strong>
                        <Localize>{lessonById(id)?.title}</Localize>
                      </strong>
                      <span>
                        <Localize>
                          {loading ? "Loading…" : lessonStatus(state)}
                        </Localize>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <p className="field-help">
              <Localize>
                {loading
                  ? "Loading…"
                  : `${path.ids.filter((id) => p.learningProgress[id]?.completed).length} of 3 explored`}
              </Localize>
            </p>
          </section>
        ))}
      </div>
      <p className="release-note">
        <Localize>
          {
            "These twelve lessons use the sourced SafeNest material. The broader eight-collection, 64-lesson curriculum is a separate content delivery."
          }
        </Localize>
        <Localize> </Localize>
        <Link href="/safenest">
          <Localize>{"Explore the room-by-room references"}</Localize>
        </Link>
        .
      </p>
    </div>
  );
}
