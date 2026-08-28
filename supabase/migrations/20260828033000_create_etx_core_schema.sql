create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum ('client', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.record_status as enum ('draft', 'active', 'hidden', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum ('draft', 'pending_payment', 'under_review', 'approved', 'rejected', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_method as enum ('gcash', 'bpi', 'usdt_bep20', 'usdt_trc20', 'crypto_other');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum ('pending', 'under_review', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_status as enum ('trial', 'active', 'expired', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.commission_status as enum ('pending', 'available', 'requested', 'approved', 'paid', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.ticket_status as enum ('open', 'pending_admin', 'pending_client', 'resolved', 'closed');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public;
revoke execute on function public.set_updated_at() from anon;
revoke execute on function public.set_updated_at() from authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'client',
  full_name text,
  email text,
  telegram_username text,
  referral_code text unique,
  referred_by uuid references public.profiles(id) on delete set null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  category text not null,
  description text,
  status public.record_status not null default 'draft',
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price_amount numeric(12, 2) not null check (price_amount >= 0),
  currency text not null default 'USD',
  duration_days integer not null check (duration_days > 0),
  bonus_days integer not null default 0 check (bonus_days >= 0),
  is_trial boolean not null default false,
  status public.record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete restrict,
  status public.order_status not null default 'pending_payment',
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  currency text not null default 'USD',
  referral_code_used text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  method public.payment_method not null,
  status public.payment_status not null default 'pending',
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'USD',
  transaction_reference text,
  proof_path text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  plan_id uuid references public.plans(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  status public.subscription_status not null default 'active',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  activated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_client_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  commission_amount numeric(12, 2) not null default 0 check (commission_amount >= 0),
  commission_status public.commission_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (referrer_id, referred_client_id)
);

create table if not exists public.commission_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  status public.commission_status not null default 'requested',
  payout_method text not null,
  payout_details text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status public.ticket_status not null default 'open',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_referral_code_idx on public.profiles(referral_code);
create index if not exists products_status_idx on public.products(status);
create index if not exists plans_product_id_idx on public.plans(product_id);
create index if not exists orders_client_id_idx on public.orders(client_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists payments_order_id_idx on public.payments(order_id);
create index if not exists payments_client_id_idx on public.payments(client_id);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists subscriptions_client_id_idx on public.subscriptions(client_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
create index if not exists referrals_referrer_id_idx on public.referrals(referrer_id);
create index if not exists commission_requests_client_id_idx on public.commission_requests(client_id);
create index if not exists support_tickets_client_id_idx on public.support_tickets(client_id);
create index if not exists audit_logs_actor_id_idx on public.audit_logs(actor_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_plans_updated_at on public.plans;
create trigger set_plans_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists set_referrals_updated_at on public.referrals;
create trigger set_referrals_updated_at
before update on public.referrals
for each row execute function public.set_updated_at();

drop trigger if exists set_commission_requests_updated_at on public.commission_requests;
create trigger set_commission_requests_updated_at
before update on public.commission_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_support_tickets_updated_at on public.support_tickets;
create trigger set_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.plans enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.referrals enable row level security;
alter table public.commission_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) = id
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) = id
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  (select auth.uid()) = id
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "products_public_active_select" on public.products;
create policy "products_public_active_select"
on public.products
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
on public.products
for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "plans_public_active_select" on public.plans;
create policy "plans_public_active_select"
on public.plans
for select
to anon, authenticated
using (
  status = 'active'
  and exists (
    select 1
    from public.products
    where products.id = plans.product_id
      and products.status = 'active'
  )
);

drop policy if exists "plans_admin_all" on public.plans;
create policy "plans_admin_all"
on public.plans
for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "orders_client_select_own_or_admin" on public.orders;
create policy "orders_client_select_own_or_admin"
on public.orders
for select
to authenticated
using (
  (select auth.uid()) = client_id
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "orders_client_insert_own" on public.orders;
create policy "orders_client_insert_own"
on public.orders
for insert
to authenticated
with check ((select auth.uid()) = client_id);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
on public.orders
for update
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "payments_client_select_own_or_admin" on public.payments;
create policy "payments_client_select_own_or_admin"
on public.payments
for select
to authenticated
using (
  (select auth.uid()) = client_id
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "payments_client_insert_own" on public.payments;
create policy "payments_client_insert_own"
on public.payments
for insert
to authenticated
with check ((select auth.uid()) = client_id);

drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update"
on public.payments
for update
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "subscriptions_client_select_own_or_admin" on public.subscriptions;
create policy "subscriptions_client_select_own_or_admin"
on public.subscriptions
for select
to authenticated
using (
  (select auth.uid()) = client_id
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "subscriptions_admin_all" on public.subscriptions;
create policy "subscriptions_admin_all"
on public.subscriptions
for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "referrals_client_select_related_or_admin" on public.referrals;
create policy "referrals_client_select_related_or_admin"
on public.referrals
for select
to authenticated
using (
  (select auth.uid()) in (referrer_id, referred_client_id)
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "referrals_admin_all" on public.referrals;
create policy "referrals_admin_all"
on public.referrals
for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "commission_requests_client_select_own_or_admin" on public.commission_requests;
create policy "commission_requests_client_select_own_or_admin"
on public.commission_requests
for select
to authenticated
using (
  (select auth.uid()) = client_id
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "commission_requests_client_insert_own" on public.commission_requests;
create policy "commission_requests_client_insert_own"
on public.commission_requests
for insert
to authenticated
with check ((select auth.uid()) = client_id);

drop policy if exists "commission_requests_admin_update" on public.commission_requests;
create policy "commission_requests_admin_update"
on public.commission_requests
for update
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "support_tickets_client_select_own_or_admin" on public.support_tickets;
create policy "support_tickets_client_select_own_or_admin"
on public.support_tickets
for select
to authenticated
using (
  (select auth.uid()) = client_id
  or assigned_to = (select auth.uid())
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "support_tickets_client_insert_own" on public.support_tickets;
create policy "support_tickets_client_insert_own"
on public.support_tickets
for insert
to authenticated
with check ((select auth.uid()) = client_id);

drop policy if exists "support_tickets_client_update_own_or_admin" on public.support_tickets;
create policy "support_tickets_client_update_own_or_admin"
on public.support_tickets
for update
to authenticated
using (
  (select auth.uid()) = client_id
  or assigned_to = (select auth.uid())
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  (select auth.uid()) = client_id
  or assigned_to = (select auth.uid())
  or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "audit_logs_admin_select" on public.audit_logs;
create policy "audit_logs_admin_select"
on public.audit_logs
for select
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "audit_logs_admin_insert" on public.audit_logs;
create policy "audit_logs_admin_insert"
on public.audit_logs
for insert
to authenticated
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into public.products (name, code, category, description, status, sort_order)
values
  ('ETX SAFY Expert Advisor', 'SAFY-EA', 'expert_advisor', 'Basic, Advance, Premium, and Promo EA plans.', 'active', 10),
  ('ETX VIP Signal', 'VIP-SIGNAL', 'signal', 'VIP signal subscriptions with promo duration options.', 'active', 20),
  ('Yugo Ashi Indicator', 'YUGO-ASHI', 'indicator', 'Indicator access with trial and paid subscriptions.', 'active', 30),
  ('Elite X Package', 'ELITE-X', 'academy_package', 'Academy package entry product.', 'active', 40),
  ('Pro-X Package', 'PRO-X', 'academy_package', 'Premium academy package product.', 'active', 50)
on conflict (code) do update
set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.plans (product_id, name, price_amount, currency, duration_days, bonus_days, is_trial, status)
select p.id, plan_data.name, plan_data.price_amount, plan_data.currency, plan_data.duration_days, plan_data.bonus_days, plan_data.is_trial, 'active'::public.record_status
from public.products p
join (
  values
    ('SAFY-EA', 'Basic Plan', 100.00, 'USD', 30, 0, false),
    ('SAFY-EA', 'Advance Plan', 200.00, 'USD', 30, 0, false),
    ('SAFY-EA', 'Premium Plan', 300.00, 'USD', 30, 0, false),
    ('SAFY-EA', 'Promo Plan', 400.00, 'USD', 365, 60, false),
    ('VIP-SIGNAL', 'VIP 1 Month', 100.00, 'USD', 30, 0, false),
    ('VIP-SIGNAL', 'VIP 3 Months', 250.00, 'USD', 90, 0, false),
    ('VIP-SIGNAL', 'VIP 6 Months', 450.00, 'USD', 180, 0, false),
    ('VIP-SIGNAL', 'VIP 12 Months + 2 Free', 800.00, 'USD', 365, 60, false),
    ('YUGO-ASHI', 'Free 7 Days', 0.00, 'USD', 7, 0, true),
    ('ELITE-X', 'Elite X Package', 130.00, 'USD', 365, 0, false),
    ('PRO-X', 'Pro-X Package', 300.00, 'USD', 365, 0, false)
) as plan_data(product_code, name, price_amount, currency, duration_days, bonus_days, is_trial)
  on p.code = plan_data.product_code
where not exists (
  select 1
  from public.plans existing
  where existing.product_id = p.id
    and existing.name = plan_data.name
);
