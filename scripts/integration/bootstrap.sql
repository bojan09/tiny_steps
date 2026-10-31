-- Isolated test database only; never apply this bootstrap to a managed project.
-- API roles follow Supabase's official postgres init scripts. auth.uid reads
-- PostgREST's request.jwt.claims, matching the production auth helper semantics.
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";
create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;
create role authenticator login noinherit password :'authenticator_password';
grant anon, authenticated, service_role to authenticator;
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
create schema auth;
create role supabase_auth_admin login noinherit createrole password :'authenticator_password';
grant all on schema auth to supabase_auth_admin;
alter role supabase_auth_admin set search_path = auth;
grant usage on schema auth to anon, authenticated, service_role;
