-- Run in Supabase SQL Editor before using the new gallery, music and audit features.
create table if not exists public.heart_photos (
 id uuid primary key default gen_random_uuid(),
 storage_path text not null unique,
 caption text not null default '',
 memory_date date,
 created_at timestamptz not null default now()
);
alter table public.heart_photos enable row level security;
grant select on public.heart_photos to anon,authenticated;
grant insert,update,delete on public.heart_photos to authenticated;
create policy "photos visible to visitors" on public.heart_photos for select to anon,authenticated using(true);
create policy "admins manage photos" on public.heart_photos for all to authenticated
 using(exists(select 1 from public.heart_admins where user_id=(select auth.uid())))
 with check(exists(select 1 from public.heart_admins where user_id=(select auth.uid())));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('heart-memories','heart-memories',true,10485760,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict(id) do update set public=true,file_size_limit=10485760,allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif'];
create policy "public read heart photos" on storage.objects for select to anon,authenticated
 using(bucket_id='heart-memories');
create policy "admin upload heart photos" on storage.objects for insert to authenticated
 with check(bucket_id='heart-memories' and exists(select 1 from public.heart_admins where user_id=(select auth.uid())));
create policy "admin delete heart photos" on storage.objects for delete to authenticated
 using(bucket_id='heart-memories' and exists(select 1 from public.heart_admins where user_id=(select auth.uid())));

alter table public.heart_site_settings add column if not exists music_url text not null default '';
alter table public.heart_site_settings add column if not exists music_volume numeric not null default 0.35;
alter table public.heart_site_settings add constraint heart_music_volume_range check(music_volume between 0 and 1);
grant update(music_url,music_volume) on public.heart_site_settings to authenticated;

create table if not exists public.heart_admin_audit (
 id bigint generated always as identity primary key,
 happened_at timestamptz not null default now(),
 admin_id uuid,
 action text not null,
 details text not null default ''
);
alter table public.heart_admin_audit enable row level security;
grant select on public.heart_admin_audit to authenticated;
create policy "admins read audit" on public.heart_admin_audit for select to authenticated
 using(exists(select 1 from public.heart_admins where user_id=(select auth.uid())));

create or replace function public.heart_audit_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.heart_admin_audit(admin_id,action,details)
 values((select auth.uid()),TG_TABLE_NAME||' '||TG_OP,
 case when TG_TABLE_NAME='heart_photos' then coalesce(new.caption,old.caption,'')
 else 'Site settings updated' end);
 return coalesce(new,old);
end $$;
revoke all on function public.heart_audit_change() from public,anon,authenticated;
drop trigger if exists heart_settings_audit on public.heart_site_settings;
create trigger heart_settings_audit after update on public.heart_site_settings
 for each row execute function public.heart_audit_change();
drop trigger if exists heart_photos_audit on public.heart_photos;
create trigger heart_photos_audit after insert or update or delete on public.heart_photos
 for each row execute function public.heart_audit_change();
