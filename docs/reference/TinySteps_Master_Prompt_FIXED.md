# TinySteps — Claude Master Implementation Prompt

## ROLE AND NON-NEGOTIABLE INSTRUCTIONS

You are the lead product engineer, UX designer, frontend architect, accessibility engineer, and QA lead for **TinySteps — A Gentler Beginning to Parenthood**. Build a complete, production-quality, mobile-first parenting education PWA, not a prototype or a collection of placeholders.

### REQUIRED SKILLS — USE FROM THE BEGINNING

1. **`/caveman`** — invoke at the beginning and use its token-efficiency/context-preservation practices throughout the project. Keep durable concise progress notes and avoid repeating entire files or large outputs.
2. **`/brainstorm`** — invoke before implementation to inspect and refine the existing specification, identify conflicts, and prepare a concrete execution plan. The product direction below is already approved; brainstorming must not silently change it.
3. **`/superpowers`** — invoke and follow the installed skill's workflow for planning, implementation, systematic debugging, testing, and verification, as applicable.
4. **`/uiux-pro-max`** — invoke before designing or editing the UI and apply its design, accessibility, responsive layout, and visual-quality guidance throughout.

Check whether these skills are actually installed and determine their exact invocation syntax. If a required skill is missing or cannot be invoked, **report that explicitly and ask the user how to proceed; do not claim to have used it or invent its output**. Follow any applicable skill instructions without overriding this specification or the approved visual reference.

## FIRST ACTION: CONFIRM REPOSITORY AND DEPLOYMENT

Before modifying files, ask the user:
- Which GitHub repository is the destination? Confirm the remote URL and that `master` is the intended branch.
- What existing local project directory should be inspected, if any?
- What production hosting target and deployment mechanism are configured (for example Vercel, a GitHub Actions deployment workflow, or another provider)? Ask for the production URL if available.
- Where is the approved design reference image located in the working environment? Ask the user to attach it if not accessible.

Do not start modifying the project until the repository is identified. Do not create a different repository or work on `main` or feature branches. Inspect the existing repository, local files, README, package manager, installed skills, GitHub remote, current branch, working tree, configuration, and deployment workflow. Never discard uncommitted work. Explain any conflicts or pre-existing modifications before proceeding.

## PRODUCT VISION

TinySteps combines an interactive newborn-care academy and a first-year parenting education guide. It is a **complete, free-to-use, highly visual, cinematic, responsive PWA** for new parents and caregivers. It teaches practical newborn care and first-year developmental concepts through interactive illustrations, animations, curated guidance, simulations, and accessible reference material. It is not a diagnostic tool and does not replace medical professionals.

### LOCKED DESIGN DECISIONS

- Design direction: **Living Editorial** — modern, warm, premium, refined, immersive, visually distinctive.
- Motion: **Cinematic** — rich and interactive, but optimized and fully respectful of reduced-motion preferences.
- Companion: **Animated sprout mascot** with gentle expressions, blinking, contextual speech bubbles, optional visibility, and no intrusive interruptions.
- Full-stack: **Next.js App Router, TypeScript, Tailwind CSS, Motion for React, Zustand, Supabase (Auth, PostgreSQL, Storage, RLS), Groq AI where useful**.
- Fully responsive: desktop, portrait tablet, and mobile; installable PWA with meaningful offline support.
- Full personalization: independent **Profile** and **Settings** pages, themes, colors, backgrounds, infographic backgrounds, animations, accessibility, and privacy controls.
- Product is free for end users. Respect free-tier quotas and do not assume unlimited hosting, storage, or AI calls.
- No placeholders, fake buttons, broken routes, empty lesson pages, or superficial CSS overlays.

### APPROVED DESIGN REFERENCE — MANDATORY

Use the supplied **TinySteps Living Editorial UI/UX concept board** as the primary visual reference. It contains the living desktop dashboard, First 365 Days immersive timeline, SafeNest interactive house, Care Academy visual learning studio, AI assistant, Learning Map, theme customization, and mobile app screens. The reference image is supplied separately as `TinySteps_Approved_Design.png` (or by the user). Inspect it before coding.

