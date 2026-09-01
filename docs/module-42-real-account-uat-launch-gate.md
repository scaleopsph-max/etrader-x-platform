# Module 42 Real Account UAT Launch Gate

Run date: 2026-09-01

## Purpose

Module 42 verifies that the platform is ready for real client/admin UAT after automated launch QA. It checks whether actual Supabase Auth users, profiles, roles, wallet balances, deposit methods, and production routes are ready for live manual testing.

## Automated Launch Gate Result

Status: `READY FOR REAL-ACCOUNT UAT`

The automated launch gate is clear after fixing two readiness issues:

- Missing profile safety net for newly created Auth users.
- Wallet reconciliation variance caused by wallet test activity on an operations account.

## Fixes Applied

### Auth Profile Safety Net

- Added `public.handle_new_auth_user_profile()`.
- Added an `auth.users` trigger that creates a matching `profiles` row after signup.
- Backfilled existing Auth users that did not yet have a profile row.
- Verified:
  - Auth users: `4`
  - Profiles: `4`
  - Auth users without profile: `0`
  - Profiles without Auth user: `0`

### Payment Method Readiness

- Verified active payment methods have official receiving details.
- Backfilled missing GCash instructions.
- Verified active methods missing account/address or instructions: `0`.

### Wallet Reconciliation

- Updated admin financial summary to reconcile wallet balances by actual wallet ledger participants instead of only `role = client`.
- Verified:
  - Wallet credit: `$1,000.00`
  - Wallet debit: `$200.00`
  - Loaded wallet participant balance: `$800.00`
  - Wallet variance: `$0.00`

## Supabase Security Gate

- Public profile/deposit data stays private.
- Public/anonymous REST access remains limited to public catalog/PAM/landing content.
- New auth-profile trigger function is not executable by `anon` or `authenticated`.
- Existing secured wallet RPCs are intentionally callable by authenticated users:
  - `approve_wallet_deposit`
  - `purchase_plan_with_wallet`
- These RPCs still check `auth.uid()` and role/ownership rules internally.

## Remaining Manual Dashboard Gate

- Enable leaked password protection in Supabase Auth.

Supabase Advisor still reports this as a launch security warning. This requires Dashboard action and cannot be completed from the frontend codebase.

## Real-Account UAT Checklist

Run this with a real phone and real test accounts before public rollout.

1. Client creates account at `https://etrader-x-platform.pages.dev/client`.
2. Client confirms email if required.
3. Client logs in and sees sidebar only after login.
4. Client opens `Wallet / Deposit`.
5. Client selects every active payment method and confirms official instructions appear.
6. Client submits a small test deposit proof.
7. Admin logs in at `https://etrader-x-platform.pages.dev/admin`.
8. Admin confirms role label and accessible modules.
9. Admin approves the valid deposit.
10. Client confirms wallet balance and notification.
11. Client buys an ETX Trading Tools plan using wallet balance.
12. Client confirms subscription appears.
13. Referral account earns 5% when another client buys with its referral code.
14. Client submits support ticket.
15. Admin replies or updates status.
16. Client confirms support notification.
17. Admin checks Financial Statement, Wallet Reconciliation, Deposit Report, Subscription Report, Referral Report, Expense Report, and CSV exports.

## Launch Decision

Recommended decision: `READY WITH MANUAL UAT REQUIRED`

The platform passed automated launch gates and database readiness checks. Do not mark as fully live until real-account UAT confirms deposit upload, admin approval, wallet purchase, referral commission, support, and reports using real credentials.
