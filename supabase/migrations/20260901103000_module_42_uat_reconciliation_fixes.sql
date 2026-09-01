create or replace function public.get_admin_financial_summary(
  p_from timestamp with time zone default null,
  p_to timestamp with time zone default null,
  p_status text default 'all',
  p_method text default 'all',
  p_search text default ''
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  actor_role text := coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '');
  normalized_status text := lower(coalesce(nullif(trim(p_status), ''), 'all'));
  normalized_method text := lower(coalesce(nullif(trim(p_method), ''), 'all'));
  normalized_search text := lower(nullif(trim(p_search), ''));
  gross_revenue numeric(12, 2) := 0;
  approved_deposits numeric(12, 2) := 0;
  pending_deposits numeric(12, 2) := 0;
  referral_commissions numeric(12, 2) := 0;
  approved_expenses numeric(12, 2) := 0;
  wallet_credit_total numeric(12, 2) := 0;
  wallet_debit_total numeric(12, 2) := 0;
  loaded_wallet_balance numeric(12, 2) := 0;
  approved_payment_count integer := 0;
  approved_deposit_count integer := 0;
  pending_deposit_count integer := 0;
  approved_expense_count integer := 0;
  commission_count integer := 0;
  active_subscription_count integer := 0;
begin
  if actor_role not in ('super_user', 'admin', 'manager') then
    raise exception 'Operations role required';
  end if;

  with payment_rows as (
    select p.*
    from public.payments p
    left join public.profiles client_profile on client_profile.id = p.client_id
    left join public.payment_methods method_record on method_record.id = p.payment_method_id
    left join public.orders order_record on order_record.id = p.order_id
    left join public.plans plan_record on plan_record.id = order_record.plan_id
    left join public.products product_record on product_record.id = plan_record.product_id
    where (p_from is null or p.created_at >= p_from)
      and (p_to is null or p.created_at < p_to)
      and (normalized_status = 'all' or p.status::text = normalized_status)
      and (
        normalized_method = 'all'
        or p.method::text = normalized_method
        or method_record.method_key::text = normalized_method
      )
      and (
        normalized_search is null
        or lower(concat_ws(
          ' ',
          p.transaction_reference,
          p.method::text,
          client_profile.email,
          client_profile.full_name,
          method_record.name,
          method_record.method_key::text,
          plan_record.name,
          product_record.name,
          product_record.code
        )) like '%' || normalized_search || '%'
      )
  )
  select
    coalesce(sum(amount) filter (where status = 'approved'), 0),
    count(*) filter (where status = 'approved')
  into gross_revenue, approved_payment_count
  from payment_rows;

  with deposit_rows as (
    select d.*
    from public.deposit_requests d
    left join public.profiles client_profile on client_profile.id = d.client_id
    left join public.payment_methods method_record on method_record.id = d.payment_method_id
    where (p_from is null or d.created_at >= p_from)
      and (p_to is null or d.created_at < p_to)
      and (normalized_status = 'all' or d.status = normalized_status)
      and (
        normalized_method = 'all'
        or d.method::text = normalized_method
        or method_record.method_key::text = normalized_method
      )
      and (
        normalized_search is null
        or lower(concat_ws(
          ' ',
          d.transaction_reference,
          d.method::text,
          d.proof_file_name,
          client_profile.email,
          client_profile.full_name,
          method_record.name,
          method_record.method_key::text
        )) like '%' || normalized_search || '%'
      )
  )
  select
    coalesce(sum(coalesce(wallet_credit_amount, amount)) filter (where status = 'approved'), 0),
    coalesce(sum(coalesce(wallet_credit_amount, amount)) filter (where status in ('pending', 'under_review')), 0),
    count(*) filter (where status = 'approved'),
    count(*) filter (where status in ('pending', 'under_review'))
  into approved_deposits, pending_deposits, approved_deposit_count, pending_deposit_count
  from deposit_rows;

  with expense_rows as (
    select e.*
    from public.expenses e
    where (p_from is null or e.expense_date >= p_from::date)
      and (p_to is null or e.expense_date < p_to::date)
      and (normalized_status = 'all' or e.status = normalized_status)
      and (
        normalized_search is null
        or lower(concat_ws(
          ' ',
          e.description,
          e.category,
          e.vendor,
          e.payment_method,
          e.notes
        )) like '%' || normalized_search || '%'
      )
  )
  select
    coalesce(sum(usd_amount) filter (where status = 'approved'), 0),
    count(*) filter (where status = 'approved')
  into approved_expenses, approved_expense_count
  from expense_rows;

  with referral_rows as (
    select r.*
    from public.referrals r
    left join public.profiles referrer_profile on referrer_profile.id = r.referrer_id
    left join public.profiles referred_profile on referred_profile.id = r.referred_client_id
    where (p_from is null or r.created_at >= p_from)
      and (p_to is null or r.created_at < p_to)
      and (normalized_status = 'all' or r.commission_status::text = normalized_status)
      and (
        normalized_search is null
        or lower(concat_ws(
          ' ',
          referrer_profile.email,
          referrer_profile.full_name,
          referrer_profile.referral_code,
          referred_profile.email,
          referred_profile.full_name
        )) like '%' || normalized_search || '%'
      )
  )
  select
    coalesce(sum(commission_amount) filter (where commission_status in ('available', 'requested', 'approved', 'paid')), 0),
    count(*) filter (where commission_status in ('available', 'requested', 'approved', 'paid'))
  into referral_commissions, commission_count
  from referral_rows;

  with wallet_rows as (
    select w.*
    from public.wallet_transactions w
    left join public.profiles client_profile on client_profile.id = w.client_id
    where (p_from is null or w.created_at >= p_from)
      and (p_to is null or w.created_at < p_to)
      and (
        normalized_search is null
        or lower(concat_ws(
          ' ',
          w.type,
          w.direction,
          w.description,
          client_profile.email,
          client_profile.full_name
        )) like '%' || normalized_search || '%'
      )
  )
  select
    coalesce(sum(amount) filter (where direction = 'credit'), 0),
    coalesce(sum(amount) filter (where direction = 'debit'), 0)
  into wallet_credit_total, wallet_debit_total
  from wallet_rows;

  with wallet_participants as (
    select distinct client_id
    from public.wallet_transactions
    where (p_from is null or created_at >= p_from)
      and (p_to is null or created_at < p_to)
  )
  select coalesce(sum(p.wallet_balance), 0)
  into loaded_wallet_balance
  from public.profiles p
  join wallet_participants wp on wp.client_id = p.id;

  select count(*)
  into active_subscription_count
  from public.subscriptions
  where status in ('active', 'trial')
    and (p_from is null or created_at >= p_from)
    and (p_to is null or created_at < p_to);

  return jsonb_build_object(
    'source', 'server',
    'generated_at', now(),
    'grossRevenue', gross_revenue,
    'approvedDeposits', approved_deposits,
    'pendingDeposits', pending_deposits,
    'referralCommissions', referral_commissions,
    'approvedExpenses', approved_expenses,
    'netProfit', gross_revenue - referral_commissions - approved_expenses,
    'walletCreditTotal', wallet_credit_total,
    'walletDebitTotal', wallet_debit_total,
    'expectedWalletBalance', wallet_credit_total - wallet_debit_total,
    'loadedWalletBalance', loaded_wallet_balance,
    'walletVariance', (wallet_credit_total - wallet_debit_total) - loaded_wallet_balance,
    'approvedExpenseCount', approved_expense_count,
    'commissionCount', commission_count,
    'approvedPaymentCount', approved_payment_count,
    'approvedDepositCount', approved_deposit_count,
    'pendingDepositCount', pending_deposit_count,
    'activeSubscriptionCount', active_subscription_count
  );
end;
$$;

revoke all on function public.get_admin_financial_summary(timestamp with time zone, timestamp with time zone, text, text, text) from public;
revoke all on function public.get_admin_financial_summary(timestamp with time zone, timestamp with time zone, text, text, text) from anon;
grant execute on function public.get_admin_financial_summary(timestamp with time zone, timestamp with time zone, text, text, text) to authenticated;

update public.payment_methods
set instructions = 'Send the exact GCash amount to the displayed official ETX GCash account, then upload a screenshot with a visible reference number for admin verification.',
    updated_at = now()
where method_key = 'gcash'
  and status = 'active'
  and nullif(trim(coalesce(instructions, '')), '') is null;
