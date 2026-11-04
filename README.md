# TinySteps

A gentler beginning to parenthood. Version 1.8.0: read-only offline guidance and release hardening in a warm, responsive parenting education PWA built from the approved Living Editorial concept.

## Run locally

Use Node.js 20.9 or newer (verified locally on Node 26.13.0).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The server needs outbound access to Supabase for sign-in and account storage. For the production build and service worker:

```sh
npm run build
npm run start
```

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
# In a separate terminal with npm run start running:
npm run test:e2e
```

Browser checks default to installed Google Chrome. To use another Chromium, set TINYSTEPS_CHROMIUM_EXECUTABLE to its absolute executable path; install a browser with npx playwright install chromium if needed. The app must be running before browser tests. Source can be formatted with npx prettier --write app components lib tests.

## Delivered in Phase 1

- Next.js App Router, TypeScript, Tailwind CSS, Motion, Zustand.
- Responsive desktop rail, tablet rail, five mobile destinations, searchable navigation and keyboard-accessible mobile drawer.
- Original hero, baby, house and sprout artwork, botanical SVG accents and care illustrations.
- Separate Profile and Settings routes, seven palettes, light/dark/system display, backgrounds, intensity, text size, motion and companion controls.
- A five-step app introduction, honest local progress, and collection bookmarks.
- Informative route introductions for later modules, with explicit release boundaries.
- Install manifest, PNG and maskable icons, production service worker and a verified offline fallback. Only public static assets and the offline page are cached.

## Phase 2 local implementation

Google OAuth entry/callback, Supabase schema and RLS, profile edits, account appearance/progress/bookmarks, isolated guest storage, preference conflict checks, original potato companion, 12 palettes plus Custom, eight scenes and a visible version. Real disposable-account checks pass; user Google consent and GitHub Actions activation remain external gates. See docs/PHASE_2_STATUS.md and docs/SUPABASE_KEEPALIVE.md.

## Not delivered yet

The wider 64-lesson curriculum, live Groq AI and full lesson downloads remain later work. Twelve guided lessons and four learning paths are now available. Living Home and First 365 Days are implemented; SafeNest provides sourced risk comparisons and a reference-review planner. See docs/PHASE_PROGRESS.md for the active continuation roadmap.

## Configuration and privacy

The existing .env stays local and ignored. Variable names are documented in .env.example; no real values belong in Git. The application uses only public Supabase settings with per-user authentication. Privileged database/service-role credentials are confined to local migration and disposable-test scripts; Groq is not connected yet. Never expose those secrets through NEXT_PUBLIC variables. Local preferences, bookmarks and introduction progress can be removed by clearing this site's browser data.

See docs/PHASE_1_REVIEW.md for the architecture and Supabase/auth plan. See docs/CODEX_PROMPT_REVIEW.md for differences in the later Codex-specific brief. Original references are retained under docs/reference, not rendered as application screens.

## Deployment

Repository: https://github.com/bojan09/tiny_steps.git. Work remains on master. The user has added https://tiny-steps-six.vercel.app. The continuation handoff records user authorization for master auto-deployments after tested increments. Verify deployment separately from a successful Git push. The health-check workflow does not deploy the app.

## Content and artwork

This release includes app orientation, collection descriptions and sourced developmental education. It provides general education, not clinical assessment or medical advice. Original generated artwork is decorative. See docs/ASSETS.md for provenance and prompts. Health and safety content needs current source review before publication.

## Cloud continuation — Phase 3

Living Home now reflects account greetings, real saved collections and introduction progress, with an optional learning-stage interest (no birth date). Stage settings use the existing isolated guest/account preferences. Resetting appearance preserves the learning interest. The cold offline fallback now precaches its required static assets. See docs/CLOUD_HANDOFF.md for current verification and external blockers. In this cloud runtime use `npm run build -- --webpack`; browser checks use the saved local Chromium override.

## First 365 Days — Phase 4, v1.5.2

Browse 13 monthly caregiver-reflection chapters in English or Macedonian, or jump to an approximate chapter by day/week. Mark reading progress explicitly, return through My Journey, and bookmark the collection. Choices use existing isolated guest/account preferences; no birth date or health observations are collected. Five bilingual developmental stages now include CDC-based examples, gentle interaction ideas, reference ages, source links/read dates and guidance on concerns. Earlier chapters clearly distinguish looking ahead from expectations for the selected month. Stage windows are reading groups, not clinical deadlines; progress records reading, never a baby’s abilities. See docs/PHASE_4_CONTENT_REVIEW.md for the source review and boundaries.

## SafeNest — Phase 5, v1.5.3

Choose one of four rooms from the illustrated map or equivalent text list. Twelve reference-review prompts support Not started, Needs follow-up and Reference reviewed states. Choices persist through the existing isolated guest/account settings, appear in My Journey, and survive an appearance reset. Collection bookmarks and the optional companion use existing controls. Twelve source-reviewed Avoid / Reduce risk comparisons add actionable guidance for sleep, furniture, meals, storage, hot drinks, bathing, cords and stairs. Optional two-routine practice has explanatory feedback without scores or saved answers; every lesson also has a static text alternative. Sources identify their jurisdiction, dates and links. This is educational learning, not a home inspection or safety certification. See docs/PHASE_5_REVIEW.md and docs/CLOUD_HANDOFF.md for checkpoint evidence.

## Release verification and persistence fix — v1.5.1

The save indicator now stays pending until all newer preference/progress changes have persisted. Real isolated Auth/PostgreSQL/PostgREST checks run with `npm run test:integration`, synthetic throttled mobile checks with `npm run verify:performance`, and authoritative source/deployed-version checks with `npm run verify:external`. See docs/INTEGRATION_TESTING.md. External transport failures remain failures; these commands do not claim production or source verification when blocked.

## Phase 6 — Learning Studio, map and companion, v1.6.0

Care Academy now contains twelve three-step lessons across four paths, using the already sourced SafeNest topics. Understand a comparison, try optional practice and carry a small action forward. The Learning Map displays Not started, In progress and Explored states; lessons resume at their saved step, and My Journey shows self-reported exploration counts. Appearance reset preserves learning choices. The existing app introduction remains available.

Account progress uses the existing validated, revisioned preferences JSON and owner RLS; guest choices remain separate. No migration or AI service is added. Sprout provides contextual, dismissible inline guidance with reduced-motion support and a dedicated companion route. The 64-lesson curriculum is not claimed delivered. Phase 7 adds complete English/Macedonian interface and released-lesson localization. See docs/PHASE_6_REVIEW.md and docs/CLOUD_HANDOFF.md for validation and release evidence.

## Phase 7 — Localization and personalization, v1.7.0

Settings switches the whole app between English and Macedonian, including search, accessible labels, save/error states, twelve Studio lessons and SafeNest comparisons. Global language also sets First 365 Days reading language; its separate reading selector remains available. Names, email addresses and source destinations stay unchanged. Profile and Settings remain separate. Thirteen palettes (including Custom), eight backgrounds, display mode, intensity, text size, motion and companion choices remain available. Notification support is described honestly; this release does not request permission or offer push scheduling.

Language uses the existing revisioned account settings and isolated guest storage. No new dependency, schema or paid service. Edit lib/i18n/mk.tsv and run npm run i18n:build; npm run i18n:check verifies the checked-in catalog. Existing bilingual first-year content is reused. See docs/PHASE_7_REVIEW.md for scope and evidence. Phase 8 completes the supplied implementation roadmap.

## Phase 8 — Offline and release hardening, v1.8.0

After successful online preparation, failed document navigation opens a bilingual read-only copy of the twelve safety references. No account details, progress edits or full lesson pages are cached. Connection and waiting-update notices are explicit; updates wait until all tabs close. Added security headers and a page retry boundary. Expanded browser coverage checks first offline use, cache exclusions, install metadata and multi-tab updates.

Production deployment is deliberately held: vercel.json disables Git auto-deployments. The live site remains v1.7.0 until a separately authorized release. See docs/PHASE_8_REVIEW.md for the vision audit, limitations and final verification.