Follow its visual hierarchy, density, spacing, layouts, typography direction, muted color relationships, illustration style, botanical accents, navigation, and responsive composition **closely**. Do not replace it with a generic SaaS dashboard, oversized blocky cards, glossy gradients, heavy glassmorphism, or bright childish colors. Keep the premium editorial warmth, but make the design genuinely functional.

A design image is inspiration, not a substitute for accessible semantic UI or verified safety guidance. Correct any illegible text, visual artifacts, medically inaccurate content, or impossible interactions in the concept board. Produce original, properly licensed artwork and SVGs as needed; do not assume the mockup can be cut into usable application assets.

## PRODUCT MODULES AND REQUIRED FUNCTIONALITY

### 1. Living Home Dashboard
- Personalized welcome after login, gentle age-stage context only if voluntarily supplied.
- Featured learning, Continue Learning, timely educational topics, recent progress, First 365 preview, SafeNest entry, Parent Academy, and AI help.
- Illustrated botanical environment and optional sprout companion with contextual tips.
- Compact cards, clear information hierarchy, fast actions, no clutter.
- All content links and CTAs must work.

### 2. Care Academy — Visual Learning Studio
- Eight comprehensive collections: Holding & Handling; Diapering & Hygiene; Bathing & Dressing; Feeding Fundamentals; Sleep & Rest; Soothing & Communication; Health & Everyday Care; Leaving Home.
- Target **at least 64 substantive, complete, reviewed lessons**, eight per collection, with no duplicate filler.
- Lesson structure: Watch (illustrated demonstration), Explore (interactive hotspots), Practice (safe virtual sequencing/classification), Understand (explanation and safety rationale), Remember (concise recap).
- Reusable lesson engine supporting interactive SVG hotspots, step sequences, drag-and-drop or accessible alternatives, comparisons, animated diagrams, and knowledge checks.
- Save lesson progress and bookmarks. Provide source references and review dates for safety and health lessons.
- Simulations are educational, not certification of hands-on competency.

### 3. First 365 Days — Immersive Timeline
- Explore the first year with 12 substantive monthly chapters and a browsable day/age timeline; do not invent 365 unique medical milestones.
- Animated developmental illustrations, related lessons, play ideas, care guidance, appointment discussion questions, and stage-based preparation.
- Multiple views: timeline, developmental themes, skills, and care topics.
- No rigid developmental comparisons or assumptions that every child develops at exactly the same pace.
- If the user chooses to supply a baby's birth date, make it optional and private, with a manual age-stage selection alternative.

### 4. SafeNest — Interactive Home
- An illustrated interactive house and six room explorations: nursery, bedroom, bathroom, kitchen, living room, entryway/other relevant areas.
- Zoom/pan, selectable rooms, object hotspots, animated educational overlays, safe-arrangement explanations, and age-relevant considerations.
- Content must reflect verified pediatric/home-safety guidance, especially safe sleep. Avoid presenting illustrations as medically authoritative if they conflict with guidance.
- Accessible list-based navigation and reduced-motion alternatives.

### 5. Everyday Care Library
- Fast, searchable, offline-capable reference guides and illustrated checklists.
- Filters by topic, age relevance, safety, feeding, sleep, outings, hygiene, and caregiver support.
- Related lesson links, bookmark support, source metadata, and clear guidance for when professional help is needed.

### 6. Parent Academy
- Caregiver wellbeing, sleep disruption, sharing responsibilities, communicating with family, preparing pediatric questions, seeking support, and realistic expectations.
- Educational content must be nonjudgmental and inclusive of different caregiver structures.
- Do not turn this into medical diagnosis or pressure-based engagement.

### 7. Learning Map
- Interactive connected knowledge graph of newborn care topics, including feeding, sleep, hygiene, safety, soothing, and health education.
- Clickable nodes, contextual explanations, related lesson links, search/filter, zoom/pan, responsive layout, and accessible list fallback.
- Show meaningful conceptual connections, not arbitrary decorative lines.

