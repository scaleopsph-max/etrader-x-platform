create table if not exists public.exchange_rates (
  quote_currency text primary key,
  base_currency text not null default 'USD',
  live_rate numeric(12, 4) not null check (live_rate > 0),
  markup_amount numeric(12, 4) not null default 0 check (markup_amount >= 0),
  manual_rate numeric(12, 4) check (manual_rate is null or manual_rate > 0),
  final_rate numeric(12, 4) generated always as (coalesce(manual_rate, live_rate + markup_amount)) stored,
  source text not null default 'manual',
  auto_enabled boolean not null default true,
  fetched_at timestamp with time zone,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  constraint exchange_rates_currency_pair_check check (base_currency = 'USD' and quote_currency in ('PHP'))
);

alter table public.exchange_rates enable row level security;

revoke all on public.exchange_rates from anon;
revoke all on public.exchange_rates from authenticated;
grant select, insert, update on public.exchange_rates to authenticated;

drop policy if exists "exchange_rates_authenticated_read" on public.exchange_rates;
create policy "exchange_rates_authenticated_read" on public.exchange_rates
  for select
  to authenticated
  using (true);

drop policy if exists "exchange_rates_admin_write" on public.exchange_rates;
create policy "exchange_rates_admin_write" on public.exchange_rates
  for insert
  to authenticated
  with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

drop policy if exists "exchange_rates_admin_update" on public.exchange_rates;
create policy "exchange_rates_admin_update" on public.exchange_rates
  for update
  to authenticated
  using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'))
  with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

insert into public.exchange_rates (quote_currency, live_rate, markup_amount, manual_rate, source, auto_enabled)
values ('PHP', 56.5000, 0.5000, null, 'manual_seed', true)
on conflict (quote_currency) do nothing;

alter table public.deposit_requests
  add column if not exists paid_amount numeric(12, 2),
  add column if not exists paid_currency text not null default 'USD',
  add column if not exists exchange_rate numeric(12, 4),
  add column if not exists exchange_markup numeric(12, 4) not null default 0,
  add column if not exists platform_rate numeric(12, 4),
  add column if not exists wallet_credit_amount numeric(12, 2);

update public.deposit_requests
set paid_amount = coalesce(paid_amount, amount),
    paid_currency = coalesce(nullif(paid_currency, ''), currency, 'USD'),
    wallet_credit_amount = coalesce(wallet_credit_amount, amount),
    platform_rate = coalesce(platform_rate, case when currency = 'USD' then 1 else platform_rate end),
    exchange_rate = coalesce(exchange_rate, case when currency = 'USD' then 1 else exchange_rate end)
where paid_amount is null or wallet_credit_amount is null;

create index if not exists exchange_rates_updated_at_idx on public.exchange_rates(updated_at desc);
create index if not exists exchange_rates_updated_by_idx on public.exchange_rates(updated_by);
create index if not exists deposit_requests_paid_currency_idx on public.deposit_requests(paid_currency, created_at desc);

drop function if exists public.approve_wallet_deposit(uuid, text);

create or replace function public.approve_wallet_deposit(target_deposit_id uuid, review_note text default null, approved_wallet_credit numeric default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  reviewer_id uuid := auth.uid();
  reviewer_role text;
  deposit public.deposit_requests%rowtype;
  next_balance numeric(12, 2);
  credit_amount numeric(12, 2);
begin
  if reviewer_id is null then
    raise exception 'Authentication required';
  end if;

  reviewer_role := coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '');
  if reviewer_role not in ('super_user', 'admin') then
    raise exception 'Admin permission required';
  end if;

  select * into deposit
  from public.deposit_requests
  where id = target_deposit_id
  for update;

  if deposit.id is null then
    raise exception 'Deposit not found';
  end if;

  if deposit.status = 'approved' then
    raise exception 'Deposit is already approved';
  end if;

  if deposit.status = 'cancelled' then
    raise exception 'Cancelled deposit cannot be approved';
  end if;

  credit_amount := coalesce(approved_wallet_credit, deposit.wallet_credit_amount, deposit.amount);
  if credit_amount is null or credit_amount <= 0 then
    raise exception 'Wallet credit amount must be greater than zero';
  end if;

  select wallet_balance + credit_amount into next_balance
  from public.profiles
  where id = deposit.client_id
  for update;

  update public.profiles
  set wallet_balance = next_balance
  where id = deposit.client_id;

  update public.deposit_requests
  set status = 'approved',
      amount = credit_amount,
      currency = 'USD',
      wallet_credit_amount = credit_amount,
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      review_notes = review_note,
      updated_at = now()
  where id = deposit.id;

  insert into public.wallet_transactions (client_id, type, direction, amount, currency, balance_after, related_table, related_id, description)
  values (deposit.client_id, 'deposit', 'credit', credit_amount, 'USD', next_balance, 'deposit_requests', deposit.id, 'Approved wallet deposit');

  return jsonb_build_object('client_id', deposit.client_id, 'wallet_balance', next_balance, 'deposit_id', deposit.id, 'wallet_credit_amount', credit_amount);
end;
$$;

revoke all on function public.approve_wallet_deposit(uuid, text, numeric) from public;
revoke all on function public.approve_wallet_deposit(uuid, text, numeric) from anon;
grant execute on function public.approve_wallet_deposit(uuid, text, numeric) to authenticated;

drop trigger if exists set_exchange_rates_updated_at on public.exchange_rates;
create trigger set_exchange_rates_updated_at
before update on public.exchange_rates
for each row execute function public.set_updated_at();
