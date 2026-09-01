# Module 41 Final Launch QA

Run date: 2026-09-01

## Scope

- Static code hygiene
- Supabase RLS, grants, storage, advisors, and seed data checks
- Cloudflare Pages production deployment and route/header smoke
- Mobile layout QA for client and admin portals
- Production readiness documentation check

## Code QA

- `etx-auth.js` syntax check passed.
- `supabase-config.js` syntax check passed.
- `git diff --check` passed.
- Stale wording scan passed for removed pre-production checkout and role labels.
- Admin login label was polished to `Private operations`.

## Supabase QA

- Public tables without RLS: `0`.
- Anonymous grants are limited to public catalog, landing creatives, and active PAM FAQ rows.
- Public/anon executable functions: `0`.
- `payment-proofs` bucket is private.
- Required operating seed data exists:
  - Products: `5`
  - Plans: `11`
  - Payment methods: `4`
  - Exchange rates: `1`
  - PAM FAQ entries: `5`
  - Landing creatives: `2`
- Operations role registry includes:
  - `super_user`
  - `admin`
  - `manager`

## Supabase Fixes Applied

- Added missing foreign-key indexes for:
  - `expenses.updated_by`
  - `landing_creatives.created_by`
  - `landing_creatives.updated_by`
  - `pam_faq_entries.created_by`
  - `pam_faq_entries.updated_by`
- Consolidated authenticated SELECT policies for landing creatives and PAM FAQ entries.
- Verified the new indexes and policies after applying the migration.

## Advisory Notes

- Supabase still reports expected `SECURITY DEFINER` warnings for:
  - `approve_wallet_deposit`
  - `purchase_plan_with_wallet`
- These are intentional because the frontend calls secured RPCs through authenticated sessions. The functions still check `auth.uid()` and role/ownership rules internally.
- Manual launch action remains: enable leaked password protection in Supabase Auth.
- Unused index warnings are expected while the database is still low-traffic.

## Cloudflare QA

- Production deployment is successful.
- Landing route `/` returns `200`.
- Client route `/client` returns `200`.
- Admin route `/admin` returns `200`.
- `/client` and `/admin` use `Cache-Control: no-store`.
- `/admin` uses `X-Robots-Tag: noindex, nofollow`.
- Security headers are present.
- JS assets use short revalidation caching.

## REST Smoke QA

- Public products REST access: `200`.
- Public PAM FAQ REST access: `200`.
- Anonymous profiles REST access: `401`.
- Anonymous deposit requests REST access: `401`.

## Mobile Layout QA

- Added reusable QA script: `qa/module-41-mobile-layout-qa.cjs`.
- Checked signed-out and signed-in portal shells across:
  - `320px`
  - `390px`
  - `768px`
  - `1365px`
- Total layout checks: `108`.
- Horizontal page overflow failures: `0`.

## Result

Module 41 is production-ready after the Supabase performance fix, static QA, live route smoke, REST smoke, and mobile layout QA.
