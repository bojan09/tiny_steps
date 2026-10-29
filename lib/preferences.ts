"use client";
import { create } from "zustand";
import { browserStorage } from "./browser-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  defaults,
  sanitizePreferences,
  type Preferences,
} from "./preferences-model";
type State = {
  preferences: Preferences;
  orientationStep: number;
  orientationComplete: boolean;
  setPreferences: (value: Partial<Preferences>) => void;
  reset: () => void;
  setStep: (step: number) => void;
  finish: () => void;
};
export const usePreferences = create<State>()(
  persist(
    (set) => ({
      preferences: defaults,
      orientationStep: 0,
      orientationComplete: false,
      setPreferences: (value) =>
        set((s) => ({
          preferences: sanitizePreferences({ ...s.preferences, ...value }),
        })),
      reset: () => set({ preferences: { ...defaults } }),
      setStep: (orientationStep) => set({ orientationStep }),
      finish: () => set({ orientationComplete: true, orientationStep: 4 }),
    }),
    {
      name: "tinysteps-local-v1",
      version: 1,
      storage: createJSONStorage(() => browserStorage),
      skipHydration: true,
      merge: (stored, current) => {
        const s =
          stored && typeof stored === "object"
            ? (stored as Partial<State>)
            : {};
        return {
          ...current,
          preferences: sanitizePreferences(s.preferences),
          orientationStep:
            Number.isInteger(s.orientationStep) &&
            Number(s.orientationStep) >= 0 &&
            Number(s.orientationStep) <= 4
              ? Number(s.orientationStep)
              : 0,
          orientationComplete: s.orientationComplete === true,
        };
      },
      partialize: ({ preferences, orientationStep, orientationComplete }) => ({
        preferences,
        orientationStep,
        orientationComplete,
      }),
    },
  ),
);
