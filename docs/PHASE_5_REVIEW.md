# Phase 5 — Interactive SafeNest and production checkpoint

## Delivered scope — 2026-10-31, v1.5.3

SafeNest now has twelve sourced safety comparisons across nursery/bedroom, kitchen, bathroom and living room/entryway. Each presents an explicitly labelled **Avoid** routine, a **Reduce risk** alternative, one next action, and its source's jurisdiction, source date (when stated) and TinySteps read date. This replaces the previous planner-only boundary; the original room map, text navigation, reference-review choices, bookmarks and guest/account isolation remain.

Optional keyboard-operable practice lets a caregiver compare the same routines and read explanatory feedback. It has no scores, rewards, saved answers or automatic review completion. The essential comparison/action/source is always visible without opening practice, playing animation or using the map. Review progress still means references read, never a home certified or a hazard resolved. No observations, notes or child health data are collected.

## Source review

All sources below were retrieved and read on 31 October 2026. The former NHS safety URL returns 404; both the product link and external verifier now use its current first-aid-and-safety path. Current source content, rather than the old cloud network restriction, informed this delivery.

| Topics | Reviewed source | Source metadata |
| --- | --- | --- |
| Clear cot, back sleeping, firm flat mattress, room sharing for at least six months | [NHS: SIDS — UK](https://www.nhs.uk/baby/caring-for-a-newborn/sudden-infant-death-syndrome-sids/) | Reviewed 25 November 2025 |
| Changing surfaces, adult presence at meals, bath-water check | [NHS: Baby and toddler safety — UK](https://www.nhs.uk/baby/first-aid-and-safety/safety/baby-and-toddler-safety/) | Reviewed 19 February 2026 |
| Hot drinks, uninterrupted bath supervision, taking the child along when leaving, draining the bath | [HSE: Water safety in the home — Ireland](https://www2.hse.ie/babies-children/child-safety/water-safety/water-safety-home/) | Reviewed 24 June 2026 |
| Anchoring furniture and televisions; removing tempting objects | [CPSC: Anchor It! — US](https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/AnchorItgov) | No review date stated on the retrieved page |
| Keeping furniture away from blinds; fitted cord safety devices | [OPSS: Blind cord safety — UK](https://www.gov.uk/guidance/child-safety-blind-cords) | Updated 25 January 2024 |
| Original-container medicine/cleaner storage, visitors' bags, infant seats and stair gates | [Canadian Paediatric Society: Home safety — Canada](https://caringforkids.cps.ca/handouts/safety-and-injury-prevention/keep_your_young_child_safe) | Updated May 2023 |

Wording was checked against these sources. The app avoids universalising local installation standards, offers manufacturer/local-guidance context, and does not introduce emergency treatment, medicine dosing or feeding-preparation instructions. Sources do not endorse TinySteps; no external clinician approval is claimed. Education cannot replace supervision, professional advice or emergency services. Complete app localization remains the dedicated Phase 7 scope; the Phase 5 SafeNest lessons are English.

## Engineering and quality

- Existing twelve topic IDs and bounded Not started / Needs follow-up / Reference reviewed states remain unchanged. No database migration, RLS change, dependency upgrade or paid service.
- Companion cues now reflect the selected room. Existing reduced-motion/user-motion preferences and equivalent text controls remain.
- Final lint/types/webpack build passed; all 19 unit tests and all 32 browser tests passed. New tests cover lesson/source coverage, every room's two-routine interaction without automatic progress, 320px static guidance and accessibility. Existing tests cover persistence, isolation, save failures, account revision queues, bookmarks, offline fallback, large text and reduced motion.
- Desktop 1440px, mobile bathroom 375px and dark tablet 768px screenshots reviewed. No overflow or automated WCAG A/AA violations. Evidence: ignored verification-results/phase5/.
- Throttled local mobile (390×844, 4× CPU, 150ms latency, 1.6Mbps down/750Kbps up): SafeNest observed LCP 668ms, CLS 0.0001; First 365 Days LCP 864ms, CLS 0. Both pass preset LCP ≤2500ms/CLS ≤0.1. Synthetic local data, not field Core Web Vitals.
- Docker is unavailable locally and sudo requires the user's password. Added a read-only-permission GitHub Actions workflow using disposable services, generated test credentials and the existing pinned integration images. No production credentials/data are used. Its first actual run passed auth, owner/cross-account/anonymous RLS, revision/identity protections, real browser persistence/isolation/sign-out, and cleanup: https://github.com/bojan09/tiny_steps/actions/runs/41235034060 . It reruns on runtime changes to master, with a non-secret summary artifact. Final-release run evidence is recorded after publication.

## Release checkpoint

Implementation tests pass. Commit/remote publication, final hosted security-run result, production version/browser verification and the existing health workflow's actual outcome are recorded in CLOUD_HANDOFF.md and PHASE_PROGRESS.md after verification. The health workflow's first inspected run failed because its repository secret was missing; the user is adding it. A credential setup promise is not a successful workflow execution, and a successful health read never guarantees Supabase will not pause a free-tier project.
