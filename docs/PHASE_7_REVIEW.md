# Phase 7 — Localization, Profile and Settings

## Scope — v1.7.0, 4 November 2026

English/Macedonian localization covers published navigation, search, headings, explanatory copy, accessible labels, account/save/error states, orientation, Home, Profile, Settings, bookmarks, Journey, Studio/map/companion, all twelve released lessons, all four SafeNest rooms and offline/not-found pages. Existing bilingual First 365 Days content remains, with global language changes also selecting its reading language. The separate chapter reading selector remains available. Document language and title follow the global choice. User names/emails and destination URLs are never translated.

Separate Profile and Settings pages retain account editing and personalization: thirteen palettes including Custom, eight nature/art backgrounds, light/dark/system mode, background intensity, text size, motion and companion controls. Language and these choices use the existing revisioned owner preferences and isolated guest storage. Old/invalid language values safely default to English. Appearance reset keeps language and learning. Unsupported push notifications are explained, with no permission request, scheduling or misleading preference switch.

## Content and implementation

Authored translations live in lib/i18n/mk.tsv. The deterministic generator combines them with existing paired first-year copy into 728 messages in lib/i18n/mk.ts; i18n:check detects stale generated content. React context and explicit text/attribute translation preserve component semantics and layout. No DOM rewriting. Numeric lesson fragments, source metadata, save controls and mixed feedback are covered. Optional test instrumentation collects missing strings only when the browser test supplies its Set; it sends nothing over the network.

Safety material translates the reviewed Phase 5 source comparisons/actions reused in Phase 6. Source URLs, jurisdictions, dates, numbers and negative instructions are retained. Unit checks cover every comparison/action and critical sleep, bath and gate advice. This is authored translation and implementation review, not independent native-language or clinical certification. No new health claims, curriculum expansion, dependency, database migration or RLS policy change. The broader 64-lesson curriculum remains unreleased.

## Corrections found during verification

The existing first-year unit/day controls could accept input before account hydration and lose it; they now wait for loading like their neighboring controls. Visual review found a CSS-generated English mobile search hint; it now uses a localized attribute and has a regression assertion. The initial throttled lesson LCP was 2596ms against the existing 2500ms target. Public educational guidance now renders while account progress loads; controls remain disabled. A browser regression verifies readable safety text during a delayed account response and enabled controls afterward.

## Validation

Final results, remote commit, hosted authenticated language persistence/RLS and deployment evidence are recorded in PHASE_PROGRESS.md and CLOUD_HANDOFF.md after publication. Local evidence is ignored under verification-results/phase7. This phase does not change offline caching/installability; Phase 8 is the remaining roadmap phase. The independent Supabase health workflow still requires verified successful execution and never guarantees pause prevention.
