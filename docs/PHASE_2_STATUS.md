# Phase 2 — local implementation, v1.2.0
Date: 2026-10-29. The prior user baseline was 1.0.2. Account work was developed as 1.1.0; appearance expansion is 1.2.0. Future delivered fixes increment patch; new features/phases increment minor. Unshipped edits do not bump repeatedly.

## Implemented
- Google OAuth PKCE entry, safe callback, verified server identity, profile name and sign-out.
- Supabase owner-only account tables and initialization trigger, applied to the configured project. No production app deployment performed.
- Account appearance, introduction progress and bookmarks; guest storage kept separate.
- Preference revision conflicts reject stale writes; errors remain visible and saved account settings can be reloaded.
- 12 palettes plus a custom color picker; eight scene choices with adjustable intensity.
- Original potato companion and meadow artwork, responsive UI, visible version in footer and Help.
- Restricted read-only database health login and scheduled/manual Actions workflow.

## Evidence
- Real disposable-account browser verification passed: profile save, preference persistence, bookmarks, guest isolation, sign-out; test identity removed.
- RLS verification passed for owner, other-account and anonymous access, identity protection, stale preference revisions and protected achievements. Test identities removed.
- Exact health script passed locally; health login cannot read private user data.
- The reported React 418 error was reproduced on the failed OAuth callback and covered by a passing regression test.
- Local preview originally lacked Supabase network access. Restarting with network access fixed session verification. Explicit app origins fixed internal-host versus public-host validation and callback redirection.

## Remaining external gates
- User must confirm real Google consent returns to a signed-in profile. A disposable password session proves account infrastructure, not Google consent configuration.
- GitHub workflow secret, push, manual execution and scheduled execution remain unverified. See SUPABASE_KEEPALIVE.md.
- User added Vercel during this work. Do not push until the deployment implication is resolved; earlier instructions required Phase 2 to remain local.

## Redirect settings
Supabase Site URL: https://tiny-steps-six.vercel.app
Supabase allowed redirect URLs:
- https://tiny-steps-six.vercel.app/auth/callback
- http://127.0.0.1:3000/auth/callback
- http://localhost:3000/auth/callback

Google authorized redirect URI:
https://baupvfnujzfugksfzrrq.supabase.co/auth/v1/callback

The app accepts only these known app origins in lib/request-origin.ts. Add future domains deliberately. Vercel needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in its build environment. Administrative database credentials are only for local migration/verification scripts.

## Curriculum and handoff
The 64-lesson curriculum belongs in Phase 3: eight reviewed lessons per Care Academy collection, using Watch, Explore, Practice, Understand, Remember. Complete the curriculum before linking lessons into the timeline/Learning Map. Phase 4 cross-links guides and rooms; Phase 5 requires source review before release. No health lesson content was invented in Phase 2.

Stop local implementation after Phase 2 and obtain the required Codex cloud handoff before Phase 3. This phase does not claim a completed medical curriculum, AI connection or production release.

## Final local checks
- Production build: passed.
- TypeScript (build check): passed.
- ESLint: passed.
- Unit tests: 9 passed.
- Browser suite: 16 passed, including accessibility and dark contrast, mobile/no-overflow, offline cache isolation, failed callback hydration, custom color and scene persistence.
- Real-account browser check: passed, including persisted introduction progress; disposable identity removed.
- Secret scan: no configured private credentials in tracked/unignored source or browser bundles; both credential files are Git-ignored.
- Reviewed desktop/mobile previews are saved under docs/reference/phase-2-*.png.
- This pass was author-reviewed; no independent reviewer result is claimed.

## Cloud handoff readiness
Implementation remains on local master. Before cloud work, publish this verified snapshot after resolving Vercel deployment permission and provide its commit SHA. Install with npm ci, configure the public Supabase settings plus any phase-specific server-only credentials securely, and rerun the checks. Do not copy local .env files into the repository. Keep Phase 3 blocked until the explicit cloud handoff and outstanding Phase 2 integration gates are resolved.
