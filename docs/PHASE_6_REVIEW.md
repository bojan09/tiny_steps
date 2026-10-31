# Phase 6 — Learning Studio, Learning Map and companion

## Scope — v1.6.0, 2026-10-31

Care Academy is now a visual Learning Studio with twelve structured lessons across four paths. Each lesson has Understand, Compare and Carry it forward steps, a source link/jurisdiction/date, optional explanatory practice and an explicit explored toggle. The map uses semantic ordered lesson lists with visible Not started / In progress / Explored states and connected nodes. Paths remain freely browsable; there are no streaks, locked progression or care-proficiency scores.

The twelve lessons reuse the source-reviewed SafeNest material; see PHASE_5_REVIEW.md for its six-source claim mapping. NHS safety and sleep guidance were retrieved again during this task. No new medical or developmental claims were added. The broader eight-collection, 64-lesson curriculum remains a separate content delivery; neither the UI nor this phase claims it is complete. Full new-interface localization remains Phase 7.

Sprout provides contextual inline guidance, a next-lesson link and a dismiss control. Existing companion settings and reduced-motion preferences apply. The former assistant placeholder now links into working reviewed learning. It is guided navigation, not live AI chat: no prompts or family data are sent to an AI provider. No paid service or new dependency.

## Persistence and security

- Added bounded activeLearningLesson and learningProgress fields to existing preferences JSON. Only the twelve known lesson IDs and integer steps 0–2 are accepted; malformed state is discarded. Completion is a self-reported reading flag, not an award or competency record.
- Existing revisioned account saves, immutable account identity and owner RLS remain. No schema migration or RLS policy change. Guest state stays separate and does not become account progress on sign-in.
- Revisiting earlier steps preserves explored status; the explicit toggle can remove it. Appearance reset preserves lesson position and progress. The Studio and map show account-save status/errors without claiming every optimistic choice has already persisted.
- A failing browser regression exposed an initial-save ordering bug: the lesson could mark itself in progress before the account provider subscribed to saves. Initial tracking is now deferred until that subscription is attached, with cleanup on account/route changes. The failed-save regression now passes. The real authenticated browser runner also verifies initial lesson save, reload, completion and map state.

## Validation

Lint/typecheck/production build and 24 unit tests passed. All 36 browser tests passed, including direct lesson resume, completion/revisit/reset behavior, Journey/map counts, keyboard focus, 320px large-text/dark/reduced-motion accessibility, account/guest isolation, failed saves and unknown-lesson 404. Existing auth, home, first-year, SafeNest, bookmarks and offline regressions pass. Desktop Studio, mobile lesson and dark tablet map screenshots were reviewed; no overflow, page errors or automated WCAG A/AA violations. Evidence is in ignored verification-results/phase6/.

Performance results and final hosted auth/RLS, commit/remote and production evidence are recorded in CLOUD_HANDOFF.md and PHASE_PROGRESS.md after verification. The hosted runner uses disposable services and generated local test credentials; no production user records are mutated. Google consent and remote managed-project configuration are not re-certified by those local-to-runner tests.

## Next

Phase 7: finish app-wide English/Macedonian localization, personalization and the remaining Profile/Settings scope. The independent Supabase health-workflow secret/run setup from Phase 5 is still unverified; do not imply that lesson delivery fixes it or guarantees free-tier pause prevention.
