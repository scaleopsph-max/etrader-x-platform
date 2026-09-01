# Module 43 MVP Production, UAT, and Role Closeout

Run date: 2026-09-01

## Scope

This pass closes the three final MVP gates requested before pausing ETX and moving to the next project:

- Production Settings Final Check
- Real Account UAT Readiness
- Admin Role Final Validation

## Production Settings Final Check

Status: PASS WITH ONE MANUAL DASHBOARD ITEM

- Cloudflare Pages routes are live:
  - Landing: `https://etrader-x-platform.pages.dev/`
  - Client: `https://etrader-x-platform.pages.dev/client`
  - Admin: `https://etrader-x-platform.pages.dev/admin`
- Frontend uses the Supabase publishable key only.
- Admin route is gated and hidden until an approved operations role is verified.
- All public schema tables have RLS enabled.
- Public schema tables have explicit policies.
- `payment-proofs` storage bucket is private.
- Proof uploads are limited to PNG, JPEG, WEBP, and PDF.
- Active payment methods have client-facing receiving details and instructions.

Manual dashboard item:

- Enable Supabase Auth leaked password protection.

## Real Account UAT Readiness

Status: READY FOR REAL ACCOUNT UAT

Current readiness checks:

- Auth users: `4`
- Profiles: `4`
- Auth users without profiles: `0`
- Profiles without auth users: `0`
- Active products: `5`
- Active plans: `11`
- Pending deposit queue: `0`

Manual UAT flow to run with real accounts:

1. Client signs up and confirms email if required.
2. Client logs in and sees the sidebar only after login.
3. Client opens Wallet / Deposit.
4. Client selects each payment method and confirms receiving details are visible.
5. Client submits a test deposit proof.
6. Admin logs in and verifies the deposit.
7. Client receives wallet credit and notification.
8. Client buys an ETX Trading Tools plan using wallet balance.
9. Client sees subscription reflected.
10. Referral user receives 5% commission when a referred client subscribes.
11. Client opens PAM/support and submits a support item.
12. Admin reviews support, reports, and audit logs.

## Admin Role Final Validation

Status: PASS

Role registry:

- `super_user` / SUPER USER
- `admin` / ADMIN
- `manager` / MANAGER

Auth role distribution:

- `super_user`: `1`
- `none`: `3`

Expected access:

- SUPER USER: full operations, role registry, audit, reports, products, pricing, payment methods, deposits, clients, profiling, landing creatives, subscriptions, referrals, support, PAM knowledge.
- ADMIN: operations access without the role registry.
- MANAGER: view/report/support-focused access without dangerous write/admin-role controls.

## Advisor Notes

Security advisor notes:

- Two wallet RPC warnings are expected because authenticated users can call the RPC endpoints, but the functions enforce ownership/admin checks internally.
- Leaked password protection remains the only dashboard security toggle to enable.

Performance advisor notes:

- Unused index notices are expected for a fresh MVP with low traffic.
- Do not remove these indexes until the system has real usage data.

## Launch Decision

Decision: MVP READY FOR REAL ACCOUNT UAT

The app is ready for controlled MVP usage after enabling leaked password protection and completing one real-account UAT pass.
