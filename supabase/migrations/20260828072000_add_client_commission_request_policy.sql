grant update on public.referrals to authenticated;

drop policy if exists "referrals_client_mark_available_requested" on public.referrals;
create policy "referrals_client_mark_available_requested"
on public.referrals
for update
to authenticated
using (
  (select auth.uid()) = referrer_id
  and commission_status = 'available'
)
with check (
  (select auth.uid()) = referrer_id
  and commission_status = 'requested'
);
