# Real isolated integration tests

Run from the existing checkout:

```sh
npm run test:integration
```

Prerequisites: Node/npm dependencies installed, a reachable **local** Docker daemon at `/var/run/docker.sock`, installed Chromium at `/usr/bin/chromium` (or set `TINYSTEPS_CHROMIUM_EXECUTABLE`), and free local app port 3000. Stop only a development server you started. In the cloud command sandbox, Docker/local socket access needs the normal sandbox escalation. Preserve proxy settings and TLS verification.

The runner uses immutable image digests for PostgreSQL 17.6, Supabase Auth 2.197.0 and PostgREST 14.18. Auth/PostgREST versions were taken from Supabase's official compose file. Docker pulls verify image digests through the configured registry/proxy route. No package declarations or lockfiles are rewritten.

The runner creates a dedicated local bridge and disposable database, with Auth/PostgREST ports published only to loopback. A local gateway routes the Supabase SDK's `/auth/v1` and `/rest/v1` requests. Generated local-only test passwords/JWTs are written to temporary mode-0600 files and redacted from output. No production admin credentials are requested or used. The application migration is applied unchanged to the empty test database. Production databases and source `.env` files are not touched.

A temporary app copy excludes `.git`, dependencies, build outputs and all `.env*` files; dependencies are symlinked from the existing installation. The copy is built with the local Auth URL and local test key. The existing production `.next` build is preserved. Containers, database volume, copied app and temporary credentials are removed in `finally`, including on assertion failure. A timestamped report is saved to ignored `verification-results/local-integration/report.json`; failed checks or failed cleanup return a nonzero exit code.

Assertions exercise real services, not mocked HTTP responses:

- Owner read/write, cross-account read/write denial and anonymous denial.
- Immutable user identity, server-managed preference revisions, stale revision rejection and protected achievements.
- First-year and SafeNest JSON persistence with cross-account isolation.
- Authenticated browser profile edits, appearance, bookmarks, first-year reading and SafeNest follow-up choices surviving reload.
- Guest/account separation, introduction progress and real sign-out.

This establishes behavior against the committed schema and real local Auth/PostgreSQL/PostgREST. It does not prove the remote managed project's current configuration or exercise Google's consent UI. Existing Google consent is user-verified. Do not report local tests as remote-project inspection.

Bootstrap references: Supabase postgres init scripts (`supabase/postgres`, `migrations/db/init-scripts`) and the official Supabase Docker compose (`supabase/supabase`, `docker/docker-compose.yml`). The small test bootstrap creates standard API roles and Auth namespace; the modern `auth.uid()` request-claims helper is applied after Auth migrations. All application RLS policies come from the committed migration, unchanged.

# External evidence

```sh
npm run verify:external
```

This checks current CDC/NHS source availability and the version shown on the production Help page. It writes a timestamped report with commit, expected version, HTTP/transport outcomes and hashes to ignored `verification-results/external-release/report.json`. Available source HTML is saved alongside it for substantive source review. An availability/content-marker check alone is **not** source fidelity or medical review. Failed/blocked checks return a nonzero exit code.

If the running cloud policy blocks these destinations despite correct saved settings, the runner reports that failure. It does not bypass the proxy, disable TLS verification or treat a Git push as deployment evidence. The saved configuration must be applied to the actual running environment before those checks can finish.

# Throttled local mobile performance

Run `npm run verify:performance` against the local production build. Fresh Chromium contexts use a 390×844 mobile viewport, 4× CPU slowdown, 150 ms latency and 1.6 Mbps download/750 Kbps upload. The runner records observed LCP, CLS, overflow, load time and the target version in ignored `verification-results/performance/report.json`. Targets are LCP ≤2,500 ms and CLS ≤0.1. These are synthetic local observations, not production field metrics or a physical-device benchmark.
