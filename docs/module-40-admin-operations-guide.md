# Module 40 Admin Operations Guide

Use this guide for daily ETrader-X admin work after login.

## Access Rules

- Admin URL: `https://etrader-x-platform.pages.dev/admin`
- The admin route is hidden from public UI and protected by Supabase Auth role checks.
- Valid operations roles:
  - `super_user`: full access, including Roles.
  - `admin`: daily operations access, except role registry control.
  - `manager`: view/report/support access only.
- Roles must be assigned in Supabase Auth `app_metadata.role`.
- Do not use `user_metadata` for admin authorization.

## Daily Start Checklist

- Login to Admin.
- Confirm the sidebar appears only after login.
- Check `Overview` for pending deposits, active clients, subscriptions, and alerts.
- Open `Deposit Queue` first if there are pending top-ups.
- Review `Support` for open tickets.
- Review `Reports` for daily wallet sales, pending deposits, and expenses.

## Products

- Go to `Products`.
- Create or update product name, product code, category, description, status, and sort order.
- Use `active` only when the product is ready to be sold.
- Use `hidden` or `draft` when a product should not appear to clients.
- After saving, confirm the success toast appears.

## Plans & Pricing

- Go to `Plans & Pricing`.
- Select product, plan name, price, currency, duration, bonus days, trial status, and status.
- Client purchases are wallet-only, so every paid plan must be priced in USD for the MVP.
- Confirm the plan appears in `ETX Trading Tools` on the client side when active.

## Payment Methods

- Go to `Payment Methods`.
- Create receiving details for GCash, bank, USDT BEP20/BSC, USDT TRC20, or other approved channels.
- Fill in account name, account number or wallet address, network, QR URL if applicable, and clear deposit instructions.
- Clients see these details in `Wallet / Deposit` after choosing a method.
- Keep inactive methods hidden from clients.

## Rates

- Go to `Rates`.
- Fetch live USD/PHP rate if available.
- Set markup amount according to current finance policy.
- Platform rate determines estimated USD wallet credit for PHP deposits.
- Admin can still adjust final USD credit during deposit approval.

## Deposit Queue

- Go to `Deposit Queue`.
- Open proof through `View Proof`.
- Compare submitted amount, payment method, reference/TX hash, and proof image/PDF.
- Adjust USD credit if needed before approval.
- Add review notes if the client needs context.
- Approve only valid deposits.
- Reject unclear, duplicate, wrong amount, wrong method, or invalid proof submissions.
- Approved deposits credit client wallet balance and create a wallet ledger entry.
- Rejected deposits notify the client to correct the submission.

## Clients And Client Profiling

- `Clients` shows a quick registered-client list.
- `Client Profiling` is the detailed client 360 view.
- Use client profiling to review:
  - Wallet balance
  - Deposit history
  - Orders
  - Subscriptions
  - Referral records
  - Support tickets
  - Notifications
  - Audit trail

## Landing Creatives

- Go to `Landing Creatives`.
- Manage planned text, images, CTA copy, promo blocks, testimonials, and upcoming promos.
- This is the editable creative library for future landing updates.
- Keep landing changes in draft until reviewed.
- Do not change the live landing design unless a landing polish module is approved.

## PAM Knowledge

- Go to `PAM Knowledge`.
- Add approved FAQ answers for PAM the Trading Assistant.
- Keep answers operational and support-focused.
- PAM must not:
  - Promise guaranteed profit.
  - Give financial guarantees.
  - Ask for passwords, OTPs, seed phrases, or private keys.
  - Tell clients to send funds outside official ETX payment methods.

## Expenses

- Go to `Expenses`.
- Record business expenses with date, category, vendor, amount, currency, USD equivalent, status, receipt URL, and notes.
- Approved expenses are included in financial statement reporting.
- Use pending/draft if an expense is not final.

## Reports

- Go to `Reports`.
- Review:
  - Financial Statement
  - Wallet Reconciliation
  - Operations Health
  - Revenue Mix
  - Deposit Report
  - Subscription Report
  - Referral Report
  - Expense Report
- Export CSV when needed for reconciliation or accounting.

## Audit Logs

- Go to `Audit Logs`.
- Use filters for action, entity, date range, and search.
- Check audit logs after sensitive actions like rate updates, deposit approvals, product changes, and role edits.

## Roles

- `Roles` is super-user-only.
- Create role registry entries for operational planning.
- Actual login permissions still depend on Supabase Auth `app_metadata.role`.
- Keep role keys stable and lowercase, such as `super_user`, `admin`, and `manager`.
