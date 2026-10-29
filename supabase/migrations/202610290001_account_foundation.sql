-- Additive TinySteps account foundation. Apply once through scripts/migrate.mjs.
create table public.profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check(char_length(display_name)<=80),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.user_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 preferences jsonb not null default '{}'::jsonb check(jsonb_typeof(preferences)='object' and octet_length(preferences::text)<=8192),
 revision bigint not null default 1, updated_at timestamptz not null default now()
);
create table public.learning_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id text not null check(char_length(lesson_id) between 1 and 100),
 step integer not null default 0 check(step between 0 and 4), completed boolean not null default false,
 updated_at timestamptz not null default now(), primary key(user_id,lesson_id)
);
create table public.bookmarks (
 user_id uuid not null references auth.users(id) on delete cascade,
 resource_id text not null check(char_length(resource_id) between 1 and 100),
 created_at timestamptz not null default now(),primary key(user_id,resource_id)
);
create table public.achievements (
 user_id uuid not null references auth.users(id) on delete cascade,
 achievement_id text not null check(char_length(achievement_id) between 1 and 100),
 earned_at timestamptz not null default now(),primary key(user_id,achievement_id)
);
create table public.optional_child_context (
 user_id uuid primary key references auth.users(id) on delete cascade,
 age_months integer check(age_months between 0 and 12),updated_at timestamptz not null default now()
);
create table public.ai_usage (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),request_count integer not null default 1 check(request_count>0)
);
create index ai_usage_user_created on public.ai_usage(user_id,created_at);

create function public.tinysteps_touch_row() returns trigger language plpgsql set search_path='' as $$
begin new.updated_at=now();return new;end $$;
create function public.tinysteps_preferences_revision() returns trigger language plpgsql set search_path='' as $$
begin new.revision=old.revision+1;new.updated_at=now();return new;end $$;
create trigger profiles_updated before update on public.profiles for each row execute function public.tinysteps_touch_row();
create trigger preferences_updated before update on public.user_preferences for each row execute function public.tinysteps_preferences_revision();
create trigger progress_updated before update on public.learning_progress for each row execute function public.tinysteps_touch_row();
create trigger child_context_updated before update on public.optional_child_context for each row execute function public.tinysteps_touch_row();

create function public.tinysteps_initialize_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(user_id,display_name) values(new.id,left(coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',''),80)) on conflict do nothing;
 insert into public.user_preferences(user_id) values(new.id) on conflict do nothing;
 return new;
end $$;
revoke all on function public.tinysteps_initialize_user() from public,anon,authenticated;
create trigger tinysteps_user_created after insert on auth.users for each row execute function public.tinysteps_initialize_user();
-- Initialize pre-existing identities without modifying their auth configuration.
insert into public.profiles(user_id,display_name) select id,left(coalesce(raw_user_meta_data->>'full_name',raw_user_meta_data->>'name',''),80) from auth.users on conflict do nothing;
insert into public.user_preferences(user_id) select id from auth.users on conflict do nothing;

do $$ declare tab text; begin
 foreach tab in array array['profiles','user_preferences','learning_progress','bookmarks','achievements','optional_child_context','ai_usage'] loop
 execute format('alter table public.%I enable row level security',tab);
 execute format('revoke all on public.%I from anon,authenticated',tab);
 execute format('grant select on public.%I to authenticated',tab);
 execute format('create policy owner_read on public.%I for select to authenticated using ((select auth.uid())=user_id)',tab);
 end loop;
 foreach tab in array array['profiles','user_preferences','learning_progress','bookmarks','optional_child_context'] loop
 execute format('grant insert,update,delete on public.%I to authenticated',tab);
 execute format('create policy owner_insert on public.%I for insert to authenticated with check ((select auth.uid())=user_id)',tab);
 execute format('create policy owner_update on public.%I for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id)',tab);
 execute format('create policy owner_delete on public.%I for delete to authenticated using ((select auth.uid())=user_id)',tab);
 end loop;
end $$;
-- Limit writable preference columns: clients cannot set revision or server timestamps.
revoke insert,update on public.user_preferences from authenticated;
grant insert(user_id,preferences),update(preferences) on public.user_preferences to authenticated;
revoke update on public.profiles from authenticated;
grant update(display_name) on public.profiles to authenticated;

-- The health role receives ONLY execution of a bounded, non-sensitive database read.
create schema if not exists tinysteps_private;
revoke all on schema tinysteps_private from public,anon,authenticated;
create table tinysteps_private.healthcheck(id integer primary key check(id=1),ready boolean not null);
insert into tinysteps_private.healthcheck values(1,true);
create function public.tinysteps_healthcheck() returns boolean language sql stable security definer set search_path='' as $$ select ready from tinysteps_private.healthcheck where id=1 $$;
revoke all on function public.tinysteps_healthcheck() from public,anon,authenticated;
notify pgrst,'reload schema';
