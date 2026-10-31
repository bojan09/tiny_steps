"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, ArrowRight } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import {
  lessonById,
  lessonHref,
  nextLearningLesson,
} from "@/lib/learning/content";

export function LearningCompanion({ message }: { message?: string }) {
  const p = usePreferences((s) => s.preferences);
  const reduced = useReducedMotion();
  const [dismissed, dismiss] = useState(false);
  if (!p.companion || dismissed) return null;
  const next = nextLearningLesson(p.learningProgress, p.activeLearningLesson);
  const animate = !reduced && ["balanced", "cinematic"].includes(p.motion);
  return (
    <aside
      className="learning-companion paper"
      aria-label="Sprout’s learning guidance"
    >
      <motion.div
        animate={animate ? { y: [0, -3, 0] } : undefined}
        transition={{ duration: 4, repeat: 1 }}
      >
        <Image
          src="/images/potato.webp"
          alt="Sprout, your learning companion"
          width={62}
          height={75}
        />
      </motion.div>
      <div>
        <p className="eyebrow">A LITTLE GUIDANCE FROM SPROUT</p>
        <p>
          {message ||
            "You can pause, revisit a step, or choose another path. There is no daily target."}
        </p>
        <Link className="text-link" href={lessonHref(next)}>
          Your next lesson: {lessonById(next)?.title}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <button
        className="icon-button"
        aria-label="Dismiss this companion tip"
        onClick={() => dismiss(true)}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </aside>
  );
}
