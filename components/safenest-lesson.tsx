"use client";
import { Localize, useTranslate } from "@/components/localize";
import { useState } from "react";
import { ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";
import type { SafetyLesson } from "@/lib/safenest/lessons";
import type { TopicId } from "@/lib/safenest/model";
export function SafeNestLesson({
  lesson,
  id,
  title,
}: {
  lesson: SafetyLesson;
  id: TopicId;
  title: string;
}) {
  const localeText = useTranslate();
  const [choice, setChoice] = useState<"avoid" | "safer" | null>(null);
  return (
    <section
      className="nest-lesson"
      aria-label={localeText(title + " learning example")}
    >
      <div className="nest-comparison">
        <div className="nest-avoid">
          <h4>
            <ShieldAlert size={20} aria-hidden="true" />
            <Localize>{"Avoid"}</Localize>
          </h4>
          <p>
            <Localize>{lesson.avoid}</Localize>
          </p>
        </div>
        <div className="nest-safer">
          <h4>
            <ShieldCheck size={20} aria-hidden="true" />
            <Localize>{"Reduce risk"}</Localize>
          </h4>
          <p>
            <Localize>{lesson.safer}</Localize>
          </p>
        </div>
      </div>
      <p className="nest-action">
        <strong>
          <Localize>{"One next action: "}</Localize>
        </strong>
        <Localize>{lesson.action}</Localize>
      </p>
      <details className="nest-practice">
        <summary>
          <Localize>{"Compare two routines: "}</Localize>
          <Localize>{title}</Localize>
        </summary>
        <p id={"nest-practice-" + id}>
          <Localize>
            {
              "Which approach reduces the risk described here? This is a learning example, with no score or saved answer."
            }
          </Localize>
        </p>
        <div
          className="nest-practice-options"
          role="group"
          aria-labelledby={"nest-practice-" + id}
        >
          {(["avoid", "safer"] as const).map((value) => (
            <button
              className="button secondary"
              key={value}
              aria-pressed={choice === value}
              onClick={() => setChoice(value)}
            >
              <Localize>{lesson[value]}</Localize>
            </button>
          ))}
        </div>
        <p role="status" className="nest-practice-feedback">
          <Localize>
            {choice === "safer"
              ? "This is the risk-reducing approach in this example. It does not certify a home or remove the need for supervision."
              : choice === "avoid"
                ? "This routine retains the hazard. Compare it with the risk-reducing approach above, and read the source for context."
                : ""}
          </Localize>
        </p>
      </details>
      <p className="field-help">
        <Localize>{"Reference: "}</Localize>
        <Localize>{lesson.source.jurisdiction}</Localize> ·{" "}
        <Localize>{lesson.source.sourceDate}</Localize>
        <Localize>{" \u00B7 Read 31 October 2026."}</Localize>
      </p>
      <a className="text-link" href={lesson.source.url}>
        <Localize>{"Read source: "}</Localize>
        <Localize>{lesson.source.title}</Localize>
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    </section>
  );
}
