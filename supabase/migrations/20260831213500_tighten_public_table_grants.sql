-- Module 36: tighten exposed-schema grants.
-- RLS remains the primary row-level control; these grants reduce unnecessary
-- table-level capabilities for anon/authenticated roles.

revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;

grant select on public.products to anon, authenticated;
grant select on public.plans to anon, authenticated;
grant select on public.landing_creatives to anon, authenticated;
grant select on public.pam_faq_entries to anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert, update on public.payments to authenticated;
grant select, insert, update on public.deposit_requests to authenticated;
grant select on public.wallet_transactions to authenticated;
grant select, insert, update on public.referrals to authenticated;
grant select, insert, update on public.commission_requests to authenticated;
grant select, insert, update on public.subscriptions to authenticated;
grant select, insert, update on public.support_tickets to authenticated;
grant select, insert on public.support_replies to authenticated;
grant select, insert, update on public.notifications to authenticated;
grant select, insert, update on public.payment_methods to authenticated;
grant select, insert, update on public.exchange_rates to authenticated;
grant select, insert, update on public.expenses to authenticated;
grant select, insert, update on public.landing_creatives to authenticated;
grant select, insert, update on public.pam_faq_entries to authenticated;
grant select, insert, update on public.admin_roles to authenticated;
grant select, insert on public.audit_logs to authenticated;

revoke all on function public.approve_wallet_deposit(uuid, text, numeric) from public, anon;
revoke all on function public.purchase_plan_with_wallet(uuid, text) from public, anon;
revoke all on function public.get_admin_financial_summary(timestamptz, timestamptz, text, text, text) from public, anon;

grant execute on function public.approve_wallet_deposit(uuid, text, numeric) to authenticated;
grant execute on function public.purchase_plan_with_wallet(uuid, text) to authenticated;
grant execute on function public.get_admin_financial_summary(timestamptz, timestamptz, text, text, text) to authenticated;
