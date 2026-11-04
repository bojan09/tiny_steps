"use client";
import { Localize, useTranslate } from "@/components/localize";
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
    body: "Care Academy offers twelve guided lessons and four learning paths. First 365 Days supports age-stage exploration. SafeNest brings sourced comparisons into everyday spaces, and Parent Academy makes room for caregiver reflection.",
  },
  {
    title: "Practice",
    label: "Make it yours",
    heading: "Find a calmer way to learn.",
    body: "Try the appearance settings: choose a palette, adjust your background, increase text size, or turn motion off. Guest choices stay on this device; signed-in choices use your account settings. Your device’s reduced-motion preference always takes priority.",
  },
  {
    title: "Understand",
    label: "Know the boundaries",
    heading: "Support for learning, not diagnosis.",
    body: "TinySteps is an educational space. It cannot diagnose a condition, certify a practical care skill, or replace your healthcare team. Published health and safety lessons link to reviewed sources and show their source dates. Bring personal care questions to a qualified professional.",
  },
  {
    title: "Remember",
    label: "Your next small step",
    heading: "You get to set the pace.",
    body: "You don’t need to do everything today. Choose one area that interests you, personalize your space, or simply come back when you have a moment. Finishing this introduction records app learning, not a care qualification.",
  },
];
export function Orientation() {
  const localeText = useTranslate();
  const step = usePreferences((s) => s.orientationStep);
  const setStep = usePreferences((s) => s.setStep);
  const finish = usePreferences((s) => s.finish);
  const done = usePreferences((s) => s.orientationComplete);
  const item = steps[step];
  return (
    <div className="orientation">
      <nav
        className="orientation-steps"
        aria-label={localeText("Introduction steps")}
      >
        {steps.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setStep(i)}
            className={step === i ? "selected" : ""}
            aria-current={step === i ? "step" : undefined}
          >
            <span className="step-number">
              <Localize>{done ? <Check size={14} /> : i + 1}</Localize>
            </span>
            <span>
              <Localize>{s.title}</Localize>
              <small>
                <Localize>{s.label}</Localize>
              </small>
            </span>
          </button>
        ))}
      </nav>
      <section className="orientation-main paper">
        <div className="orientation-art">
          <Localize>
            {step === 2 ? (
              <Botanical />
            ) : (
              <StillLife kind={step === 4 ? "guide" : "care"} />
            )}
          </Localize>
        </div>
        <span className="eyebrow">
          <Localize>{"YOUR INTRODUCTION \u00B7 "}</Localize>
          <Localize>{step + 1}</Localize>
          <Localize>{" OF 5"}</Localize>
        </span>
        <h2>
          <Localize>{item.heading}</Localize>
        </h2>
        <p>
          <Localize>{item.body}</Localize>
        </p>
        <Localize>
          {step === 2 && (
            <Link className="text-link" href="/settings">
              <Localize>{"Try appearance settings "}</Localize>
              <ArrowRight size={16} />
            </Link>
          )}
        </Localize>
        <Localize>
          {done && (
            <p className="completion-note" role="status">
              <Localize>
                {
                  "Introduction complete. Your progress is saved on this device."
                }
              </Localize>
            </p>
          )}
        </Localize>
        <div className="orientation-actions">
          <button
            className="button secondary"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={16} />
            <Localize>{"Back"}</Localize>
          </button>
          <Localize>
            {step < 4 ? (
              <button
                className="button primary"
                onClick={() => setStep(step + 1)}
              >
                <Localize>{"Next step "}</Localize>
                <ArrowRight size={16} />
              </button>
            ) : done ? (
              <Link className="button primary" href="/my-journey">
                <Localize>{"View your journey "}</Localize>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <button className="button primary" onClick={finish}>
                <Localize>{"Finish introduction "}</Localize>
                <Check size={16} />
              </button>
            )}
          </Localize>
        </div>
      </section>
    </div>
  );
}
