-- Run in Supabase SQL Editor. The publishable key is safe in client code;
-- NEVER put a service_role/secret key in this public repository.
create table if not exists public.heart_visits (
  id bigint generated always as identity primary key,
  visited_at timestamptz not null default now(),
  event_type text not null check (event_type in ('page_view','home_screen_launch')),
  device_type text not null check (device_type in ('iOS','Android','Desktop/Other')),
  display_mode text not null check (display_mode in ('standalone','browser')),
  session_id uuid not null
);
create index if not exists heart_visits_visited_at_idx on public.heart_visits (visited_at desc);

create table if not exists public.heart_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.heart_visits enable row level security;
alter table public.heart_admins enable row level security;

revoke all on public.heart_visits from anon, authenticated;
revoke all on public.heart_admins from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant insert (event_type, device_type, display_mode, session_id)
  on public.heart_visits to anon, authenticated;
grant select on public.heart_visits to authenticated;
grant select on public.heart_admins to authenticated;

drop policy if exists "record public visit" on public.heart_visits;
create policy "record public visit" on public.heart_visits
  for insert to anon, authenticated with check (true);
drop policy if exists "admin can view visits" on public.heart_visits;
create policy "admin can view visits" on public.heart_visits
  for select to authenticated using (
    exists (select 1 from public.heart_admins a where a.user_id = (select auth.uid()))
  );
drop policy if exists "admin can view own role" on public.heart_admins;
create policy "admin can view own role" on public.heart_admins
  for select to authenticated using (user_id = (select auth.uid()));

-- AFTER creating your admin in Authentication > Users, run this separately
-- replacing the placeholder with that user's actual UUID:
-- insert into public.heart_admins (user_id) values ('YOUR_AUTH_USER_UUID');
