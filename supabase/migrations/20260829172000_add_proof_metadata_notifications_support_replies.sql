alter table public.payments
  add column if not exists proof_file_name text,
  add column if not exists proof_file_size integer,
  add column if not exists proof_file_type text,
  add column if not exists resubmitted_from uuid references public.payments(id) on delete set null;

create index if not exists payments_resubmitted_from_idx on public.payments(resubmitted_from);

create table if not exists public.support_replies (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  is_admin_reply boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create index if not exists support_replies_ticket_created_idx on public.support_replies(ticket_id, created_at asc);
create index if not exists support_replies_author_id_idx on public.support_replies(author_id);

alter table public.support_replies enable row level security;

revoke all on public.support_replies from anon;
revoke all on public.support_replies from authenticated;
grant select, insert on public.support_replies to authenticated;

create policy "support_replies_select_owner_or_ops" on public.support_replies
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.support_tickets ticket
      where ticket.id = support_replies.ticket_id
        and ticket.client_id = (select auth.uid())
    )
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
  );

create policy "support_replies_insert_owner_or_ops" on public.support_replies
  for insert
  to authenticated
  with check (
    author_id = (select auth.uid())
    and (
      (
        is_admin_reply = false
        and exists (
          select 1
          from public.support_tickets ticket
          where ticket.id = support_replies.ticket_id
            and ticket.client_id = (select auth.uid())
        )
      )
      or (
        is_admin_reply = true
        and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') in ('super_user', 'admin', 'manager')
      )
    )
  );
