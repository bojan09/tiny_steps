# TinySteps cloud phase progress

## Phase 5 release candidate — 2026-10-31, v1.5.3

SafeNest implementation and local release checks are complete. Final remote security/deployment/health-workflow observations are recorded after publication; do not infer those results from this candidate status. Earlier Phase 4 and cloud blockers below are historical.

- Twelve source-reviewed Avoid / Reduce risk comparisons, next actions and optional two-routine practice across all four rooms. Essential text remains visible without animation, map interaction or practice. Practice has no score, rewards, saved answers or automatic completion. Existing review states, bookmarks, isolated guest/account persistence, My Journey and appearance-reset preservation remain.
- Contextual companion cues retain reduced-motion/user controls. Source links identify country, source date and read date. The moved NHS safety URL was corrected in product and external verification. Full source-to-topic review: PHASE_5_REVIEW.md. SafeNest localization remains Phase 7; Phase 4's bilingual explorer is preserved.
- No migration, RLS changes, new dependencies, paid service or production user-data mutations.
- Final lint/typecheck/webpack build passed; 19 unit tests and all 32 browser tests passed. New coverage includes all room comparisons, explanatory choices without false progress, source metadata, static bath supervision guidance, 320px accessibility. Existing persistence/account isolation, failed-save, revision queue, offline, large-text and reduced-motion regressions pass.
- Desktop 1440px, mobile 375px and dark tablet 768px screenshots reviewed, with no overflow or automated WCAG A/AA violations. Evidence in ignored verification-results/phase5/.
- Synthetic throttled local mobile: SafeNest LCP 668ms/CLS 0.0001; First 365 Days LCP 864ms/CLS 0. Both pass the preset LCP ≤2500ms/CLS ≤0.1 targets. These are local synthetic observations, not field data.
- Local Docker is absent; sudo needs a user password. Added `.github/workflows/account-rls-verification.yml` in 52c186a, using GitHub's disposable runner and the existing immutable Auth/PostgreSQL/PostgREST images, generated test credentials and unchanged migration. The first actual hosted run passed full auth/RLS and real browser persistence/isolation/sign-out/cleanup: https://github.com/bojan09/tiny_steps/actions/runs/41235034060 . Final runtime commit triggers the same checks again. Reports contain no production credentials. See INTEGRATION_TESTING.md.
- Inspected actual existing Supabase health run 41210761688: failed because repository secret SUPABASE_KEEPALIVE_DATABASE_URL was missing. The user explicitly chose to add the secret and run the workflow. Do not claim success before a real passing result. Health activity never guarantees the free project will avoid pausing.

Commands: source /home/stan/.nvm/nvm.sh; npm run lint; npm run typecheck; npm test; npm run build -- --webpack; npm run start; run npm run test:e2e and npm run verify:performance with TINYSTEPS_CHROMIUM_EXECUTABLE=/home/stan/projects/tiny_steps/node_modules/.cache/phase4-browsers/chromium-1248/chrome-linux64/chrome. Do not kill a server started by the user; only the previews from this task were stopped/restarted. .codex-attachments remains untracked and the original local-work stash is retained.


## Current local release — 2026-10-31, v1.5.2

**Phase 4 First 365 Days is complete.** The earlier cloud source-access blocker and incomplete-content notes below are historical. Phase 5 remains open for its own sourced safety lessons and production checkpoint; no Phase 5 completion is claimed.

- Added CDC-based bilingual developmental cards for reference ages 2, 4, 6, 9 and 12 months, covering all 13 chapters. Each includes selected developmental examples, a gentle interaction idea, variation/screening context, source jurisdiction/link/date and concern/lost-skill guidance. Reading groups are not clinical acquisition ranges; earlier chapters explicitly label content as looking ahead.
- Added five stage shortcuts with current-stage semantics and chapter-heading focus. Preserved day/week/month navigation, previous/next boundaries, collection bookmarks, reading progress and My Journey. Added Macedonian save/error states. No birth date/ability tracking, new schema, dependencies or paid services.
- Source review is complete for the educational scope. See PHASE_4_CONTENT_REVIEW.md for the source-to-claim mapping, dates and translation boundaries. This is not an independently clinically reviewed curriculum or CDC endorsement. Whole-app localization remains Phase 7.
- Preserved pre-existing missing-Supabase-config fixes, verified them in the merged app and committed them separately (published as 0acc3dc). Account configuration is optional for guest exploration; unavailable sign-in is explained. Original stash backup remains; .codex-attachments is left untracked. Repository-local commit identity was restored from the existing commit history because this new machine had none configured; no global Git identity was changed.

