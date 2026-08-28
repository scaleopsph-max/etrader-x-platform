create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public;
revoke execute on function public.set_updated_at() from anon;
revoke execute on function public.set_updated_at() from authenticated;

create index if not exists profiles_referred_by_idx on public.profiles(referred_by);
create index if not exists products_created_by_idx on public.products(created_by);
create index if not exists orders_plan_id_idx on public.orders(plan_id);
create index if not exists payments_reviewed_by_idx on public.payments(reviewed_by);
create index if not exists subscriptions_product_id_idx on public.subscriptions(product_id);
create index if not exists subscriptions_plan_id_idx on public.subscriptions(plan_id);
create index if not exists subscriptions_order_id_idx on public.subscriptions(order_id);
create index if not exists subscriptions_activated_by_idx on public.subscriptions(activated_by);
create index if not exists referrals_referred_client_id_idx on public.referrals(referred_client_id);
create index if not exists referrals_order_id_idx on public.referrals(order_id);
create index if not exists commission_requests_reviewed_by_idx on public.commission_requests(reviewed_by);
create index if not exists support_tickets_assigned_to_idx on public.support_tickets(assigned_to);
