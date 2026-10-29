"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { StillLife, Botanical } from "./art";
const steps = [
  {
    title: "Welcome",
    label: "Find your feet",
    heading: "A little village, in your pocket.",
    body: "TinySteps is a place to learn about caring for a baby and caring for yourself. You can explore at your own pace, come back to a topic, or take a pause. This introduction shows you around the app; it is not a care lesson.",
  },
  {
    title: "Explore",
    label: "Follow your curiosity",
    heading: "Start wherever you are.",
    body: "Care Academy brings practical learning together. First 365 Days is your home for age-stage exploration. SafeNest focuses on spaces at home, and Parent Academy makes room for you. These collections are taking shape; this release introduces the space before reviewed lessons arrive.",
  },
  {
    title: "Practice",
    label: "Make it yours",
    heading: "Find a calmer way to learn.",
    body: "Try the appearance settings: choose a palette, adjust your background, increase text size, or turn motion off. These choices are saved on this device. Your device’s reduced-motion preference always takes priority.",
  },
  {
    title: "Understand",
    label: "Know the boundaries",
    heading: "Support for learning, not diagnosis.",
    body: "TinySteps is an educational space. It cannot diagnose a condition, certify a practical care skill, or replace your healthcare team. Future health and safety lessons must include source references and a review date before publication. Bring personal care questions to a qualified professional.",
  },
  {
    title: "Remember",
    label: "Your next small step",
    heading: "You get to set the pace.",
    body: "You don’t need to do everything today. Choose one area that interests you, personalize your space, or simply come back when you have a moment. Finishing this introduction records a small piece of progress in this browser only.",
  },
];
export function Orientation() {
  const step = usePreferences((s) => s.orientationStep);
  const setStep = usePreferences((s) => s.setStep);
  const finish = usePreferences((s) => s.finish);
  const done = usePreferences((s) => s.orientationComplete);
  const item = steps[step];
  return (
    <div className="orientation">
      <nav className="orientation-steps" aria-label="Introduction steps">
        {steps.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setStep(i)}
            className={step === i ? "selected" : ""}
            aria-current={step === i ? "step" : undefined}
          >
            <span className="step-number">
              {done ? <Check size={14} /> : i + 1}
            </span>
            <span>
              {s.title}
              <small>{s.label}</small>
            </span>
          </button>
        ))}
      </nav>
      <section className="orientation-main paper">
        <div className="orientation-art">
          {step === 2 ? (
            <Botanical />
          ) : (
            <StillLife kind={step === 4 ? "guide" : "care"} />
          )}
        </div>
        <span className="eyebrow">YOUR INTRODUCTION · {step + 1} OF 5</span>
        <h2>{item.heading}</h2>
        <p>{item.body}</p>
        {step === 2 && (
          <Link className="text-link" href="/settings">
            Try appearance settings <ArrowRight size={16} />
          </Link>
        )}
        {done && (
          <p className="completion-note" role="status">
            Introduction complete. Your progress is saved on this device.
          </p>
        )}
        <div className="orientation-actions">
          <button
            className="button secondary"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          {step < 4 ? (
            <button
              className="button primary"
              onClick={() => setStep(step + 1)}
            >
              Next step <ArrowRight size={16} />
            </button>
          ) : done ? (
            <Link className="button primary" href="/my-journey">
              View your journey <ArrowRight size={16} />
            </Link>
          ) : (
            <button className="button primary" onClick={finish}>
              Finish introduction <Check size={16} />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
