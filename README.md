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
See `docs/database-framework.md` for the table map and security model.
