create index if not exists expenses_updated_by_idx
on public.expenses(updated_by);

create index if not exists landing_creatives_created_by_idx
on public.landing_creatives(created_by);

create index if not exists landing_creatives_updated_by_idx
on public.landing_creatives(updated_by);

create index if not exists pam_faq_entries_created_by_idx
on public.pam_faq_entries(created_by);

create index if not exists pam_faq_entries_updated_by_idx
on public.pam_faq_entries(updated_by);

drop policy if exists "landing_creatives_public_active_select" on public.landing_creatives;
drop policy if exists "landing_creatives_ops_select" on public.landing_creatives;

create policy "landing_creatives_anon_active_select"
on public.landing_creatives
for select
to anon
using (
  status = 'active'
  and (promo_starts_at is null or promo_starts_at <= now())
  and (promo_ends_at is null or promo_ends_at >= now())
);

create policy "landing_creatives_authenticated_select"
on public.landing_creatives
for select
to authenticated
using (
  (
    status = 'active'
    and (promo_starts_at is null or promo_starts_at <= now())
    and (promo_ends_at is null or promo_ends_at >= now())
  )
  or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
);

drop policy if exists "pam_faq_entries_public_active_select" on public.pam_faq_entries;
drop policy if exists "pam_faq_entries_ops_select" on public.pam_faq_entries;

create policy "pam_faq_entries_anon_active_select"
on public.pam_faq_entries
for select
to anon
using (status = 'active');

create policy "pam_faq_entries_authenticated_select"
on public.pam_faq_entries
for select
to authenticated
using (
  status = 'active'
  or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
);
