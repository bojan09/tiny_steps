"use client";
import { Localize } from "@/components/localize";
import { lessonIds } from "@/lib/learning/model";
import { useAccount } from "./account-provider";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
export function Journey() {
  const { account } = useAccount();
  const learning = usePreferences((s) => s.preferences.learningProgress);
  const lessonCount = lessonIds.filter((id) => learning[id]?.completed).length;
  const done = usePreferences((s) => s.orientationComplete);
  const step = usePreferences((s) => s.orientationStep);
  const explored = usePreferences((s) => s.preferences.firstYearRead.length);
  const nestReviewed = usePreferences(
    (s) =>
      Object.values(s.preferences.safeNestChecks).filter(
        (value) => value === "reviewed",
      ).length,
  );
  return (
    <>
      <section className="paper progress-summary">
        <div className="progress-ring">
          <strong>
            <Localize>{done ? "1" : "0"}</Localize>
          </strong>
          <small>
            <Localize>{"completed"}</Localize>
          </small>
        </div>
        <div>
          <h2>
            <Localize>
              {done
                ? "You’ve taken your first step."
                : "Every journey has a beginning."}
            </Localize>
          </h2>
          <p>
            <Localize>
              {done
                ? "1 introduction completed"
                : "Your introduction is ready whenever you are."}
            </Localize>
          </p>
          <p>
            <Localize>
              {done
                ? "This is an app orientation, not a care certification."
                : step
                  ? "You’re on step " + (step + 1) + " of 5."
                  : "No lessons completed yet. No rush."}
            </Localize>
          </p>
          <Link className="text-link" href="/care-academy/getting-started">
            <Localize>
              {done ? "Revisit your introduction" : "Begin your introduction"}
            </Localize>
            <Localize> </Localize>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <p className="release-note">
        <Localize>
          {account
            ? "Your introduction progress is saved to your account."
            : "This progress belongs to this browser. Sign in to start an account journey."}
        </Localize>
      </p>
      <section className="paper content-panel">
        <p className="eyebrow">
          <Localize>{"YOUR STUDIO LEARNING"}</Localize>
        </p>
        <h2>
          <Localize>{lessonCount}</Localize>
          <Localize> </Localize>
          <Localize>
            {lessonCount === 1
              ? "Studio lesson explored"
              : "Studio lessons explored"}
          </Localize>
        </h2>
        <p>
          <Localize>
            {
              "Self-reported reading and reflection, not a care qualification or home-safety assessment."
            }
          </Localize>
        </p>
        <Link className="text-link" href="/care-academy">
          <Localize>{"Return to Learning Studio "}</Localize>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
      <section className="paper content-panel">
        <p className="eyebrow">
          <Localize>{"YOUR FIRST-YEAR READING"}</Localize>
        </p>
        <h2>
          <Localize>
            {explored
              ? `${explored} first-year ${explored === 1 ? "chapter" : "chapters"} explored`
              : "A year to explore, at your own pace"}
          </Localize>
        </h2>
        <p>
          <Localize>
            {
              "This records chapters you chose to mark as explored. It is not a record of your baby\u2019s abilities or a care qualification."
            }
          </Localize>
        </p>
        <Link className="text-link" href="/first-365-days">
          <Localize>{"Return to First 365 Days "}</Localize>
          <ArrowRight size={16} />
        </Link>
      </section>
      <section className="paper content-panel">
        <p className="eyebrow">
          <Localize>{"YOUR SAFENEST REFERENCE REVIEWS"}</Localize>
        </p>
        <h2>
          <Localize>{nestReviewed}</Localize>
          <Localize> </Localize>
          <Localize>
            {nestReviewed === 1 ? "reference reviewed" : "references reviewed"}
          </Localize>
        </h2>
        <p>
          <Localize>
            {
              "These are reading choices, not a home inspection or confirmation that a room is safe."
            }
          </Localize>
        </p>
        <Link className="text-link" href="/safenest">
          <Localize>{"Return to SafeNest "}</Localize>
          <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
