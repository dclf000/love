-- Run once in Supabase SQL Editor to enable secure admin-only MP3 uploads.
-- Public playback is permitted; uploads/deletes require an authenticated heart_admins member.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('heart-music','heart-music',true,20971520,array['audio/mpeg','audio/mp3'])
on conflict(id) do update set public=true,file_size_limit=20971520,allowed_mime_types=array['audio/mpeg','audio/mp3'];

drop policy if exists "heart music public playback" on storage.objects;
create policy "heart music public playback" on storage.objects
for select to anon,authenticated using(bucket_id='heart-music');

drop policy if exists "heart music admin upload" on storage.objects;
create policy "heart music admin upload" on storage.objects
for insert to authenticated
with check(bucket_id='heart-music' and exists
 (select 1 from public.heart_admins where user_id=(select auth.uid())));

drop policy if exists "heart music admin delete" on storage.objects;
create policy "heart music admin delete" on storage.objects
for delete to authenticated
using(bucket_id='heart-music' and exists
 (select 1 from public.heart_admins where user_id=(select auth.uid())));
