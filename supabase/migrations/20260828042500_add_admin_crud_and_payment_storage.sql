grant select, insert, update on public.products to authenticated;
grant select, insert, update on public.plans to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert, update on public.payments to authenticated;
grant select, insert, update on public.subscriptions to authenticated;
grant select, insert, update on public.referrals to authenticated;
grant select, insert on public.audit_logs to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "payment_proofs_client_upload_own" on storage.objects;
create policy "payment_proofs_client_upload_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "payment_proofs_client_read_own_or_admin" on storage.objects;
create policy "payment_proofs_client_read_own_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    (select auth.uid())::text = (storage.foldername(name))[1]
    or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

drop policy if exists "payment_proofs_client_update_own_or_admin" on storage.objects;
create policy "payment_proofs_client_update_own_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    (select auth.uid())::text = (storage.foldername(name))[1]
    or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
)
with check (
  bucket_id = 'payment-proofs'
  and (
    (select auth.uid())::text = (storage.foldername(name))[1]
    or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);
