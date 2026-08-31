# Module 39 Production Settings

## Cloudflare Pages

- Project: `etrader-x-platform`
- Production branch: `main`
- Production URL: `https://etrader-x-platform.pages.dev`
- Latest checked production deploy: success
- Static security and cache headers are managed in `_headers`.

## Headers Policy

- All routes receive:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
  - `Cross-Origin-Opener-Policy: same-origin`
  - `X-Permitted-Cross-Domain-Policies: none`
  - Content Security Policy scoped to ETX, Google Fonts, jsDelivr, and the Supabase project.
- `client.html`, `admin.html`, `/client`, and `/admin` use `Cache-Control: no-store` because they contain auth-dependent UI.
- JS/CSS use short revalidation caching so new pushes appear quickly.
- `assets/*` uses longer static caching.
- `admin.html` and `/admin` remain `X-Robots-Tag: noindex, nofollow`.

## Supabase Production Settings

- Project URL: `https://uefydotccjokisgutton.supabase.co`
- Frontend key type: publishable key only.
- Service-role keys must never be committed or used in browser code.
- Storage bucket: `payment-proofs`, private, signed URL review flow.
- RLS and least-privilege grants are already applied in migrations.

## Supabase Dashboard Checks Before Launch

- Auth Site URL: `https://etrader-x-platform.pages.dev`
- Additional redirect URLs:
  - `https://etrader-x-platform.pages.dev/client.html`
  - `https://etrader-x-platform.pages.dev/admin.html`
  - Future custom domain equivalents once connected.
- Keep email confirmation enabled unless operations intentionally approves instant signup.
- Enable leaked password protection.
- Confirm the first operations account has `app_metadata.role = super_user`.
- Confirm admin accounts use one of:
  - `super_user`
  - `admin`
  - `manager`

## Launch Smoke Tests

- Landing route returns `200`.
- Client route returns `200`.
- Admin route returns `200`.
- Public products REST request returns `200`.
- Anonymous profiles REST request returns `401` or no data.
- Client signup/login can create a profile.
- Admin login stays gated until app metadata role is present.
