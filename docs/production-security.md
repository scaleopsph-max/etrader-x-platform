# ETX Production Security Checklist

## Done In Code / Database

- Admin UI is noindex/nofollow.
- Cloudflare Pages security headers are defined in `_headers`.
- Supabase frontend uses a publishable key, not a service-role key.
- RLS is enabled on all public tables.
- Anonymous table access is restricted to public `products` and `plans`.
- Private client/admin tables require authenticated access plus RLS ownership/admin policies.
- Payment proofs use a private Supabase Storage bucket with MIME and file-size limits.
- Admin authorization uses `app_metadata.role = admin`, not user-editable metadata.
- Mock client/subscription data was removed from admin UI.
- Admin login now hides the sidebar and operations workspace until role verification passes.
- `admin_roles` registry is seeded with SUPER USER, ADMIN, and MANAGER.

## Required Supabase Dashboard Toggle

- Enable leaked password protection in Supabase Auth.
- Advisor: `auth_leaked_password_protection`
- Remediation: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Pre-Launch Manual Checks

- Confirm the first real admin user has `app_metadata.role = admin`.
- Define the final MANAGER permission matrix before granting it access to sensitive tables.
- Approve whether SUPER USER should have full operations access or role-registry-only access.
- Keep email confirmation enabled unless the business intentionally wants instant signup.
- Rotate publishable keys if they were shared outside the repo workflow.
- Test real client signup, proof upload, admin approval, subscription activation, referral commission, withdrawal, and support tickets.
