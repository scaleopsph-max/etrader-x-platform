drop policy if exists "profiles_insert_own_client" on public.profiles;
create policy "profiles_insert_own_client"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) = id
  and role = 'client'
);

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.plans to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.orders to authenticated;
grant select, insert on public.payments to authenticated;
grant select on public.subscriptions to authenticated;
grant select on public.referrals to authenticated;
grant select, insert on public.commission_requests to authenticated;
grant select, insert, update on public.support_tickets to authenticated;
