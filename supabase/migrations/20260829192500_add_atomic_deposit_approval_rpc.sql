create or replace function public.approve_wallet_deposit(target_deposit_id uuid, review_note text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text := coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '');
  actor_id uuid := auth.uid();
  deposit public.deposit_requests%rowtype;
  next_balance numeric(12, 2);
begin
  if actor_id is null or actor_role not in ('super_user', 'admin') then
    raise exception 'ADMIN or SUPER USER role required';
  end if;

  select * into deposit
  from public.deposit_requests
  where id = target_deposit_id
  for update;

  if deposit.id is null then
    raise exception 'Deposit request not found';
  end if;

  if deposit.status = 'approved' then
    raise exception 'Deposit is already approved';
  end if;

  if deposit.status = 'cancelled' then
    raise exception 'Cancelled deposit cannot be approved';
  end if;

  select wallet_balance + deposit.amount into next_balance
  from public.profiles
  where id = deposit.client_id
  for update;

  update public.profiles
  set wallet_balance = next_balance
  where id = deposit.client_id;

  update public.deposit_requests
  set status = 'approved',
      reviewed_by = actor_id,
      reviewed_at = now(),
      review_notes = nullif(trim(review_note), '')
  where id = deposit.id;

  insert into public.wallet_transactions (client_id, type, direction, amount, currency, balance_after, related_table, related_id, description)
  values (deposit.client_id, 'deposit', 'credit', deposit.amount, deposit.currency, next_balance, 'deposit_requests', deposit.id, 'Approved wallet deposit');

  return jsonb_build_object('client_id', deposit.client_id, 'wallet_balance', next_balance, 'deposit_id', deposit.id);
end;
$$;

revoke all on function public.approve_wallet_deposit(uuid, text) from public;
revoke all on function public.approve_wallet_deposit(uuid, text) from anon;
grant execute on function public.approve_wallet_deposit(uuid, text) to authenticated;
