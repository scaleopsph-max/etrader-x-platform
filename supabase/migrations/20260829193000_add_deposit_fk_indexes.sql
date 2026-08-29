create index if not exists deposit_requests_payment_method_id_idx on public.deposit_requests(payment_method_id);
create index if not exists deposit_requests_reviewed_by_idx on public.deposit_requests(reviewed_by);
