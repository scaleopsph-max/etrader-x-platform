drop policy if exists "products_anon_active_select" on public.products;
drop policy if exists "products_authenticated_select" on public.products;
drop policy if exists "products_public_select_active" on public.products;

create policy "products_select_active_or_ops" on public.products
  for select
  to anon, authenticated
  using (
    status = 'active'
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

drop policy if exists "plans_anon_active_select" on public.plans;
drop policy if exists "plans_authenticated_select" on public.plans;
drop policy if exists "plans_public_select_active" on public.plans;

create policy "plans_select_active_or_ops" on public.plans
  for select
  to anon, authenticated
  using (
    (
      status = 'active'
      and exists (
        select 1
        from public.products
        where products.id = plans.product_id
          and products.status = 'active'
      )
    )
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

drop policy if exists "referrals_admin_update" on public.referrals;
drop policy if exists "referrals_client_mark_available_requested" on public.referrals;

create policy "referrals_update_admin_or_withdrawal_request" on public.referrals
  for update
  to authenticated
  using (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin')
    or ((select auth.uid()) = referrer_id and commission_status = 'available')
  )
  with check (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin')
    or ((select auth.uid()) = referrer_id and commission_status = 'requested')
  );
