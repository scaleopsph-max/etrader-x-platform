# Module 20 + 22 UAT Checklist

Run this checklist using real test accounts before launch.

## Admin Login And Roles

- Open `https://etrader-x-platform.pages.dev/admin.html`.
- Login as `scaleopsph@gmail.com`.
- Confirm the sidebar appears only after login.
- Confirm role label shows `SUPER USER`.
- Confirm `Products`, `Plans & Pricing`, `Payment Methods`, and `Roles` are visible.
- Logout and confirm admin workspace is hidden again.

## Client Signup And Login

- Open `https://etrader-x-platform.pages.dev/client.html`.
- Confirm only the login card appears while signed out.
- Click `Create account now`.
- Create a test client account with a unique email.
- Login with the test client account.
- Confirm the sidebar appears only after login.
- Confirm Profile, Subscribe / Buy, Payments, Subscriptions, Referral, and Support tabs open cleanly on mobile.

## Purchase Flow

- Go to `Subscribe / Buy`.
- Select one active plan.
- Confirm the app jumps to `Payments`.
- Confirm selected plan appears in the payment context.
- Select an active payment method.
- Confirm payment instructions appear.
- Enter transaction reference, amount, optional referral code, and proof file.
- Submit payment proof.
- Confirm client is redirected to `Subscriptions`.
- Confirm payment status says `under review`.
- Confirm client notification says payment was submitted.

## Admin Payment Review

- Login as SUPER USER in `admin.html`.
- Go to `Payment Queue`.
- Confirm the submitted client payment appears.
- Click `View Proof`.
- Confirm proof opens from a signed URL.
- Approve the payment.
- Confirm admin status says payment was approved and subscription activated.
- Confirm the payment is no longer pending.

## Client Approval Result

- Return to the client account.
- Refresh or logout/login.
- Go to `Subscriptions`.
- Confirm subscription status is `active` or `trial`.
- Confirm renewal days and latest payment status are visible.
- Confirm notification says subscription is active.

## Rejection Flow

- Submit another test payment proof.
- In admin, reject the payment.
- Return to client.
- Confirm latest payment status is `rejected`.
- Confirm notification asks client to submit corrected proof.

## Support Flow

- In client, go to `Support`.
- Ask the AI FAQ assistant a payment/subscription/referral question.
- Confirm instant FAQ answer appears.
- Submit a support ticket.
- In admin, go to `Support`.
- Set ticket to `Need Client`.
- Confirm client receives support notification.
- Set ticket to `Resolved`.
- Confirm client sees resolved status.

## Mobile QA

- Test on a real phone browser.
- Confirm no horizontal scroll on Client and Admin pages.
- Confirm sidebar/tab navigation is scrollable and usable.
- Confirm all forms fit the screen.
- Confirm buttons are large enough to tap.
