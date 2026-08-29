create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  method_key public.payment_method not null unique,
  name text not null,
  type text not null default 'manual' check (type in ('ewallet', 'bank', 'crypto', 'manual')),
  account_name text,
  account_number text,
  network text,
  instructions text,
  qr_image_url text,
  status public.record_status not null default 'active',
  sort_order integer not null default 100,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.payments
  add column if not exists payment_method_id uuid references public.payment_methods(id) on delete set null;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  title text not null,
  message text not null,
  category text not null default 'system' check (category in ('payment', 'subscription', 'support', 'commission', 'system', 'role')),
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  entity_table text,
  entity_id uuid,
  created_at timestamp with time zone not null default now(),
  read_at timestamp with time zone
);

create index if not exists payment_methods_status_sort_idx on public.payment_methods(status, sort_order);
create index if not exists payment_methods_created_by_idx on public.payment_methods(created_by);
create index if not exists payments_payment_method_id_idx on public.payments(payment_method_id);
create index if not exists notifications_recipient_created_idx on public.notifications(recipient_id, created_at desc);
create index if not exists notifications_status_created_idx on public.notifications(status, created_at desc);
create index if not exists notifications_actor_id_idx on public.notifications(actor_id);
create index if not exists admin_roles_created_by_idx on public.admin_roles(created_by);

alter table public.payment_methods enable row level security;
alter table public.notifications enable row level security;

revoke all on public.payment_methods from anon;
revoke all on public.notifications from anon;
revoke all on public.payment_methods from authenticated;
revoke all on public.notifications from authenticated;
grant select, insert, update on public.payment_methods to authenticated;
grant select, insert, update on public.notifications to authenticated;

create policy "payment_methods_authenticated_read" on public.payment_methods
  for select
  to authenticated
  using (
    status = 'active'
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

create policy "payment_methods_admin_write" on public.payment_methods
  for insert
  to authenticated
  with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

create policy "payment_methods_admin_update" on public.payment_methods
  for update
  to authenticated
  using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'))
  with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

create policy "notifications_recipient_or_ops_read" on public.notifications
  for select
  to authenticated
  using (
    recipient_id = (select auth.uid())
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

create policy "notifications_self_or_ops_insert" on public.notifications
  for insert
  to authenticated
  with check (
    recipient_id = (select auth.uid())
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

create policy "notifications_self_or_ops_update" on public.notifications
  for update
  to authenticated
  using (
    recipient_id = (select auth.uid())
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  )
  with check (
    recipient_id = (select auth.uid())
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

insert into public.payment_methods (method_key, name, type, account_name, account_number, network, instructions, status, sort_order)
values
  ('gcash', 'GCash Payment', 'ewallet', 'ETX Finance', 'Update in admin', null, 'Send exact amount, then upload screenshot with visible reference number.', 'active', 10),
  ('bpi', 'BPI Bank Transfer', 'bank', 'ETX Finance', 'Update in admin', null, 'Use bank transfer and upload receipt after payment.', 'active', 20),
  ('usdt_bep20', 'USDT BEP20 / BSC', 'crypto', 'ETX Crypto Wallet', 'Update wallet address in admin', 'BSC Network', 'Send only USDT through BEP20/BSC, then submit TX hash.', 'active', 30),
  ('usdt_trc20', 'USDT TRC20', 'crypto', 'ETX Crypto Wallet', 'Update wallet address in admin', 'TRC20', 'Send only USDT through TRC20, then submit TX hash.', 'active', 40)
on conflict (method_key) do update set
  name = excluded.name,
  type = excluded.type,
  instructions = coalesce(public.payment_methods.instructions, excluded.instructions),
  sort_order = excluded.sort_order,
  updated_at = now();
