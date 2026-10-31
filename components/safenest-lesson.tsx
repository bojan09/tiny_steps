"use client";
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
  const [choice, setChoice] = useState<"avoid" | "safer" | null>(null);
  return (
    <section className="nest-lesson" aria-label={title + " learning example"}>
      <div className="nest-comparison">
        <div className="nest-avoid">
          <h4>
            <ShieldAlert size={20} aria-hidden="true" />
            Avoid
          </h4>
          <p>{lesson.avoid}</p>
        </div>
        <div className="nest-safer">
          <h4>
            <ShieldCheck size={20} aria-hidden="true" />
            Reduce risk
          </h4>
          <p>{lesson.safer}</p>
        </div>
      </div>
      <p className="nest-action">
        <strong>One next action: </strong>
        {lesson.action}
      </p>
      <details className="nest-practice">
        <summary>Compare two routines: {title}</summary>
        <p id={"nest-practice-" + id}>
          Which approach reduces the risk described here? This is a learning
          example, with no score or saved answer.
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
              {lesson[value]}
            </button>
          ))}
        </div>
        <p role="status" className="nest-practice-feedback">
          {choice === "safer"
            ? "This is the risk-reducing approach in this example. It does not certify a home or remove the need for supervision."
            : choice === "avoid"
              ? "This routine retains the hazard. Compare it with the risk-reducing approach above, and read the source for context."
              : ""}
        </p>
      </details>
      <p className="field-help">
        Reference: {lesson.source.jurisdiction} · {lesson.source.sourceDate} ·
        Read 31 October 2026.
      </p>
      <a className="text-link" href={lesson.source.url}>
        Read source: {lesson.source.title}
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    </section>
  );
}
