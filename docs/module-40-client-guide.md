# Module 40 Client Guide

This is the client-side operating flow for the ETrader-X MVP.

## Client URL

- Client portal: `https://etrader-x-platform.pages.dev/client`
- Signed-out users see only login and account creation.
- Sidebar, wallet, profile, subscriptions, referral, and support pages appear only after login.

## Create Account

- Open the client portal.
- Click `Create account now`.
- Enter full name, email, Telegram username, and password.
- Confirm email if Supabase email confirmation is enabled.
- Login after confirmation.

## Account Dashboard

After login, the dashboard shows:

- Wallet balance
- Active access
- Subscription status
- Next action
- Notifications

The client should deposit first before buying ETX products.

## Profile

Use `Profile` to review:

- Client ID
- Email
- Full name
- Telegram username
- Referral code
- Wallet balance
- Active subscriptions
- Recent account activity

Clients can edit basic profile details, but not admin-only fields.

## Wallet / Deposit

This is the only payment entry point in the MVP.

1. Open `Wallet / Deposit`.
2. Select a payment method.
3. Review the official ETX receiving details shown on the page.
4. Send funds only to the displayed official account or wallet address.
5. Enter deposit reference or TX hash.
6. Enter paid amount.
7. Upload deposit proof.
8. Submit deposit for review.
9. Wait for admin verification.

## Wallet Currency Rules

- Main wallet currency: USD.
- USDT deposits are treated as 1:1 with USD.
- PHP deposits use the active platform USD/PHP conversion rate.
- Admin can adjust final USD credit during review if proof and conversion need correction.
- Products can only be purchased using approved wallet balance.

## ETX Trading Tools

Use `ETX Trading Tools` to browse active plans grouped by category.

1. Select a plan.
2. Review the plan details in the glassmorphism confirmation modal.
3. Confirm wallet balance is enough.
4. Click subscribe.
5. The system deducts wallet balance and activates the subscription automatically.

If wallet balance is not enough, deposit first and wait for approval.

## Subscriptions

Use `Subscriptions` to check:

- Active access
- Trial access
- Expiration dates
- Orders
- Wallet purchase history

Approved wallet purchases should appear here after subscription.

## Referral

Clients have a referral code in the profile/referral page.

- Referral commission is 5% of the referred client's approved subscription purchase.
- Commission is created only after the referred client successfully buys with wallet balance.
- Self-referral is blocked.
- Duplicate commission abuse is controlled by order-level tracking.
- Client receives a notification when referral commission is earned.
- Withdrawal requests go to admin review.

## Notifications

Notifications appear in the client portal for:

- Deposit submitted
- Deposit approved
- Deposit rejected
- Subscription activated
- Referral commission earned
- Withdrawal request updates
- Support ticket updates

## PAM The Trading Assistant

PAM helps clients understand ETX operational flow:

- Deposits
- Wallet balance
- Payment methods
- Subscriptions
- Referrals
- Notifications
- Support
- Account/profile questions

PAM does not provide guaranteed profit claims or request sensitive credentials.

## Support

Use `Support` when the client needs account-specific help.

1. Open `Support`.
2. Ask PAM for common questions.
3. If still unresolved, submit a support ticket.
4. Wait for admin reply or status update.
5. Check ticket history and notifications.
