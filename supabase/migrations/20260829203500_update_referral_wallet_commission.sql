alter table public.referrals drop constraint if exists referrals_referrer_id_referred_client_id_key;
create unique index if not exists referrals_order_id_referrer_id_idx on public.referrals(order_id, referrer_id) where order_id is not null;

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
  commission_amount numeric(12, 2);
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
    if referrer_id is not null and selected_plan.price_amount > 0 then
      commission_amount := round(selected_plan.price_amount * 0.05, 2);

      insert into public.referrals (referrer_id, referred_client_id, order_id, commission_amount, commission_status)
      values (referrer_id, buyer_id, new_order_id, commission_amount, 'available')
      on conflict do nothing;

      insert into public.notifications (recipient_id, actor_id, title, message, category, entity_table, entity_id)
      values (
        referrer_id,
        buyer_id,
        'Referral commission earned',
        'A referred member subscribed. You earned ' || commission_amount::text || ' USD commission.',
        'commission',
        'referrals',
        new_order_id
      );
    end if;
  end if;

  return jsonb_build_object('order_id', new_order_id, 'payment_id', new_payment_id, 'subscription_id', new_subscription_id, 'wallet_balance', new_balance);
end;
$$;

revoke all on function public.purchase_plan_with_wallet(uuid, text) from public;
revoke all on function public.purchase_plan_with_wallet(uuid, text) from anon;
grant execute on function public.purchase_plan_with_wallet(uuid, text) to authenticated;
