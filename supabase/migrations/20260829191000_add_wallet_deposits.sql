alter table public.profiles
  add column if not exists wallet_balance numeric(12, 2) not null default 0 check (wallet_balance >= 0);

do $$
begin
  alter type public.payment_method add value if not exists 'wallet';
exception
  when duplicate_object then null;
end $$;

create table if not exists public.deposit_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  method public.payment_method not null,
  status text not null default 'under_review' check (status in ('under_review', 'approved', 'rejected', 'cancelled')),
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD',
  transaction_reference text not null,
  proof_path text,
  proof_file_name text,
  proof_file_size integer,
  proof_file_type text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamp with time zone,
  review_notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('deposit', 'purchase', 'refund', 'adjustment', 'commission')),
  direction text not null check (direction in ('credit', 'debit')),
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD',
  balance_after numeric(12, 2) not null default 0,
  related_table text,
  related_id uuid,
  description text,
  created_at timestamp with time zone not null default now()
);

create index if not exists deposit_requests_client_created_idx on public.deposit_requests(client_id, created_at desc);
create index if not exists deposit_requests_status_created_idx on public.deposit_requests(status, created_at desc);
create index if not exists wallet_transactions_client_created_idx on public.wallet_transactions(client_id, created_at desc);

alter table public.deposit_requests enable row level security;
alter table public.wallet_transactions enable row level security;

revoke all on public.deposit_requests from anon;
revoke all on public.wallet_transactions from anon;
revoke all on public.deposit_requests from authenticated;
revoke all on public.wallet_transactions from authenticated;

grant select, insert, update on public.deposit_requests to authenticated;
grant select, insert on public.wallet_transactions to authenticated;

drop policy if exists "deposit_requests_select_owner_or_ops" on public.deposit_requests;
create policy "deposit_requests_select_owner_or_ops" on public.deposit_requests
  for select
  to authenticated
  using (
    client_id = (select auth.uid())
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

drop policy if exists "deposit_requests_client_insert_own" on public.deposit_requests;
create policy "deposit_requests_client_insert_own" on public.deposit_requests
  for insert
  to authenticated
  with check (client_id = (select auth.uid()) and status = 'under_review');

drop policy if exists "deposit_requests_ops_update" on public.deposit_requests;
create policy "deposit_requests_ops_update" on public.deposit_requests
  for update
  to authenticated
  using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'))
  with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

drop policy if exists "wallet_transactions_select_owner_or_ops" on public.wallet_transactions;
create policy "wallet_transactions_select_owner_or_ops" on public.wallet_transactions
  for select
  to authenticated
  using (
    client_id = (select auth.uid())
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

create or replace function public.purchase_plan_with_wallet(target_plan_id uuid, referral_code text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  buyer_id uuid := auth.uid();
  buyer public.profiles%rowtype;
  selected_plan record;
  new_order_id uuid;
  new_payment_id uuid;
  new_subscription_id uuid;
  duration integer;
  new_balance numeric(12, 2);
  referrer_id uuid;
begin
  if buyer_id is null then
    raise exception 'Authentication required';
  end if;

  select * into buyer from public.profiles where id = buyer_id for update;
  if buyer.id is null then
    raise exception 'Profile not found';
  end if;

  select plans.*, products.id as product_id, products.name as product_name
  into selected_plan
  from public.plans
  join public.products on products.id = plans.product_id
  where plans.id = target_plan_id
    and plans.status = 'active'
    and products.status = 'active';

  if selected_plan.id is null then
    raise exception 'Plan is not available';
  end if;

  if selected_plan.price_amount > buyer.wallet_balance then
    raise exception 'Insufficient wallet balance';
  end if;

  new_balance := buyer.wallet_balance - selected_plan.price_amount;
  update public.profiles set wallet_balance = new_balance where id = buyer_id;

  insert into public.orders (client_id, plan_id, status, total_amount, currency, referral_code_used, notes)
  values (buyer_id, selected_plan.id, 'approved', selected_plan.price_amount, selected_plan.currency, nullif(upper(trim(referral_code)), ''), 'Paid using wallet balance')
  returning id into new_order_id;

  execute 'insert into public.payments (order_id, client_id, method, status, amount, currency, transaction_reference, reviewed_at, review_notes) values ($1, $2, $3::public.payment_method, $4, $5, $6, $7, now(), $8) returning id'
  using new_order_id, buyer_id, 'wallet', 'approved'::public.payment_status, selected_plan.price_amount, selected_plan.currency, 'wallet-' || new_order_id::text, 'Auto-approved wallet purchase'
  into new_payment_id;

  duration := selected_plan.duration_days + selected_plan.bonus_days;
  insert into public.subscriptions (client_id, product_id, plan_id, order_id, status, expires_at, activated_by)
  values (buyer_id, selected_plan.product_id, selected_plan.id, new_order_id, case when selected_plan.price_amount = 0 then 'trial'::public.subscription_status else 'active'::public.subscription_status end, now() + make_interval(days => duration), buyer_id)
  returning id into new_subscription_id;

  insert into public.wallet_transactions (client_id, type, direction, amount, currency, balance_after, related_table, related_id, description)
  values (buyer_id, 'purchase', 'debit', selected_plan.price_amount, selected_plan.currency, new_balance, 'orders', new_order_id, 'Wallet purchase: ' || selected_plan.product_name || ' / ' || selected_plan.name);

  if nullif(upper(trim(referral_code)), '') is not null then
    select id into referrer_id from public.profiles where referral_code = upper(trim(referral_code)) and id <> buyer_id;
    if referrer_id is not null then
      insert into public.referrals (referrer_id, referred_client_id, order_id, commission_amount, commission_status)
      values (referrer_id, buyer_id, new_order_id, round(selected_plan.price_amount * 0.05, 2), 'available')
      on conflict (referrer_id, referred_client_id) do update
      set order_id = excluded.order_id,
          commission_amount = excluded.commission_amount,
          commission_status = 'available',
          updated_at = now();
    end if;
  end if;

  return jsonb_build_object('order_id', new_order_id, 'payment_id', new_payment_id, 'subscription_id', new_subscription_id, 'wallet_balance', new_balance);
end;
$$;

revoke all on function public.purchase_plan_with_wallet(uuid, text) from public;
revoke all on function public.purchase_plan_with_wallet(uuid, text) from anon;
grant execute on function public.purchase_plan_with_wallet(uuid, text) to authenticated;

drop trigger if exists set_deposit_requests_updated_at on public.deposit_requests;
create trigger set_deposit_requests_updated_at
before update on public.deposit_requests
for each row execute function public.set_updated_at();