### Final validation

- npm run lint and npm run typecheck: passed.
- npm test: all 18 individual unit tests passed.
- npm run build -- --webpack: final production build passed.
- npm run test:e2e with configured Chromium executable: all 30 browser tests passed, including all 13 chapter/source mappings, stage keyboard focus, 320px Macedonian accessibility, guest reading/bookmark persistence, account revision/isolation and localized failed-save behavior.
- Missing-configuration production build/mobile/API smoke test: passed. Normal configured production build restored afterward.
- Desktop 1440px, Macedonian mobile 390px and dark tablet 768px screenshots reviewed; no horizontal overflow, no automated WCAG A/AA violations, chapter focus passed. Additional browser coverage checks large text and reduced motion. Reports/screenshots: ignored verification-results/phase4/.
- Throttled local mobile check (390×844, 4× CPU, 150ms latency, 1.6Mbps down/750Kbps up): First 365 Days LCP 852ms, CLS 0; SafeNest LCP 644ms, CLS 0.0024. Both passed preset LCP ≤2500ms/CLS ≤0.1. These are synthetic local observations, not production field metrics. Report: ignored verification-results/performance/report.json.
- Existing real isolated Auth/RLS evidence is retained in INTEGRATION_TESTING.md. No schema/RLS changes were made; mocked account tests are not a fresh inspection of the managed Supabase project. Docker is absent locally, so the isolated integration runner was not rerun. No production account/data mutations were performed.
- Installation reported 16 moderate dependency advisories in the existing locked dependency tree; no dependency versions changed or force-upgrades applied in this phase.

### Reproduce locally

Checkout: /home/stan/projects/tiny_steps. Load the installed runtime with `source /home/stan/.nvm/nvm.sh` (Node 26.13.0/npm 11.20.0). Use npm ci, npm run lint, npm run typecheck, npm test and npm run build -- --webpack. Start the preview with npm run start. The browser executable for this machine is /home/stan/projects/tiny_steps/node_modules/.cache/phase4-browsers/chromium-1248/chrome-linux64/chrome; set TINYSTEPS_CHROMIUM_EXECUTABLE to that path for npm run test:e2e and npm run verify:performance. To recreate it, set PLAYWRIGHT_BROWSERS_PATH=/home/stan/projects/tiny_steps/node_modules/.cache/phase4-browsers when running npx playwright install chromium. Browser binaries and .env files remain ignored.


### Verified Phase 4 delivery

- Supporting configuration commit published as `0acc3dcd42974a5bbc7c2204b3c1715d517736f4`; Phase 4 implementation published as `7702539d39d9e255c4e066e2059fb54a6053b705` on origin/master.
- The new machine lacked HTTPS Git push credentials. Publication used the authenticated GitHub connector to create the two commits and fast-forward master with an expected-head check; no force update or remote overwrite. The API-created release tree exactly matched the tested local tree `12b3c81e52040fa783fe0e69faf11f05f4f9fc23`. `git fetch`/`git rebase origin/master` recognized and skipped the equivalent local commits; `git ls-remote` independently confirmed the published implementation SHA. Local master matches the published content.
- Vercel commit status for 7702539 is **success**: https://vercel.com/bojanstanimirovski097hotmailcoms-projects/tiny-steps/4K96nD3pjXUK3sE1vJSmKf6CSJyz .
- Independently verified production at https://tiny-steps-six.vercel.app with a fresh guest Chromium context on 2026-10-31: /help HTTP 200 and version 1.5.2; /first-365-days HTTP 200; month 12 reference/source correct; Macedonian content and five stage controls work; no mobile overflow, page errors or account writes. Report: ignored verification-results/phase4/production-check.json. This verifies the implemented release, not remote account/RLS or field performance.
- Phase 4 is complete; there are no remaining Phase 4 implementation/source-access blockers. Next roadmap work is completion of the existing Phase 5 SafeNest educational scope and its checkpoint; do not rebuild the planner or mark Phase 5 complete from Phase 4 evidence. No Phase 6–8 implementation was started.
- This documentation follow-up records the delivered implementation; it does not change runtime behavior. The connector publication route remains available if command-line Git credentials are not configured.



