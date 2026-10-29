# Codex prompt comparison

Inspected at the user's request on 2026-10-28. Phase 1 and the approved visual direction are unchanged.

Changes from the original brief:
- Later cloud execution and handoff are explicitly for Codex rather than Claude.
- Skill discovery, installation consent, source verification, and evidence of use are clearer.
- Supabase keep-alive is added to Phase 2, separate from deployment. It requires current policy research, a least-privilege real database request, GitHub secrets, a manual successful Actions run, and documentation of scheduler/provider limitations. It cannot guarantee the project will not pause.

Still unresolved:
- The 64-lesson Care Academy is required but not allocated to a delivery phase.
- Production release after Phase 5 precedes Phase 6 content-review and security polish. All release-blocking safety and content checks must pass before Phase 5 deployment.
- Automatic Vercel deployment must be reconciled when Vercel is connected later.

No keep-alive, migration, cloud handoff, or production deployment was performed during Phase 1.
