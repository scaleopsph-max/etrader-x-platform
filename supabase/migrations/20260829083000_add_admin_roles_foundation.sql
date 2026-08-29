alter type public.app_role add value if not exists 'super_user';
alter type public.app_role add value if not exists 'manager';

create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  role_key text not null unique,
  name text not null,
  description text,
  is_system boolean not null default false,
  sort_order integer not null default 100,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_roles_key_format check (role_key ~ '^[a-z][a-z0-9_]{1,48}$')
);

alter table public.admin_roles enable row level security;

drop trigger if exists admin_roles_set_updated_at on public.admin_roles;
create trigger admin_roles_set_updated_at
before update on public.admin_roles
for each row execute function public.set_updated_at();

insert into public.admin_roles (role_key, name, description, is_system, sort_order)
values
  ('super_user', 'SUPER USER', 'Full operations access plus role registry management.', true, 10),
  ('admin', 'ADMIN', 'Full operations access for products, payments, subscriptions, referrals, support, and reports.', true, 20),
  ('manager', 'MANAGER', 'Operations access for review, monitoring, and client support.', true, 30)
on conflict (role_key) do update
set
  name = excluded.name,
  description = excluded.description,
  is_system = excluded.is_system,
  sort_order = excluded.sort_order;

grant select on public.admin_roles to authenticated;
grant insert, update on public.admin_roles to authenticated;

drop policy if exists "admin_roles_privileged_select" on public.admin_roles;
create policy "admin_roles_privileged_select"
on public.admin_roles
for select
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') in ('super_user', 'admin'));

drop policy if exists "admin_roles_super_user_insert" on public.admin_roles;
create policy "admin_roles_super_user_insert"
on public.admin_roles
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'super_user');

drop policy if exists "admin_roles_super_user_update" on public.admin_roles;
create policy "admin_roles_super_user_update"
on public.admin_roles
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'super_user')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'super_user');

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
