create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null default current_date,
  category text not null check (category in (
    'software_tools',
    'ads_marketing',
    'staff_commission',
    'cloud_server',
    'trading_ops',
    'refund_adjustment',
    'admin_misc',
    'other'
  )),
  description text not null check (char_length(trim(description)) > 0),
  vendor text,
  payment_method text,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD' check (currency in ('USD', 'PHP', 'USDT')),
  usd_amount numeric(12, 2) not null check (usd_amount > 0),
  status text not null default 'approved' check (status in ('draft', 'approved', 'voided')),
  receipt_url text,
  notes text,
  created_by uuid not null default auth.uid() references public.profiles(id) on delete restrict,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists expenses_date_idx on public.expenses(expense_date desc);
create index if not exists expenses_status_idx on public.expenses(status);
create index if not exists expenses_category_idx on public.expenses(category);
create index if not exists expenses_created_by_idx on public.expenses(created_by);

alter table public.expenses enable row level security;

revoke all on public.expenses from anon;
revoke all on public.expenses from authenticated;
grant select, insert, update on public.expenses to authenticated;

drop policy if exists "expenses_ops_select" on public.expenses;
create policy "expenses_ops_select"
on public.expenses
for select
to authenticated
using (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
);

drop policy if exists "expenses_admin_insert" on public.expenses;
create policy "expenses_admin_insert"
on public.expenses
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin')
);

drop policy if exists "expenses_admin_update" on public.expenses;
create policy "expenses_admin_update"
on public.expenses
for update
to authenticated
using (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin')
)
with check (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin')
);

drop trigger if exists set_expenses_updated_at on public.expenses;
create trigger set_expenses_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();
