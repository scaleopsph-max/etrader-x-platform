revoke all on public.profiles from anon;
revoke all on public.orders from anon;
revoke all on public.payments from anon;
revoke all on public.subscriptions from anon;
revoke all on public.referrals from anon;
revoke all on public.commission_requests from anon;
revoke all on public.support_tickets from anon;
revoke all on public.audit_logs from anon;

grant select on public.products to anon;
grant select on public.plans to anon;