## Earlier cloud history

## Baseline audit — 2026-10-30
- Repository bojan09/tiny_steps; fetched origin/master at 648054d36cc64183122dc864a7e9ddd610d78310. Initial checkout had no tracked changes and matched the remote. Switched the environment's `work` branch to local `master` tracking origin/master without resetting files.
- Phase 1 foundation: Next.js App Router, editorial home, responsive navigation, accessibility/motion controls, manifest and service worker present. Baseline lint/types/build and 9 unit tests passed; 15/16 browser tests passed. Cold offline navigation failed because the offline route's JS chunk was absent from precache.
- Phase 2: Google OAuth callback, profile/account API, isolated guest state, preferences/bookmarks/introduction progress, additive schema and owner RLS policies present. User confirms Google sign-in and Vercel are working. This is user verification, not a fresh cloud OAuth or RLS test.
- Supabase network access is still blocked in the running cloud instance. Public configuration is in ignored local settings; the domain addition is saved in the environment draft but not applied.
- Health-check Actions workflow and least-privilege read script already exist. Actual GitHub Actions executions and secret presence have not been verified here.
- The requested brainstorm, superpowers, caveman and UI/UX skills are absent from the installed filesystem and cloud skill catalog. No supported installer/catalog source is available here; no installation or skill execution is claimed.

## Authorized continuation roadmap
The user explicitly authorized the uploaded continuation prompt after inspection. Its Phase 3 Living Home roadmap supersedes the older curriculum-first ordering. No completed foundation is being rebuilt. Later phases: First 365 Days; SafeNest and Phase 5 production checkpoint; learning studio/map/companion; localization/personalization; offline/performance hardening.

## Phase 3 — Living Home, v1.3.0
Completed as d3a1bdf630f0372bfa496f80d9b11250436cbafd and pushed to origin/master; remote SHA independently verified. Lint, types, webpack build, 10 unit tests and full 18-test browser suite passed; 3 affected browser tests passed again after the final refinement. Deployment verification is blocked by current network policy.
- Personalized account greeting and resumable introduction CTA.
- Optional learning-stage interest with no birth date; uses existing validated preference persistence and account revision handling. It is a browsing interest, not a developmental assessment.
- Honest next actions, real saved-collection counts and introduction progress; no invented lessons, metrics or medical claims.
- Responsive editorial cards retain existing design, companion and reduced-motion behavior.
- Repaired baseline service-worker precache to prepare the offline HTML's own static assets before activation.
- Unit validation covers old/invalid stage settings; browser coverage checks guest persistence/resume and mocked account state isolation.

## External gates
- Deployment cadence resolved by user: Vercel auto-deploys master and deployments after each phase are authorized. Verify remote push and deployment separately.
- Apply saved cloud Supabase, GitHub API, CDC/NHS and Vercel domain policy. CDC source retrieval returned proxy CONNECT 403; current infant-development guidance cannot be reviewed until policy is applied. Phase 4 content/source review is blocked.
- Verify existing Actions execution securely; do not recreate database, credentials or workflow blindly.

## Phase 4 — First 365 Days explorer increment, v1.4.0
User requested execution. Initial fetch matched origin/master with a clean working tree. Runtime network still has zero custom domains despite the settings UI displaying all five saved domains. CDC retry returned proxy CONNECT 403. The settings are correct; runtime application is unresolved. Do not ask the user to add the same domains again.

Implemented: 13 caregiver-reflection chapters in English/Macedonian; approximate day/week jumps; monthly navigation; explicit reading progress; My Journey reading summary; collection bookmarking; validated preference persistence and guest/account separation; reading choices preserved by appearance reset. No birth date, health observations, diagnosis or ability scores.

