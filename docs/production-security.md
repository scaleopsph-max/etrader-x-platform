# ETX Production Security Checklist

## Done In Code / Database

- Admin UI is noindex/nofollow.
- Cloudflare Pages security headers are defined in `_headers`.
- Supabase frontend uses a publishable key, not a service-role key.
- RLS is enabled on all public tables.
- Anonymous table access is restricted to public `products` and `plans`.
- Private client/admin tables require authenticated access plus RLS ownership/admin policies.
- Public table grants are least-privilege:
  - `anon`: read-only access to public catalog, landing creatives, and active PAM FAQ rows.
  - `authenticated`: only the CRUD verbs required by client/admin workflows.
- Payment proofs use a private Supabase Storage bucket with MIME and file-size limits.
- Admin authorization uses `app_metadata.role = admin`, not user-editable metadata.
- Mock client/subscription data was removed from admin UI.
- Admin login now hides the sidebar and operations workspace until role verification passes.
- `admin_roles` registry is seeded with SUPER USER, ADMIN, and MANAGER.
- Role permission matrix is enforced in UI and Supabase RLS:
  - SUPER USER: full operations plus role registry.
  - ADMIN: full operations except role registry.
  - MANAGER: view/report/support access only.
- Sensitive RPC functions revoke `PUBLIC`/`anon` execution and are only executable by authenticated users after in-function role checks.
- Module 37B mobile overflow checks passed across client/admin portal tabs at 320px, 360px, 390px, and 768px widths.

## Required Supabase Dashboard Toggle

- Enable leaked password protection in Supabase Auth.
- Advisor: `auth_leaked_password_protection`
- Remediation: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Pre-Launch Manual Checks

- Confirm the first real admin user has `app_metadata.role = admin`.
- Confirm which real user accounts should receive `super_user`, `admin`, or `manager` in Supabase Auth app metadata.
- Keep email confirmation enabled unless the business intentionally wants instant signup.
- Rotate publishable keys if they were shared outside the repo workflow.
- Test real client signup, proof upload, admin approval, subscription activation, referral commission, withdrawal, and support tickets.
