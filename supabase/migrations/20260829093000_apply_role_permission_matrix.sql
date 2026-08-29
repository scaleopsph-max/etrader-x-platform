drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin')
)
with check (
  id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin')
);

drop policy if exists "products_public_select_active" on public.products;
create policy "products_public_select_active"
on public.products
for select
to anon, authenticated
using (
  status = 'active'
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
on public.products
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
on public.products
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'))
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "plans_public_select_active" on public.plans;
create policy "plans_public_select_active"
on public.plans
for select
to anon, authenticated
using (
  status = 'active'
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "plans_admin_insert" on public.plans;
create policy "plans_admin_insert"
on public.plans
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "plans_admin_update" on public.plans;
create policy "plans_admin_update"
on public.plans
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'))
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "orders_client_select_own_or_admin" on public.orders;
create policy "orders_client_select_own_or_admin"
on public.orders
for select
to authenticated
using (
  client_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
on public.orders
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'))
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "payments_client_select_own_or_admin" on public.payments;
create policy "payments_client_select_own_or_admin"
on public.payments
for select
to authenticated
using (
  client_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update"
on public.payments
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'))
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "subscriptions_client_select_own_or_admin" on public.subscriptions;
create policy "subscriptions_client_select_own_or_admin"
on public.subscriptions
for select
to authenticated
using (
  client_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "subscriptions_admin_insert" on public.subscriptions;
create policy "subscriptions_admin_insert"
on public.subscriptions
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "subscriptions_admin_update" on public.subscriptions;
create policy "subscriptions_admin_update"
on public.subscriptions
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'))
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "referrals_client_select_related_or_admin" on public.referrals;
create policy "referrals_client_select_related_or_admin"
on public.referrals
for select
to authenticated
using (
  referrer_id = (select auth.uid())
  or referred_client_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "referrals_admin_insert" on public.referrals;
create policy "referrals_admin_insert"
on public.referrals
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "referrals_admin_update" on public.referrals;
create policy "referrals_admin_update"
on public.referrals
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'))
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "commission_requests_client_select_own_or_admin" on public.commission_requests;
create policy "commission_requests_client_select_own_or_admin"
on public.commission_requests
for select
to authenticated
using (
  client_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "commission_requests_admin_update" on public.commission_requests;
create policy "commission_requests_admin_update"
on public.commission_requests
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'))
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "support_tickets_client_select_own_or_admin" on public.support_tickets;
create policy "support_tickets_client_select_own_or_admin"
on public.support_tickets
for select
to authenticated
using (
  client_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "support_tickets_client_update_own_or_admin" on public.support_tickets;
create policy "support_tickets_client_update_own_or_admin"
on public.support_tickets
for update
to authenticated
using (
  client_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
)
with check (
  client_id = (select auth.uid())
  or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
);

drop policy if exists "audit_logs_admin_select" on public.audit_logs;
create policy "audit_logs_admin_select"
on public.audit_logs
for select
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "audit_logs_admin_insert" on public.audit_logs;
create policy "audit_logs_admin_insert"
on public.audit_logs
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager'));

drop policy if exists "admin_roles_privileged_select" on public.admin_roles;
create policy "admin_roles_privileged_select"
on public.admin_roles
for select
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "payment_proofs_client_read_own_or_admin" on storage.objects;
create policy "payment_proofs_client_read_own_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    owner_id::text = (select auth.uid())::text
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin', 'manager')
  )
);

drop policy if exists "payment_proofs_client_update_own_or_admin" on storage.objects;
create policy "payment_proofs_client_update_own_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    owner_id::text = (select auth.uid())::text
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin')
  )
)
with check (
  bucket_id = 'payment-proofs'
  and (
    owner_id::text = (select auth.uid())::text
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin')
  )
);
