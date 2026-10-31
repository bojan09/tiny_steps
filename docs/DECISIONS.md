# Cloud continuation decisions

- 2026-10-30: Follow the newly authorized continuation roadmap (Phase 3 Living Home), superseding older curriculum-first phase numbering. Existing reviewed-content requirements remain.
- Preserve Phase 1–2 architecture and database. Extend the existing preferences JSON for optional learning-stage interests, avoiding a new schema or collection of birth dates. Older preferences default to Any stage.
- Keep home progress factual: only introduction completion and real saved collections. Care content remains explicitly unreleased; stage copy is general orientation, not health instruction.
- Fix the proven cold-offline regression before advancing: install-time precaching includes same-origin Next static resources referenced by the public offline HTML. Private routes/API/auth responses are not precached.
- Use installed tools with explicit reporting while named optional skills are unavailable. Do not install unknown third-party skills.
- Use Next's supported webpack build due to Turbopack worker socket restrictions; retain installed Chromium via ignored local Playwright configuration.
- Production is already live and Google sign-in works according to the user. User explicitly confirms master auto-deploys and authorizes deployments after every completed phase, superseding the uploaded Phase 5-only checkpoint. Verify actual deployment separately from push.

- Phase 4 local draft: reuse the revisioned preference JSON for chapter month, language and explored-month IDs; sanitize all loaded state and preserve guest/account isolation. Reading progress is explicitly separate from child development. Monthly reflections collect no health data or journal entries.
- Do not substitute general caregiver reflection cards for the required sourced developmental experience. Keep the sourced-developmental-content scope incomplete until authoritative guidance can be retrieved and reviewed. The tested nonclinical explorer can ship separately with its limitations stated. Further-reading links are not proof of source review.

- Phase 5 explorer increment: preserve learning versus home-safety status. Reference-review states never mean a room is safe or a hazard resolved. Use the existing revisioned preferences rather than adding a remote schema for planning choices. Preserve those choices when resetting appearance.
- House artwork is decorative navigation with equivalent text buttons, not a safe room diagram. All controls work without animation; companion respects reduced-motion/user settings. No risk gamification.
- Source verification and live RLS remain separate required gates. Do not mislabel the planner as reviewed safe/unsafe training or its mocked account tests as live security verification. The full Phase 5 checkpoint remains open.

- 2026-10-31: Replace the unrun-security-test prerequisite with repeatable real isolated Auth/PostgreSQL/PostgREST tests against the unchanged committed migration. This gives genuine auth/RLS evidence without production admin keys; it does not claim inspection of managed-project configuration or Google consent.
- An isolated integration run exposed harness setup/diagnostic races, which were corrected. A separate failing delayed-write browser test proved an application save-status race; the provider now reports Saved only once current preferences/progress are persisted, and marks newer choices pending immediately.
- Store durable release evidence under ignored verification-results/, outside Playwright's cleaned output directory. External checks retain blocked/failed/passed distinctions. Do not manufacture content-review or deployment success from blocked requests.
