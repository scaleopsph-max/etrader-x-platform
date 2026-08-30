create table if not exists public.landing_creatives (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  title text not null,
  subtitle text,
  body text,
  image_url text,
  cta_label text,
  cta_url text,
  promo_starts_at timestamptz,
  promo_ends_at timestamptz,
  status public.record_status not null default 'draft',
  sort_order integer not null default 100,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint landing_creatives_section_key_format check (section_key ~ '^[a-z][a-z0-9_]{1,48}$'),
  constraint landing_creatives_promo_window check (promo_ends_at is null or promo_starts_at is null or promo_ends_at > promo_starts_at)
);

alter table public.landing_creatives enable row level security;

drop trigger if exists landing_creatives_set_updated_at on public.landing_creatives;
create trigger landing_creatives_set_updated_at
before update on public.landing_creatives
for each row execute function public.set_updated_at();

create index if not exists landing_creatives_status_sort_idx on public.landing_creatives(status, sort_order);
create index if not exists landing_creatives_section_status_idx on public.landing_creatives(section_key, status);
create index if not exists landing_creatives_promo_window_idx on public.landing_creatives(promo_starts_at, promo_ends_at);

revoke all on public.landing_creatives from anon;
revoke all on public.landing_creatives from authenticated;
grant select on public.landing_creatives to anon, authenticated;
grant insert, update on public.landing_creatives to authenticated;

drop policy if exists "landing_creatives_public_active_select" on public.landing_creatives;
create policy "landing_creatives_public_active_select"
on public.landing_creatives
for select
to anon, authenticated
using (
  status = 'active'
  and (promo_starts_at is null or promo_starts_at <= now())
  and (promo_ends_at is null or promo_ends_at >= now())
);

drop policy if exists "landing_creatives_ops_select" on public.landing_creatives;
create policy "landing_creatives_ops_select"
on public.landing_creatives
for select
to authenticated
using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager'));

drop policy if exists "landing_creatives_admin_insert" on public.landing_creatives;
create policy "landing_creatives_admin_insert"
on public.landing_creatives
for insert
to authenticated
with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

drop policy if exists "landing_creatives_admin_update" on public.landing_creatives;
create policy "landing_creatives_admin_update"
on public.landing_creatives
for update
to authenticated
using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'))
with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

insert into public.landing_creatives (section_key, title, subtitle, body, cta_label, cta_url, status, sort_order)
values
  ('hero', 'ETrader-X Trading Tools', 'Premium trading access for ETX clients.', 'Manage wallet deposits, subscriptions, referrals, and support through the ETX client portal.', 'Open Client Portal', 'client.html', 'draft', 10),
  ('upcoming_promo', 'Upcoming ETX Promo', 'Prepare for the next access drop.', 'Use this slot for limited-time announcements, bonus months, or launch campaigns.', 'View Plans', 'client.html', 'draft', 20)
on conflict do nothing;
