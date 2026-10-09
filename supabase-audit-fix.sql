-- Fix audit trigger: avoid referencing caption on heart_site_settings.
create or replace function public.heart_audit_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  audit_details text;
begin
  if TG_TABLE_NAME = 'heart_photos' then
    if TG_OP = 'DELETE' then
      audit_details := coalesce(OLD.caption, '');
    else
      audit_details := coalesce(NEW.caption, '');
    end if;
  else
    audit_details := 'Site settings updated';
  end if;

  insert into public.heart_admin_audit (admin_id, action, details)
  values ((select auth.uid()), TG_TABLE_NAME || ' ' || TG_OP, audit_details);

  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$;
revoke all on function public.heart_audit_change() from public, anon, authenticated;