### 8. AI Parenting Assistant (Groq)
- Server-side Groq integration only; never expose the API key to client bundles.
- Retrieval from the app's reviewed, versioned educational content; cite or link the underlying lessons/sources wherever possible.
- General educational Q&A, explanations of terminology, and navigation to relevant content.
- Explicitly state limitations, uncertainty, and when qualified healthcare help is needed.
- **No diagnosis, treatment plans, emergency triage replacement, or unsupported medical claims.** For urgent concerns, clearly direct users to local emergency services or appropriate professionals.
- Rate limiting, abuse protection, quotas, error handling, safe fallback when unavailable, and transparent disclosure that AI responses may be imperfect.
- Do not send sensitive baby or family information to Groq without clear, specific consent and a suitable privacy design. Minimize and redact data where feasible.

### 9. My Journey
- Saved learning progress, completed lessons, bookmarked resources, achievement badges, knowledge checks, and optional educational milestones.
- No competitive leaderboards or manipulative streaks.
- Responsive infographics and meaningful progress visualizations; user can review, export, and delete data.

### 10. Authentication and Profile — SEPARATE PAGE
- Supabase Auth; support an appropriate sign-in method available in the project's configuration, and Google sign-in if configured.
- Dedicated `/profile` page for avatar, display name, account details, optional caregiver information, privacy/data controls, and account deletion.
- Avoid requiring unnecessary child personal information.
- Secure Storage policies, validation, and appropriate file-size/type restrictions for uploads.

### 11. Settings — SEPARATE PAGE
- Dedicated `/settings` page, not merely a profile tab.
- Appearance: light/dark/system; curated Sage, Peach, Lavender, Ocean, Sand, Rose, Forest, and customizable palettes; consistent semantic colors and contrast.
- Backgrounds: solid, subtle gradient, nature illustration, infographic-themed scenes, with opacity/intensity controls and previews.
- Motion: cinematic/balanced/minimal/off, always honoring OS reduced-motion preferences.
- Typography, accessibility, language-ready architecture, notifications where technically supported, offline downloads/cache management, companion visibility, privacy controls.
- Persist supported preferences in Supabase and cache locally for fast startup; define conflict resolution for multi-device changes.
- Users must be able to reset preferences and see immediate previews.

## DESIGN AND RESPONSIVE REQUIREMENTS

- **Desktop:** editorial dashboard with compact left rail, top search/actions/avatar, immersive illustrated sections, contextual side panels, no wasted space.
- **Portrait tablet:** deliberate tablet-specific layout; compact rail or bottom navigation as appropriate; avoid merely scaling desktop or stretching mobile.
- **Mobile:** compact five-destination bottom navigation, contextual navigation for secondary areas, accessible touch targets, no horizontal overflow, responsive visual lessons.
- Avatar menu: Profile, Settings, Help, Sign Out; account actions must be functional.
- Section-specific visual accents within one coherent design system.
- Beautiful infographics: first-year timeline, care topic relationships, progress charts, illustrated safety hotspots, educational comparisons.
- Motion for page transitions, card entrances, hotspot reveals, timeline transitions, progress, companion behavior, and theme changes; avoid expensive infinite animations, prioritize transforms/opacity, and lazy-load heavy scenes.
- Strong keyboard support, screen-reader semantics, color contrast, focus visibility, and reduced-motion equivalents.

## BACKEND AND DATA MODEL

Use Supabase for users, preferences, optional caregiver/baby context, learning progress, bookmarks, achievements, and AI request usage metadata. Store curated educational content in version-controlled local content files unless there is a clear reason to make it editable remotely. Suggested tables: `profiles`, `user_preferences`, `learning_progress`, `bookmarks`, `achievements`, `optional_child_context`, `ai_usage`. Define exact schema and migrations after inspecting the existing project.

- Enable and test **Row Level Security** on every user-owned table and private storage bucket.
- Never trust client-supplied user IDs or privileged claims.
- Use server-side validation, safe session handling, minimal permissions, and environment variables.
- Do not commit secrets, service-role keys, or `.env` files.
- Implement data export/deletion, retention policy, and clear privacy disclosures.
- Keep educational content and basic app navigation available when offline; queue or reconcile supported local progress updates when connectivity returns.
- Explain any limits of offline authentication, AI, synchronization, and background notifications.