This is a deliverable nonclinical explorer increment. The complete Phase 4 developmental-content scope remains unfinished: current authoritative source review and sourced educational cards with flexible developmental ranges. No reviewed clinical curriculum or current-source verification is claimed. See PHASE_4_CONTENT_REVIEW.md for remaining requirements. Final check/commit/push evidence is in CLOUD_HANDOFF.md.

Explorer implementation pushed and remote verified: c7ddebf6a2f26e151ab83fae7b9984e574b05c74. Final checks passed: lint, types, webpack build, 13 unit tests and 22 browser tests. Production deployment remains unverified.

## Phase 5 — SafeNest explorer increment, v1.5.0
User authorized proceeding. Initial fetch matched origin/master with no tracked changes. Built four-room navigation, decorative map and equivalent text list, twelve reference-review planning prompts, follow-up states, collection bookmarks, persisted preferences, companion/reduced-motion behavior and a My Journey summary. No safety score or home certification.

Full checkpoint remains open: authoritative hazard-content review/safe-versus-unsafe education, live auth/RLS testing and production verification. Runtime source access still returns proxy CONNECT 403 despite correct saved domains; privileged test credentials are absent. No dependency or schema changes. See PHASE_5_REVIEW.md and CLOUD_HANDOFF.md for precise validation and remote evidence.

SafeNest implementation pushed and remote independently verified: d2c5ffb756e640bd93d86fb13d20fcaecbb5b822. Passed lint, typecheck, webpack build, 15 unit tests and the 26-test browser suite, plus 5 final affected browser checks after the room-focus refinement. Production verification returned proxy CONNECT 403. Full Phase 5 checkpoint remains incomplete; this is the tested explorer/planner increment.

## Phase 4–5 closure verification — v1.5.1
Real isolated auth/RLS and authenticated browser persistence checks now pass using the unchanged committed migration and disposable local services; no production keys needed. A proven save-status race was fixed and covered by a delayed-write regression. Lint/types/build, 15 unit tests and the full 27-browser-test suite pass. Throttled mobile LCP/CLS targets pass for both phase routes. See CLOUD_HANDOFF.md and INTEGRATION_TESTING.md for scope and exact observations.

Full phase completion remains blocked by current-source access and external deployment/workflow verification. Correct saved domains are not active in the running revision-1 instance. The implementation still needs the sourced developmental/safe-versus-unsafe education; no completion claim is made for those requirements. ENVIRONMENT_BLOCKER.md documents the required platform recovery without requesting duplicate domains.

v1.5.1 implementation push verified: eea07a6c24f7585a97daa36fc30249ae6a3ac885. Final local real-auth/RLS integration, product build/types/lint, 15 unit tests, 27 browser tests and throttled performance passed. Post-push external verifier reports five BLOCKED checks (proxy CONNECT 403). Source-dependent content and external release evidence remain incomplete, not waived. See ENVIRONMENT_BLOCKER.md.


## Local continuation — 2026-10-31
- Fetched and fast-forwarded local master from 648054d to 2cacdbbd9dbf3da5a3b2de14fae24302cc72af15.
- Preserved pre-existing Supabase missing-config fixes and untracked files in a named git stash, then reapplied them. Resolved package version-only conflicts in favor of remote 1.5.1. Stash retained; local work remains uncommitted.
- Phase 4 is already partly implemented remotely. Began remaining sourced-content work with a bilingual early-month educational card, displayed in chapters 0–2. No ability tracking or schema changes.
- Retrieved and read CDC milestone index and 2-month source through the web tool on 2026-10-31. Source access is available by this route despite older cloud restrictions. Reviewed population threshold, examples, caregiver interaction tips and concern/screening guidance. Source URLs: https://www.cdc.gov/act-early/milestones/index.html and https://www.cdc.gov/act-early/milestones/2-months.html . CDC detail page displays May 15, 2026, with metadata review/update May 16, 2026.
- This is an initial increment, not complete Phase 4. Remaining: reviewed later-stage cards, full content/localization review and browser verification. Macedonian copy is authored translation without independent reviewer sign-off.
- Validation blocked: this local execution shell has neither node nor npm on PATH; npm run lint did not execute (command not found). No lint/types/unit/browser/build success claimed for merged local work. No commit, push or deployment performed. Resume by making a Node runtime available, verifying local Supabase fixes together with the pulled account queue fixes, then running project checks before publishing.
