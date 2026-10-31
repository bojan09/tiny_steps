-- Apply after Auth migrations, before application migrations in the disposable DB.
-- Modern PostgREST puts claims in request.jwt.claims. Preserve the legacy fallback.
create or replace function auth.uid() returns uuid language sql stable as $$
 select coalesce(nullif(current_setting('request.jwt.claim.sub',true),''), nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid
$$;
