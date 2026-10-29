# Supabase health workflow
Prepared 2026-10-29. A local run of the exact health script passed. GitHub scheduling is **not yet active or verified**: the workflow has not been pushed and its repository secret has not been configured.

The workflow runs one bounded database SELECT daily at 08:23 UTC and supports manual dispatch. It retries at most three times with short backoff, has a five-minute job limit, read-only GitHub permissions, and concurrency control. It never deploys the application or writes user activity.

## Credential
Repository secret name: `SUPABASE_KEEPALIVE_DATABASE_URL`.
Its value is the connection URL after the equals sign in the ignored local file `.env.keepalive.local`. Do not commit that file or paste its contents into a chat.

The dedicated database login `tinysteps_healthcheck` has CONNECT, public schema USAGE and EXECUTE on `public.tinysteps_healthcheck()`. The function reads one non-sensitive private health record. Tests confirmed the login cannot read profiles, preferences or the underlying private health table. The login has a two-connection limit and ten-second statement timeout. Neither a service-role key nor the general database password belongs in Actions.

## Activate after publishing is approved
1. Push the workflow to master. Since Vercel now exists, first establish whether this push also deploys the app.
2. In GitHub repository Settings → Secrets and variables → Actions, add the named secret using the restricted URL.
3. Open Actions → Supabase health check → Run workflow.
4. Confirm the run succeeds and reports “Database health read passed.” Record the run URL in Phase 2 status.
5. Confirm scheduled runs appear the following day. A manual run alone does not prove scheduling.

## Operations and limitations
A health read is not a guarantee against pausing. Supabase decides project activity and eligibility; scheduled GitHub runs can be delayed or disabled. A public repository's schedule may stop after 60 days without activity. Monitor failures. If the project pauses, restore it through Supabase, then rerun the workflow. Do not fabricate application activity.

To disable: disable the GitHub workflow, remove the repository secret and revoke/disable the dedicated login through a privileged database session. Credential rotation is deliberate; setup refuses to rotate an existing role automatically.

References:
- https://supabase.com/docs/guides/platform/free-project-pausing
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
