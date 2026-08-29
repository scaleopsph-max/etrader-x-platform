# ETrader-X Platform

Premium landing page and MVP framework for the ETrader-X trading products platform.

## Current Module

- Premium public landing page
- Conversion CTAs
- Urgency promo section
- Product catalog blocks
- Supabase-powered client auth
- Client product selection, order creation, and payment-review submission
- Hidden admin route with Supabase admin role guard
- Clean admin login gate before the private workspace is shown
- Seeded operations role registry for SUPER USER, ADMIN, and MANAGER
- Admin product and plan management
- Admin payment review with subscription activation
- Private Supabase Storage bucket for payment proofs
- Security headers for Cloudflare Pages
- Restricted anonymous database access for private tables

## Planned Stack

- GitHub for source control
- Cloudflare Pages for hosting
- Supabase for Auth, Postgres database, and Storage

## MVP Modules

- Public landing page
- Client login/profile/subscription flow
- Payment proof upload
- Admin product and plan management
- Admin payment approval
- Subscription activation
- Referral and commission tracking

## Database Framework

The Supabase schema starts in `supabase/migrations/20260828033000_create_etx_core_schema.sql`.
Auth/profile policies and database hardening live in the follow-up migration files.
Payment proof storage and admin CRUD permissions are added in the Module 7/8 migrations.
Role registry foundation is added in the Module 15 migrations. The Module 16 permission matrix grants SUPER USER and ADMIN full operations access, while MANAGER is limited to view/report/support workflows.
See `docs/database-framework.md` for the table map and security model.
See `docs/production-security.md` for the pre-launch hardening checklist.
