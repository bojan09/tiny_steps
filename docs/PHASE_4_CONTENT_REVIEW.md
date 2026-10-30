# Phase 4 content review gate — 2026-10-30

## First-year explorer increment — v1.4.0
The First 365 Days interface now supports approximate day/week jumps and 13 manually selected chapters (first weeks and months 1–12), English/Macedonian reading text, previous/next navigation, explicit reading progress and the existing collection bookmark mechanism. No birth date, health observation, private journal entry or child ability score is collected. Existing account preferences/RLS are reused; no migration is required. Appearance reset preserves chapter language, selection and reading progress.

The current chapter text is caregiver reflection material. Month labels are browsing guides. It does not supply age-specific clinical guidance, milestone expectations or a medically reviewed curriculum. Translation is authored text; no native-speaker or clinical reviewer sign-off is claimed.

## Unfinished release requirements
- Review current authoritative developmental guidance. Add contextual educational cards with source, jurisdiction, version/review date and appropriate uncertainty.
- Explain developmental variation and when to discuss concerns with a qualified professional, based on reviewed sources; do not invent milestone deadlines or diagnoses.
- Verify source links before claiming source review. Current CDC request returned a proxy CONNECT 403.
- Review Macedonian developmental wording alongside English. Complete app-wide localization remains Phase 7.
- Richer sourced stage material remains outstanding; day/week/month navigation is implemented.
- Verify real cloud account saves once Supabase access works. Browser account-save/isolation coverage currently uses a mocked account API; no live RLS verification is claimed.
- Complete final sourced-content checks and deployment verification when source access works. The nonclinical explorer passed lint, types, build, 13 unit tests and 22 browser tests and ships as a clearly scoped Phase 4 increment. This does not complete the sourced-developmental-content requirements.

## Intended references (not retrieved/reviewed in this task)
- CDC, US: https://www.cdc.gov/act-early/milestones/index.html
- NHS, UK: https://www.nhs.uk/baby/babys-development/

These are further-reading links in the local draft, not citations for unverified developmental claims. Source access and final clinical-content review remain pending. No provider endorsement is implied.
