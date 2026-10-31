"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { useAccount } from "./account-provider";
import { lessonById, learningPaths, lessonHref } from "@/lib/learning/content";
import { lessonIds, type LessonId } from "@/lib/learning/model";
import { LearningCompanion } from "./learning-companion";

const steps = ["Understand", "Compare", "Carry it forward"];
export function LearningLesson({ id }: { id: LessonId }) {
  const lesson = lessonById(id)!;
  const p = usePreferences((s) => s.preferences),
    set = usePreferences((s) => s.setPreferences);
  const { loading, message, account } = useAccount();
  useEffect(() => {
    if (loading) return;
    // Let the account provider attach its revisioned save subscription first.
    const timer = setTimeout(() => {
      const current = usePreferences.getState().preferences;
      if (current.activeLearningLesson === id && current.learningProgress[id])
        return;
      set({
        activeLearningLesson: id,
        learningProgress: {
          ...current.learningProgress,
          [id]: current.learningProgress[id] || { step: 0, completed: false },
        },
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [id, loading, set]);
  const state = p.learningProgress[id];
  const step = state?.step || 0;
  const [choice, setChoice] = useState<"avoid" | "safer" | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const path = learningPaths.find((path) => path.ids.includes(id))!;
  const next = lessonIds[lessonIds.indexOf(id) + 1];
  function save(targetStep: number, completed = state?.completed || false) {
    set({
      activeLearningLesson: id,
      learningProgress: {
        ...usePreferences.getState().preferences.learningProgress,
        [id]: { step: targetStep, completed },
      },
    });
    requestAnimationFrame(() => heading.current?.focus());
  }
  return (
    <div className="page-content lesson-page">
      <Link className="text-link" href="/care-academy">
        <ArrowLeft size={16} aria-hidden="true" />
        Learning Studio
      </Link>
      <header className="page-heading">
        <p className="eyebrow">{path.title}</p>
        <h1>{lesson.title}</h1>
        <p>One topic, three small steps. Pause whenever you need.</p>
      </header>
      <nav className="lesson-step-nav" aria-label="Lesson steps">
        {steps.map((title, i) => (
          <button
            className="button secondary"
            disabled={loading}
            key={title}
            aria-current={step === i ? "step" : undefined}
            onClick={() => save(i)}
          >
            {i + 1}. {title}
          </button>
        ))}
      </nav>
      <article className="lesson-panel paper" aria-busy={loading}>
        <p className="eyebrow">STEP {step + 1} OF 3</p>
        <h2 ref={heading} tabIndex={-1}>
          {steps[step]}
        </h2>
        {loading ? (
          <p role="status">Loading your lesson…</p>
        ) : step === 0 ? (
          <>
            <p className="lesson-objective">
              <strong>Your focus: </strong>
              {lesson.action}
            </p>
            <div className="nest-comparison">
              <div className="nest-avoid">
                <h3>Avoid</h3>
                <p>{lesson.avoid}</p>
              </div>
              <div className="nest-safer">
                <h3>Reduce risk</h3>
                <p>{lesson.safer}</p>
              </div>
            </div>
            <p>
              Read the source in context. These examples are general education,
              not a full safety assessment or medical advice.
            </p>
          </>
        ) : step === 1 ? (
          <>
            <p id="lesson-practice-question">
              Which routine reduces the risk in this example? You can compare
              both responses or continue without answering. There is no score.
            </p>
            <div
              className="nest-practice-options"
              role="group"
              aria-labelledby="lesson-practice-question"
            >
              {(["avoid", "safer"] as const).map((value) => (
                <button
                  key={value}
                  className="button secondary"
                  aria-pressed={choice === value}
                  onClick={() => setChoice(value)}
                >
                  {lesson[value]}
                </button>
              ))}
            </div>
            <p className="lesson-feedback" role="status">
              {choice === "safer"
                ? "This is the risk-reducing approach in the example. Keep the source and your local guidance in mind."
                : choice === "avoid"
                  ? "This routine retains the hazard. Compare it with this alternative: " +
                    lesson.safer
                  : ""}
            </p>
            <details>
              <summary>Read the comparison without choosing</summary>
              <p>
                <strong>Avoid: </strong>
                {lesson.avoid}
              </p>
              <p>
                <strong>Reduce risk: </strong>
                {lesson.safer}
              </p>
            </details>
          </>
        ) : (
          <>
            <p className="lesson-objective">{lesson.action}</p>
            <p>
              Think about what you would like to discuss with another caregiver
              or qualified professional. No private notes need to be entered
              here.
            </p>
            <p>
              This lesson’s progress records your reading and reflection. It
              does not record a child’s abilities or certify that a hazard has
              been resolved.
            </p>
            <button
              className="button primary"
              onClick={() => save(2, !state?.completed)}
              aria-pressed={state?.completed || false}
            >
              {state?.completed && <Check size={16} aria-hidden="true" />}
              {state?.completed
                ? "Mark lesson as not explored"
                : "Mark lesson as explored"}
            </button>
            {state?.completed && (
              <p role="status">
                Lesson explored. You can revisit it whenever you like.
              </p>
            )}
          </>
        )}
        <div className="lesson-source">
          <a className="text-link" href={lesson.source.url}>
            Source: {lesson.source.title}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <p className="field-help">
            {lesson.source.jurisdiction} · {lesson.source.sourceDate} · Content
            reviewed 31 October 2026.
          </p>
        </div>
        <nav className="lesson-controls" aria-label="Move through lesson">
          <button
            className="button secondary"
            disabled={loading || step === 0}
            onClick={() => save(step - 1)}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Previous step
          </button>
          {step < 2 ? (
            <button
              className="button primary"
              disabled={loading}
              onClick={() => save(step + 1)}
            >
              Continue
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : next ? (
            <Link className="button secondary" href={lessonHref(next)}>
              Next lesson
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <Link className="button secondary" href="/learning-map">
              Return to Learning Map
            </Link>
          )}
        </nav>
        <p className="field-help">
          {account
            ? "Learning choices use your account settings."
            : "Guest learning choices stay in this browser."}
        </p>
        {message && <p role="status">{message}</p>}
      </article>
      <LearningCompanion
        message={
          step === 0
            ? "Notice the contrast, then read the source. You can take this one step at a time."
            : step === 1
              ? "There is room to compare and reconsider. This practice is for learning, not a test of you."
              : "A question to share is a useful next step. Mark this lesson explored only when you choose."
        }
      />
    </div>
  );
}
