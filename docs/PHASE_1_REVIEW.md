# Phase 1 review — 2026-10-28

## Approved direction
TinySteps is a free parenting education PWA. The user approved the supplied Living Editorial board and explicitly requested Phase 1 implementation. The locked stack is Next.js App Router, TypeScript, Tailwind CSS, Motion, Zustand, and later Supabase and Groq integration. Work stays local on master. No hosting exists; Vercel will be connected manually later.

## Visual reading
Cream paper surfaces, forest-green controls, dusty sage and peach accents. Editorial serif headings paired with readable sans-serif text. The desktop dashboard is an immersive sunlit room, narrow left rail, compact search, overlapping learning cards, and a row of illustrated destinations. Tablet needs a compact rail. Mobile uses an art-led welcome and exactly five bottom destinations. Settings are a quiet grid of named botanical palettes. Botanical details and a sprout companion should support content rather than obscure it.

The generated reference has tiny text, low-contrast captions, dense touch targets, and some decorative baby-sleep scenes that must not become safety instructions. Use readable text, 44px controls, semantic navigation, keyboard access, reduced-motion handling, and original imagery. Do not reproduce invented user names, progress, notifications, or badges as real data.

## Scope and decisions
Implement the shell, living dashboard, useful navigable collection introductions, global destination search, a local learning orientation, separate Profile and Settings routes, local appearance preferences, original art, and an initial offline fallback. Full monthly chapters, room simulations, AI answers, account synchronization, and 64 reviewed lessons belong to later work. Phase 1 route introductions must describe content honestly; no pretend lessons or fake AI responses.

The specification explicitly permits Profile/Settings shells in Phase 1 despite its overall prohibition on placeholders. Resolve this by giving those routes real local controls and clear account integration status. No real email, baby identity, or fabricated progress is shown.

## Gaps to resolve before later phases
- Care Academy's 64 substantive lessons have no explicit delivery phase. Assign an owner/phase before expanding the roadmap.
- Phases 3–6 require Claude cloud. This Codex session does not satisfy that condition; do not silently proceed there.
- Google/Supabase is configured by the user, but real end-to-end sign-in and RLS remain unverified until Phase 2.
- No production host exists; user will configure Vercel later. Check deployment behavior again before future pushes after hosting is connected.

## Skills and tools
Caveman, Superpowers brainstorming, planning, execution, and verification are available. Installed ui-ux-pro-max from nextlevelbuilder/ui-ux-pro-max-skill at the user's request. Its automatic style matches conflict with the approved board, so use the supplied board for art direction and the skill's general accessibility/interaction guidelines. Local shell initially failed due to Windows CET; cmd.exe with approved execution works.

## Backend plan
Phase 2: profiles keyed by auth.users.id; user_preferences with version and updated_at; learning_progress keyed by user and lesson; bookmarks keyed by user and resource; achievements from verified progress; optional_child_context private and optional; server-only ai_usage. RLS must compare auth.uid() to user_id on all operations. Use private avatar storage, validated uploads, PKCE callback, server session verification, export/deletion flows. Never expose service role, database credentials, or Groq key. Public Supabase variables alone may enter the browser.

Preferences start locally in a versioned store, with validated hydration and safe defaults. Future account sync uses server timestamps and explicit last-write conflict resolution. Service worker caches only public assets and an offline page; never authenticated HTML, OAuth callbacks, or API responses.