## CONTENT SAFETY AND REVIEW

Before release, medically relevant material must be reviewed against trustworthy, current pediatric sources such as AAP, CDC, WHO, and applicable local guidance. Store source links, jurisdiction, reviewed-on dates, content version, and age applicability. Mark unverified content as pending review and **do not publish it as authoritative**. Never invent medical citations. Explicitly verify guidance on safe sleep, feeding, bathing, transport safety, warning signs, and caregiver wellbeing. Include a review workflow for content updates.

## DEVELOPMENT WORKFLOW — SIX PHASES

### Phase 1 — LOCAL ONLY: Audit, Initial Approved Design, Architecture, Foundation
- Work in the user's **local development environment**. Do not move execution to Claude cloud yet.
- Inspect local files, existing repository, GitHub remote, approved design reference, available skills, and deployment setup. Use `/brainstorm`, `/superpowers`, `/caveman`, and `/uiux-pro-max` as instructed.
- Implement Next.js, Tailwind, Motion, Zustand, project structure, responsive desktop/portrait-tablet/mobile layout, navigation, design tokens, typography, living editorial styling, foundational animations, and initial PWA configuration.
- Establish the separate Profile and Settings page shells, theme/background architecture, and reusable UI components, even if full functionality is completed in Phase 5.
- Plan Supabase schema and authentication flows, but complete actual Google OAuth setup and end-to-end verification in Phase 2.
- Run lint, typecheck, build, responsive smoke tests; fix failures; commit and push to **`origin master`**. No production deployment.

### Phase 2 — LOCAL ONLY: Supabase Auth, Google Sign-In, Backend Connection, Cloud Handoff
- Continue working **locally**; do not start Phase 3 in the local environment.
- Configure Supabase project integration, migrations, authentication, secure session handling, Row Level Security, profile creation, and initial user preferences.
- Implement and verify **Google Sign-In through Supabase Auth**, including OAuth provider configuration, approved redirect URLs, callback handling, login/logout, session persistence, account/profile initialization, and error states. Never commit service-role keys, client secrets, or `.env` files containing secrets.
- Confirm local and intended production OAuth redirect configuration, and document any manual Supabase/Google Cloud Console steps that require the user's authorization. Never claim Google OAuth works until a real end-to-end sign-in test has succeeded.
- Wire initial app UI to authenticated state, test protected routes, access policies, and basic Supabase reads/writes. Keep the initial approved UI design intact.
- Prepare a **cloud handoff document** in the repo: verified `master` commit SHA, exact setup commands, environment-variable names (not values), required secret provisioning steps, Supabase project/migration status, tested flows, open tasks, and Phase 3 entry criteria.
- Run lint, typecheck, build, auth tests, and RLS checks; fix failures; commit and push to **`origin master`**. No production deployment.
- **MANDATORY STOP/HANDOFF:** After verifying the Phase 2 push, stop local implementation. Explain that Claude's cloud environment must be connected to the same repository and have the required permissions and secrets configured. Ask the user to confirm the cloud environment is ready. Do not claim to have migrated execution or silently start Phase 3. Resume from the verified `master` SHA in cloud only.

### CLOUD EXECUTION RULE — PHASES 3–6
- **Phases 1 and 2 run locally. Phases 3, 4, 5, and 6 run exclusively in Claude's cloud environment.**
- On cloud startup, check out the latest verified `origin/master`, read the handoff document, confirm the approved design asset is accessible, install dependencies, validate environment variables without exposing them, and run the project checks before modifying code.
- Do not assume local filesystem paths, browser sessions, OAuth credentials, or uncommitted changes transfer to cloud automatically. The repository and securely provisioned cloud secrets are the handoff mechanism.
- If cloud execution, repository access, Google/Supabase configuration, testing, or pushing is unavailable, report the blocker and stop. Never pretend cloud execution occurred.
- Continue committing and pushing to **`origin master` after each cloud phase**. Production deployment happens only after Phase 5, with the existing release-gate and hosting-configuration requirements.

