"use client";
import { useAccount } from "./account-provider";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
export function Journey() {
  const { account } = useAccount();
  const done = usePreferences((s) => s.orientationComplete);
  const step = usePreferences((s) => s.orientationStep);
  const explored = usePreferences((s) => s.preferences.firstYearRead.length);
  return (
    <>
      <section className="paper progress-summary">
        <div className="progress-ring">
          <strong>{done ? "1" : "0"}</strong>
          <small>completed</small>
        </div>
        <div>
          <h2>
            {done
              ? "You’ve taken your first step."
              : "Every journey has a beginning."}
          </h2>
          <p>
            {done
              ? "1 introduction completed"
              : "Your introduction is ready whenever you are."}
          </p>
          <p>
            {done
              ? "This is an app orientation, not a care certification."
              : step
                ? "You’re on step " + (step + 1) + " of 5."
                : "No lessons completed yet. No rush."}
          </p>
          <Link className="text-link" href="/care-academy/getting-started">
            {done ? "Revisit your introduction" : "Begin your introduction"}{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <p className="release-note">
        {account
          ? "Your introduction progress is saved to your account."
          : "This progress belongs to this browser. Sign in to start an account journey."}
      </p>
      <section className="paper content-panel">
        <p className="eyebrow">YOUR FIRST-YEAR READING</p>
        <h2>
          {explored
            ? `${explored} first-year ${explored === 1 ? "chapter" : "chapters"} explored`
            : "A year to explore, at your own pace"}
        </h2>
        <p>
          This records chapters you chose to mark as explored. It is not a
          record of your baby’s abilities or a care qualification.
        </p>
        <Link className="text-link" href="/first-365-days">
          Return to First 365 Days <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
