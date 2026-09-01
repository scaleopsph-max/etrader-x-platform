# ETX MVP UAT Checklist

Run this checklist using real test accounts before launch.

## Admin Login And Roles

- Open `https://etrader-x-platform.pages.dev/admin`.
- Login using an operations account.
- Confirm the admin workspace is hidden before login.
- Confirm sidebar appears only after login.
- Confirm role label shows the expected role.
- For `super_user`, confirm `Roles` is visible.
- For `admin`, confirm daily operations pages are visible except role registry control.
- For `manager`, confirm write-only controls are hidden or blocked.
- Logout and confirm admin workspace is hidden again.

## Client Signup And Login

- Open `https://etrader-x-platform.pages.dev/client`.
- Confirm only the login card appears while signed out.
- Click `Create account now`.
- Create a test client account with a unique email.
- Confirm email if required.
- Login with the test client account.
- Confirm the sidebar appears only after login.
- Confirm these tabs open cleanly on mobile:
  - Overview
  - Profile
  - ETX Trading Tools
  - Wallet / Deposit
  - Subscriptions
  - Referral
  - About ETrader-X
  - Support

## Client Wallet Deposit Flow

- Go to `Wallet / Deposit`.
- Select each active payment method one by one.
- Confirm official ETX receiving details appear for the selected method.
- Confirm instructions, network, account number, wallet address, or QR URL are understandable.
- Enter deposit reference or TX hash.
- Enter amount.
- Upload an accepted proof file:
  - JPG
  - PNG
  - WEBP
  - PDF
- Submit deposit for review.
- Confirm success toast appears.
- Confirm deposit appears in Deposit Requests.
- Confirm notification says the deposit is under review.

## Admin Deposit Review

- Login to Admin.
- Go to `Deposit Queue`.
- Confirm the submitted client deposit appears under Needs Review.
- Click `View Proof`.
- Confirm proof opens through a signed URL.
- Verify amount, reference, method, and uploaded proof.
- Add review notes.
- Approve the deposit.
- Confirm:
  - Success toast appears.
  - Deposit buttons are removed after approval.
  - Wallet ledger is credited.
  - Client receives notification.
- Repeat with another deposit and reject it.
- Confirm rejected deposit notifies the client with correction message.

## Wallet Purchase Flow

- Login as client.
- Confirm wallet balance has approved USD credit.
- Go to `ETX Trading Tools`.
- Select an active plan.
- Review the confirmation modal.
- Add referral code if testing referral flow.
- Click subscribe.
- Confirm:
  - Success toast appears.
  - Wallet balance decreases correctly.
  - Subscription appears in `Subscriptions`.
  - Order appears in order history.
  - Wallet purchase appears in wallet purchase history.

## Referral Flow

- Create or use two different client accounts.
- Copy referral code from Client A.
- Login as Client B.
- Deposit and get approved wallet balance.
- Client B buys a paid plan using Client A referral code.
- Confirm Client A receives:
  - Referral commission record.
  - Notification with earned amount.
- Confirm commission equals 5% of the subscription amount.
- Confirm self-referral is blocked.
- Submit withdrawal request from Client A.
- Confirm admin can approve or reject withdrawal request.

## Support And PAM

- In client portal, go to `Support`.
- Ask PAM about deposits, wallet balance, subscription, referral, and rejected deposit.
- Confirm PAM gives operational answers and no profit guarantees.
- Submit a support ticket.
- In admin, go to `Support`.
- Set ticket to `Need Client`.
- Confirm client receives support notification.
- Reply to the ticket if applicable.
- Set ticket to `Resolved`.
- Confirm client sees resolved status.

## Admin Management

- Create or update one product.
- Create one plan under that product.
- Create or update one payment method.
- Update PHP conversion rate.
- Create one PAM FAQ entry.
- Create one landing creative draft.
- Create one expense entry.
- Confirm each action shows a save/update toast.
- Confirm audit logs capture sensitive admin actions.

## Reports

- Go to `Reports`.
- Check Financial Statement.
- Check Wallet Reconciliation.
- Check Deposit Report.
- Check Subscription Report.
- Check Referral Report.
- Check Expense Report.
- Export CSV files.
- Confirm exported rows match visible filters.

## Mobile QA

- Test on a real phone browser.
- Confirm no page-level horizontal scroll.
- Confirm sidebar tab navigation is usable.
- Confirm all forms fit the screen.
- Confirm buttons are large enough to tap.
- Confirm modals fit the screen and can be closed.
- Confirm toasts do not block critical buttons.

## Production Smoke

- Landing route returns `200`.
- Client route returns `200`.
- Admin route returns `200`.
- `/client` and `/admin` use `Cache-Control: no-store`.
- `/admin` uses `X-Robots-Tag: noindex, nofollow`.
- Public product catalog loads.
- Anonymous profile access stays blocked.
