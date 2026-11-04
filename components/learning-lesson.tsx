"use client";
import { Localize, useTranslate } from "@/components/localize";
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
  const localeText = useTranslate();
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
        <Localize>{"Learning Studio"}</Localize>
      </Link>
      <header className="page-heading">
        <p className="eyebrow">
          <Localize>{path.title}</Localize>
        </p>
        <h1>
          <Localize>{lesson.title}</Localize>
        </h1>
        <p>
          <Localize>
            {"One topic, three small steps. Pause whenever you need."}
          </Localize>
        </p>
      </header>
      <nav className="lesson-step-nav" aria-label={localeText("Lesson steps")}>
        {steps.map((title, i) => (
          <button
            className="button secondary"
            disabled={loading}
            key={title}
            aria-current={step === i ? "step" : undefined}
            onClick={() => save(i)}
          >
            <Localize>{i + 1}</Localize>. <Localize>{title}</Localize>
          </button>
        ))}
      </nav>
      <article className="lesson-panel paper" aria-busy={loading}>
        <p className="eyebrow">
          <Localize>{"STEP "}</Localize>
          <Localize>{step + 1}</Localize>
          <Localize>{" OF 3"}</Localize>
        </p>
        <h2 ref={heading} tabIndex={-1}>
          <Localize>{steps[step]}</Localize>
        </h2>
        {loading && (
          <p role="status">
            <Localize>{"Loading your lesson\u2026"}</Localize>
          </p>
        )}
        {loading || step === 0 ? (
          <>
            <p className="lesson-objective">
              <strong>
                <Localize>{"Your focus: "}</Localize>
              </strong>
              <Localize>{lesson.action}</Localize>
            </p>
            <div className="nest-comparison">
              <div className="nest-avoid">
                <h3>
                  <Localize>{"Avoid"}</Localize>
                </h3>
                <p>
                  <Localize>{lesson.avoid}</Localize>
                </p>
              </div>
              <div className="nest-safer">
                <h3>
                  <Localize>{"Reduce risk"}</Localize>
                </h3>
                <p>
                  <Localize>{lesson.safer}</Localize>
                </p>
              </div>
            </div>
            <p>
              <Localize>
                {
                  "Read the source in context. These examples are general education, not a full safety assessment or medical advice."
                }
              </Localize>
            </p>
          </>
        ) : step === 1 ? (
          <>
            <p id="lesson-practice-question">
              <Localize>
                {
                  "Which routine reduces the risk in this example? You can compare both responses or continue without answering. There is no score."
                }
              </Localize>
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
                  <Localize>{lesson[value]}</Localize>
                </button>
              ))}
            </div>
            <p className="lesson-feedback" role="status">
              <Localize>
                {choice === "safer"
                  ? "This is the risk-reducing approach in the example. Keep the source and your local guidance in mind."
                  : choice === "avoid"
                    ? "This routine retains the hazard. Compare it with this alternative: " +
                      lesson.safer
                    : ""}
              </Localize>
            </p>
            <details>
              <summary>
                <Localize>{"Read the comparison without choosing"}</Localize>
              </summary>
              <p>
                <strong>
                  <Localize>{"Avoid: "}</Localize>
                </strong>
                <Localize>{lesson.avoid}</Localize>
              </p>
              <p>
                <strong>
                  <Localize>{"Reduce risk: "}</Localize>
                </strong>
                <Localize>{lesson.safer}</Localize>
              </p>
            </details>
          </>
        ) : (
          <>
            <p className="lesson-objective">
              <Localize>{lesson.action}</Localize>
            </p>
            <p>
              <Localize>
                {
                  "Think about what you would like to discuss with another caregiver or qualified professional. No private notes need to be entered here."
                }
              </Localize>
            </p>
            <p>
              <Localize>
                {
                  "This lesson\u2019s progress records your reading and reflection. It does not record a child\u2019s abilities or certify that a hazard has been resolved."
                }
              </Localize>
            </p>
            <button
              className="button primary"
              onClick={() => save(2, !state?.completed)}
              aria-pressed={state?.completed || false}
            >
              <Localize>
                {state?.completed && <Check size={16} aria-hidden="true" />}
              </Localize>
              <Localize>
                {state?.completed
                  ? "Mark lesson as not explored"
                  : "Mark lesson as explored"}
              </Localize>
            </button>
            <Localize>
              {state?.completed && (
                <p role="status">
                  <Localize>
                    {"Lesson explored. You can revisit it whenever you like."}
                  </Localize>
                </p>
              )}
            </Localize>
          </>
        )}
        <div className="lesson-source">
          <a className="text-link" href={lesson.source.url}>
            <Localize>{"Source: "}</Localize>
            <Localize>{lesson.source.title}</Localize>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <p className="field-help">
            <Localize>{lesson.source.jurisdiction}</Localize> ·{" "}
            <Localize>{lesson.source.sourceDate}</Localize>
            <Localize>{" \u00B7 Content reviewed 31 October 2026."}</Localize>
          </p>
        </div>
        <nav
          className="lesson-controls"
          aria-label={localeText("Move through lesson")}
        >
          <button
            className="button secondary"
            disabled={loading || step === 0}
            onClick={() => save(step - 1)}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <Localize>{"Previous step"}</Localize>
          </button>
          <Localize>
            {step < 2 ? (
              <button
                className="button primary"
                disabled={loading}
                onClick={() => save(step + 1)}
              >
                <Localize>{"Continue"}</Localize>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : next ? (
              <Link className="button secondary" href={lessonHref(next)}>
                <Localize>{"Next lesson"}</Localize>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <Link className="button secondary" href="/learning-map">
                <Localize>{"Return to Learning Map"}</Localize>
              </Link>
            )}
          </Localize>
        </nav>
        <p className="field-help">
          <Localize>
            {account
              ? "Learning choices use your account settings."
              : "Guest learning choices stay in this browser."}
          </Localize>
        </p>
        <Localize>
          {message && (
            <p role="status">
              <Localize>{message}</Localize>
            </p>
          )}
        </Localize>
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
