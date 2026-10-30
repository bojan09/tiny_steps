# TinySteps

A gentler beginning to parenthood. Version 1.3.0: Phase 3 of a warm, responsive parenting education PWA built from the approved Living Editorial concept.

## Run locally

Use Node.js 20.9 or newer (verified here on Node 25.9).

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

Browser checks use an installed Google Chrome. To use bundled Chromium instead, remove channel: 'chrome' in playwright.config.ts and install Chromium with Playwright. The app must be running before browser tests. Source can be formatted with npx prettier --write app components lib tests.

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

The 64-lesson curriculum is allocated to Phase 3 (eight lessons per Care Academy collection). Monthly chapters, room simulations, live Groq AI and full lesson downloads remain later phases. No production release of these local Phase 2 changes has been performed.

## Configuration and privacy

The existing .env stays local and ignored. Variable names are documented in .env.example; no real values belong in Git. The application uses only public Supabase settings with per-user authentication. Privileged database/service-role credentials are confined to local migration and disposable-test scripts; Groq is not connected yet. Never expose those secrets through NEXT_PUBLIC variables. Local preferences, bookmarks and introduction progress can be removed by clearing this site's browser data.

See docs/PHASE_1_REVIEW.md for the architecture and Supabase/auth plan. See docs/CODEX_PROMPT_REVIEW.md for differences in the later Codex-specific brief. Original references are retained under docs/reference, not rendered as application screens.

## Deployment

Repository: https://github.com/bojan09/tiny_steps.git. Work remains on master. The user has added https://tiny-steps-six.vercel.app. Confirm automatic deployment behavior before pushing Phase 2; the original roadmap permits production deployment only after Phase 5 unless the user changes that instruction. The health-check workflow does not deploy the app.

## Content and artwork

This release contains app orientation and collection descriptions, not reviewed medical instruction. Original generated artwork is decorative. See docs/ASSETS.md for provenance and prompts. Health and safety content needs current source review before publication.

## Cloud continuation — Phase 3

Living Home now reflects account greetings, real saved collections and introduction progress, with an optional learning-stage interest (no birth date). Stage settings use the existing isolated guest/account preferences. Resetting appearance preserves the learning interest. The cold offline fallback now precaches its required static assets. See docs/CLOUD_HANDOFF.md for current verification and external blockers. In this cloud runtime use `npm run build -- --webpack`; browser checks use the saved local Chromium override.
