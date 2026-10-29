# TinySteps

A gentler beginning to parenthood. Phase 1 of a warm, responsive parenting education PWA built from the approved Living Editorial concept.

## Run locally

Use Node.js 20.9 or newer (verified here on Node 25.9).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production build and service worker:

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

## Not delivered yet

Google sign-in, Supabase schema/RLS, account sync, full care lessons, monthly chapters, room simulations, live Groq AI, full lesson downloads and production deployment. Existing Supabase/Google configuration is user-supplied; no end-to-end auth claim is made. The 64-lesson curriculum needs an explicit roadmap allocation.

## Configuration and privacy

The existing .env stays local and ignored. Variable names are documented in .env.example; no real values belong in Git. Phase 1 does not use database, service-role or Groq credentials. Never expose those secrets through NEXT_PUBLIC variables. Local preferences, bookmarks and introduction progress can be removed by clearing this site's browser data.

See docs/PHASE_1_REVIEW.md for the architecture and Supabase/auth plan. See docs/CODEX_PROMPT_REVIEW.md for differences in the later Codex-specific brief. Original references are retained under docs/reference, not rendered as application screens.

## Deployment

Repository: https://github.com/bojan09/tiny_steps.git. Work remains on master. No hosting is connected and no deployment workflow is included. The user will configure Vercel manually later; review automatic deployments before connecting it, since the roadmap permits production deployment only after Phase 5 unless changed by the user.

## Content and artwork

This release contains app orientation and collection descriptions, not reviewed medical instruction. Original generated artwork is decorative. See docs/ASSETS.md for provenance and prompts. Health and safety content needs current source review before publication.
