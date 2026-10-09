-- Run once in Supabase SQL Editor to enable the new features.
alter table public.heart_visits add column if not exists browser_type text;
-- Browser information is optional for historical visits.
grant insert (browser_type) on public.heart_visits to anon, authenticated;

create table if not exists public.heart_site_settings (
  id integer primary key default 1 check (id = 1),
  messages jsonb not null default '["Every heartbeat is for you ❤️","You make my world brighter ✨","Forever LF ❤️ LM"]'::jsonb,
  anniversary_date date,
  heart_size numeric not null default 1 check (heart_size between 0.5 and 1.6),
  particle_speed numeric not null default 1 check (particle_speed between 0.2 and 3),
  heart_color text not null default '#c878ff' check (heart_color ~ '^#[0-9a-fA-F]{6}$'),
  updated_at timestamptz not null default now()
);
insert into public.heart_site_settings(id) values(1) on conflict(id) do nothing;
alter table public.heart_site_settings enable row level security;
revoke all on public.heart_site_settings from anon, authenticated;
grant select on public.heart_site_settings to anon, authenticated;
grant update (messages,anniversary_date,heart_size,particle_speed,heart_color,updated_at)
  on public.heart_site_settings to authenticated;
drop policy if exists "public can read heart appearance" on public.heart_site_settings;
create policy "public can read heart appearance" on public.heart_site_settings
 for select to anon, authenticated using (true);
drop policy if exists "only admins can change heart appearance" on public.heart_site_settings;
create policy "only admins can change heart appearance" on public.heart_site_settings
 for update to authenticated
 using (exists(select 1 from public.heart_admins a where a.user_id=(select auth.uid())))
 with check (exists(select 1 from public.heart_admins a where a.user_id=(select auth.uid())));
