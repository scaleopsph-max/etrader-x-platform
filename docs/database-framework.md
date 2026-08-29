# ETX Supabase Database Framework

This module defines the database foundation for the ETrader-X MVP.

## Project

- Supabase project: `ETrader-X Platform`
- Project ref: `uefydotccjokisgutton`
- API URL: `https://uefydotccjokisgutton.supabase.co`
- Region: `ap-southeast-1`
- Monthly project cost confirmed in Supabase: `$0`

## Tables

- `profiles`: client/admin profile data tied to `auth.users`
- `products`: ETX products such as SAFY EA, VIP Signal, Yugo Ashi, Elite X, Pro-X
- `plans`: prices, duration, trial, and promo metadata per product
- `orders`: client purchase intent before payment approval
- `payments`: payment method, proof path, review state, and admin review fields
- `subscriptions`: active/trial/expired access records
- `referrals`: referral relationships and commission eligibility
- `commission_requests`: withdrawal requests and approval status
- `support_tickets`: client support requests
- `audit_logs`: admin/security event tracking
- `admin_roles`: operations role registry seeded with SUPER USER, ADMIN, and MANAGER

## Security Model

- RLS is enabled on every public table.
- Public users can only read active products and plans.
- The `anon` role has table-level read access only to `products` and `plans`; private tables are authenticated/admin only.
- Clients can read and create their own orders, payments, tickets, and commission requests.
- Clients can read their own subscriptions and referral-related rows.
- Operations access is based on `auth.jwt()->app_metadata.role`, using `super_user`, `admin`, and `manager`.
- `super_user`: full owner-level operations plus role registry management.
- `admin`: full daily operations, including products, pricing, payments, subscriptions, referrals, support, and reports.
- `manager`: read access for operations/reports/client context, payment-proof review, and support ticket updates only.
- Products, pricing, payment approval, subscription activation, referral/commission changes, and role management are blocked for `manager`.

## Important Implementation Notes

- Do not authorize admin access from `user_metadata`; it is user-editable.
- The frontend must never receive a Supabase `service_role` key.
- Payment proof upload paths are stored in `payments.proof_path`; actual files should use Supabase Storage later.
- Payment proof files now use the private `payment-proofs` Supabase Storage bucket.
- Clients can upload/read their own proof files; admin users can review proof files through signed URLs.
- This migration includes starter products and plans from the ETX Telegram flow.
- Apply this only to the confirmed ETX Supabase project, not a shared production database.
- For frontend integration, use `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Never commit service-role keys or private admin credentials.
- Cloudflare Pages security headers live in `_headers`.
- The admin login page stays clean until a privileged role signs in; the sidebar and workspace are hidden before verification.
