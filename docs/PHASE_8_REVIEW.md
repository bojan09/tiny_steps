# Phase 8 — Offline PWA and release hardening

## Scope — v1.8.0, 4 November 2026

The offline page now contains a read-only copy of the twelve released safety references. It reuses reviewed source objects and Macedonian translations, with source jurisdiction/date and a visible preparation/content-review date. It explains that saved guidance can become outdated and source websites require a connection. There are no assessment, answer, completion or account-edit controls in the guide. Its public HTML and required hashed scripts/styles are prepared during service-worker installation, even if the visitor never opened the offline route. First use still needs a successful connected preparation; storage clearing, browser restrictions and installation failures can remove offline availability. This is not full lesson downloading or emergency guidance.

The worker uses a release-specific cache, serves offline fallbacks only after failed document navigations, and does not intercept account API, auth, authorized, cross-origin or non-GET requests. Runtime storage permits only known public assets and immutable Next static paths, excludes query variants and responses marked private/no-store, and reads from the current release cache. It never caches profile/settings/lesson/account HTML. Activation removes only previous TinySteps public caches. Failed installation leaves the active release's cache available.

Updates wait for all existing tabs to close. A localized notice explains this without forcing a reload or risking unsaved edits. Connection notices explain that account saves cannot succeed offline and link to the guide. Native document links deliberately allow service-worker navigation fallback, instead of Next client/RSC requests. The notice appears inside the main workspace, with accessible status semantics. No background write queue, push permission or hidden save retry is introduced.

## Security, errors and installability

Configured CSP limits resources to the app and the configured account origin, blocks framing, objects and foreign base/form targets, and avoids unsafe-eval in production. Static Next hydration still requires inline scripts/styles; this is a baseline CSP, not nonce-based strict CSP or an XSS-proof claim. Added nosniff, frame denial, referrer and camera/microphone/geolocation restrictions. Service-worker responses are revalidated without HTTP cache retention. Existing API private/no-store, origin/identity validation, size bounds, revisions and database RLS remain. No schema or policy change. Offline review exposed a reset of text/motion choices during account loading failures. Identity transitions now retain only interface preferences; private learning and orientation state still reset until identity is established. A unit regression and the large-text offline browser check cover this boundary.

A localized page error boundary offers retry and offline guidance without displaying raw errors. Existing manifest, standalone start/scope, real PNG dimensions and maskable icons are checked. A fresh persistent Chromium profile reports zero installability errors; its private-context counterpart reports only the expected in-incognito restriction. Device/browser install UI and persistence quotas remain platform-dependent. Nature assets already use Next Image with dimensions, responsive sizing and optimized WebP. Existing reduced-motion and bounded companion animation remain; no new animation or image payload was introduced. Performance checks now include Home, Settings and offline guide alongside the five learning routes.

## Vision audit and boundaries

| Approved area | Actual state |
| --- | --- |
| Living Editorial responsive UI | Existing original art, coherent sections, mobile/tablet layouts, nature backgrounds and thirteen palettes retained. |
| Living Home / First 365 Days | Working personalized Home and thirteen bilingual chapters with sourced development references; not clinical tracking. |
| SafeNest / Studio / map | Four rooms, twelve sourced comparisons/lessons, four paths and resumable self-reported exploration. The wider 64-lesson curriculum is not delivered. |
| Companion / AI | Accessible, dismissible guided companion; no live AI chat or external prompt submission. |
| Profile / Settings / localization | Separate pages, EN/MK released copy, revisioned account preferences and isolated guest storage. |
| Offline / installability | Public read-only safety guide and fallback after successful online preparation; manifest/icons. No full lesson-download manager or offline account edits. |
| Notifications | Unsupported and described honestly; no scheduler or permission request. |
| Security | Automated disposable Auth/Postgres/PostgREST checks; this does not certify live managed-project configuration or Google consent. |

Dependency audit: npm audit --omit=dev reports zero vulnerabilities. The full audit reports 16 moderate inherited development-tool findings through minimatch glob amplification (GHSA-g3hv-75wg-m249), no high/critical findings. npm's suggested automatic fix downgrades major ESLint/Next tooling and was not applied. No dependency changes in this phase. These development findings remain documented; release hardening does not mean a clean full audit or independent penetration test.

## Release policy

Phase 8 is held for a separately authorized production deployment. vercel.json sets git.deploymentEnabled=false so publishing master cannot automatically replace v1.7.0. Manual deployment remains possible when authorized; remove/change this flag only with a deliberate deployment decision. GitHub's disposable integration workflow continues to run. Do not infer production v1.8.0 from a successful push or hosted test. The independent Supabase health-workflow activation remains unverified and cannot guarantee free-tier pause prevention.

Final check results, commit/remote evidence and hosted integration outcome are recorded in PHASE_PROGRESS.md and CLOUD_HANDOFF.md. Local artifacts remain ignored under verification-results/phase8. There is no Phase 9 in the supplied roadmap; remaining product expansion and a release decision require separate scope.

Implementation references: [service-worker lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [Next security headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers), and [Vercel Git deployment configuration](https://vercel.com/docs/project-configuration/git-configuration). These explain the implementation mechanisms; test outcomes are recorded separately.
