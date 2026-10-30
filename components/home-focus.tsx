"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import type { Preferences } from "@/lib/preferences-model";
import { useAccount } from "./account-provider";

const stageNotes: Record<Preferences["learningStage"], string> = {
  all: "Start with an introduction to your learning space, then keep the collections you want to explore close.",
  preparing:
    "Make yourself at home before your baby arrives. Explore the care collections and save the places you want to return to.",
  early:
    "There is no need to learn everything at once. Begin with your introduction and choose one care collection that interests you.",
  middle:
    "Your questions can change as your family grows. Revisit your saved collections and make room for a new interest.",
  later:
    "Keep learning at your family's pace. Return to familiar collections or explore something new together.",
};

export function HomeFocus() {
  const { account, loading, bookmarks } = useAccount();
  const stage = usePreferences((s) => s.preferences.learningStage);
  const setPreferences = usePreferences((s) => s.setPreferences);
  const done = usePreferences((s) => s.orientationComplete);
  const step = usePreferences((s) => s.orientationStep);
  return (
    <section className="home-focus paper" aria-labelledby="home-focus-title">
      <div className="home-focus-heading">
        <div>
          <p className="eyebrow">A SMALL MOMENT FOR YOU</p>
          <h2 id="home-focus-title">Your next little step</h2>
        </div>
        <div className="home-stage">
          <label htmlFor="learning-stage">
            What stage would you like to explore?
          </label>
          <select
            id="learning-stage"
            value={stage}
            disabled={loading}
            onChange={(e) =>
              setPreferences({
                learningStage: e.target.value as Preferences["learningStage"],
              })
            }
          >
            <option value="all">Any stage</option>
            <option value="preparing">Getting ready</option>
            <option value="early">0–3 months</option>
            <option value="middle">4–6 months</option>
            <option value="later">7–12 months</option>
          </select>
        </div>
      </div>
      <p className="home-stage-note" aria-live="polite">
        {stageNotes[stage]}
      </p>
      <p className="home-storage-note">
        Choose a learning interest, not a milestone deadline. No birth date
        needed.
      </p>
      {loading ? (
        <p role="status">Opening your learning space…</p>
      ) : (
        <div className="home-actions">
          <Link href={done ? "/care-academy" : "/care-academy/getting-started"}>
            <span className="eyebrow">
              {done
                ? "KEEP EXPLORING"
                : step
                  ? "PICK UP WHERE YOU PAUSED"
                  : "BEGIN GENTLY"}
            </span>
            <strong>
              {done
                ? "Explore your care collections"
                : step
                  ? `Continue at step ${step + 1} of 5`
                  : "Meet your learning space"}
            </strong>
            <span>
              {done
                ? "Your introduction is complete. Reviewed care lessons are still being prepared."
                : "A five-step app introduction, at your own pace."}
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/bookmarks">
            <span className="eyebrow">KEEP SOMETHING CLOSE</span>
            <strong>
              {bookmarks.length
                ? `${bookmarks.length} saved ${bookmarks.length === 1 ? "collection" : "collections"}`
                : "Find a collection to save"}
            </strong>
            <span>
              {bookmarks.length
                ? "Return to the places you chose to explore."
                : "Build a small shelf of interests, without a daily target."}
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/my-journey">
            <span className="eyebrow">YOUR REAL PROGRESS</span>
            <strong>
              {done ? "1 introduction completed" : "Your beginning counts"}
            </strong>
            <span>
              {account
                ? "Progress and learning interests use your account settings."
                : "Guest choices stay in this browser. Sign in for an account journey."}
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
