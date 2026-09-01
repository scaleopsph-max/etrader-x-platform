# ETrader-X Platform

Premium landing page and MVP framework for the ETrader-X trading products platform.

## Current Module

- Premium public landing page
- Imported Yugo Ashi product landing page based on `antigoderiv/ETX-Products`
- Conversion CTAs
- Urgency promo section
- Product catalog blocks
- Supabase-powered client auth
- Client wallet deposit, admin top-up approval, and wallet-only product purchase
- Hidden admin route with Supabase admin role guard
- Clean admin login gate before the private workspace is shown
- Seeded operations role registry for SUPER USER, ADMIN, and MANAGER
- Admin product and plan management
- Admin deposit review with wallet crediting and subscription activation
- Private Supabase Storage bucket for deposit proofs
- Security headers for Cloudflare Pages
- Restricted anonymous database access for private tables
- Least-privilege public table grants for Supabase Data API access
- Full mobile overflow QA pass for client/admin portal tabs
- Admin UX feedback polish for save/update/approval actions
- Production settings pass for Cloudflare headers, cache rules, and Supabase launch checks
- Final launch QA pass with Supabase performance fixes and mobile layout automation

## Planned Stack

- GitHub for source control
- Cloudflare Pages for hosting
- Supabase for Auth, Postgres database, and Storage

## Landing Source

The public `index.html` is adapted from the teammate landing repository:
`https://github.com/antigoderiv/ETX-Products`.

Imported landing assets live under `assets/`. Public CTAs are connected to the ETX `/client` portal flow.

## MVP Modules

- Public landing page
- Client login/profile/subscription flow
- Wallet deposit proof upload
- Admin product and plan management
- Admin deposit approval and wallet crediting
- Subscription activation
- Referral and commission tracking
- Wallet-only deposits with USD balance
- PHP conversion rate management
- Client notifications and browser alerts
- Client profiling and account history
- Landing creatives management
- Expenses ledger and financial reports
- PAM the Trading Assistant with admin-managed FAQ knowledge
- Mobile-first portal polish
- Supabase RLS and grants hardening
- Admin action feedback and responsive operations polish
- Production settings and launch readiness checks

## Database Framework

The Supabase schema starts in `supabase/migrations/20260828033000_create_etx_core_schema.sql`.
Auth/profile policies and database hardening live in the follow-up migration files.
Deposit proof storage and admin CRUD permissions are added in the Module 7/8 migrations.
Role registry foundation is added in the Module 15 migrations. The Module 16 permission matrix grants SUPER USER and ADMIN full operations access, while MANAGER is limited to view/report/support workflows.
PAM FAQ knowledge is managed in `pam_faq_entries` with public active reads and admin-only writes.
Module 36 tightened table/function grants so RLS remains backed by least-privilege Data API access.
See `docs/database-framework.md` for the table map and security model.
See `docs/production-security.md` for the pre-launch hardening checklist.
See `docs/module-39-production-settings.md` for Cloudflare and Supabase production settings.
See `docs/module-40-admin-operations-guide.md` for admin daily operations.
See `docs/module-40-client-guide.md` for the client portal guide.
See `docs/module-40-launch-sop.md` for launch SOP and incident handling.
See `docs/module-20-22-uat-checklist.md` for the current wallet-only UAT checklist.
See `docs/module-41-final-launch-qa.md` for the final launch QA report.
