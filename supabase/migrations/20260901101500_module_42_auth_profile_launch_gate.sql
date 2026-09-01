create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  requested_role text := coalesce(new.raw_app_meta_data ->> 'role', 'client');
  profile_role public.app_role := 'client';
  base_code text;
begin
  if requested_role in ('super_user', 'admin', 'manager') then
    profile_role := requested_role::public.app_role;
  end if;

  base_code := upper(regexp_replace(split_part(coalesce(new.email, new.id::text), '@', 1), '[^a-zA-Z0-9]', '', 'g'));
  if char_length(base_code) < 4 then
    base_code := 'ETX' || upper(substring(replace(new.id::text, '-', '') from 1 for 8));
  else
    base_code := substring(base_code from 1 for 8) || upper(substring(replace(new.id::text, '-', '') from 1 for 4));
  end if;

  insert into public.profiles (
    id,
    role,
    full_name,
    email,
    telegram_username,
    referral_code,
    status
  )
  values (
    new.id,
    profile_role,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'telegram_username', ''),
    base_code,
    'active'
  )
  on conflict (id) do update
  set email = excluded.email,
      role = case
        when excluded.role in ('super_user', 'admin', 'manager') then excluded.role
        else public.profiles.role
      end,
      updated_at = now();

  return new;
end;
$$;

revoke execute on function public.handle_new_auth_user_profile() from public;
revoke execute on function public.handle_new_auth_user_profile() from anon;
revoke execute on function public.handle_new_auth_user_profile() from authenticated;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user_profile();

insert into public.profiles (
  id,
  role,
  full_name,
  email,
  telegram_username,
  referral_code,
  status
)
select
  u.id,
  case
    when u.raw_app_meta_data ->> 'role' in ('super_user', 'admin', 'manager') then (u.raw_app_meta_data ->> 'role')::public.app_role
    else 'client'::public.app_role
  end,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  u.email,
  coalesce(u.raw_user_meta_data ->> 'telegram_username', ''),
  case
    when char_length(upper(regexp_replace(split_part(coalesce(u.email, u.id::text), '@', 1), '[^a-zA-Z0-9]', '', 'g'))) < 4
      then 'ETX' || upper(substring(replace(u.id::text, '-', '') from 1 for 8))
    else substring(upper(regexp_replace(split_part(coalesce(u.email, u.id::text), '@', 1), '[^a-zA-Z0-9]', '', 'g')) from 1 for 8) || upper(substring(replace(u.id::text, '-', '') from 1 for 4))
  end,
  'active'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
