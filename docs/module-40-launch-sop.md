# Module 40 Launch SOP

This SOP defines how to operate the ETrader-X MVP during launch.

## Launch Owner Checklist

- Confirm latest GitHub commit is deployed successfully in Cloudflare Pages.
- Confirm Supabase project is the correct production project.
- Confirm admin super user can login.
- Confirm at least one backup admin account exists.
- Confirm payment methods show correct receiving details.
- Confirm PHP conversion rate and markup are current.
- Confirm product and plan prices are correct.
- Confirm PAM FAQs are reviewed.
- Confirm support response owner is assigned.

## Pre-Launch Freeze

- Do not change landing design during final launch QA.
- Do not edit products/prices during active payment testing unless the test requires it.
- Do not rotate Supabase keys without updating `supabase-config.js`.
- Do not disable RLS.
- Do not expose service-role keys in frontend code.

## Release Process

1. Finish module development.
2. Run basic QA.
3. Run full QA if the module touches money, auth, permissions, or client-facing workflows.
4. Commit and push to `main`.
5. Confirm Cloudflare production deployment succeeds.
6. Verify live route smoke tests.
7. Record completed module and QA notes.

## Deposit Review SOP

- Review deposits at least daily during launch.
- Prioritize deposits in `pending` or `under_review`.
- Verify proof file, method, amount, reference, and client account.
- Reject duplicates, invalid proof, unclear screenshots, wrong network, wrong recipient, or mismatched amount.
- Add review notes for every rejection.
- Approval credits USD wallet balance.
- Rejection asks the client to correct and resubmit.

## Subscription SOP

- Clients subscribe only using approved wallet balance.
- Admin does not manually activate subscriptions for normal purchases.
- If a client reports missing subscription:
  - Check wallet transaction.
  - Check order record.
  - Check subscription record.
  - Check notifications.
  - Check audit logs.
  - Escalate only if wallet was deducted without subscription creation.

## Referral SOP

- Referral commission is 5% of approved paid wallet purchase.
- Self-referral is blocked.
- Do not manually add referral commission unless approved by business owner.
- Review withdrawal requests against available commission records.
- Mark withdrawal as approved or rejected with notes.

## Support SOP

- PAM handles general FAQ.
- Account-specific issues must use support tickets.
- Keep support replies clear and specific.
- Never ask for password, OTP, seed phrase, private key, or personal wallet credentials.
- Use `Need Client` when more proof/details are required.
- Use `Resolved` only when the client's issue is answered or fixed.

## Financial Reporting SOP

- Record expenses in `Expenses`.
- Review `Reports` weekly or before payout decisions.
- Use Financial Statement for:
  - Gross wallet sales
  - Referral commissions
  - Expenses
  - Net profit
- Use Wallet Reconciliation to detect mismatches between ledger and client balances.
- Export CSV for accounting backup.

## Incident Response

If money, login, or permission behavior looks wrong:

1. Pause approvals for affected records.
2. Capture screenshots and affected client email/client ID.
3. Check `Audit Logs`.
4. Check `Deposit Queue`, `Wallet Ledger`, `Orders`, and `Subscriptions`.
5. Avoid manual DB edits unless a fix migration or approved SQL is prepared.
6. Document what happened and what was changed.

## Manual Dashboard Tasks

These are dashboard-side settings to verify before public launch:

- Supabase Auth Site URL is the production URL.
- Supabase redirect URLs include client/admin routes.
- Leaked password protection is enabled.
- Email confirmation policy is decided.
- First admin user has `app_metadata.role = super_user`.
- Cloudflare Pages production branch is `main`.
- Custom domain is configured later if needed.
