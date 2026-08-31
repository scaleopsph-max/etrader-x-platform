create table if not exists public.pam_faq_entries (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general',
  question text not null,
  answer text not null,
  keywords text[] not null default '{}',
  status public.record_status not null default 'draft',
  sort_order integer not null default 100,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pam_faq_entries_category_format check (category ~ '^[a-z][a-z0-9_]{1,48}$'),
  constraint pam_faq_entries_question_length check (char_length(question) between 6 and 240),
  constraint pam_faq_entries_answer_length check (char_length(answer) between 12 and 2000)
);

alter table public.pam_faq_entries enable row level security;

drop trigger if exists pam_faq_entries_set_updated_at on public.pam_faq_entries;
create trigger pam_faq_entries_set_updated_at
before update on public.pam_faq_entries
for each row execute function public.set_updated_at();

create index if not exists pam_faq_entries_status_sort_idx on public.pam_faq_entries(status, sort_order);
create index if not exists pam_faq_entries_category_status_idx on public.pam_faq_entries(category, status);
create index if not exists pam_faq_entries_keywords_gin_idx on public.pam_faq_entries using gin(keywords);

revoke all on public.pam_faq_entries from anon;
revoke all on public.pam_faq_entries from authenticated;
grant select on public.pam_faq_entries to anon, authenticated;
grant insert, update on public.pam_faq_entries to authenticated;

drop policy if exists "pam_faq_entries_public_active_select" on public.pam_faq_entries;
create policy "pam_faq_entries_public_active_select"
on public.pam_faq_entries
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "pam_faq_entries_ops_select" on public.pam_faq_entries;
create policy "pam_faq_entries_ops_select"
on public.pam_faq_entries
for select
to authenticated
using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager'));

drop policy if exists "pam_faq_entries_admin_insert" on public.pam_faq_entries;
create policy "pam_faq_entries_admin_insert"
on public.pam_faq_entries
for insert
to authenticated
with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

drop policy if exists "pam_faq_entries_admin_update" on public.pam_faq_entries;
create policy "pam_faq_entries_admin_update"
on public.pam_faq_entries
for update
to authenticated
using (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'))
with check (coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin'));

insert into public.pam_faq_entries (category, question, answer, keywords, status, sort_order)
values
  ('wallet', 'How does the ETX deposit flow work?', 'Deposit first through Wallet / Deposit. Choose an official ETX payment method, send funds only to the displayed receiving details, enter the reference or TX hash, add the amount, upload proof, then wait for admin verification. Approved deposits credit the USD wallet balance.', array['deposit','wallet','top up','top-up','payment','proof','gcash','bpi','usdt','reference','tx hash'], 'active', 10),
  ('wallet', 'How does PHP or USDT wallet credit work?', 'USD is the main ETX wallet currency. USDT deposits are credited 1:1 after approval. PHP deposits use the active platform conversion rate plus the configured markup before the approved USD wallet credit is added.', array['php','peso','conversion','rate','markup','usdt','usd','wallet balance'], 'active', 20),
  ('subscription', 'How do clients buy ETX Trading Tools?', 'Clients deposit first, wait for approved wallet balance, open ETX Trading Tools, choose a category and plan, review the plan popup, then subscribe using wallet balance. If the balance is not enough, the client should top up first.', array['subscribe','buy','plan','trading tools','ea','indicator','signal','safy','yugo','vip'], 'active', 30),
  ('referral', 'How does referral commission work?', 'Referral commission is 5% of a valid referred client subscription. It is counted after a real wallet purchase. Self-referrals, duplicate accounts, fake deposits, and abusive activity can be rejected before payout.', array['referral','commission','refer','withdraw','payout','5%','invite'], 'active', 40),
  ('security', 'What security reminders should clients follow?', 'Never share passwords, OTPs, recovery phrases, seed phrases, private keys, or wallet secrets. PAM and ETX support will never ask for those. Report suspicious requests through Support.', array['security','password','otp','private key','seed phrase','recovery phrase','scam'], 'active', 50)
on conflict do nothing;
