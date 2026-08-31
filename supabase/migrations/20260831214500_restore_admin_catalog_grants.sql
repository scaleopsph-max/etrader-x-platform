-- Module 36 follow-up: authenticated ops users need catalog writes.
-- RLS policies still limit writes to SUPER USER and ADMIN app_metadata roles.

grant insert, update on public.products to authenticated;
grant insert, update on public.plans to authenticated;
