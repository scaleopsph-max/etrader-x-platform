drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
on public.products
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
on public.products
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "plans_admin_insert" on public.plans;
create policy "plans_admin_insert"
on public.plans
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "plans_admin_update" on public.plans;
create policy "plans_admin_update"
on public.plans
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
on public.orders
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update"
on public.payments
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "subscriptions_admin_insert" on public.subscriptions;
create policy "subscriptions_admin_insert"
on public.subscriptions
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "subscriptions_admin_update" on public.subscriptions;
create policy "subscriptions_admin_update"
on public.subscriptions
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "referrals_admin_insert" on public.referrals;
create policy "referrals_admin_insert"
on public.referrals
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "referrals_admin_update" on public.referrals;
create policy "referrals_admin_update"
on public.referrals
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "commission_requests_admin_update" on public.commission_requests;
create policy "commission_requests_admin_update"
on public.commission_requests
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "audit_logs_admin_insert" on public.audit_logs;
create policy "audit_logs_admin_insert"
on public.audit_logs
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