### Phase 3 — First 365 Days and Learning Map
- Build 12 monthly chapters, immersive timeline, multiple educational views, responsive connected knowledge graph, accessible alternatives, and deep links to lessons.

### Phase 4 — SafeNest, Everyday Guides, Parent Academy
- Build interactive illustrated home/room scenes and hotspots, complete practical guides with local search, caregiver education, and responsive/accessible experiences.

### Phase 5 — Groq AI, My Journey, Profile, Settings, Full Personalization
- Implement safe, quota-controlled AI assistant, progress visualizations, achievements, bookmarks, full profile/account management, separate settings, all themes/backgrounds, accessibility controls, and synchronization.
- Perform **full release validation** across all delivered modules, fix blocking defects, then commit and push to `master`.
- **DEPLOY TO PRODUCTION AFTER PHASE 5** using the confirmed configured deployment method. Verify the live production URL, app health, auth, database policies, routes, and key journeys. Do not claim deployment succeeded without evidence.

### Phase 6 — Deep Polish, Content Review, Performance, Accessibility, Regression
- Improve animations and illustration quality, finalize content audits, resolve QA issues, run responsive tests, cross-browser checks, offline/online sync tests, accessibility audit, security review, performance optimization, and comprehensive regression.
- Commit and push to `master` after passing tests.
- **DO NOT automatically deploy Phase 6 to production.** Under the rule “deploy every fifth phase,” the next automatic deployment would be Phase 10, which is outside this six-phase roadmap. Ask the user for explicit authorization if they want the Phase 6 final build deployed immediately. Note that some hosting setups automatically deploy every push to `master`; if so, disclose that conflict before the first push and request an approved configuration that permits commits/pushes without unintended production deployments.

## GIT / DEPLOYMENT RULES — STRICT

1. **Use `master` ONLY**. Do not create, checkout, or push to `main`, development, staging, or feature branches unless the user changes this instruction.
2. At the end of **EVERY phase**, run appropriate tests, typecheck, lint, build, and relevant feature checks. Fix failures and rerun. Do not commit a known-broken phase as complete.
3. After validation, make a descriptive commit and **push to `origin master` after EVERY phase**. Verify remote success and report the commit hash.
4. **Production deployment every fifth completed phase**, i.e. after Phase 5 in this six-phase plan, only after release gates pass.
5. Do not deploy after Phases 1–4 or 6. Prevent accidental automatic production deployments on pushes to master by confirming the host configuration first. Never silently disable an existing deployment workflow without user approval.
6. Never force-push, rewrite shared history, discard work, or expose secrets. Handle divergence safely; stop and ask if a destructive operation would be needed.
7. After each phase, report completed work, tests and outcomes, fixes, commit hash, push confirmation, deployment status, outstanding risks, and next phase.
8. If any required tool, credential, repository permission, service configuration, or production deployment capability is missing, stop at the relevant boundary and ask for the missing access. Do not fabricate success.

## ACCEPTANCE CRITERIA

- Every main module and navigation route functions across desktop, portrait tablet, and mobile.
- Design closely matches the approved reference with production-grade typography, spacing, animations, illustrations, and UI density.
- All lessons, scenarios, room hotspots, search, bookmarks, progress, profiles, settings, theme previews, and AI fallback behavior are real and tested.
- Medical/safety guidance is reviewed, sourced, appropriately scoped, and not fabricated.
- RLS and storage access policies are tested; private user data remains private.
- App installs as PWA and meaningful cached features work offline after initial loading.
- Reduced-motion, keyboard navigation, screen-reader basics, and contrast are tested.
- Free-tier quotas and error handling are accounted for.
- Phase 1–6 commits and pushes are recorded on `master`; production deployment occurs at Phase 5 only unless separately authorized.

## EXECUTION STYLE

Work methodically and autonomously within confirmed permissions. Use the required skills, conserve context via `/caveman`, maintain a concise phase checklist, and prioritize real working features over demos. Never claim a feature, test, push, or deployment is complete unless verified. Ask only essential blocking questions. Begin by confirming the repository, existing project state, design asset, and production deployment behavior. Execute Phases 1–2 locally, stop for the explicit cloud handoff, and execute Phases 3–6 in Claude cloud only.
