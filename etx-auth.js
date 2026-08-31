(function () {
  const config = window.ETX_SUPABASE || {};
  const sdk = window.supabase;
  const authPanels = document.querySelectorAll("[data-auth-panel]");
  const authStatuses = document.querySelectorAll("[data-auth-status]");
  const authUser = document.querySelector("[data-auth-user]");
  const profileForm = document.querySelector("[data-profile-form]");
  const signInForm = document.querySelector("[data-sign-in-form]");
  const signUpForm = document.querySelector("[data-sign-up-form]");
  const showSignupButton = document.querySelector("[data-show-signup]");
  const showLoginButton = document.querySelector("[data-show-login]");
  const signOutButtons = document.querySelectorAll("[data-sign-out]");
  const dynamicPlanGrid = document.querySelector("[data-dynamic-plans]");
  const selectedPlan = document.getElementById("selected-plan");
  const paymentForm = document.querySelector("[data-payment-form]");
  const paymentMethodSelect = document.querySelector("[data-payment-method-select]");
  const paymentMethodDetails = document.querySelector("[data-payment-method-details]");
  const depositAmountInput = document.querySelector("[data-deposit-amount-input]");
  const depositRatePreview = document.querySelector("[data-deposit-rate-preview]");
  const proofInput = document.querySelector("[data-proof-input]");
  const proofNote = document.querySelector("[data-proof-note]");
  const adminGate = document.querySelector("[data-admin-gate]");
  const adminAuthGate = document.querySelector("[data-admin-auth-gate]");
  const adminShell = document.querySelector("[data-admin-shell]");
  const adminProductForm = document.querySelector("[data-admin-product-form]");
  const adminPlanForm = document.querySelector("[data-admin-plan-form]");
  const adminPaymentMethodForm = document.querySelector("[data-admin-payment-method-form]");
  const adminExchangeRateForm = document.querySelector("[data-admin-exchange-rate-form]");
  const fetchLiveRateButton = document.querySelector("[data-fetch-live-rate]");
  const adminExchangeRateSummary = document.querySelector("[data-admin-exchange-rate-summary]");
  const adminRoleForm = document.querySelector("[data-admin-role-form]");
  const adminProductsList = document.querySelector("[data-admin-products-list]");
  const adminPlansList = document.querySelector("[data-admin-plans-list]");
  const adminPaymentMethodsList = document.querySelector("[data-admin-payment-methods-list]");
  const adminPaymentQueue = document.querySelector("[data-admin-payment-queue]");
  const adminWalletLedger = document.querySelector("[data-admin-wallet-ledger]");
  const adminReviewNotes = document.getElementById("admin-review-notes");
  const adminActionLog = document.getElementById("admin-action-log");
  const adminPlanProductSelect = document.querySelector("[data-admin-plan-product]");
  const adminReferralList = document.querySelector("[data-admin-referral-list]");
  const adminCommissionQueue = document.querySelector("[data-admin-commission-queue]");
  const adminSupportQueue = document.querySelector("[data-admin-support-queue]");
  const adminExpenseForm = document.querySelector("[data-admin-expense-form]");
  const adminExpenseClear = document.querySelector("[data-expense-clear]");
  const adminExpensesList = document.querySelector("[data-admin-expenses-list]");
  const expenseAmountInput = document.querySelector("[data-expense-amount]");
  const expenseCurrencySelect = document.querySelector("[data-expense-currency]");
  const expenseUsdInput = document.querySelector("[data-expense-usd]");
  const expenseRateNote = document.querySelector("[data-expense-rate-note]");
  const adminPriorityList = document.querySelector("[data-admin-priority-list]");
  const adminHealthList = document.querySelector("[data-admin-health-list]");
  const adminRevenueList = document.querySelector("[data-admin-revenue-list]");
  const reportRangeFilter = document.querySelector("[data-report-range]");
  const reportStatusFilter = document.querySelector("[data-report-status]");
  const reportMethodFilter = document.querySelector("[data-report-method]");
  const reportSearchFilter = document.querySelector("[data-report-search]");
  const reportFinancialStatement = document.querySelector("[data-report-financial-statement]");
  const reportWalletReconciliation = document.querySelector("[data-report-wallet-reconciliation]");
  const reportSourceNote = document.querySelector("[data-report-source]");
  const reportPrintButton = document.querySelector("[data-report-print]");
  const reportDepositsList = document.querySelector("[data-report-deposits-list]");
  const reportSubscriptionsList = document.querySelector("[data-report-subscriptions-list]");
  const reportReferralsList = document.querySelector("[data-report-referrals-list]");
  const reportExpensesList = document.querySelector("[data-report-expenses-list]");
  const auditRangeFilter = document.querySelector("[data-audit-range]");
  const auditActionFilter = document.querySelector("[data-audit-action]");
  const auditEntityFilter = document.querySelector("[data-audit-entity]");
  const auditSearchFilter = document.querySelector("[data-audit-search]");
  const adminAuditList = document.querySelector("[data-admin-audit-list]");
  const auditExportButton = document.querySelector("[data-audit-export]");
  const adminClientsList = document.querySelector("[data-admin-clients-list]");
  const adminClientDirectory = document.querySelector("[data-admin-client-directory]");
  const adminClientProfile = document.querySelector("[data-admin-client-profile]");
  const clientProfileSearch = document.querySelector("[data-client-profile-search]");
  const landingCreativeForm = document.querySelector("[data-landing-creative-form]");
  const landingCreativeClear = document.querySelector("[data-landing-creative-clear]");
  const landingCreativesList = document.querySelector("[data-landing-creatives-list]");
  const landingCreativePreview = document.querySelector("[data-landing-creative-preview]");
  const adminSubscriptionsList = document.querySelector("[data-admin-subscriptions-list]");
  const adminExpiringList = document.querySelector("[data-admin-expiring-list]");
  const adminRolesList = document.querySelector("[data-admin-roles-list]");
  const adminNotificationsList = document.querySelector("[data-admin-notifications-list]");
  const adminNotificationBadge = document.querySelector("[data-admin-notification-badge]");
  const superUserOnlyItems = document.querySelectorAll("[data-super-user-only]");
  const adminWriteOnlyItems = document.querySelectorAll("[data-admin-write-only]");
  const reportExportButtons = document.querySelectorAll("[data-report-export]");
  const clientAuthGate = document.querySelector("[data-client-auth-gate]");
  const clientAppShell = document.querySelector("[data-client-app-shell]");
  const clientFlowAlert = document.querySelector("[data-client-flow-alert]");
  const paymentContext = document.querySelector("[data-payment-context]");
  const clientNextActions = document.querySelector("[data-client-next-actions]");
  const walletPurchaseButton = document.querySelector("[data-wallet-purchase]");
  const walletReferralCode = document.querySelector("[data-wallet-referral-code]");
  const profileActiveSubscriptions = document.querySelector("[data-profile-active-subscriptions]");
  const profileRecentActivity = document.querySelector("[data-profile-recent-activity]");
  const profileReferralSnapshot = document.querySelector("[data-profile-referral-snapshot]");
  const planModal = document.querySelector("[data-plan-modal]");
  const planModalClose = document.querySelector("[data-plan-modal-close]");
  const planModalPurchase = document.querySelector("[data-plan-modal-purchase]");
  const planModalDeposit = document.querySelector("[data-plan-modal-deposit]");
  const planModalReferralCode = document.querySelector("[data-plan-modal-referral-code]");
  const planModalBenefits = document.querySelector("[data-plan-modal-benefits]");
  const walletTransactionsList = document.querySelector("[data-wallet-transactions-list]");
  const depositRequestsList = document.querySelector("[data-deposit-requests-list]");
  const commissionForm = document.querySelector("[data-commission-form]");
  const supportForm = document.querySelector("[data-support-form]");
  const supportThread = document.querySelector("[data-support-thread]");
  const clientNotifications = document.querySelector("[data-client-notifications]");
  const notificationBadge = document.querySelector("[data-notification-badge]");
  const notificationButton = document.querySelector("[data-notification-button]");
  const markNotificationsReadButton = document.querySelector("[data-mark-notifications-read]");
  const enableNotificationButtons = document.querySelectorAll("[data-enable-notifications]");
  const aiChatForm = document.querySelector("[data-ai-chat-form]");
  const aiChatMessages = document.querySelector("[data-ai-chat-messages]");
  const pamPromptButtons = document.querySelectorAll("[data-pam-prompt]");
  const MAX_PROOF_SIZE = 8 * 1024 * 1024;
  const ALLOWED_PROOF_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
  const LIVE_RATE_URL = "https://open.er-api.com/v6/latest/USD";
  const DEFAULT_PHP_RATE = {
    quote_currency: "PHP",
    base_currency: "USD",
    live_rate: 56.5,
    markup_amount: 0.5,
    manual_rate: null,
    final_rate: 57,
    source: "fallback",
    auto_enabled: true,
    fetched_at: null,
    updated_at: null,
  };
  let toastHost = null;

  if (!sdk || !config.url || !config.publishableKey) {
    setStatus("Supabase config is missing. Add the project URL and publishable key first.", "warn");
    return;
  }

  const client = sdk.createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  let currentUser = null;
  let currentProfile = null;
  let currentPlan = null;
  let paymentMethodsCache = [];
  let exchangeRateCache = { ...DEFAULT_PHP_RATE };
  let availableCommission = 0;
  let walletBalance = 0;
  let adminReportSnapshot = null;
  let adminClientSnapshot = null;
  let landingCreativesCache = [];
  let auditLogsCache = [];
  let supportTicketsCache = [];
  let realtimeChannels = [];
  let realtimeKey = "";
  let clientRealtimeRefreshTimer = null;
  let adminRealtimeRefreshTimer = null;
  let reportRenderToken = 0;
  let latestTrustedFinancialSummary = null;
  let latestTrustedReportKey = "";
  const referredByCode = getReferralCode();
  let lastClientSnapshot = {
    hasPendingPayment: false,
    hasActiveSubscription: false,
  };

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    bindAuthForms();
    bindAuthModeToggle();
    bindProfileForm();
    bindPaymentForm();
    bindWalletPurchase();
    bindProofInput();
    bindPaymentMethodSelect();
    bindPaymentMethodCopy();
    bindDepositEstimate();
    bindNotificationActions();
    bindCommissionForm();
    bindSupportForm();
    bindAiSupportChat();
    bindAdminForms();
    bindExchangeRateForm();
    bindAdminRoleForm();
    bindExpenseForm();
    bindReportFilters();
    bindReportPrint();
    bindReportExports();
    bindAuditFilters();
    bindAuditExport();
    bindClientProfileSearch();
    bindLandingCreativeForm();
    bindSignOut();
    await refreshSession();
    await loadPlans();

    client.auth.onAuthStateChange(async () => {
      await refreshSession();
    });
  }

  async function refreshSession() {
    const { data, error } = await client.auth.getUser();

    if (error || !data.user) {
      resetRealtimeSubscriptions();
      currentUser = null;
      currentProfile = null;
      renderSignedOut();
      return;
    }

    currentUser = data.user;
    currentProfile = await ensureProfile(data.user);
    renderSignedIn();
    await loadExchangeRate();
    await loadPaymentMethods();
    await hydrateClientData();
    renderAdminGate(data.user);
    setupRealtimeSubscriptions(data.user);
  }

  function bindAuthForms() {
    if (signInForm) {
      signInForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        await withButtonLoading(event.submitter, "Signing in...", async () => {
          const form = new FormData(signInForm);
          setStatus("Signing in...");

          const { error } = await client.auth.signInWithPassword({
            email: String(form.get("email") || "").trim(),
            password: String(form.get("password") || ""),
          });

          setStatus(error ? error.message : "Signed in successfully.", error ? "warn" : "ok");
        });
      });
    }

    if (signUpForm) {
      signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        await withButtonLoading(event.submitter, "Creating account...", async () => {
          const form = new FormData(signUpForm);
          setStatus("Creating client account...");

          const { data, error } = await client.auth.signUp({
            email: String(form.get("email") || "").trim(),
            password: String(form.get("password") || ""),
            options: {
              data: {
                full_name: String(form.get("full_name") || "").trim(),
                telegram_username: String(form.get("telegram_username") || "").trim(),
              },
            },
          });

          if (error) {
            setStatus(error.message, "warn");
            return;
          }

          if (!data.session) {
            setStatus("Account created. Please check email confirmation before signing in.", "ok");
            return;
          }

          setStatus("Account created and signed in.", "ok");
        });
      });
    }
  }

  function bindAuthModeToggle() {
    if (showSignupButton && signInForm && signUpForm) {
      showSignupButton.addEventListener("click", () => {
        signInForm.classList.add("hidden");
        signUpForm.classList.remove("hidden");
        setStatus("Create your client account to continue.", "ok");
      });
    }

    if (showLoginButton && signInForm && signUpForm) {
      showLoginButton.addEventListener("click", () => {
        signUpForm.classList.add("hidden");
        signInForm.classList.remove("hidden");
        setStatus("Sign in or create a client account to continue.", "warn");
      });
    }
  }

  function bindProfileForm() {
    if (!profileForm) return;

    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!currentUser) {
        setStatus("Please sign in before saving your profile.", "warn");
        return;
      }

      await withButtonLoading(event.submitter, "Saving...", async () => {
        const form = new FormData(profileForm);
        const update = {
          full_name: String(form.get("full_name") || "").trim(),
          email: String(form.get("email") || "").trim(),
          telegram_username: String(form.get("telegram_username") || "").trim(),
        };

        const { data, error } = await client
          .from("profiles")
          .update(update)
          .eq("id", currentUser.id)
          .select()
          .single();

        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        currentProfile = data;
        renderProfile(data);
        setStatus("Profile saved.", "ok");
      });
    });
  }

  function bindPaymentForm() {
    if (!paymentForm) return;

    paymentForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!currentUser) {
        setStatus("Please sign in before submitting a deposit.", "warn");
        return;
      }

      await withButtonLoading(event.submitter, "Submitting...", async () => {
        const form = new FormData(paymentForm);
        const selectedMethod = paymentMethodsCache.find((method) => method.method_key === String(form.get("method") || ""));
        if (!selectedMethod) {
          setStatus("Select an active deposit method first.", "warn");
          return;
        }

        if (!selectedMethod.account_number) {
          setStatus("This payment method is missing receiving details. Please choose another method or contact support.", "warn");
          return;
        }

        const file = proofInput?.files?.[0] || null;
        const fileError = validateProofFile(file);
        if (fileError) {
          setProofNote(fileError, "warn");
          setStatus(fileError, "warn");
          return;
        }

        let proofPath = null;
        try {
          proofPath = await uploadPaymentProof(file);
        } catch (error) {
          setProofNote(error.message, "warn");
          setStatus(error.message, "warn");
          return;
        }

        const amount = Number(form.get("amount") || 0);
        if (!amount || amount <= 0) {
          setStatus("Deposit amount must be greater than zero.", "warn");
          return;
        }
        const estimate = calculateWalletCredit(amount, selectedMethod);
        if (!estimate.walletCredit || estimate.walletCredit <= 0) {
          setStatus("Unable to calculate wallet credit. Check payment method and amount.", "warn");
          return;
        }

        const { data: deposit, error: depositError } = await client.from("deposit_requests").insert({
          client_id: currentUser.id,
          method: selectedMethod.method_key,
          payment_method_id: selectedMethod.id,
          amount: estimate.walletCredit,
          currency: "USD",
          paid_amount: estimate.paidAmount,
          paid_currency: estimate.paidCurrency,
          exchange_rate: estimate.exchangeRate,
          exchange_markup: estimate.exchangeMarkup,
          platform_rate: estimate.platformRate,
          wallet_credit_amount: estimate.walletCredit,
          transaction_reference: String(form.get("transaction_reference") || "").trim(),
          proof_path: proofPath,
          proof_file_name: file.name,
          proof_file_size: file.size,
          proof_file_type: file.type,
        }).select("id").single();

        if (depositError) {
          setStatus(depositError.message, "warn");
          return;
        }

        await createNotification({
          recipientId: currentUser.id,
          title: "Deposit submitted",
          message: `${selectedMethod.name} top-up proof received. Estimated wallet credit is ${formatMoney(estimate.walletCredit, "USD")}. Please wait for admin verification.`,
          category: "payment",
          entityTable: "deposit_requests",
          entityId: deposit.id,
        });

        paymentForm.reset();
        setProofNote("Accepted: JPG, PNG, WEBP, or PDF up to 8 MB.", "");
        renderPaymentMethodOptions();
        setStatus("Deposit submitted for admin review.", "ok");
        setClientFlow("verification", "Deposit received. Please wait while admin verifies your top-up proof.");
        goToTab("payments");
        await hydrateClientData();
      });
    });
  }

  function bindWalletPurchase() {
    if (!walletPurchaseButton && !planModalPurchase) return;

    const buyWithWallet = async (event) => {
      if (!currentUser) {
        setStatus("Please sign in before buying a plan.", "warn");
        return;
      }

      if (!currentPlan) {
        setStatus("Select a product plan first.", "warn");
        return;
      }

      if (walletBalance < currentPlan.price_amount) {
        setStatus("Insufficient wallet balance. Deposit funds first and wait for admin approval.", "warn");
        updateSelectedPlanSummary(currentPlan);
        setClientFlow("payment", "Your selected plan needs more wallet balance. Submit a deposit and wait for admin approval.");
        goToTab("payments");
        return;
      }

      await withButtonLoading(event?.currentTarget || event?.submitter || planModalPurchase || walletPurchaseButton, "Subscribing...", async () => {
        const { data, error } = await client.rpc("purchase_plan_with_wallet", {
          target_plan_id: currentPlan.id,
          referral_code: String(planModalReferralCode?.value || walletReferralCode?.value || referredByCode || "").trim().toUpperCase() || null,
        });

        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        walletBalance = Number(data?.wallet_balance || 0);
        await createNotification({
          recipientId: currentUser.id,
          title: "Subscription activated",
          message: `${currentPlan.product_name} / ${currentPlan.name} was purchased using your wallet balance.`,
          category: "subscription",
          entityTable: "subscriptions",
          entityId: data?.subscription_id || null,
        });

        setStatus("Plan purchased using wallet balance. Subscription is active.", "ok");
        setClientFlow("subscription", "Congratulations. Your subscription is now active and reflected in your account.");
        if (selectedPlan) {
          selectedPlan.textContent = "Subscription active. Choose another ETX tool when ready.";
          selectedPlan.className = "codebox ok";
        }
        currentPlan = null;
        closePlanModal();
        goToTab("subscriptions");
        await hydrateClientData();
      });
    };

    walletPurchaseButton?.addEventListener("click", buyWithWallet);
    planModalPurchase?.addEventListener("click", buyWithWallet);
    planModalClose?.addEventListener("click", closePlanModal);
    planModal?.addEventListener("click", (event) => {
      if (event.target === planModal) closePlanModal();
    });
    planModalDeposit?.addEventListener("click", () => {
      closePlanModal();
      goToTab("payments");
      setClientFlow("payment", "Submit a wallet deposit, then wait for admin approval before subscribing.");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePlanModal();
    });
  }

  function bindProofInput() {
    if (!proofInput) return;
    proofInput.addEventListener("change", () => {
      const file = proofInput.files?.[0] || null;
      const fileError = validateProofFile(file);
      if (fileError) {
        setProofNote(fileError, "warn");
        return;
      }

      setProofNote(`${file.name} selected. Ready for verification upload.`, "ok");
    });
  }

  function bindNotificationActions() {
    markNotificationsReadButton?.addEventListener("click", markClientNotificationsRead);
    enableNotificationButtons.forEach((button) => {
      button.addEventListener("click", requestBrowserNotificationPermission);
    });
    syncNotificationPermissionUi();
  }

  function bindReportPrint() {
    if (!reportPrintButton) return;

    reportPrintButton.addEventListener("click", () => {
      if (!requireAdmin()) return;
      document.body.classList.add("printing-report");
      setStatus("Opening printable financial report.", "ok");
      window.print();
      window.setTimeout(() => document.body.classList.remove("printing-report"), 800);
    });
  }

  function bindCommissionForm() {
    if (!commissionForm) return;

    commissionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!currentUser) {
        setStatus("Please sign in before requesting commission withdrawal.", "warn");
        return;
      }

      if (availableCommission <= 0) {
        setStatus("No available commission to withdraw yet.", "warn");
        return;
      }

      await withButtonLoading(event.submitter, "Submitting...", async () => {
        const form = new FormData(commissionForm);
        const { error } = await client.from("commission_requests").insert({
          client_id: currentUser.id,
          amount: availableCommission,
          payout_method: String(form.get("payout_method") || "").trim(),
          payout_details: String(form.get("payout_details") || "").trim(),
        });

        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        const { error: referralError } = await client
          .from("referrals")
          .update({ commission_status: "requested" })
          .eq("referrer_id", currentUser.id)
          .eq("commission_status", "available");

        if (referralError) {
          setStatus(referralError.message, "warn");
          return;
        }

        await createNotification({
          recipientId: currentUser.id,
          title: "Withdrawal request submitted",
          message: "Your referral withdrawal request is now waiting for admin review.",
          category: "commission",
          entityTable: "commission_requests",
        });

        commissionForm.reset();
        setStatus("Commission withdrawal request submitted for admin review.", "ok");
        await hydrateClientData();
      });
    });
  }

  function bindSupportForm() {
    if (!supportForm) return;

    supportForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!currentUser) {
        setStatus("Please sign in before sending a support request.", "warn");
        return;
      }

      await withButtonLoading(event.submitter, "Sending...", async () => {
        const form = new FormData(supportForm);
        const { data: ticket, error } = await client.from("support_tickets").insert({
          client_id: currentUser.id,
          subject: String(form.get("subject") || "").trim(),
          message: String(form.get("message") || "").trim(),
          status: "open",
        }).select("id,subject").single();

        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        await createNotification({
          recipientId: currentUser.id,
          title: "Support request submitted",
          message: `${ticket.subject} is now in the ETX support queue.`,
          category: "support",
          entityTable: "support_tickets",
          entityId: ticket.id,
        });

        supportForm.reset();
        setStatus("Support ticket submitted. ETX admin will review it.", "ok");
        goToTab("support");
        await hydrateClientData();
      });
    });
  }

  function bindAiSupportChat() {
    if (!aiChatForm || !aiChatMessages) return;

    pamPromptButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const question = String(button.dataset.pamPrompt || "").trim();
        if (!question) return;
        handlePamQuestion(question);
      });
    });

    aiChatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(aiChatForm);
      const question = String(form.get("message") || "").trim();
      if (!question) return;

      handlePamQuestion(question);
      aiChatForm.reset();
    });
  }

  function handlePamQuestion(question) {
    appendAiMessage(question, "user");
    appendAiMessage(getPamAnswer(question), "bot");
    if (aiChatMessages) {
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }
  }

  function appendAiMessage(message, role) {
    if (!aiChatMessages) return;
    const bubble = document.createElement("div");
    bubble.className = `ai-message ${role}`;
    bubble.textContent = message;
    aiChatMessages.appendChild(bubble);
  }

  const PAM_KNOWLEDGE = [
    {
      title: "Wallet / Deposit",
      keywords: ["deposit", "top up", "top-up", "wallet", "payment", "bayad", "proof", "gcash", "bpi", "usdt", "php", "peso", "rate", "conversion", "convert", "address", "bank"],
      answer: "Deposit flow:\n1. Open Wallet / Deposit.\n2. Choose the payment method.\n3. Send funds only to the official ETX receiving details shown on that page.\n4. Enter reference or TX hash, amount, and upload proof.\n5. Wait for admin verification.\n\nUSD is the main wallet currency. USDT is credited 1:1. PHP deposits use the active platform conversion rate plus the configured markup."
    },
    {
      title: "ETX Trading Tools",
      keywords: ["subscribe", "subscription", "plan", "buy", "purchase", "tools", "trading tools", "ea", "indicator", "signal", "safy", "yugo", "vip", "package"],
      answer: "Buying flow:\n1. Deposit first and wait until the wallet balance is approved.\n2. Open ETX Trading Tools.\n3. Pick a category and select a plan.\n4. Review the plan details in the popup.\n5. Subscribe using your approved wallet balance.\n\nIf the wallet balance is not enough, top up first before buying."
    },
    {
      title: "Subscription Status",
      keywords: ["active", "expired", "duration", "renew", "renewal", "status", "access", "valid", "days left"],
      answer: "Subscription status is shown in Subscriptions and Profile after purchase. Once the wallet purchase is completed, the subscription should appear with its active dates, status, and remaining access period."
    },
    {
      title: "Referral Commission",
      keywords: ["referral", "refer", "commission", "invite", "code", "link", "withdraw", "payout", "5%"],
      answer: "Referral rules:\n1. Share your referral code or link.\n2. When a referred client buys a valid ETX plan, you earn 5% of the subscribed amount.\n3. Commission is only counted after a valid wallet purchase.\n4. Self-referrals, duplicate accounts, fake transactions, or abuse attempts can be rejected.\n5. Available commission can be requested for withdrawal from the Referral page."
    },
    {
      title: "Verification",
      keywords: ["verify", "verification", "approved", "pending", "rejected", "reject", "review", "correction", "failed"],
      answer: "Verification guide:\nPending means ETX admin is reviewing the deposit proof.\nApproved means the USD wallet balance was credited.\nRejected means the proof, amount, method, or reference needs correction.\n\nIf rejected, resubmit the correct proof or send a support ticket with your reference number."
    },
    {
      title: "Notifications",
      keywords: ["notification", "notify", "bell", "alert", "message", "update", "congratulations"],
      answer: "Notifications appear in the bell area at the top of the client portal. You will be notified for deposit updates, subscription activation, support replies, and referral commission events. Browser alerts work while the portal is open if notifications are enabled."
    },
    {
      title: "Account / Profile",
      keywords: ["login", "account", "profile", "email", "telegram", "name", "signup", "sign up", "register", "password"],
      answer: "Account guide:\nLogin first to unlock the client dashboard. Your Profile stores your name, email, Telegram username, client ID, referral code, wallet summary, subscriptions, and recent activity.\n\nFor password or access issues, use the official login recovery flow or submit a support request."
    },
    {
      title: "Support",
      keywords: ["support", "help", "ticket", "reply", "concern", "issue", "problem", "manual"],
      answer: "For account-specific help, submit a Support Request below this chat. Include the plan name, deposit reference or TX hash, amount, payment method, and a short explanation so ETX admin can review faster."
    }
  ];

  function getPamAnswer(question) {
    const text = question.toLowerCase();

    if (["otp", "one time password", "private key", "seed phrase", "secret key", "recovery phrase"].some((keyword) => text.includes(keyword))) {
      return "Security reminder from PAM: never share your password, OTP, seed phrase, private keys, recovery phrase, or wallet secret. ETX support and PAM will never ask for those. If someone requests them, stop and report it through Support.";
    }

    if (["guarantee", "guaranteed", "sure profit", "no loss", "win rate", "100%", "financial advice"].some((keyword) => text.includes(keyword))) {
      return "Trading risk note from PAM: ETX tools can support analysis, workflow, and trading discipline, but they do not guarantee profit or remove market risk. Only trade with risk you understand and can manage.";
    }

    const matchedTopic = PAM_KNOWLEDGE
      .map((topic) => ({
        ...topic,
        score: topic.keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0)
      }))
      .sort((a, b) => b.score - a.score)[0];

    if (matchedTopic?.score) {
      return `PAM answer: ${matchedTopic.title}\n\n${matchedTopic.answer}`;
    }

    return "PAM can help with ETX wallet deposits, payment method details, USD balance, PHP conversion, ETX Trading Tools, subscriptions, referrals, verification, notifications, account/profile flow, and support tickets. For account-specific concerns, send a Support Request below so admin can review your case.";
  }

  function bindSignOut() {
    signOutButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        await client.auth.signOut();
        window.location.href = "index.html";
      });
    });
  }

  function bindAdminForms() {
    if (adminProductForm) {
      adminProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!requireAdminWrite()) return;

        await withButtonLoading(event.submitter, "Saving...", async () => {
          const form = new FormData(adminProductForm);
          const payload = {
            name: String(form.get("name") || "").trim(),
            code: String(form.get("code") || "").trim().toUpperCase(),
            category: String(form.get("category") || "expert_advisor"),
            description: String(form.get("description") || "").trim(),
            status: String(form.get("status") || "draft"),
            sort_order: Number(form.get("sort_order") || 100),
            created_by: currentUser.id,
          };

          const { data: product, error } = await client.from("products").upsert(payload, { onConflict: "code" }).select("id").single();
          if (error) {
            setStatus(error.message, "warn");
            return;
          }

          await logAdminAction("product.saved", "products", product?.id || null, {
            code: payload.code,
            status: payload.status,
          });
          adminProductForm.reset();
          setStatus("Product saved.", "ok");
          await loadAdminData();
          await loadPlans();
        });
      });
    }

    if (adminPlanForm) {
      adminPlanForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!requireAdminWrite()) return;

        await withButtonLoading(event.submitter, "Creating...", async () => {
          const form = new FormData(adminPlanForm);
          const payload = {
            product_id: String(form.get("product_id") || ""),
            name: String(form.get("name") || "").trim(),
            price_amount: Number(form.get("price_amount") || 0),
            currency: String(form.get("currency") || "USD"),
            duration_days: Number(form.get("duration_days") || 30),
            bonus_days: Number(form.get("bonus_days") || 0),
            is_trial: form.get("is_trial") === "on",
            status: String(form.get("status") || "active"),
          };

          const { data: plan, error } = await client.from("plans").insert(payload).select("id").single();
          if (error) {
            setStatus(error.message, "warn");
            return;
          }

          await logAdminAction("plan.created", "plans", plan?.id || null, {
            product_id: payload.product_id,
            price_amount: payload.price_amount,
            currency: payload.currency,
            status: payload.status,
          });
          adminPlanForm.reset();
          setStatus("Plan created.", "ok");
          await loadAdminData();
          await loadPlans();
        });
      });
    }

    if (adminPaymentMethodForm) {
      adminPaymentMethodForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!requireAdminWrite()) return;

        await withButtonLoading(event.submitter, "Saving...", async () => {
          const form = new FormData(adminPaymentMethodForm);
          const payload = {
            method_key: String(form.get("method_key") || "gcash"),
            name: String(form.get("name") || "").trim(),
            type: String(form.get("type") || "manual"),
            account_name: String(form.get("account_name") || "").trim() || null,
            account_number: String(form.get("account_number") || "").trim() || null,
            network: String(form.get("network") || "").trim() || null,
            instructions: String(form.get("instructions") || "").trim() || null,
            qr_image_url: String(form.get("qr_image_url") || "").trim() || null,
            status: String(form.get("status") || "active"),
            sort_order: Number(form.get("sort_order") || 100),
            created_by: currentUser.id,
          };

          const { data: method, error } = await client.from("payment_methods").upsert(payload, { onConflict: "method_key" }).select("id").single();
          if (error) {
            setStatus(error.message, "warn");
            return;
          }

          await logAdminAction("payment_method.saved", "payment_methods", method?.id || null, {
            method_key: payload.method_key,
            status: payload.status,
            type: payload.type,
          });
          adminPaymentMethodForm.reset();
          setStatus("Payment method saved.", "ok");
          await loadPaymentMethods();
          await loadAdminData();
        });
      });
    }
  }

  function bindExchangeRateForm() {
    if (fetchLiveRateButton) {
      fetchLiveRateButton.addEventListener("click", async (event) => {
        if (!requireAdminWrite()) return;

        await withButtonLoading(event.currentTarget, "Fetching...", async () => {
          setStatus("Fetching live USD/PHP rate...");
          const live = await fetchLivePhpRate();
          exchangeRateCache = normalizeExchangeRate({
            ...exchangeRateCache,
            live_rate: live.rate,
            source: live.source,
            fetched_at: live.fetchedAt,
          });
          hydrateExchangeRateForm();
          renderExchangeRateSummary();
          renderDepositEstimate();
          syncExpenseUsdAmount();
          setStatus("Live USD/PHP rate loaded. Review markup, then save.", "ok");
        }, "Unable to fetch the live USD/PHP rate.");
      });
    }

    if (!adminExchangeRateForm) return;

    adminExchangeRateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAdminWrite()) return;

      await withButtonLoading(event.submitter, "Saving...", async () => {
        const form = new FormData(adminExchangeRateForm);
        const liveRate = Number(form.get("live_rate") || 0);
        const markup = Number(form.get("markup_amount") || 0);
        const manualValue = String(form.get("manual_rate") || "").trim();
        const manualRate = manualValue ? Number(manualValue) : null;

        if (!liveRate || liveRate <= 0 || markup < 0 || (manualRate !== null && manualRate <= 0)) {
          setStatus("Enter a valid live rate, markup, and optional manual override.", "warn");
          return;
        }

        const payload = {
          quote_currency: "PHP",
          base_currency: "USD",
          live_rate: liveRate,
          markup_amount: markup,
          manual_rate: manualRate,
          source: exchangeRateCache.source || "admin",
          auto_enabled: String(form.get("auto_enabled")) === "true",
          fetched_at: exchangeRateCache.fetched_at,
          updated_by: currentUser.id,
        };

        const { data, error } = await client.from("exchange_rates").upsert(payload, { onConflict: "quote_currency" }).select("*").single();
        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        exchangeRateCache = normalizeExchangeRate(data);
        hydrateExchangeRateForm();
        renderExchangeRateSummary();
        renderDepositEstimate();
        syncExpenseUsdAmount();
        await logAdminAction("exchange_rate.updated", "exchange_rates", null, {
          quote_currency: payload.quote_currency,
          live_rate: payload.live_rate,
          markup_amount: payload.markup_amount,
          manual_rate: payload.manual_rate,
          final_rate: data.final_rate,
        });
        setStatus("Conversion rate saved.", "ok");
        await loadAdminData();
      });
    });
  }

  function bindAdminRoleForm() {
    if (!adminRoleForm) return;

    adminRoleForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireSuperUser()) return;

      await withButtonLoading(event.submitter, "Saving...", async () => {
        const form = new FormData(adminRoleForm);
        const roleKey = normalizeRoleKey(form.get("role_key"));
        const payload = {
          name: String(form.get("name") || "").trim(),
          role_key: roleKey,
          description: String(form.get("description") || "").trim(),
          created_by: currentUser.id,
        };

        const { data: role, error } = await client.from("admin_roles").upsert(payload, { onConflict: "role_key" }).select("id").single();
        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        await logAdminAction("role.saved", "admin_roles", role?.id || null, {
          role_key: payload.role_key,
          name: payload.name,
        });
        adminRoleForm.reset();
        setStatus("Role saved. Assign the matching app_metadata role after final permission mapping.", "ok");
        await loadAdminRoles();
      });
    });
  }

  function bindExpenseForm() {
    if (adminExpenseClear) {
      adminExpenseClear.addEventListener("click", () => {
        clearExpenseForm();
        setStatus("Expense form cleared.", "ok");
      });
    }

    [expenseAmountInput, expenseCurrencySelect].forEach((control) => {
      if (!control) return;
      control.addEventListener("input", syncExpenseUsdAmount);
      control.addEventListener("change", syncExpenseUsdAmount);
    });

    if (!adminExpenseForm) return;
    clearExpenseForm();

    adminExpenseForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAdminWrite()) return;

      await withButtonLoading(event.submitter, "Saving...", async () => {
        const form = new FormData(adminExpenseForm);
        const amount = Number(form.get("amount") || 0);
        const currency = String(form.get("currency") || "USD");
        const usdAmount = Number(form.get("usd_amount") || calculateExpenseUsdAmount(amount, currency));
        const description = String(form.get("description") || "").trim();

        if (!description || !amount || amount <= 0 || !usdAmount || usdAmount <= 0) {
          setStatus("Enter a valid expense description, amount, and USD equivalent.", "warn");
          return;
        }

        const payload = {
          expense_date: String(form.get("expense_date") || todayInputValue()),
          category: String(form.get("category") || "other"),
          description,
          vendor: String(form.get("vendor") || "").trim() || null,
          payment_method: String(form.get("payment_method") || "").trim() || null,
          amount: roundMoney(amount),
          currency,
          usd_amount: roundMoney(usdAmount),
          status: String(form.get("status") || "approved"),
          receipt_url: String(form.get("receipt_url") || "").trim() || null,
          notes: String(form.get("notes") || "").trim() || null,
          updated_by: currentUser.id,
        };
        const id = String(form.get("id") || "").trim();
        if (!id) payload.created_by = currentUser.id;

        const query = id
          ? client.from("expenses").update(payload).eq("id", id).select("*").single()
          : client.from("expenses").insert(payload).select("*").single();
        const { data, error } = await query;

        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        await logAdminAction(id ? "expense.updated" : "expense.created", "expenses", data.id, {
          category: payload.category,
          status: payload.status,
          usd_amount: payload.usd_amount,
        });
        clearExpenseForm();
        setStatus(id ? "Expense updated." : "Expense saved.", "ok");
        await loadAdminData();
      });
    });
  }

  function syncExpenseUsdAmount() {
    if (!expenseUsdInput) return;
    const amount = Number(expenseAmountInput?.value || 0);
    const currency = expenseCurrencySelect?.value || "USD";
    const usdAmount = calculateExpenseUsdAmount(amount, currency);
    expenseUsdInput.value = usdAmount ? String(usdAmount) : "";

    if (expenseRateNote) {
      expenseRateNote.textContent = currency === "PHP"
        ? `PHP expense uses platform rate ${formatRate(getPlatformRate())} PHP per USD. Adjust USD equivalent if needed.`
        : `${currency} expense is treated as 1:1 with USD. Adjust USD equivalent if needed.`;
    }
  }

  function calculateExpenseUsdAmount(amount, currency) {
    const value = Number(amount || 0);
    if (!value || value <= 0) return 0;
    if (currency === "PHP") return roundMoney(value / getPlatformRate());
    return roundMoney(value);
  }

  function hydrateExpenseForm(expense) {
    if (!adminExpenseForm || !expense) return;
    adminExpenseForm.elements.id.value = expense.id || "";
    adminExpenseForm.elements.expense_date.value = expense.expense_date || todayInputValue();
    adminExpenseForm.elements.category.value = expense.category || "other";
    adminExpenseForm.elements.description.value = expense.description || "";
    adminExpenseForm.elements.vendor.value = expense.vendor || "";
    adminExpenseForm.elements.payment_method.value = expense.payment_method || "";
    adminExpenseForm.elements.amount.value = expense.amount || "";
    adminExpenseForm.elements.currency.value = expense.currency || "USD";
    adminExpenseForm.elements.usd_amount.value = expense.usd_amount || "";
    adminExpenseForm.elements.status.value = expense.status || "approved";
    adminExpenseForm.elements.receipt_url.value = expense.receipt_url || "";
    adminExpenseForm.elements.notes.value = expense.notes || "";
    setStatus("Expense loaded for editing.", "ok");
    goToTab("admin-expenses");
  }

  function clearExpenseForm() {
    if (!adminExpenseForm) return;
    adminExpenseForm.reset();
    adminExpenseForm.elements.id.value = "";
    adminExpenseForm.elements.expense_date.value = todayInputValue();
    adminExpenseForm.elements.status.value = "approved";
    syncExpenseUsdAmount();
  }

  async function ensureProfile(user) {
    const { data: existing } = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
    const appRole = String(user.app_metadata?.role || "").toLowerCase();
    const profileRole = ["super_user", "admin", "manager"].includes(appRole) ? appRole : "client";
    if (existing) {
      if (profileRole !== "client" && existing.role !== profileRole) {
        const { data: updated, error } = await client.from("profiles").update({ role: profileRole }).eq("id", user.id).select().single();
        if (error) {
          setStatus(error.message, "warn");
          return existing;
        }
        return updated;
      }
      return existing;
    }

    const meta = user.user_metadata || {};
    const profile = {
      id: user.id,
      role: profileRole,
      full_name: meta.full_name || "",
      email: user.email,
      telegram_username: meta.telegram_username || "",
      referral_code: makeReferralCode(user.email || user.id),
    };

    const { data, error } = await client.from("profiles").insert(profile).select().single();
    if (error) {
      setStatus(error.message, "warn");
      return null;
    }
    return data;
  }

  async function loadPlans() {
    if (!dynamicPlanGrid) return;

    const { data, error } = await client
      .from("plans")
      .select("id,name,price_amount,currency,duration_days,bonus_days,is_trial,products(name,code,category)")
      .eq("status", "active")
      .order("price_amount", { ascending: true });

    if (error) {
      dynamicPlanGrid.innerHTML = `<article class="panel"><h3>Plans unavailable</h3><p>${escapeHtml(error.message)}</p></article>`;
      return;
    }

    dynamicPlanGrid.innerHTML = renderGroupedPlans(data);
    dynamicPlanGrid.querySelectorAll("[data-select-plan]").forEach((button) => {
      button.addEventListener("click", () => {
        const plan = data.find((item) => item.id === button.dataset.selectPlan);
        if (!plan) return;

        currentPlan = {
          id: plan.id,
          name: plan.name,
          price_amount: Number(plan.price_amount),
          currency: plan.currency,
          product_name: plan.products?.name || "ETX Product",
          product_code: plan.products?.code || "ETX",
          category: formatCategory(plan.products?.category || plan.products?.name || "ETX Trading Tools"),
          duration_days: Number(plan.duration_days || 0),
          bonus_days: Number(plan.bonus_days || 0),
          is_trial: Boolean(plan.is_trial),
        };

        updateSelectedPlanSummary(currentPlan);

        if (paymentContext) {
          paymentContext.textContent = `Wallet deposit mode. Approved balance required before buying ${currentPlan.product_name} / ${currentPlan.name}.`;
        }

        setStatus("Plan selected. Review wallet checkout details.", "ok");
        setClientFlow("select", "Plan selected. Confirm inside the checkout modal, or deposit funds if balance is insufficient.");
        openPlanModal(currentPlan);
      });
    });
  }

  async function loadExchangeRate() {
    if (!currentUser) return exchangeRateCache;

    const { data, error } = await client.from("exchange_rates").select("*").eq("quote_currency", "PHP").maybeSingle();
    if (!error && data) {
      exchangeRateCache = normalizeExchangeRate(data);
    }

    hydrateExchangeRateForm();
    renderExchangeRateSummary();
    renderDepositEstimate();
    syncExpenseUsdAmount();
    return exchangeRateCache;
  }

  function normalizeExchangeRate(rate) {
    const liveRate = Number(rate?.live_rate || DEFAULT_PHP_RATE.live_rate);
    const markup = Number(rate?.markup_amount ?? DEFAULT_PHP_RATE.markup_amount);
    const manualRate = rate?.manual_rate === null || rate?.manual_rate === undefined || rate?.manual_rate === "" ? null : Number(rate.manual_rate);
    const finalRate = Number(rate?.final_rate || manualRate || liveRate + markup);
    return {
      ...DEFAULT_PHP_RATE,
      ...rate,
      live_rate: liveRate,
      markup_amount: markup,
      manual_rate: manualRate,
      final_rate: finalRate,
      auto_enabled: rate?.auto_enabled !== false,
    };
  }

  function getPlatformRate() {
    return Number(exchangeRateCache.final_rate || exchangeRateCache.manual_rate || Number(exchangeRateCache.live_rate || 0) + Number(exchangeRateCache.markup_amount || 0) || DEFAULT_PHP_RATE.final_rate);
  }

  async function fetchLivePhpRate() {
    const response = await fetch(LIVE_RATE_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Live rate source is unavailable.");
    const payload = await response.json();
    const rate = Number(payload?.rates?.PHP);
    if (!rate || rate <= 0) throw new Error("Live PHP rate was not returned.");
    return {
      rate,
      source: payload?.provider || "open.er-api.com",
      fetchedAt: new Date().toISOString(),
    };
  }

  function getDepositCurrency(method) {
    if (!method) return "USD";
    if (method.method_key === "gcash" || method.method_key === "bpi" || method.type === "ewallet" || method.type === "bank") return "PHP";
    if (method.method_key?.startsWith("usdt") || method.type === "crypto") return "USDT";
    return "USD";
  }

  function calculateWalletCredit(amount, method) {
    const paidAmount = Number(amount || 0);
    const paidCurrency = getDepositCurrency(method);
    if (!paidAmount || paidAmount <= 0) {
      return { paidAmount: 0, paidCurrency, walletCredit: 0, exchangeRate: null, exchangeMarkup: 0, platformRate: null };
    }

    if (paidCurrency === "PHP") {
      const platformRate = getPlatformRate();
      return {
        paidAmount,
        paidCurrency,
        walletCredit: roundMoney(paidAmount / platformRate),
        exchangeRate: Number(exchangeRateCache.live_rate || 0),
        exchangeMarkup: Number(exchangeRateCache.markup_amount || 0),
        platformRate,
      };
    }

    return {
      paidAmount,
      paidCurrency,
      walletCredit: roundMoney(paidAmount),
      exchangeRate: 1,
      exchangeMarkup: 0,
      platformRate: 1,
    };
  }

  function renderDepositEstimate() {
    if (!depositRatePreview || !paymentMethodSelect) return;

    const method = paymentMethodsCache.find((item) => item.method_key === paymentMethodSelect.value && item.status === "active");
    const amount = Number(depositAmountInput?.value || 0);
    const estimate = calculateWalletCredit(amount, method);

    if (!method) {
      depositRatePreview.innerHTML = `<strong>Wallet Credit Estimate</strong><span>Select a payment method and enter amount.</span>`;
      return;
    }

    if (!amount || amount <= 0) {
      depositRatePreview.innerHTML = `<strong>${escapeHtml(estimate.paidCurrency)} Deposit</strong><span>Enter amount to estimate USD wallet credit.</span>`;
      return;
    }

    const rateLine = estimate.paidCurrency === "PHP"
      ? `<span>Rate: ${formatRate(estimate.exchangeRate)} + ${formatRate(estimate.exchangeMarkup)} = ${formatRate(estimate.platformRate)} PHP per USD</span>`
      : `<span>Rate: 1 ${escapeHtml(estimate.paidCurrency)} = 1 USD</span>`;

    depositRatePreview.innerHTML = `
      <strong>Estimated Credit: ${escapeHtml(formatMoney(estimate.walletCredit, "USD"))}</strong>
      <span>Paid: ${escapeHtml(formatMoney(estimate.paidAmount, estimate.paidCurrency))}</span>
      ${rateLine}
      <small>Final credit is subject to admin verification.</small>
    `;
  }

  function hydrateExchangeRateForm() {
    if (!adminExchangeRateForm) return;
    setField(adminExchangeRateForm, "live_rate", exchangeRateCache.live_rate || "");
    setField(adminExchangeRateForm, "markup_amount", exchangeRateCache.markup_amount ?? 0);
    setField(adminExchangeRateForm, "manual_rate", exchangeRateCache.manual_rate || "");
    setField(adminExchangeRateForm, "auto_enabled", String(exchangeRateCache.auto_enabled !== false));
  }

  function renderExchangeRateSummary() {
    if (!adminExchangeRateSummary) return;
    const updated = exchangeRateCache.updated_at || exchangeRateCache.fetched_at;
    adminExchangeRateSummary.innerHTML = `
      <div class="row"><span>Live USD/PHP</span><b>${escapeHtml(formatRate(exchangeRateCache.live_rate))}</b></div>
      <div class="row"><span>Markup</span><b>${escapeHtml(formatRate(exchangeRateCache.markup_amount))}</b></div>
      <div class="row"><span>Platform Rate</span><b class="ok">${escapeHtml(formatRate(getPlatformRate()))}</b></div>
      <div class="row"><span>Mode</span><b>${escapeHtml(exchangeRateCache.manual_rate ? "Manual override" : "Auto + markup")}</b></div>
      <div class="row"><span>Updated</span><b>${escapeHtml(updated ? formatDateTime(updated) : "Not synced")}</b></div>
    `;
  }

  async function loadPaymentMethods() {
    if (!paymentMethodSelect && !adminPaymentMethodsList) return;

    const query = client
      .from("payment_methods")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    const { data, error } = hasAdminAccess() ? await query : await query.eq("status", "active");

    if (error) {
      if (paymentMethodSelect) {
        paymentMethodSelect.innerHTML = `<option value="">Payment methods unavailable</option>`;
        paymentMethodSelect.disabled = true;
      }
      setStatus(error.message, "warn");
      return;
    }

    paymentMethodsCache = data || [];
    renderPaymentMethodOptions();
  }

  function bindPaymentMethodSelect() {
    if (!paymentMethodSelect) return;
    paymentMethodSelect.addEventListener("change", () => {
      renderPaymentMethodDetails();
      renderDepositEstimate();
    });
  }

  function bindPaymentMethodCopy() {
    if (!paymentMethodDetails) return;
    paymentMethodDetails.addEventListener("click", async (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("[data-copy-payment-detail]");
      if (!button) return;

      const value = button.dataset.copyPaymentDetail || "";
      if (!value) {
        setStatus("No payment detail available to copy.", "warn");
        return;
      }

      await copyText(value, "Payment detail copied.");
    });
  }

  function bindDepositEstimate() {
    if (!depositAmountInput) return;
    depositAmountInput.addEventListener("input", renderDepositEstimate);
  }

  function renderPaymentMethodOptions() {
    if (!paymentMethodSelect) return;

    const activeMethods = paymentMethodsCache.filter((method) => method.status === "active");
    paymentMethodSelect.disabled = activeMethods.length === 0;
    paymentMethodSelect.innerHTML = activeMethods.length
      ? activeMethods.map((method) => `<option value="${escapeHtml(method.method_key)}">${escapeHtml(method.name)}</option>`).join("")
      : `<option value="">No active payment methods</option>`;

    renderPaymentMethodDetails();
    renderDepositEstimate();
  }

  function renderPaymentMethodDetails() {
    if (!paymentMethodDetails || !paymentMethodSelect) return;

    const method = paymentMethodsCache.find((item) => item.method_key === paymentMethodSelect.value && item.status === "active");
    if (!method) {
      paymentMethodDetails.innerHTML = `<strong>No method selected</strong><span>Choose an active deposit method before submitting proof.</span>`;
      return;
    }

    const account = method.account_number ? method.account_number : "Account details not configured yet.";
    const accountTone = method.account_number ? "" : "warn";
    const copyButton = method.account_number
      ? `<button class="ghost-btn compact-btn copy-detail-btn" type="button" data-copy-payment-detail="${escapeHtml(method.account_number)}">Copy</button>`
      : "";
    const metaRows = [
      ["Account Name", method.account_name || "ETX Finance"],
      [method.type === "crypto" ? "Wallet Address" : "Account / Mobile Number", account],
      ["Network", method.network || (method.type === "crypto" ? "Confirm network before sending" : "Not required")],
    ];
    const paidCurrency = getDepositCurrency(method);
    const currencyNote = paidCurrency === "PHP" ? `Enter PHP amount. Platform rate: ${formatRate(getPlatformRate())} PHP per USD.` : "Enter USDT amount. Wallet credit is 1:1 USD.";
    const qr = method.qr_image_url
      ? `<a href="${escapeHtml(method.qr_image_url)}" target="_blank" rel="noopener">Open QR / payment image</a>`
      : "";

    paymentMethodDetails.innerHTML = `
      <strong>Send funds to: ${escapeHtml(method.name)}</strong>
      <div class="method-data-list">
        ${metaRows.map(([label, value]) => {
          const isDestination = label.includes("Account / Mobile") || label.includes("Wallet");
          return `<span class="${isDestination ? "payment-destination-row" : ""}"><small>${escapeHtml(label)}</small><b class="${isDestination ? accountTone : ""}">${escapeHtml(value)}</b>${isDestination ? copyButton : ""}</span>`;
        }).join("")}
      </div>
      <span>${escapeHtml(currencyNote)}</span>
      ${method.account_number ? `<p class="payment-safe-note">Send only to this active ETX destination, then upload proof with visible reference details.</p>` : `<p class="payment-safe-note warn">This method is not ready. Admin must add the official receiving account before clients can submit deposits.</p>`}
      <small>${escapeHtml(method.instructions || "Send the exact top-up amount, then upload proof with a visible reference number.")}</small>
      ${qr}
    `;
  }

  async function hydrateClientData() {
    if (!currentUser) return;

    const [profile, orders, payments, subscriptions, referrals, commissionRequests, supportTickets, notifications, deposits, walletTransactions] = await Promise.all([
      client.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
      client.from("orders").select("id,status,total_amount,currency,created_at,plans(name,duration_days,bonus_days,products(name,category))").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(8),
      client.from("payments").select("id,status,amount,currency,method,transaction_reference,proof_file_name,proof_file_size,proof_file_type,resubmitted_from,review_notes,created_at,payment_methods(name,network),orders(plans(name,products(name)))").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("subscriptions").select("status,starts_at,expires_at,created_at,products(name,category),plans(name,duration_days,bonus_days)").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(8),
      client.from("referrals").select("commission_amount,commission_status,created_at").eq("referrer_id", currentUser.id).order("created_at", { ascending: false }).limit(12),
      client.from("commission_requests").select("amount,status,payout_method,created_at").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("support_tickets").select("id,subject,message,status,created_at,updated_at,support_replies(id,author_id,message,is_admin_reply,created_at)").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("notifications").select("*").eq("recipient_id", currentUser.id).neq("status", "archived").order("created_at", { ascending: false }).limit(8),
      client.from("deposit_requests").select("id,status,amount,currency,paid_amount,paid_currency,exchange_rate,exchange_markup,platform_rate,wallet_credit_amount,method,transaction_reference,proof_file_name,review_notes,created_at").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(8),
      client.from("wallet_transactions").select("id,type,direction,amount,currency,balance_after,description,created_at").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(8),
    ]);

    if (profile.data) {
      currentProfile = profile.data;
      renderProfile(currentProfile);
    }

    const clientDataError = profile.error || orders.error || payments.error || subscriptions.error || referrals.error || commissionRequests.error || supportTickets.error || notifications.error || deposits.error || walletTransactions.error;
    if (clientDataError) {
      setStatus(clientDataError.message, "warn");
      return;
    }

    renderList("[data-orders-list]", orders.data, renderOrderRow, "No orders yet.");
    renderList("[data-payments-list]", payments.data, renderPaymentRow, "No payment submitted yet.");
    renderList("[data-subscriptions-list]", subscriptions.data, renderSubscriptionRow, "No subscriptions yet.");
    renderListElement(depositRequestsList, deposits.data, renderDepositRequestRow, "No deposit requests yet.");
    renderListElement(walletTransactionsList, walletTransactions.data, renderWalletTransactionRow, "No wallet activity yet.");
    renderClientProfileDashboard({
      profile: currentProfile,
      orders: orders.data || [],
      payments: payments.data || [],
      subscriptions: subscriptions.data || [],
      referrals: referrals.data || [],
      deposits: deposits.data || [],
      walletTransactions: walletTransactions.data || [],
      supportTickets: supportTickets.data || [],
      notifications: notifications.data || [],
    });
    supportTicketsCache = supportTickets.data || [];
    renderList("[data-support-tickets-list]", supportTickets.data, renderSupportTicketRow, "No support tickets yet.");
    if (!supportTicketsCache.length && supportThread) {
      supportThread.innerHTML = `<p class="codebox">Select a ticket to view replies.</p>`;
    }
    bindClientSupportTicketActions();

    walletBalance = Number(currentProfile?.wallet_balance || 0);
    setText("[data-wallet-balance]", formatMoney(walletBalance, "USD"));
    syncClientFlowState(orders.data || [], payments.data || [], subscriptions.data || [], supportTickets.data || [], notifications.data || [], deposits.data || []);

    const referralRows = referrals.data || [];
    availableCommission = referralRows
      .filter((item) => item.commission_status === "available")
      .reduce((sum, item) => sum + Number(item.commission_amount || 0), 0);

    renderList("[data-commission-requests-list]", commissionRequests.data, renderCommissionRequestRow, "No withdrawal request yet.");
    setText("[data-referral-invites]", String(referralRows.length));
    setText("[data-referral-conversions]", String(referralRows.filter((item) => ["available", "requested", "approved", "paid"].includes(item.commission_status)).length));
    setText("[data-referral-code]", currentProfile?.referral_code || "Pending");
    setText("[data-referral-link]", `${window.location.origin}/?ref=${currentProfile?.referral_code || ""}`);
    setText("[data-commission-total]", formatMoney(availableCommission, "USD"));
  }

  function renderSignedOut() {
    authPanels.forEach((panel) => panel.classList.toggle("is-signed-in", false));
    toggleClientShell(false);
    setText("[data-auth-email]", "Not signed in");
    setStatus("Sign in or create a client account to continue.", "warn");
    setClientFlow("select", "Sign in or create a client account to continue.");
    updateBadge(notificationBadge, 0);
    updateBadge(adminNotificationBadge, 0);
    renderAdminGate(null);
  }

  function renderSignedIn() {
    authPanels.forEach((panel) => panel.classList.toggle("is-signed-in", true));
    toggleClientShell(true);
    setText("[data-auth-email]", currentUser.email || "Signed in");
    renderProfile(currentProfile);
    setClientFlow("select", "Select a plan to start your subscription request.");
  }

  function toggleClientShell(isSignedIn) {
    if (!clientAuthGate || !clientAppShell) return;
    clientAuthGate.classList.toggle("hidden", isSignedIn);
    clientAppShell.classList.toggle("hidden", !isSignedIn);
    notificationButton?.classList.toggle("hidden", !isSignedIn);
  }

  function renderProfile(profile) {
    if (!profileForm || !profile) return;
    setField(profileForm, "full_name", profile.full_name || "");
    setField(profileForm, "email", profile.email || currentUser?.email || "");
    setField(profileForm, "telegram_username", profile.telegram_username || "");
    setField(profileForm, "referral_code", profile.referral_code || "");
  }

  function renderClientProfileDashboard(data) {
    const profile = data.profile || currentProfile || {};
    const activeSubscriptions = (data.subscriptions || []).filter((subscription) => ["active", "trial"].includes(subscription.status));
    const latestDeposit = (data.deposits || [])[0];
    const referralRows = data.referrals || [];
    const availableReferral = referralRows
      .filter((item) => item.commission_status === "available")
      .reduce((sum, item) => sum + Number(item.commission_amount || 0), 0);

    setText("[data-profile-display-name]", profile.full_name || profile.email || currentUser?.email || "ETX Client");
    setText("[data-profile-display-email]", profile.email || currentUser?.email || "No email");
    setText("[data-profile-display-telegram]", profile.telegram_username || "Not set");
    setText("[data-profile-display-referral]", profile.referral_code || "Pending");
    setText("[data-profile-wallet-balance]", formatMoney(Number(profile.wallet_balance || walletBalance || 0), "USD"));
    setText("[data-profile-active-count]", String(activeSubscriptions.length));
    setText("[data-profile-active-detail]", activeSubscriptions[0] ? `${activeSubscriptions[0].products?.name || "ETX Product"} active` : "No active access yet");
    setText("[data-profile-referral-earnings]", formatMoney(availableReferral, "USD"));
    setText("[data-profile-referral-detail]", `${referralRows.length} referral record${referralRows.length === 1 ? "" : "s"}`);
    setText("[data-profile-latest-deposit]", latestDeposit ? formatStatus(latestDeposit.status) : "None");
    setText("[data-profile-latest-deposit-detail]", latestDeposit ? `${formatMoney(latestDeposit.wallet_credit_amount || latestDeposit.amount || 0, "USD")} / ${formatDate(latestDeposit.created_at)}` : "No top-up yet");

    renderListElement(profileActiveSubscriptions, activeSubscriptions, renderProfileAccessRow, "No active subscriptions yet.");
    renderListElement(profileRecentActivity, buildProfileActivityRows(data), renderProfileActivityRow, "Recent activity will appear here.");
    renderProfileReferralSnapshot(referralRows, availableReferral);
  }

  function renderProfileAccessRow(subscription) {
    const product = subscription.products?.name || "ETX Product";
    const plan = subscription.plans?.name || "Plan";
    const days = daysUntil(subscription.expires_at);
    const expiry = subscription.expires_at ? `${days} day${days === 1 ? "" : "s"} left` : "No expiry";

    return `
      <div class="profile-access-row">
        <div>
          <strong>${escapeHtml(product)}</strong>
          <span>${escapeHtml(plan)} - ${escapeHtml(formatStatus(subscription.status))}</span>
        </div>
        <b>${escapeHtml(expiry)}</b>
      </div>
    `;
  }

  function buildProfileActivityRows(data) {
    const rows = [
      ...(data.deposits || []).map((deposit) => ({
        at: deposit.created_at,
        type: "Deposit",
        title: formatMoney(deposit.wallet_credit_amount || deposit.amount || 0, "USD"),
        detail: `${formatStatus(deposit.status)} / ${deposit.transaction_reference || "No reference"}`,
      })),
      ...(data.orders || []).map((order) => ({
        at: order.created_at,
        type: "Order",
        title: order.plans?.products?.name || order.plans?.name || "ETX Order",
        detail: `${formatMoney(order.total_amount || 0, order.currency || "USD")} / ${formatStatus(order.status)}`,
      })),
      ...(data.subscriptions || []).map((subscription) => ({
        at: subscription.created_at || subscription.starts_at,
        type: "Subscription",
        title: subscription.products?.name || subscription.plans?.name || "ETX Access",
        detail: `${formatStatus(subscription.status)} until ${formatDate(subscription.expires_at)}`,
      })),
      ...(data.supportTickets || []).map((ticket) => ({
        at: ticket.updated_at || ticket.created_at,
        type: "Support",
        title: ticket.subject || "Support Ticket",
        detail: formatStatus(ticket.status),
      })),
      ...(data.notifications || []).map((notification) => ({
        at: notification.created_at,
        type: "Notice",
        title: notification.title || "Notification",
        detail: notification.body || formatStatus(notification.status),
      })),
    ];

    return rows
      .filter((item) => item.at)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 8);
  }

  function renderProfileActivityRow(item) {
    return `
      <div class="profile-activity-row">
        <span>${escapeHtml(item.type)}</span>
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.detail)} - ${formatDate(item.at)}</small>
        </div>
      </div>
    `;
  }

  function renderProfileReferralSnapshot(referrals, availableReferral) {
    if (!profileReferralSnapshot) return;

    const convertedRows = referrals.filter((item) => ["available", "requested", "approved", "paid"].includes(item.commission_status));
    const latestRows = referrals.slice(0, 4).map((item, index) => {
      const referredClient = `Referral ${index + 1}`;
      return `
        <div class="profile-referral-row">
          <span>${escapeHtml(referredClient)}</span>
          <b>${escapeHtml(formatMoney(item.commission_amount || 0, "USD"))}</b>
          <small>${escapeHtml(formatStatus(item.commission_status))} - ${formatDate(item.created_at)}</small>
        </div>
      `;
    }).join("");

    profileReferralSnapshot.innerHTML = `
      <div class="profile-referral-summary">
        <div><span>Total Invites</span><strong>${referrals.length}</strong></div>
        <div><span>Conversions</span><strong>${convertedRows.length}</strong></div>
        <div><span>Available</span><strong>${formatMoney(availableReferral, "USD")}</strong></div>
      </div>
      ${latestRows || `<p class="codebox">No referral activity yet.</p>`}
    `;
  }

  function renderAdminGate(user) {
    if (!adminGate || !adminShell || !adminAuthGate) return;

    const hasAccess = hasAdminAccess(user);
    const isSuperUser = hasSuperUserAccess(user);
    const canWrite = hasAdminWriteAccess(user);
    adminAuthGate.classList.toggle("hidden", hasAccess);
    adminGate.classList.toggle("hidden", hasAccess);
    adminShell.classList.toggle("hidden", !hasAccess);
    superUserOnlyItems.forEach((item) => item.classList.toggle("hidden", !isSuperUser));
    adminWriteOnlyItems.forEach((item) => item.classList.toggle("hidden", !canWrite));
    setText("[data-admin-role-label]", formatRoleLabel(user?.app_metadata?.role || "none"));

    if (!user) {
      setText("[data-admin-gate-title]", "Admin sign in required");
      return;
    }

    if (!hasAccess) {
      setText("[data-admin-gate-title]", "Signed in, but operations role is required");
      return;
    }

    setStatus(`${formatRoleLabel(user.app_metadata?.role)} verified. Loading operations workspace...`, "ok");
    loadAdminData();
  }

  async function loadAdminRoles() {
    if (!hasSuperUserAccess()) return;

    const { data, error } = await client.from("admin_roles").select("*").order("sort_order", { ascending: true });
    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    renderListElement(adminRolesList, data, renderAdminRoleRow, "No custom roles yet.");
  }

  async function uploadPaymentProof(file) {
    const fileError = validateProofFile(file);
    if (fileError) throw new Error(fileError);

    const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
    const path = `${currentUser.id}/${Date.now()}-${safeName}`;
    const { error } = await client.storage.from("payment-proofs").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    return path;
  }

  function validateProofFile(file) {
    if (!file) return "Upload a deposit proof file before submitting.";
    if (!ALLOWED_PROOF_TYPES.includes(file.type)) return "Proof must be JPG, PNG, WEBP, or PDF.";
    if (file.size > MAX_PROOF_SIZE) return "Proof file must be 8 MB or smaller.";
    return "";
  }

  function setProofNote(message, tone) {
    if (!proofNote) return;
    proofNote.textContent = message;
    proofNote.className = `proof-note${tone ? ` ${tone}` : ""}`;
  }

  async function loadAdminData() {
    if (!requireAdmin(false)) return;

    const roleRequest = hasSuperUserAccess() ? client.from("admin_roles").select("*").order("sort_order", { ascending: true }) : Promise.resolve({ data: [], error: null });
    const auditRequest = hasAdminWriteAccess()
      ? client
        .from("audit_logs")
        .select("*,actor:profiles!audit_logs_actor_id_fkey(full_name,email,role)")
        .order("created_at", { ascending: false })
        .limit(150)
      : Promise.resolve({ data: [], error: null });
    const landingRequest = hasAdminAccess()
      ? client
        .from("landing_creatives")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(80)
      : Promise.resolve({ data: [], error: null });

    const [products, plans, paymentMethods, payments, deposits, walletTransactions, expenses, referrals, commissionRequests, supportTickets, subscriptions, orders, profiles, notifications, roles, exchangeRates, auditLogs, landingCreatives] = await Promise.all([
      client.from("products").select("*").order("sort_order", { ascending: true }),
      client.from("plans").select("*,products(name,code)").order("created_at", { ascending: false }),
      client.from("payment_methods").select("*").order("sort_order", { ascending: true }),
      client
        .from("payments")
        .select("*,payment_methods(name,network),orders(id,status,total_amount,currency,plan_id,plans(name,duration_days,bonus_days,product_id,products(name))),profiles!payments_client_id_fkey(full_name,email,telegram_username)")
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("deposit_requests")
        .select("*,payment_methods(name,network),profiles!deposit_requests_client_id_fkey(full_name,email,telegram_username)")
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("wallet_transactions")
        .select("*,profiles!wallet_transactions_client_id_fkey(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("expenses")
        .select("*,creator:profiles!expenses_created_by_fkey(full_name,email),updater:profiles!expenses_updated_by_fkey(full_name,email)")
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("referrals")
        .select("id,referrer_id,referred_client_id,order_id,commission_amount,commission_status,created_at,referrer:profiles!referrals_referrer_id_fkey(full_name,email,referral_code),referred:profiles!referrals_referred_client_id_fkey(full_name,email),orders(total_amount,currency)")
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("commission_requests")
        .select("id,client_id,amount,status,payout_method,payout_details,created_at,profiles!commission_requests_client_id_fkey(full_name,email,telegram_username)")
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("support_tickets")
        .select("id,client_id,subject,message,status,created_at,updated_at,profiles!support_tickets_client_id_fkey(full_name,email,telegram_username),support_replies(id,author_id,message,is_admin_reply,created_at)")
        .order("created_at", { ascending: false })
        .limit(30),
      client
        .from("subscriptions")
        .select("id,client_id,status,starts_at,expires_at,created_at,products(name),plans(name),profiles!subscriptions_client_id_fkey(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("orders")
        .select("id,client_id,status,total_amount,currency,created_at,plans(name,products(name)),profiles!orders_client_id_fkey(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("profiles")
        .select("id,full_name,email,telegram_username,role,created_at,referral_code,wallet_balance")
        .eq("role", "client")
        .order("created_at", { ascending: false })
        .limit(1000),
      client
        .from("notifications")
        .select("*,recipient:profiles!notifications_recipient_id_fkey(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(80),
      roleRequest,
      client.from("exchange_rates").select("*").eq("quote_currency", "PHP").maybeSingle(),
      auditRequest,
      landingRequest,
    ]);

    if (products.error || plans.error || paymentMethods.error || payments.error || deposits.error || walletTransactions.error || expenses.error || referrals.error || commissionRequests.error || supportTickets.error || subscriptions.error || orders.error || profiles.error || notifications.error || roles.error || exchangeRates.error || auditLogs.error || landingCreatives.error) {
      setStatus(products.error?.message || plans.error?.message || paymentMethods.error?.message || payments.error?.message || deposits.error?.message || walletTransactions.error?.message || expenses.error?.message || referrals.error?.message || commissionRequests.error?.message || supportTickets.error?.message || subscriptions.error?.message || orders.error?.message || profiles.error?.message || notifications.error?.message || roles.error?.message || exchangeRates.error?.message || auditLogs.error?.message || landingCreatives.error?.message, "warn");
      return;
    }

    if (exchangeRates.data) {
      exchangeRateCache = normalizeExchangeRate(exchangeRates.data);
      hydrateExchangeRateForm();
      renderExchangeRateSummary();
    }

    renderListElement(adminProductsList, products.data, renderAdminProductRow, "No products yet.");
    renderListElement(adminPlansList, plans.data, renderAdminPlanRow, "No plans yet.");
    renderListElement(adminPaymentMethodsList, paymentMethods.data, renderAdminPaymentMethodRow, "No payment methods yet.");
    renderAdminDepositQueue(deposits.data || [], walletTransactions.data || []);
    renderListElement(adminExpensesList, expenses.data, renderAdminExpenseRow, "No expenses recorded yet.");
    renderListElement(adminReferralList, referrals.data, renderAdminReferralRow, "No referral records yet.");
    renderListElement(adminCommissionQueue, commissionRequests.data, renderCommissionReviewCard, "No withdrawal requests yet.");
    const dataSnapshot = {
      products: products.data || [],
      plans: plans.data || [],
      paymentMethods: paymentMethods.data || [],
      payments: payments.data || [],
      deposits: deposits.data || [],
      walletTransactions: walletTransactions.data || [],
      expenses: expenses.data || [],
      referrals: referrals.data || [],
      commissionRequests: commissionRequests.data || [],
      supportTickets: supportTickets.data || [],
      subscriptions: subscriptions.data || [],
      orders: orders.data || [],
      profiles: profiles.data || [],
      notifications: notifications.data || [],
      roles: roles.data || [],
      auditLogs: auditLogs.data || [],
      exchangeRates: exchangeRates.data ? [exchangeRates.data] : [],
      landingCreatives: landingCreatives.data || [],
    };

    renderListElement(adminSupportQueue, dataSnapshot.supportTickets, renderSupportReviewCard, "No support tickets yet.");
    renderListElement(adminClientsList, buildClientRows(dataSnapshot.profiles, dataSnapshot.subscriptions, dataSnapshot.payments), renderMetricRow, "No client accounts yet.");
    renderClientDirectory(dataSnapshot);
    renderListElement(adminSubscriptionsList, subscriptions.data, renderAdminSubscriptionRow, "No subscriptions yet.");
    renderListElement(adminExpiringList, buildExpiringRows(subscriptions.data || []), renderMetricRow, "No renewals due yet.");
    renderListElement(adminNotificationsList, notifications.data, renderAdminNotificationRow, "No notifications yet.");
    renderListElement(adminRolesList, roles.data, renderAdminRoleRow, "No custom roles yet.");
    landingCreativesCache = dataSnapshot.landingCreatives;
    renderLandingCreatives();
    updateBadge(adminNotificationBadge, (notifications.data || []).filter((notification) => notification.status === "unread").length);
    auditLogsCache = auditLogs.data || [];
    renderAuditLogs();
    hydrateAdminProductOptions(products.data || []);
    bindAdminPaymentActions();
    bindAdminPaymentMethodActions();
    bindAdminCommissionActions();
    bindAdminSupportActions();
    bindAdminExpenseActions();
    adminReportSnapshot = dataSnapshot;
    adminClientSnapshot = dataSnapshot;
    renderAdminReports(adminReportSnapshot);
    paymentMethodsCache = paymentMethods.data || [];
    renderPaymentMethodOptions();
  }

  function renderAdminDepositQueue(deposits, walletTransactions) {
    const reviewStatuses = ["pending", "under_review"];
    const reviewable = deposits.filter((deposit) => reviewStatuses.includes(deposit.status));
    const finalized = deposits.filter((deposit) => !reviewStatuses.includes(deposit.status));
    const orderedDeposits = [...reviewable, ...finalized];
    const pendingCredit = reviewable.reduce((sum, deposit) => sum + Number(deposit.wallet_credit_amount || deposit.amount || 0), 0);

    setText("[data-admin-deposit-review-count]", String(reviewable.length));
    setText("[data-admin-deposit-review-usd]", formatReportMoney(pendingCredit, "USD"));
    setText("[data-admin-deposit-approved-count]", String(deposits.filter((deposit) => deposit.status === "approved").length));

    renderListElement(adminPaymentQueue, orderedDeposits, renderDepositReviewCard, "No deposits in queue.");
    renderListElement(adminWalletLedger, walletTransactions.slice(0, 12), renderAdminWalletLedgerRow, "No wallet ledger activity yet.");
  }

  function bindAdminPaymentActions() {
    document.querySelectorAll("[data-admin-approve], [data-admin-reject], [data-proof-path], [data-deposit-audit], [data-admin-product-status], [data-admin-plan-status]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", async () => {
        if (button.hasAttribute("data-deposit-audit")) {
          focusDepositAudit(button.dataset.depositAudit);
          return;
        }

        if (button.hasAttribute("data-proof-path")) {
          if (!requireAdmin()) return;
          await withButtonLoading(button, "Opening...", () => openProof(button.dataset.proofPath));
          return;
        }

        if (!requireAdminWrite()) return;

        if (button.hasAttribute("data-admin-product-status")) {
          await withButtonLoading(button, "Updating...", () => updateRecordStatus("products", button.dataset.productId, button.dataset.adminProductStatus));
          return;
        }

        if (button.hasAttribute("data-admin-plan-status")) {
          await withButtonLoading(button, "Updating...", () => updateRecordStatus("plans", button.dataset.planId, button.dataset.adminPlanStatus));
          return;
        }

        const depositId = button.dataset.depositId;
        if (button.hasAttribute("data-admin-approve")) {
          await withButtonLoading(button, "Approving...", () => approveDeposit(depositId));
          return;
        }

        await withButtonLoading(button, "Rejecting...", () => rejectDeposit(depositId));
      });
    });
  }

  function bindAdminPaymentMethodActions() {
    document.querySelectorAll("[data-admin-method-status]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", async () => {
        if (!requireAdminWrite()) return;
        await withButtonLoading(button, "Updating...", () => updateRecordStatus("payment_methods", button.dataset.methodId, button.dataset.adminMethodStatus));
      });
    });
  }

  function bindReportFilters() {
    [reportRangeFilter, reportStatusFilter, reportMethodFilter, reportSearchFilter].forEach((control) => {
      if (!control) return;
      control.addEventListener("input", () => {
        if (adminReportSnapshot) renderAdminReports(adminReportSnapshot);
      });
      control.addEventListener("change", () => {
        if (adminReportSnapshot) renderAdminReports(adminReportSnapshot);
      });
    });
  }

  function bindAuditFilters() {
    [auditRangeFilter, auditActionFilter, auditEntityFilter, auditSearchFilter].forEach((control) => {
      if (!control) return;
      control.addEventListener("input", renderAuditLogs);
      control.addEventListener("change", renderAuditLogs);
    });
  }

  function bindAuditExport() {
    if (!auditExportButton) return;
    auditExportButton.addEventListener("click", () => {
      if (!requireAdminWrite()) return;
      downloadCsv("etx-audit-logs.csv", buildAuditExportRows(getFilteredAuditLogs()));
      setStatus("Audit logs exported.", "ok");
    });
  }

  function bindClientProfileSearch() {
    if (!clientProfileSearch) return;
    clientProfileSearch.addEventListener("input", () => {
      if (adminClientSnapshot) renderClientDirectory(adminClientSnapshot);
    });
  }

  function bindLandingCreativeForm() {
    if (landingCreativeClear) {
      landingCreativeClear.addEventListener("click", () => {
        clearLandingCreativeForm();
        setStatus("Landing creative form cleared.", "ok");
      });
    }

    if (!landingCreativeForm) return;
    landingCreativeForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAdminWrite()) return;

      await withButtonLoading(event.submitter, "Saving...", async () => {
        const form = new FormData(landingCreativeForm);
        const payload = {
          section_key: String(form.get("section_key") || "promo").trim(),
          title: String(form.get("title") || "").trim(),
          subtitle: String(form.get("subtitle") || "").trim() || null,
          body: String(form.get("body") || "").trim() || null,
          image_url: String(form.get("image_url") || "").trim() || null,
          cta_label: String(form.get("cta_label") || "").trim() || null,
          cta_url: String(form.get("cta_url") || "").trim() || null,
          promo_starts_at: datetimeLocalToIso(form.get("promo_starts_at")),
          promo_ends_at: datetimeLocalToIso(form.get("promo_ends_at")),
          status: String(form.get("status") || "draft"),
          sort_order: Number(form.get("sort_order") || 100),
          updated_by: currentUser.id,
        };
        const id = String(form.get("id") || "").trim();
        if (!id) payload.created_by = currentUser.id;

        const query = id
          ? client.from("landing_creatives").update(payload).eq("id", id).select("*").single()
          : client.from("landing_creatives").insert(payload).select("*").single();
        const { data, error } = await query;

        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        await logAdminAction(id ? "landing_creative.updated" : "landing_creative.created", "landing_creatives", data.id, {
          section_key: data.section_key,
          status: data.status,
          title: data.title,
        });
        clearLandingCreativeForm();
        setStatus("Landing creative saved.", "ok");
        await loadAdminData();
      });
    });
  }

  function renderAuditLogs() {
    hydrateAuditFilters();
    const logs = getFilteredAuditLogs();
    setText("[data-audit-count]", String(logs.length));
    setText("[data-audit-rate-count]", String(logs.filter((log) => log.action === "exchange_rate.updated").length));
    setText("[data-audit-deposit-count]", String(logs.filter((log) => log.entity_table === "deposit_requests").length));
    renderListElement(adminAuditList, logs.slice(0, 40), renderAuditLogRow, "No audit logs match these filters.");
  }

  function focusDepositAudit(depositId) {
    if (auditSearchFilter) auditSearchFilter.value = depositId || "";
    if (auditEntityFilter && [...auditEntityFilter.options].some((option) => option.value === "deposit_requests")) {
      auditEntityFilter.value = "deposit_requests";
    }
    renderAuditLogs();
    goToTab("admin-audit");
    setStatus("Audit trail filtered for selected deposit.", "ok");
  }

  function hydrateAuditFilters() {
    hydrateAuditSelect(auditActionFilter, auditLogsCache.map((log) => log.action));
    hydrateAuditSelect(auditEntityFilter, auditLogsCache.map((log) => log.entity_table));
  }

  function hydrateAuditSelect(select, values) {
    if (!select) return;
    const label = select === auditActionFilter ? "All actions" : "All entities";
    const currentValue = select.value || "all";
    const options = [...new Set(values.filter(Boolean))].sort();
    select.innerHTML = [`<option value="all">${label}</option>`, ...options.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(formatStatus(value))}</option>`)].join("");
    select.value = options.includes(currentValue) ? currentValue : "all";
  }

  function getFilteredAuditLogs() {
    const range = auditRangeFilter?.value || "all";
    const action = auditActionFilter?.value || "all";
    const entity = auditEntityFilter?.value || "all";
    const search = String(auditSearchFilter?.value || "").trim().toLowerCase();

    return auditLogsCache.filter((log) => {
      const rangeOk = isWithinReportRange(log.created_at, range);
      const actionOk = action === "all" || log.action === action;
      const entityOk = entity === "all" || log.entity_table === entity;
      const searchOk = !search || auditSearchText(log).includes(search);
      return rangeOk && actionOk && entityOk && searchOk;
    });
  }

  function auditSearchText(log) {
    return [
      log.action,
      log.entity_table,
      log.entity_id,
      log.actor?.email,
      log.actor?.full_name,
      log.actor?.role,
      JSON.stringify(log.metadata || {}),
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function renderAuditLogRow(log) {
    const actor = log.actor?.email || log.actor?.full_name || "System";
    const metadata = summarizeMetadata(log.metadata);
    return `
      <div class="row report-row">
        <span>${escapeHtml(formatStatus(log.action))} <small>${escapeHtml(actor)} / ${escapeHtml(log.entity_table)} / ${escapeHtml(formatDateTime(log.created_at))}${metadata ? ` / ${escapeHtml(metadata)}` : ""}</small></span>
        <b>${escapeHtml(shortId(log.entity_id))}</b>
      </div>
    `;
  }

  function summarizeMetadata(metadata) {
    if (!metadata || typeof metadata !== "object") return "";
    return Object.entries(metadata)
      .filter(([, value]) => value !== null && value !== undefined && value !== "")
      .slice(0, 4)
      .map(([key, value]) => `${formatStatus(key)}: ${String(value)}`)
      .join(" / ");
  }

  function buildAuditExportRows(logs) {
    return [
      ["Actor", "Role", "Action", "Entity", "Entity ID", "Metadata", "Created At"],
      ...logs.map((log) => [
        log.actor?.email || log.actor?.full_name || "",
        log.actor?.role || "",
        log.action || "",
        log.entity_table || "",
        log.entity_id || "",
        JSON.stringify(log.metadata || {}),
        log.created_at || "",
      ]),
    ];
  }

  function renderAdminReports(snapshot) {
    const renderToken = ++reportRenderToken;
    const reportKey = getReportContextKey();
    latestTrustedFinancialSummary = null;
    latestTrustedReportKey = reportKey;
    hydrateReportMethodFilter(snapshot.paymentMethods || []);
    const filtered = filterReportSnapshot(snapshot);
    const pendingDeposits = filtered.deposits.filter((deposit) => ["pending", "under_review"].includes(deposit.status));
    const approvedPayments = filtered.payments.filter((payment) => payment.status === "approved");
    const paymentsToday = filtered.payments.filter((payment) => isToday(payment.created_at));
    const activeSubscriptions = filtered.subscriptions.filter((subscription) => ["active", "trial"].includes(subscription.status));
    const renewalsDue = activeSubscriptions.filter((subscription) => isWithinDays(subscription.expires_at, 7));
    const openSupport = filtered.supportTickets.filter((ticket) => ["open", "pending_admin", "pending_client"].includes(ticket.status));
    const pendingCommissionRequests = filtered.commissionRequests.filter((request) => request.status === "requested");
    const pendingRevenue = pendingDeposits.reduce((sum, deposit) => sum + Number(deposit.amount || 0), 0);
    const approvedRevenue = approvedPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const commissionLiability = filtered.referrals
      .filter((referral) => ["available", "requested", "approved"].includes(referral.commission_status))
      .reduce((sum, referral) => sum + Number(referral.commission_amount || 0), 0);
    const financialSummary = buildFinancialSummary(filtered);

    setText("[data-report-pending-payments]", String(pendingDeposits.length));
    setText("[data-report-active-subscriptions]", String(activeSubscriptions.length));
    setText("[data-report-approved-revenue]", formatReportMoney(approvedRevenue, "USD"));
    setText("[data-report-payments-today]", String(paymentsToday.length));
    setText("[data-report-pending-revenue]", formatReportMoney(pendingRevenue, "USD"));
    setText("[data-report-renewals-due]", String(renewalsDue.length));

    renderListElement(
      adminPriorityList,
      buildPriorityRows({ pendingPayments: pendingDeposits, pendingCommissionRequests, openSupport, renewalsDue }),
      renderMetricRow,
      "No urgent admin actions right now."
    );

    renderListElement(
      adminHealthList,
      [
        ["Open support tickets", String(openSupport.length), openSupport.length ? "warn" : "ok"],
        ["Commission liability", formatReportMoney(commissionLiability, "USD"), commissionLiability ? "warn" : "ok"],
        ["Approved expenses", formatReportMoney(financialSummary.approvedExpenses, "USD"), financialSummary.approvedExpenses ? "warn" : "ok"],
        ["Net profit", formatReportMoney(financialSummary.netProfit, "USD"), financialSummary.netProfit >= 0 ? "ok" : "rejected"],
        ["Approved deposits", String(filtered.deposits.filter((deposit) => deposit.status === "approved").length), "ok"],
        ["PHP deposits", formatReportMoney(sumDepositsByCurrency(filtered.deposits, "PHP"), "PHP"), "warn"],
        ["USDT deposits", formatReportMoney(sumDepositsByCurrency(filtered.deposits, "USDT"), "USD"), "ok"],
      ],
      renderMetricRow,
      "No operations metrics yet."
    );

    renderListElement(
      adminRevenueList,
      buildRevenueRows(approvedPayments),
      renderMetricRow,
      "No wallet sales yet."
    );

    renderFinancialStatement(financialSummary);
    renderWalletReconciliation(financialSummary);
    setReportSource("Local fallback rendered. Verifying secured Supabase summary...", "warn");

    renderListElement(
      reportDepositsList,
      filtered.deposits.slice(0, 12),
      renderReportDepositRow,
      "No deposits match these filters."
    );

    renderListElement(
      reportSubscriptionsList,
      filtered.subscriptions.slice(0, 12),
      renderReportSubscriptionRow,
      "No subscriptions match these filters."
    );

    renderListElement(
      reportReferralsList,
      filtered.referrals.slice(0, 12),
      renderReportReferralRow,
      "No referrals match these filters."
    );

    renderListElement(
      reportExpensesList,
      filtered.expenses.slice(0, 12),
      renderReportExpenseRow,
      "No expenses match these filters."
    );

    hydrateTrustedFinancialSummary(reportKey, renderToken, financialSummary);
  }

  function buildFinancialSummary(snapshot) {
    const approvedPayments = snapshot.payments.filter((payment) => payment.status === "approved");
    const approvedDeposits = snapshot.deposits.filter((deposit) => deposit.status === "approved");
    const pendingDeposits = snapshot.deposits.filter((deposit) => ["pending", "under_review"].includes(deposit.status));
    const approvedExpenses = snapshot.expenses.filter((expense) => expense.status === "approved");
    const recognizedCommissions = snapshot.referrals.filter((referral) => ["available", "requested", "approved", "paid"].includes(referral.commission_status));
    const walletCredits = snapshot.walletTransactions.filter((transaction) => transaction.direction === "credit");
    const walletDebits = snapshot.walletTransactions.filter((transaction) => transaction.direction === "debit");

    const grossRevenue = sumNumber(approvedPayments, "amount");
    const referralCommissions = sumNumber(recognizedCommissions, "commission_amount");
    const expenseTotal = sumNumber(approvedExpenses, "usd_amount");
    const netProfit = roundMoney(grossRevenue - referralCommissions - expenseTotal);
    const walletCreditTotal = sumNumber(walletCredits, "amount");
    const walletDebitTotal = sumNumber(walletDebits, "amount");
    const loadedWalletBalance = sumNumber(snapshot.profiles, "wallet_balance");
    const expectedWalletBalance = roundMoney(walletCreditTotal - walletDebitTotal);

    return {
      grossRevenue,
      approvedDeposits: sumNumber(approvedDeposits, "wallet_credit_amount", "amount"),
      pendingDeposits: sumNumber(pendingDeposits, "wallet_credit_amount", "amount"),
      referralCommissions,
      approvedExpenses: expenseTotal,
      netProfit,
      walletCreditTotal,
      walletDebitTotal,
      expectedWalletBalance,
      loadedWalletBalance,
      walletVariance: roundMoney(expectedWalletBalance - loadedWalletBalance),
      approvedExpenseCount: approvedExpenses.length,
      commissionCount: recognizedCommissions.length,
    };
  }

  function renderFinancialStatement(summary) {
    if (!reportFinancialStatement) return;
    const rows = [
      ["Gross revenue", formatReportMoney(summary.grossRevenue, "USD"), "Approved wallet purchases", "ok"],
      ["Less referral commissions", formatReportMoney(summary.referralCommissions, "USD"), `${summary.commissionCount} recognized commission records`, summary.referralCommissions ? "warn" : ""],
      ["Less approved expenses", formatReportMoney(summary.approvedExpenses, "USD"), `${summary.approvedExpenseCount} approved expense records`, summary.approvedExpenses ? "warn" : ""],
      ["Net profit", formatReportMoney(summary.netProfit, "USD"), "Revenue minus commissions and expenses", summary.netProfit >= 0 ? "ok" : "rejected"],
    ];
    reportFinancialStatement.innerHTML = rows.map(renderStatementRow).join("");
  }

  function renderWalletReconciliation(summary) {
    if (!reportWalletReconciliation) return;
    const rows = [
      ["Approved deposits", formatReportMoney(summary.approvedDeposits, "USD"), "Client top-ups credited to wallets", "ok"],
      ["Pending deposits", formatReportMoney(summary.pendingDeposits, "USD"), "Awaiting admin verification", summary.pendingDeposits ? "warn" : ""],
      ["Wallet credits", formatReportMoney(summary.walletCreditTotal, "USD"), "Credits from deposits or adjustments", "ok"],
      ["Wallet debits", formatReportMoney(summary.walletDebitTotal, "USD"), "Purchases and deductions", summary.walletDebitTotal ? "warn" : ""],
      ["Loaded client balances", formatReportMoney(summary.loadedWalletBalance, "USD"), "Current balances from loaded profiles", ""],
      ["Ledger variance", formatReportMoney(summary.walletVariance, "USD"), "Expected balance minus loaded balances", summary.walletVariance === 0 ? "ok" : "warn"],
    ];
    reportWalletReconciliation.innerHTML = rows.map(renderStatementRow).join("");
  }

  async function hydrateTrustedFinancialSummary(reportKey, renderToken, fallbackSummary) {
    const trustedSummary = await loadTrustedFinancialSummary(fallbackSummary);
    if (!trustedSummary || reportTokenExpired(reportKey, renderToken)) {
      if (!trustedSummary) setReportSource("Local fallback active. Secured Supabase summary is unavailable right now.", "warn");
      return;
    }

    latestTrustedFinancialSummary = trustedSummary;
    latestTrustedReportKey = reportKey;
    renderFinancialStatement(trustedSummary);
    renderWalletReconciliation(trustedSummary);
    setReportSource(`Secured Supabase summary verified ${formatDateTime(trustedSummary.generatedAt)}.`, "ok");
  }

  async function loadTrustedFinancialSummary(fallbackSummary) {
    if (typeof client.rpc !== "function" || !requireAdmin(false)) return null;

    const period = getReportPeriod();
    const { data, error } = await client.rpc("get_admin_financial_summary", {
      p_from: period.from,
      p_to: period.to,
      p_status: reportStatusFilter?.value || "all",
      p_method: reportMethodFilter?.value || "all",
      p_search: String(reportSearchFilter?.value || "").trim(),
    });

    if (error) {
      console.warn("Trusted financial summary unavailable", error);
      return null;
    }

    return normalizeFinancialSummary(data, fallbackSummary);
  }

  function normalizeFinancialSummary(data, fallbackSummary = {}) {
    const source = data || {};
    return {
      ...fallbackSummary,
      source: source.source || "server",
      generatedAt: source.generated_at || source.generatedAt || new Date().toISOString(),
      grossRevenue: Number(source.grossRevenue ?? fallbackSummary.grossRevenue ?? 0),
      approvedDeposits: Number(source.approvedDeposits ?? fallbackSummary.approvedDeposits ?? 0),
      pendingDeposits: Number(source.pendingDeposits ?? fallbackSummary.pendingDeposits ?? 0),
      referralCommissions: Number(source.referralCommissions ?? fallbackSummary.referralCommissions ?? 0),
      approvedExpenses: Number(source.approvedExpenses ?? fallbackSummary.approvedExpenses ?? 0),
      netProfit: Number(source.netProfit ?? fallbackSummary.netProfit ?? 0),
      walletCreditTotal: Number(source.walletCreditTotal ?? fallbackSummary.walletCreditTotal ?? 0),
      walletDebitTotal: Number(source.walletDebitTotal ?? fallbackSummary.walletDebitTotal ?? 0),
      expectedWalletBalance: Number(source.expectedWalletBalance ?? fallbackSummary.expectedWalletBalance ?? 0),
      loadedWalletBalance: Number(source.loadedWalletBalance ?? fallbackSummary.loadedWalletBalance ?? 0),
      walletVariance: Number(source.walletVariance ?? fallbackSummary.walletVariance ?? 0),
      approvedExpenseCount: Number(source.approvedExpenseCount ?? fallbackSummary.approvedExpenseCount ?? 0),
      commissionCount: Number(source.commissionCount ?? fallbackSummary.commissionCount ?? 0),
      approvedPaymentCount: Number(source.approvedPaymentCount ?? fallbackSummary.approvedPaymentCount ?? 0),
      approvedDepositCount: Number(source.approvedDepositCount ?? fallbackSummary.approvedDepositCount ?? 0),
      pendingDepositCount: Number(source.pendingDepositCount ?? fallbackSummary.pendingDepositCount ?? 0),
      activeSubscriptionCount: Number(source.activeSubscriptionCount ?? fallbackSummary.activeSubscriptionCount ?? 0),
    };
  }

  function reportTokenExpired(reportKey, renderToken) {
    return reportKey !== getReportContextKey() || renderToken !== reportRenderToken;
  }

  function setReportSource(message, tone = "") {
    if (!reportSourceNote) return;
    reportSourceNote.textContent = message;
    reportSourceNote.className = `proof-note${tone ? ` ${tone}` : ""}`;
  }

  function renderStatementRow([label, value, note, tone]) {
    return `
      <div class="row statement-row">
        <span>${escapeHtml(label)} <small>${escapeHtml(note)}</small></span>
        <b class="${escapeHtml(tone || "")}">${escapeHtml(value)}</b>
      </div>
    `;
  }

  function getReportPeriod() {
    const range = reportRangeFilter?.value || "all";
    const now = new Date();

    if (range === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return { from: start.toISOString(), to: end.toISOString() };
    }

    const days = Number(range || 0);
    if (days > 0) {
      return { from: new Date(now.getTime() - days * 86400000).toISOString(), to: null };
    }

    return { from: null, to: null };
  }

  function getReportContextKey() {
    return JSON.stringify({
      range: reportRangeFilter?.value || "all",
      status: reportStatusFilter?.value || "all",
      method: reportMethodFilter?.value || "all",
      search: String(reportSearchFilter?.value || "").trim().toLowerCase(),
    });
  }

  function getCurrentFinancialSummary(snapshot) {
    return latestTrustedFinancialSummary && latestTrustedReportKey === getReportContextKey()
      ? latestTrustedFinancialSummary
      : buildFinancialSummary(snapshot);
  }

  function selectedOptionText(select, fallback) {
    return select?.selectedOptions?.[0]?.textContent || fallback;
  }

  function hydrateReportMethodFilter(methods) {
    if (!reportMethodFilter || reportMethodFilter.dataset.hydrated === "true") return;
    const currentValue = reportMethodFilter.value || "all";
    reportMethodFilter.innerHTML = [
      `<option value="all">All methods</option>`,
      ...methods.map((method) => `<option value="${escapeHtml(method.method_key)}">${escapeHtml(method.name)}</option>`),
    ].join("");
    reportMethodFilter.value = currentValue;
    reportMethodFilter.dataset.hydrated = "true";
  }

  function filterReportSnapshot(snapshot) {
    const range = reportRangeFilter?.value || "all";
    const status = reportStatusFilter?.value || "all";
    const method = reportMethodFilter?.value || "all";
    const search = String(reportSearchFilter?.value || "").trim().toLowerCase();

    const dateFilter = (item) => isWithinReportRange(item.created_at || item.updated_at, range);
    const searchFilter = (item) => !search || reportSearchText(item).includes(search);
    const statusFilter = (item) => status === "all" || item.status === status || item.commission_status === status;
    const methodFilter = (item) => method === "all" || item.method === method || item.payment_methods?.method_key === method;

    return {
      ...snapshot,
      deposits: snapshot.deposits.filter((item) => dateFilter(item) && statusFilter(item) && methodFilter(item) && searchFilter(item)),
      payments: snapshot.payments.filter((item) => dateFilter(item) && statusFilter(item) && methodFilter(item) && searchFilter(item)),
      orders: snapshot.orders.filter((item) => dateFilter(item) && statusFilter(item) && searchFilter(item)),
      subscriptions: snapshot.subscriptions.filter((item) => dateFilter(item) && statusFilter(item) && searchFilter(item)),
      referrals: snapshot.referrals.filter((item) => dateFilter(item) && statusFilter(item) && searchFilter(item)),
      commissionRequests: snapshot.commissionRequests.filter((item) => dateFilter(item) && statusFilter(item) && searchFilter(item)),
      supportTickets: snapshot.supportTickets.filter((item) => dateFilter(item) && statusFilter(item) && searchFilter(item)),
      expenses: snapshot.expenses.filter((item) => isWithinReportRange(item.expense_date || item.created_at, range) && statusFilter(item) && searchFilter(item)),
      walletTransactions: snapshot.walletTransactions.filter((item) => dateFilter(item) && searchFilter(item)),
    };
  }

  function isWithinReportRange(value, range) {
    if (range === "all") return true;
    if (!value) return false;
    if (range === "today") return isToday(value);
    const days = Number(range || 0);
    if (!days) return true;
    const date = new Date(value);
    return Date.now() - date.getTime() <= days * 86400000;
  }

  function reportSearchText(item) {
    return [
      item.transaction_reference,
      item.method,
      item.type,
      item.direction,
      item.description,
      item.category,
      item.vendor,
      item.payment_method,
      item.status,
      item.commission_status,
      item.payment_methods?.name,
      item.profiles?.email,
      item.profiles?.full_name,
      item.profiles?.telegram_username,
      item.referrer?.email,
      item.referrer?.full_name,
      item.referrer?.referral_code,
      item.referred?.email,
      item.referred?.full_name,
      item.plans?.name,
      item.plans?.products?.name,
      item.products?.name,
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function sumDepositsByCurrency(deposits, currency) {
    return deposits
      .filter((deposit) => (deposit.paid_currency || deposit.currency || "USD") === currency)
      .reduce((sum, deposit) => sum + Number(deposit.paid_amount || deposit.amount || 0), 0);
  }

  function sumNumber(rows, primaryKey, fallbackKey) {
    return roundMoney((rows || []).reduce((sum, row) => {
      const value = row?.[primaryKey] ?? (fallbackKey ? row?.[fallbackKey] : 0);
      return sum + Number(value || 0);
    }, 0));
  }

  function getFilteredReportSnapshot() {
    return adminReportSnapshot ? filterReportSnapshot(adminReportSnapshot) : null;
  }

  function renderReportDepositRow(deposit) {
    const paidCurrency = deposit.paid_currency || deposit.currency || "USD";
    const paidAmount = Number(deposit.paid_amount || deposit.amount || 0);
    const walletCredit = Number(deposit.wallet_credit_amount || deposit.amount || 0);
    const rate = deposit.platform_rate ? `Rate ${formatRate(deposit.platform_rate)}` : "No rate";
    return `
      <div class="row report-row">
        <span>${escapeHtml(deposit.profiles?.email || deposit.profiles?.full_name || "Client")} <small>${escapeHtml(formatMoney(paidAmount, paidCurrency))} paid / ${escapeHtml(rate)} / ${escapeHtml(deposit.transaction_reference || "No reference")}</small></span>
        <b class="${statusClass(deposit.status)}">${escapeHtml(formatMoney(walletCredit, "USD"))}</b>
      </div>
    `;
  }

  function renderReportSubscriptionRow(subscription) {
    return `
      <div class="row report-row">
        <span>${escapeHtml(subscription.products?.name || "ETX Product")} <small>${escapeHtml(subscription.profiles?.email || "Client")} / expires ${escapeHtml(formatDate(subscription.expires_at))}</small></span>
        <b class="${statusClass(subscription.status)}">${escapeHtml(formatStatus(subscription.status))}</b>
      </div>
    `;
  }

  function renderReportReferralRow(referral) {
    return `
      <div class="row report-row">
        <span>${escapeHtml(referral.referrer?.email || referral.referrer?.full_name || "Referrer")} <small>referred ${escapeHtml(referral.referred?.email || referral.referred?.full_name || "Client")}</small></span>
        <b class="${statusClass(referral.commission_status)}">${escapeHtml(formatMoney(Number(referral.commission_amount || 0), "USD"))}</b>
      </div>
    `;
  }

  function renderReportExpenseRow(expense) {
    const original = formatReportMoney(Number(expense.amount || 0), expense.currency || "USD");
    return `
      <div class="row report-row">
        <span>${escapeHtml(expense.description || "Expense")} <small>${escapeHtml(formatStatus(expense.category))} / ${escapeHtml(expense.vendor || "No vendor")} / ${escapeHtml(original)} / ${escapeHtml(formatDate(expense.expense_date))}</small></span>
        <b class="${statusClass(expense.status)}">${escapeHtml(formatReportMoney(Number(expense.usd_amount || 0), "USD"))}</b>
      </div>
    `;
  }

  function bindReportExports() {
    reportExportButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (!requireAdmin()) return;
        if (!adminReportSnapshot) {
          setStatus("Reports are still loading. Try again after the admin dashboard loads.", "warn");
          return;
        }

        const type = button.dataset.reportExport;
        const rows = withReportMetadata(type, buildExportRows(type, getFilteredReportSnapshot() || adminReportSnapshot));
        downloadCsv(`etx-${type}-report-${reportFileStamp()}.csv`, rows);
        setStatus(`${type} report exported.`, "ok");
      });
    });
  }

  function renderAdminRoleRow(role) {
    const systemLabel = role.is_system ? "Pinned" : "Custom";
    return `
      <div class="row">
        <span>${escapeHtml(role.name)} <small>${escapeHtml(role.description || role.role_key)}</small></span>
        <b class="${role.is_system ? "ok" : "warn"}">${escapeHtml(systemLabel)} / ${escapeHtml(role.role_key)}</b>
      </div>
    `;
  }

  function buildExportRows(type, snapshot) {
    if (type === "financial") {
      const summary = getCurrentFinancialSummary(snapshot);
      return [
        ["Metric", "Amount USD", "Notes"],
        ["Gross revenue", summary.grossRevenue, "Approved wallet purchases"],
        ["Referral commissions", summary.referralCommissions, "Recognized commission records"],
        ["Approved expenses", summary.approvedExpenses, "Approved expenses ledger"],
        ["Net profit", summary.netProfit, "Revenue minus commissions and expenses"],
        ["Approved deposits", summary.approvedDeposits, "Wallet top-ups credited"],
        ["Pending deposits", summary.pendingDeposits, "Awaiting review"],
        ["Wallet credits", summary.walletCreditTotal, "Ledger credits"],
        ["Wallet debits", summary.walletDebitTotal, "Ledger debits"],
        ["Loaded client balances", summary.loadedWalletBalance, "Current loaded profile balances"],
        ["Ledger variance", summary.walletVariance, "Expected balance minus loaded balances"],
      ];
    }

    if (type === "expenses") {
      return [
        ["Date", "Category", "Description", "Vendor", "Payment Method", "Amount", "Currency", "USD Amount", "Status", "Receipt URL", "Notes", "Created At"],
        ...snapshot.expenses.map((expense) => [
          expense.expense_date || "",
          expense.category || "",
          expense.description || "",
          expense.vendor || "",
          expense.payment_method || "",
          expense.amount || 0,
          expense.currency || "USD",
          expense.usd_amount || 0,
          expense.status || "",
          expense.receipt_url || "",
          expense.notes || "",
          expense.created_at || "",
        ]),
      ];
    }

    if (type === "payments") {
      return [
        ["Client", "Paid Amount", "Paid Currency", "Exchange Rate", "Markup", "Platform Rate", "USD Credit", "Status", "Method", "Reference", "Created At"],
        ...snapshot.deposits.map((deposit) => [
          deposit.profiles?.email || deposit.profiles?.full_name || "",
          deposit.paid_amount || deposit.amount || 0,
          deposit.paid_currency || deposit.currency || "USD",
          deposit.exchange_rate || "",
          deposit.exchange_markup || "",
          deposit.platform_rate || "",
          deposit.wallet_credit_amount || deposit.amount || 0,
          deposit.status || "",
          deposit.payment_methods?.name || deposit.method || "",
          deposit.transaction_reference || "",
          deposit.created_at || "",
        ]),
      ];
    }

    if (type === "commissions") {
      return [
        ["Referrer", "Referred Client", "Amount", "Status", "Created At"],
        ...snapshot.referrals.map((referral) => [
          referral.referrer?.email || referral.referrer?.full_name || "",
          referral.referred?.email || referral.referred?.full_name || "",
          referral.commission_amount || 0,
          referral.commission_status || "",
          referral.created_at || "",
        ]),
      ];
    }

    if (type === "subscriptions") {
      return [
        ["Client", "Product", "Plan", "Status", "Expires At", "Created At"],
        ...snapshot.subscriptions.map((subscription) => [
          subscription.profiles?.email || subscription.profiles?.full_name || "",
          subscription.products?.name || "",
          subscription.plans?.name || "",
          subscription.status || "",
          subscription.expires_at || "",
          subscription.created_at || "",
        ]),
      ];
    }

    return [
      ["Product", "Plan", "Order Status", "Amount", "Currency", "Created At"],
      ...snapshot.orders.map((order) => [
        order.plans?.products?.name || "",
        order.plans?.name || "",
        order.status || "",
        order.total_amount || 0,
        order.currency || "USD",
        order.created_at || "",
      ]),
    ];
  }

  function withReportMetadata(type, rows) {
    const source = latestTrustedFinancialSummary && latestTrustedReportKey === getReportContextKey()
      ? "Secured Supabase RPC"
      : "Client fallback";

    return [
      ["Report", reportTitle(type)],
      ["Generated At", new Date().toISOString()],
      ["Date Range", selectedOptionText(reportRangeFilter, "All time")],
      ["Status Filter", selectedOptionText(reportStatusFilter, "All statuses")],
      ["Method Filter", selectedOptionText(reportMethodFilter, "All methods")],
      ["Search", String(reportSearchFilter?.value || "").trim() || "None"],
      ["Summary Source", source],
      [],
      ...rows,
    ];
  }

  function reportTitle(type) {
    const titles = {
      financial: "Financial Statement",
      sales: "Sales Summary",
      payments: "Deposit Queue",
      subscriptions: "Subscriptions",
      commissions: "Commission Ledger",
      expenses: "Expenses Ledger",
    };
    return titles[type] || "Operations Report";
  }

  function reportFileStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  function buildPriorityRows({ pendingPayments, pendingCommissionRequests, openSupport, renewalsDue }) {
    return [
      pendingPayments.length ? ["Deposit proofs", `${pendingPayments.length} to review`, "warn"] : null,
      pendingCommissionRequests.length ? ["Commission withdrawals", `${pendingCommissionRequests.length} requested`, "warn"] : null,
      openSupport.length ? ["Support tickets", `${openSupport.length} open`, "warn"] : null,
      renewalsDue.length ? ["Renewals due", `${renewalsDue.length} within 7 days`, "warn"] : null,
    ].filter(Boolean);
  }

  function buildRevenueRows(payments) {
    const totals = new Map();
    payments.forEach((payment) => {
      const product = payment.orders?.plans?.products?.name || "Unassigned Product";
      totals.set(product, (totals.get(product) || 0) + Number(payment.amount || 0));
    });

    return Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([product, amount]) => [product, formatMoney(amount, "USD"), "ok"]);
  }

  function renderClientDirectory(snapshot) {
    if (!adminClientDirectory) return;

    const search = String(clientProfileSearch?.value || "").trim().toLowerCase();
    const profiles = (snapshot.profiles || [])
      .filter((profile) => {
        const searchable = [profile.full_name, profile.email, profile.telegram_username, profile.referral_code]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return !search || searchable.includes(search);
      })
      .sort((a, b) => String(a.email || "").localeCompare(String(b.email || "")));

    adminClientDirectory.innerHTML = profiles.length
      ? profiles.map((profile) => renderClientDirectoryRow(profile, snapshot)).join("")
      : `<p class="codebox">No clients match this search.</p>`;

    document.querySelectorAll("[data-view-client-profile]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", () => renderClientProfile(button.dataset.viewClientProfile));
    });

    const activeClientStillVisible = profiles.some((profile) => profile.id === adminClientProfile?.dataset.clientId);
    if ((!adminClientProfile?.dataset.clientId || !activeClientStillVisible) && profiles.length) {
      renderClientProfile(profiles[0].id);
    }
  }

  function renderClientDirectoryRow(profile, snapshot) {
    const subscriptions = (snapshot.subscriptions || []).filter((subscription) => subscription.client_id === profile.id);
    const deposits = (snapshot.deposits || []).filter((deposit) => deposit.client_id === profile.id);
    const activeCount = subscriptions.filter((subscription) => subscription.status === "active").length;
    const latestDeposit = deposits[0];

    return `
      <div class="client-directory-row">
        <div>
          <strong>${escapeHtml(profile.full_name || profile.email || "Client")}</strong>
          <span>${escapeHtml(profile.email || "No email")}</span>
          <small>${escapeHtml(profile.telegram_username || profile.referral_code || "No Telegram or referral code")}</small>
        </div>
        <div class="client-directory-meta">
          <span>${activeCount} active</span>
          <span>${latestDeposit ? formatStatus(latestDeposit.status) : "No deposit"}</span>
        </div>
        <button class="secondary-btn" type="button" data-view-client-profile="${escapeHtml(profile.id)}">View Profile</button>
      </div>
    `;
  }

  function renderClientProfile(clientId) {
    if (!adminClientProfile || !adminClientSnapshot) return;
    const profile = (adminClientSnapshot.profiles || []).find((item) => item.id === clientId);

    if (!profile) {
      adminClientProfile.dataset.clientId = "";
      adminClientProfile.innerHTML = `
        <h3>Select a client</h3>
        <p class="codebox">Client profile not found.</p>
      `;
      return;
    }

    adminClientProfile.dataset.clientId = clientId;
    const history = getClientHistory(clientId, adminClientSnapshot);
    const approvedDeposits = history.deposits.filter((deposit) => deposit.status === "approved");
    const activeSubscriptions = history.subscriptions.filter((subscription) => subscription.status === "active");
    const referralEarnings = history.referrals.reduce((sum, referral) => sum + Number(referral.commission_amount || 0), 0);

    adminClientProfile.innerHTML = `
      <div class="client-profile-header">
        <div>
          <p class="eyebrow">Selected Client</p>
          <h3>${escapeHtml(profile.full_name || profile.email || "Client")}</h3>
          <p>${escapeHtml(profile.email || "No email")} ${profile.telegram_username ? `- ${escapeHtml(profile.telegram_username)}` : ""}</p>
        </div>
        <span class="pill">${escapeHtml(profile.referral_code || "No referral code")}</span>
      </div>

      <div class="mini-stat-grid">
        <article><span>Wallet Credit</span><strong>${formatMoney(history.walletCredit, "USD")}</strong></article>
        <article><span>Approved Deposits</span><strong>${approvedDeposits.length}</strong></article>
        <article><span>Active Access</span><strong>${activeSubscriptions.length}</strong></article>
        <article><span>Referral Earnings</span><strong>${formatMoney(referralEarnings, "USD")}</strong></article>
      </div>

      <div class="client-timeline">
        <h4>Recent Timeline</h4>
        ${buildClientTimeline(profile, history).length ? buildClientTimeline(profile, history).map(renderTimelineItem).join("") : `<p class="codebox">No client activity yet.</p>`}
      </div>

      <div class="client-history-grid">
        ${renderClientHistoryBlock("Deposits", history.deposits, renderClientDepositHistory)}
        ${renderClientHistoryBlock("Subscriptions", history.subscriptions, renderClientSubscriptionHistory)}
        ${renderClientHistoryBlock("Orders", history.orders, renderClientOrderHistory)}
        ${renderClientHistoryBlock("Support", history.supportTickets, renderClientSupportHistory)}
        ${renderClientHistoryBlock("Referrals", history.referrals, renderClientReferralHistory)}
        ${renderClientHistoryBlock("Notifications", history.notifications, renderClientNotificationHistory)}
        ${renderClientHistoryBlock("Admin Actions", history.auditLogs, renderClientAuditHistory)}
      </div>
    `;
  }

  function getClientHistory(clientId, snapshot) {
    const walletTransactions = (snapshot.walletTransactions || []).filter((item) => item.client_id === clientId);
    return {
      deposits: (snapshot.deposits || []).filter((item) => item.client_id === clientId),
      walletTransactions,
      supportTickets: (snapshot.supportTickets || []).filter((item) => item.client_id === clientId),
      subscriptions: (snapshot.subscriptions || []).filter((item) => item.client_id === clientId),
      orders: (snapshot.orders || []).filter((item) => item.client_id === clientId),
      referrals: (snapshot.referrals || []).filter((item) => item.referrer_id === clientId || item.referred_client_id === clientId),
      notifications: (snapshot.notifications || []).filter((item) => item.recipient_id === clientId),
      auditLogs: (snapshot.auditLogs || []).filter((item) => JSON.stringify(item.metadata || {}).includes(clientId) || item.entity_id === clientId),
      walletCredit: walletTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    };
  }

  function renderClientHistoryBlock(title, rows, renderer) {
    return `
      <section class="history-block">
        <h4>${escapeHtml(title)}</h4>
        ${rows.length ? rows.slice(0, 6).map(renderer).join("") : `<p class="muted-text">No records yet.</p>`}
      </section>
    `;
  }

  function renderClientDepositHistory(deposit) {
    return `
      <div class="history-row">
        <span>${escapeHtml(formatStatus(deposit.status))}</span>
        <strong>${formatMoney(deposit.usd_credit_amount || deposit.amount || 0, "USD")}</strong>
        <small>${escapeHtml(deposit.payment_reference || "No reference")} - ${formatDate(deposit.created_at)}</small>
      </div>
    `;
  }

  function renderClientSubscriptionHistory(subscription) {
    return `
      <div class="history-row">
        <span>${escapeHtml(formatStatus(subscription.status))}</span>
        <strong>${escapeHtml(subscription.plans?.products?.name || subscription.plans?.name || "Subscription")}</strong>
        <small>${formatDate(subscription.starts_at || subscription.created_at)} to ${formatDate(subscription.expires_at)}</small>
      </div>
    `;
  }

  function renderClientOrderHistory(order) {
    return `
      <div class="history-row">
        <span>${escapeHtml(formatStatus(order.status))}</span>
        <strong>${escapeHtml(order.plans?.products?.name || order.plans?.name || "Order")}</strong>
        <small>${formatMoney(order.total_amount || 0, order.currency || "USD")} - ${formatDate(order.created_at)}</small>
      </div>
    `;
  }

  function renderClientSupportHistory(ticket) {
    return `
      <div class="history-row">
        <span>${escapeHtml(formatStatus(ticket.status))}</span>
        <strong>${escapeHtml(ticket.subject || "Support Ticket")}</strong>
        <small>${escapeHtml(ticket.category || "General")} - ${formatDate(ticket.created_at)}</small>
      </div>
    `;
  }

  function renderClientReferralHistory(referral) {
    return `
      <div class="history-row">
        <span>${escapeHtml(formatStatus(referral.status))}</span>
        <strong>${formatMoney(referral.commission_amount || 0, "USD")}</strong>
        <small>${escapeHtml(referral.referrer_id === adminClientProfile?.dataset.clientId ? "Earned commission" : "Referred by another client")} - ${formatDate(referral.created_at)}</small>
      </div>
    `;
  }

  function renderClientNotificationHistory(notification) {
    return `
      <div class="history-row">
        <span>${escapeHtml(formatStatus(notification.status))}</span>
        <strong>${escapeHtml(notification.title || "Notification")}</strong>
        <small>${escapeHtml(notification.body || "")} ${formatDate(notification.created_at)}</small>
      </div>
    `;
  }

  function renderClientAuditHistory(log) {
    return `
      <div class="history-row">
        <span>${escapeHtml(formatStatus(log.action || "action"))}</span>
        <strong>${escapeHtml(log.entity_table || "Record")}</strong>
        <small>${formatDate(log.created_at)}</small>
      </div>
    `;
  }

  function buildClientTimeline(profile, history) {
    const rows = [
      ...history.deposits.map((item) => ({ at: item.created_at, type: "Deposit", title: formatMoney(item.usd_credit_amount || item.amount || 0, "USD"), detail: formatStatus(item.status) })),
      ...history.orders.map((item) => ({ at: item.created_at, type: "Order", title: item.plans?.products?.name || item.plans?.name || "Order", detail: formatStatus(item.status) })),
      ...history.subscriptions.map((item) => ({ at: item.created_at || item.starts_at, type: "Subscription", title: item.plans?.products?.name || item.plans?.name || "Subscription", detail: formatStatus(item.status) })),
      ...history.supportTickets.map((item) => ({ at: item.created_at, type: "Support", title: item.subject || "Support ticket", detail: formatStatus(item.status) })),
      ...history.referrals.map((item) => ({ at: item.created_at, type: "Referral", title: formatMoney(item.commission_amount || 0, "USD"), detail: formatStatus(item.status) })),
      ...history.notifications.map((item) => ({ at: item.created_at, type: "Notification", title: item.title || "Notification", detail: formatStatus(item.status) })),
    ];

    if (profile.created_at) {
      rows.push({ at: profile.created_at, type: "Account", title: "Client account created", detail: profile.email || "" });
    }

    return rows
      .filter((item) => item.at)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 10);
  }

  function renderTimelineItem(item) {
    return `
      <div class="timeline-item">
        <span>${escapeHtml(item.type)}</span>
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.detail)} - ${formatDate(item.at)}</small>
        </div>
      </div>
    `;
  }

  function renderLandingCreatives() {
    if (!landingCreativesList) return;

    landingCreativesList.innerHTML = landingCreativesCache.length
      ? landingCreativesCache.map(renderLandingCreativeRow).join("")
      : `<p class="codebox">No landing creatives yet.</p>`;

    document.querySelectorAll("[data-edit-landing-creative]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        const creative = landingCreativesCache.find((item) => item.id === button.dataset.editLandingCreative);
        hydrateLandingCreativeForm(creative);
        renderLandingCreativePreview(creative);
      });
    });

    if (landingCreativePreview && landingCreativesCache.length && !landingCreativePreview.dataset.previewId) {
      renderLandingCreativePreview(landingCreativesCache[0]);
    }
  }

  function renderLandingCreativeRow(creative) {
    const promoWindow = [formatDate(creative.promo_starts_at), formatDate(creative.promo_ends_at)]
      .filter((value) => value && value !== "Pending")
      .join(" to ");

    return `
      <div class="landing-creative-row">
        <div>
          <span class="pill">${escapeHtml(formatStatus(creative.section_key))}</span>
          <strong>${escapeHtml(creative.title)}</strong>
          <small>${escapeHtml(creative.subtitle || creative.body || "No supporting copy")}</small>
          ${promoWindow ? `<small>${escapeHtml(promoWindow)}</small>` : ""}
        </div>
        <div class="client-directory-meta">
          <span>${escapeHtml(formatStatus(creative.status))}</span>
          <span>Sort ${Number(creative.sort_order || 0)}</span>
        </div>
        <button class="secondary-btn" type="button" data-edit-landing-creative="${escapeHtml(creative.id)}">Edit</button>
      </div>
    `;
  }

  function hydrateLandingCreativeForm(creative) {
    if (!landingCreativeForm || !creative) return;

    landingCreativeForm.elements.id.value = creative.id || "";
    landingCreativeForm.elements.section_key.value = creative.section_key || "promo";
    landingCreativeForm.elements.status.value = creative.status || "draft";
    landingCreativeForm.elements.title.value = creative.title || "";
    landingCreativeForm.elements.subtitle.value = creative.subtitle || "";
    landingCreativeForm.elements.image_url.value = creative.image_url || "";
    landingCreativeForm.elements.cta_label.value = creative.cta_label || "";
    landingCreativeForm.elements.cta_url.value = creative.cta_url || "";
    landingCreativeForm.elements.sort_order.value = creative.sort_order ?? 100;
    landingCreativeForm.elements.promo_starts_at.value = isoToDatetimeLocal(creative.promo_starts_at);
    landingCreativeForm.elements.promo_ends_at.value = isoToDatetimeLocal(creative.promo_ends_at);
    landingCreativeForm.elements.body.value = creative.body || "";
    setStatus("Landing creative loaded for editing.", "ok");
  }

  function clearLandingCreativeForm() {
    if (!landingCreativeForm) return;
    landingCreativeForm.reset();
    landingCreativeForm.elements.id.value = "";
    landingCreativeForm.elements.sort_order.value = 100;
    if (landingCreativePreview) {
      landingCreativePreview.dataset.previewId = "";
      landingCreativePreview.innerHTML = `<p class="codebox">Select or create a landing creative to preview it here.</p>`;
    }
  }

  function renderLandingCreativePreview(creative) {
    if (!landingCreativePreview || !creative) return;

    landingCreativePreview.dataset.previewId = creative.id || "";
    landingCreativePreview.innerHTML = `
      <div class="landing-preview-card">
        ${creative.image_url ? `<img src="${escapeHtml(creative.image_url)}" alt="${escapeHtml(creative.title)}" loading="lazy" />` : ""}
        <span class="pill">${escapeHtml(formatStatus(creative.section_key))} - ${escapeHtml(formatStatus(creative.status))}</span>
        <h3>${escapeHtml(creative.title)}</h3>
        ${creative.subtitle ? `<p>${escapeHtml(creative.subtitle)}</p>` : ""}
        ${creative.body ? `<small>${escapeHtml(creative.body)}</small>` : ""}
        ${creative.cta_label ? `<button class="primary-btn" type="button">${escapeHtml(creative.cta_label)}</button>` : ""}
      </div>
    `;
  }

  function datetimeLocalToIso(value) {
    if (!value) return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  function isoToDatetimeLocal(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  }

  function renderMetricRow([label, value, tone]) {
    return `<div class="row"><span>${escapeHtml(label)}</span><b class="${escapeHtml(tone || "")}">${escapeHtml(value)}</b></div>`;
  }

  function renderAdminExpenseRow(expense) {
    const canWrite = hasAdminWriteAccess();
    const nextStatus = expense.status === "approved" ? "voided" : "approved";
    const statusAction = canWrite
      ? `<button class="secondary-btn" type="button" data-expense-status="${escapeHtml(nextStatus)}" data-expense-id="${escapeHtml(expense.id)}">${escapeHtml(formatStatus(nextStatus))}</button>`
      : `<span class="warn">View only</span>`;
    const receipt = expense.receipt_url
      ? `<a href="${escapeHtml(expense.receipt_url)}" target="_blank" rel="noopener">Receipt</a>`
      : "";

    return `
      <div class="approval-card expense-row" data-expense-row="${escapeHtml(expense.id)}">
        <div>
          <strong>${escapeHtml(expense.description)}</strong>
          <p>${escapeHtml(formatStatus(expense.category))} / ${escapeHtml(formatDate(expense.expense_date))}</p>
          <p>${escapeHtml(expense.vendor || "No vendor")} / ${escapeHtml(expense.payment_method || "No method")}</p>
          ${expense.notes ? `<p>${escapeHtml(expense.notes)}</p>` : ""}
          ${receipt}
        </div>
        <span class="${statusClass(expense.status)}">${escapeHtml(formatStatus(expense.status))}</span>
        <b>${escapeHtml(formatReportMoney(Number(expense.usd_amount || 0), "USD"))}</b>
        ${canWrite ? `<button class="secondary-btn" type="button" data-edit-expense="${escapeHtml(expense.id)}">Edit</button>` : ""}
        ${statusAction}
      </div>
    `;
  }

  function bindAdminExpenseActions() {
    document.querySelectorAll("[data-edit-expense], [data-expense-status]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", async () => {
        if (!requireAdminWrite()) return;

        if (button.hasAttribute("data-edit-expense")) {
          const expense = adminReportSnapshot?.expenses?.find((item) => item.id === button.dataset.editExpense);
          hydrateExpenseForm(expense);
          return;
        }

        await withButtonLoading(button, "Updating...", () => updateExpenseStatus(button.dataset.expenseId, button.dataset.expenseStatus));
      });
    });
  }

  function bindAdminCommissionActions() {
    document.querySelectorAll("[data-admin-commission-approve], [data-admin-commission-reject]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", async () => {
        if (!requireAdminWrite()) return;

        if (button.hasAttribute("data-admin-commission-approve")) {
          await withButtonLoading(button, "Approving...", () => updateCommissionRequest(button.dataset.requestId, "approved"));
          return;
        }

        await withButtonLoading(button, "Rejecting...", () => updateCommissionRequest(button.dataset.requestId, "rejected"));
      });
    });
  }

  async function updateCommissionRequest(requestId, status) {
    const { data: request, error: readError } = await client
      .from("commission_requests")
      .select("id,client_id")
      .eq("id", requestId)
      .single();

    if (readError) {
      setStatus(readError.message, "warn");
      return;
    }

    const { error: requestError } = await client
      .from("commission_requests")
      .update({
        status,
        reviewed_by: currentUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    const nextReferralStatus = status === "approved" ? "paid" : "available";
    const { error: referralError } = await client
      .from("referrals")
      .update({ commission_status: nextReferralStatus })
      .eq("referrer_id", request.client_id)
      .eq("commission_status", "requested");

    const error = requestError || referralError;
    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction(`commission.${status}`, "commission_requests", requestId, {
      status,
      next_referral_status: nextReferralStatus,
      client_id: request.client_id,
    });
    await createNotification({
      recipientId: request.client_id,
      title: status === "approved" ? "Withdrawal approved" : "Withdrawal rejected",
      message: status === "approved" ? "Your referral withdrawal request has been approved." : "Your referral withdrawal request was rejected. Please review your payout details.",
      category: "commission",
      entityTable: "commission_requests",
      entityId: requestId,
    });
    setStatus(`Commission withdrawal ${status}.`, status === "approved" ? "ok" : "warn");
    await loadAdminData();
  }

  function bindAdminSupportActions() {
    document.querySelectorAll("[data-admin-ticket-status]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", async () => {
        if (!requireSupportAccess()) return;
        await withButtonLoading(button, "Updating...", () => updateSupportTicket(button.dataset.ticketId, button.dataset.adminTicketStatus));
      });
    });

    document.querySelectorAll("[data-admin-support-reply-form]").forEach((form) => {
      if (form.dataset.bound === "true") return;
      form.dataset.bound = "true";
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!requireSupportAccess()) return;

        await withButtonLoading(event.submitter, "Sending...", async () => {
          const ticketId = form.dataset.ticketId;
          const message = String(new FormData(form).get("reply") || "").trim();
          if (!message) {
            setStatus("Write a support reply before sending.", "warn");
            return;
          }

          const { data: ticket, error: ticketError } = await client
            .from("support_tickets")
            .update({
              status: "pending_client",
              assigned_to: currentUser.id,
            })
            .eq("id", ticketId)
            .select("client_id,subject")
            .single();

          if (ticketError) {
            setStatus(ticketError.message, "warn");
            return;
          }

          const { error } = await client.from("support_replies").insert({
            ticket_id: ticketId,
            author_id: currentUser.id,
            message,
            is_admin_reply: true,
          });

          if (error) {
            setStatus(error.message, "warn");
            return;
          }

          await logAdminAction("support.reply", "support_tickets", ticketId, {
            subject: ticket.subject,
            client_id: ticket.client_id,
          });
          await createNotification({
            recipientId: ticket.client_id,
            title: "Support replied",
            message: `ETX replied to ${ticket.subject}. Please check your support thread.`,
            category: "support",
            entityTable: "support_tickets",
            entityId: ticketId,
          });

          setStatus("Support reply sent to client.", "ok");
          await loadAdminData();
        });
      });
    });
  }

  function bindClientSupportTicketActions() {
    document.querySelectorAll("[data-view-ticket]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        const ticket = supportTicketsCache.find((item) => item.id === button.dataset.viewTicket);
        if (ticket) renderSupportThread(ticket);
      });
    });

    document.querySelectorAll("[data-client-support-reply-form]").forEach((form) => {
      if (form.dataset.bound === "true") return;
      form.dataset.bound = "true";
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!currentUser) {
          setStatus("Please sign in before replying to support.", "warn");
          return;
        }

        await withButtonLoading(event.submitter, "Sending...", async () => {
          const ticketId = form.dataset.ticketId;
          const message = String(new FormData(form).get("reply") || "").trim();
          if (!message) {
            setStatus("Write a reply before sending.", "warn");
            return;
          }

          const { error: replyError } = await client.from("support_replies").insert({
            ticket_id: ticketId,
            author_id: currentUser.id,
            message,
            is_admin_reply: false,
          });

          const { error: ticketError } = await client.from("support_tickets").update({ status: "pending_admin" }).eq("id", ticketId);
          const error = replyError || ticketError;

          if (error) {
            setStatus(error.message, "warn");
            return;
          }

          setStatus("Reply sent. ETX support will review your thread.", "ok");
          await hydrateClientData();
          const ticket = supportTicketsCache.find((item) => item.id === ticketId);
          if (ticket) renderSupportThread(ticket);
        });
      });
    });
  }

  async function updateSupportTicket(ticketId, status) {
    const { data: ticket, error } = await client
      .from("support_tickets")
      .update({
        status,
        assigned_to: currentUser.id,
      })
      .eq("id", ticketId)
      .select("client_id,subject")
      .single();

    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction(`support.${status}`, "support_tickets", ticketId, {
      status,
      subject: ticket.subject,
      client_id: ticket.client_id,
    });
    await createNotification({
      recipientId: ticket.client_id,
      title: "Support ticket updated",
      message: `${ticket.subject} is now ${formatStatus(status)}.`,
      category: "support",
      entityTable: "support_tickets",
      entityId: ticketId,
    });
    setStatus(`Support ticket marked as ${formatStatus(status)}.`, status === "resolved" ? "ok" : "warn");
    await loadAdminData();
  }

  async function updateRecordStatus(table, id, status) {
    const { error } = await client.from(table).update({ status }).eq("id", id);
    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction(`${table}.${status}`, table, id, { status });
    setStatus(`${table.slice(0, -1)} marked as ${status}.`, "ok");
    await loadAdminData();
    await loadPlans();
  }

  async function updateExpenseStatus(id, status) {
    const { error } = await client
      .from("expenses")
      .update({ status, updated_by: currentUser.id })
      .eq("id", id);

    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction(`expense.${status}`, "expenses", id, { status });
    setStatus(`Expense marked as ${formatStatus(status)}.`, "ok");
    await loadAdminData();
  }

  async function approveDeposit(depositId) {
    const reviewNotes = getAdminReviewNotes();
    const { data: deposit, error: readError } = await client
      .from("deposit_requests")
      .select("id,client_id,status,wallet_credit_amount,amount")
      .eq("id", depositId)
      .single();

    if (readError) {
      setStatus(readError.message, "warn");
      return;
    }

    if (deposit.status === "approved") {
      setStatus("Deposit is already approved.", "warn");
      return;
    }

    const creditInput = document.querySelector(`[data-admin-credit-amount][data-deposit-id="${CSS.escape(depositId)}"]`);
    const approvedCredit = Number(creditInput?.value || deposit.wallet_credit_amount || deposit.amount || 0);
    if (!approvedCredit || approvedCredit <= 0) {
      setStatus("Approved wallet credit must be greater than zero.", "warn");
      return;
    }

    const { error } = await client.rpc("approve_wallet_deposit", {
      target_deposit_id: deposit.id,
      review_note: reviewNotes || null,
      approved_wallet_credit: approvedCredit,
    });

    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction("deposit.approved", "deposit_requests", deposit.id, {
      wallet_credit_amount: approvedCredit,
      has_review_note: Boolean(reviewNotes),
    });
    await createNotification({
      recipientId: deposit.client_id,
      title: "Deposit approved",
      message: reviewNotes
        ? `Your wallet has been credited ${formatMoney(approvedCredit, "USD")}. Admin note: ${reviewNotes}`
        : `Your wallet has been credited ${formatMoney(approvedCredit, "USD")}. You can now buy ETX products using your wallet balance.`,
      category: "payment",
      entityTable: "deposit_requests",
      entityId: deposit.id,
    });
    clearAdminReviewNotes();
    if (adminActionLog) {
      adminActionLog.textContent = `Deposit approved. Wallet credited ${formatMoney(approvedCredit, "USD")} and ledger updated.`;
      adminActionLog.className = "codebox ok";
    }
    setStatus("Deposit approved and wallet balance credited.", "ok");
    await loadAdminData();
  }

  async function rejectDeposit(depositId) {
    const reviewNotes = getAdminReviewNotes();
    const { data: deposit, error: readError } = await client.from("deposit_requests").select("client_id").eq("id", depositId).single();
    if (readError) {
      setStatus(readError.message, "warn");
      return;
    }

    const { error } = await client
      .from("deposit_requests")
      .update({
        status: "rejected",
        reviewed_by: currentUser.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || null,
      })
      .eq("id", depositId);

    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction("deposit.rejected", "deposit_requests", depositId, {
      has_review_note: Boolean(reviewNotes),
    });
    await createNotification({
      recipientId: deposit.client_id,
      title: "Deposit needs correction",
      message: reviewNotes
        ? `Your deposit proof was rejected. Admin note: ${reviewNotes}`
        : "Your deposit proof was rejected. Please submit corrected top-up details or proof.",
      category: "payment",
      entityTable: "deposit_requests",
      entityId: depositId,
    });
    clearAdminReviewNotes();
    if (adminActionLog) {
      adminActionLog.textContent = "Deposit rejected. Client was notified to submit corrected details.";
      adminActionLog.className = "codebox warn";
    }
    setStatus("Deposit rejected.", "ok");
    await loadAdminData();
  }

  async function openProof(path) {
    if (!path) {
      setStatus("No proof file attached to this payment.", "warn");
      return;
    }

    const { data, error } = await client.storage.from("payment-proofs").createSignedUrl(path, 300);
    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function logAdminAction(action, entityTable, entityId, metadata = {}) {
    await client.from("audit_logs").insert({
      actor_id: currentUser.id,
      action,
      entity_table: entityTable,
      entity_id: entityId,
      metadata: {
        actor_email: currentUser.email || currentProfile?.email || null,
        actor_role: currentUser.app_metadata?.role || currentProfile?.role || null,
        ...metadata,
      },
    });
  }

  function setupRealtimeSubscriptions(user) {
    if (!user || typeof client.channel !== "function") return;

    const nextKey = `${user.id}:${String(user.app_metadata?.role || "client").toLowerCase()}`;
    if (realtimeKey === nextKey) return;

    resetRealtimeSubscriptions();
    realtimeKey = nextKey;

    const clientChannel = client
      .channel(`etx-client-notifications-${user.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `recipient_id=eq.${user.id}`,
      }, (payload) => handleClientRealtimeNotification(payload.new))
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "notifications",
        filter: `recipient_id=eq.${user.id}`,
      }, () => queueClientRealtimeRefresh())
      .subscribe(handleRealtimeStatus);

    realtimeChannels.push(clientChannel);

    if (!hasAdminAccess(user)) return;

    const adminNotificationChannel = client
      .channel("etx-admin-notification-feed")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
      }, (payload) => handleAdminRealtimeNotification(payload.new))
      .subscribe(handleRealtimeStatus);

    const adminOpsChannel = client
      .channel("etx-admin-operations-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "deposit_requests" }, () => queueAdminRealtimeRefresh("Deposit queue updated."))
      .on("postgres_changes", { event: "*", schema: "public", table: "commission_requests" }, () => queueAdminRealtimeRefresh("Commission queue updated."))
      .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, () => queueAdminRealtimeRefresh("Support queue updated."))
      .on("postgres_changes", { event: "*", schema: "public", table: "support_replies" }, () => queueAdminRealtimeRefresh("Support replies updated."))
      .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions" }, () => queueAdminRealtimeRefresh("Subscription records updated."))
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, () => queueAdminRealtimeRefresh("Payment records updated."))
      .on("postgres_changes", { event: "*", schema: "public", table: "wallet_transactions" }, () => queueAdminRealtimeRefresh("Wallet ledger updated."))
      .subscribe(handleRealtimeStatus);

    realtimeChannels.push(adminNotificationChannel, adminOpsChannel);
  }

  function resetRealtimeSubscriptions() {
    realtimeChannels.forEach((channel) => {
      try {
        if (typeof client.removeChannel === "function") {
          client.removeChannel(channel);
        } else if (typeof channel.unsubscribe === "function") {
          channel.unsubscribe();
        }
      } catch (error) {
        console.warn("Realtime unsubscribe failed", error);
      }
    });
    realtimeChannels = [];
    realtimeKey = "";
    window.clearTimeout(clientRealtimeRefreshTimer);
    window.clearTimeout(adminRealtimeRefreshTimer);
  }

  function handleRealtimeStatus(status) {
    if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
      console.warn(`Realtime channel status: ${status}`);
    }
  }

  function handleClientRealtimeNotification(notification) {
    if (!notification) return;
    const tone = notificationTone(notification);
    showToast(`${notification.title}: ${notification.message}`, tone);
    showBrowserNotification(notification.title, notification.message);
    queueClientRealtimeRefresh();
  }

  function handleAdminRealtimeNotification(notification) {
    if (!notification || notification.recipient_id === currentUser?.id) return;
    showToast(`New client notification: ${notification.title}`, "info");
    queueAdminRealtimeRefresh();
  }

  function queueClientRealtimeRefresh() {
    if (!currentUser) return;
    window.clearTimeout(clientRealtimeRefreshTimer);
    clientRealtimeRefreshTimer = window.setTimeout(() => {
      hydrateClientData();
    }, 500);
  }

  function queueAdminRealtimeRefresh(message) {
    if (message && hasAdminAccess()) showToast(message, "info");
    if (!hasAdminAccess()) return;

    window.clearTimeout(adminRealtimeRefreshTimer);
    adminRealtimeRefreshTimer = window.setTimeout(() => {
      loadAdminData();
    }, 700);
  }

  async function requestBrowserNotificationPermission() {
    if (!("Notification" in window)) {
      setStatus("Browser notifications are not supported on this device.", "warn");
      return;
    }

    if (Notification.permission === "granted") {
      setStatus("Browser alerts are already enabled.", "ok");
      syncNotificationPermissionUi();
      return;
    }

    if (Notification.permission === "denied") {
      setStatus("Browser alerts are blocked. Enable notifications in browser settings to receive pop-up alerts.", "warn");
      syncNotificationPermissionUi();
      return;
    }

    const permission = await Notification.requestPermission();
    setStatus(permission === "granted" ? "Browser alerts enabled." : "Browser alerts were not enabled.", permission === "granted" ? "ok" : "warn");
    syncNotificationPermissionUi();
  }

  function syncNotificationPermissionUi() {
    enableNotificationButtons.forEach((button) => {
      if (!("Notification" in window)) {
        button.textContent = "Alerts Unavailable";
        button.disabled = true;
        return;
      }

      if (Notification.permission === "granted") {
        button.textContent = "Alerts On";
        button.disabled = true;
        return;
      }

      if (Notification.permission === "denied") {
        button.textContent = "Alerts Blocked";
        button.disabled = true;
        return;
      }

      button.textContent = "Enable Alerts";
      button.disabled = false;
    });
  }

  function showBrowserNotification(title, message) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    try {
      new Notification(title, {
        body: message,
        tag: `etx-${title}`,
        silent: false,
      });
    } catch (error) {
      console.warn("Browser notification failed", error);
    }
  }

  function notificationTone(notification) {
    const text = `${notification.title || ""} ${notification.message || ""} ${notification.category || ""}`.toLowerCase();
    if (text.includes("reject") || text.includes("correction") || text.includes("blocked")) return "warn";
    if (text.includes("approved") || text.includes("active") || text.includes("earned")) return "ok";
    return "info";
  }

  async function createNotification({ recipientId, title, message, category = "system", entityTable = null, entityId = null }) {
    if (!recipientId || !title || !message) return null;

    const { error } = await client.from("notifications").insert({
      recipient_id: recipientId,
      actor_id: currentUser?.id || null,
      title,
      message,
      category,
      entity_table: entityTable,
      entity_id: entityId,
    });

    return error || null;
  }

  function getAdminReviewNotes() {
    return String(adminReviewNotes?.value || "").trim().slice(0, 500);
  }

  function clearAdminReviewNotes() {
    if (adminReviewNotes) adminReviewNotes.value = "";
  }

  async function markClientNotificationsRead() {
    if (!currentUser) {
      setStatus("Please sign in before updating notifications.", "warn");
      return;
    }

    const { error } = await client
      .from("notifications")
      .update({ status: "read", read_at: new Date().toISOString() })
      .eq("recipient_id", currentUser.id)
      .eq("status", "unread");

    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    setStatus("Notifications marked as read.", "ok");
    await hydrateClientData();
  }

  async function markSingleNotificationRead(notificationId) {
    if (!currentUser || !notificationId) return;

    const { error } = await client
      .from("notifications")
      .update({ status: "read", read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("recipient_id", currentUser.id);

    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    setStatus("Notification marked as read.", "ok");
    await hydrateClientData();
  }

  function updateBadge(target, count) {
    if (!target) return;
    target.textContent = String(count);
    target.classList.toggle("hidden", count <= 0);
    if (target === notificationBadge) {
      notificationButton?.classList.toggle("has-unread", count > 0);
    }
  }

  function requireAdmin(showMessage = true) {
    const hasAccess = hasAdminAccess();
    if (!hasAccess && showMessage) {
      setStatus("Operations role required.", "warn");
    }
    return hasAccess;
  }

  function requireAdminWrite(showMessage = true) {
    const hasAccess = hasAdminWriteAccess();
    if (!hasAccess && showMessage) {
      setStatus("ADMIN or SUPER USER role required for this action.", "warn");
    }
    return hasAccess;
  }

  function requireSupportAccess(showMessage = true) {
    const hasAccess = hasSupportAccess();
    if (!hasAccess && showMessage) {
      setStatus("Support access role required.", "warn");
    }
    return hasAccess;
  }

  function requireSuperUser(showMessage = true) {
    const hasAccess = hasSuperUserAccess();
    if (!hasAccess && showMessage) {
      setStatus("SUPER USER role required.", "warn");
    }
    return hasAccess;
  }

  function hasAdminAccess(user = currentUser) {
    return ["super_user", "admin", "manager"].includes(String(user?.app_metadata?.role || "").toLowerCase());
  }

  function hasAdminWriteAccess(user = currentUser) {
    return ["super_user", "admin"].includes(String(user?.app_metadata?.role || "").toLowerCase());
  }

  function hasSupportAccess(user = currentUser) {
    return ["super_user", "admin", "manager"].includes(String(user?.app_metadata?.role || "").toLowerCase());
  }

  function hasSuperUserAccess(user = currentUser) {
    return String(user?.app_metadata?.role || "").toLowerCase() === "super_user";
  }

  function formatRoleLabel(role) {
    return String(role || "none").replace(/_/g, " ").toUpperCase();
  }

  function normalizeRoleKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function renderGroupedPlans(plans) {
    if (!plans?.length) {
      return `<article class="panel"><h3>No active ETX tools yet</h3><p>Active plans will appear here once configured by admin.</p></article>`;
    }

    const groups = plans.reduce((items, plan) => {
      const product = plan.products || {};
      const key = formatCategory(product.category || product.name || "ETX Trading Tools");
      items[key] = items[key] || [];
      items[key].push(plan);
      return items;
    }, {});

    return Object.entries(groups)
      .map(([category, items]) => `
        <section class="tool-category">
          <div class="tool-category-header">
            <span>${escapeHtml(category)}</span>
            <small>${items.length} plan${items.length > 1 ? "s" : ""}</small>
          </div>
          <div class="tool-category-grid">
            ${items.map(renderPlanCard).join("")}
          </div>
        </section>
      `)
      .join("");
  }

  function formatCategory(category) {
    return String(category || "ETX Trading Tools")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function renderPlanCard(plan) {
    const product = plan.products || {};
    const duration = plan.bonus_days ? `${plan.duration_days} days + ${plan.bonus_days} bonus` : `${plan.duration_days} days`;
    const price = plan.is_trial ? "Free Trial" : formatMoney(Number(plan.price_amount), plan.currency);

    return `
      <article class="product-card${product.code === "SAFY-EA" ? " featured" : ""}">
        <span class="product-code">${escapeHtml(product.code || "ETX")}</span>
        <h3>${escapeHtml(product.name || "ETX Product")}</h3>
        <p>${escapeHtml(plan.name)} / ${escapeHtml(duration)}</p>
        <strong>${escapeHtml(price)}</strong>
        <button class="primary-btn wide" type="button" data-select-plan="${escapeHtml(plan.id)}">Select Plan</button>
      </article>
    `;
  }

  function openPlanModal(plan) {
    if (!planModal || !plan) return;

    const duration = plan.bonus_days ? `${plan.duration_days} days + ${plan.bonus_days} bonus` : `${plan.duration_days} days`;
    const price = plan.is_trial ? "Free Trial" : formatMoney(Number(plan.price_amount), plan.currency);
    const hasEnoughBalance = plan.is_trial || walletBalance >= Number(plan.price_amount || 0);
    const requiredTopUp = Math.max(Number(plan.price_amount || 0) - walletBalance, 0);
    const balanceAfterPurchase = plan.is_trial ? walletBalance : Math.max(walletBalance - Number(plan.price_amount || 0), 0);
    const status = hasEnoughBalance ? "Ready to subscribe" : "Deposit required";

    setText("[data-plan-modal-category]", plan.category || "ETX Trading Tools");
    setText("[data-plan-modal-title]", `${plan.product_name} / ${plan.name}`);
    setText("[data-plan-modal-summary]", `${plan.product_name} access with ${plan.name}. This checkout uses approved wallet balance only.`);
    setText("[data-plan-modal-price]", price);
    setText("[data-plan-modal-duration]", duration);
    setText("[data-plan-modal-wallet]", formatMoney(walletBalance, "USD"));
    setText("[data-plan-modal-status]", status);
    setText("[data-plan-modal-after]", formatMoney(balanceAfterPurchase, "USD"));
    setText("[data-plan-modal-gap]", hasEnoughBalance ? "No top-up needed" : formatMoney(requiredTopUp, "USD"));
    setText("[data-plan-modal-note]", hasEnoughBalance
      ? "Ready. Your subscription will activate immediately after successful wallet purchase."
      : `Your wallet is short by ${formatMoney(requiredTopUp, "USD")}. Deposit funds first and wait for admin approval before subscribing.`);

    if (planModalBenefits) {
      const benefits = [
        `${plan.category || "ETX Trading Tools"} access`,
        `${duration} subscription term`,
        hasEnoughBalance ? "Wallet checkout is ready" : "Deposit approval required before checkout",
        "Subscription status updates in Profile and Subscriptions",
      ];
      planModalBenefits.innerHTML = benefits.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    }

    const statusTarget = document.querySelector("[data-plan-modal-status]");
    if (statusTarget) {
      statusTarget.className = hasEnoughBalance ? "ok" : "warn";
    }

    if (planModalPurchase) {
      planModalPurchase.disabled = !hasEnoughBalance;
      planModalPurchase.textContent = hasEnoughBalance ? "Subscribe Now" : "Insufficient Balance";
    }

    if (planModalReferralCode && !planModalReferralCode.value && referredByCode) {
      planModalReferralCode.value = referredByCode;
    }

    planModal.classList.remove("hidden");
    planModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function updateSelectedPlanSummary(plan) {
    if (!selectedPlan || !plan) return;

    const hasEnoughBalance = plan.is_trial || walletBalance >= Number(plan.price_amount || 0);
    const requiredTopUp = Math.max(Number(plan.price_amount || 0) - walletBalance, 0);
    selectedPlan.textContent = hasEnoughBalance
      ? `${plan.product_name} / ${plan.name} is ready for wallet checkout.`
      : `${plan.product_name} / ${plan.name} selected. Add ${formatMoney(requiredTopUp, "USD")} to wallet before subscribing.`;
    selectedPlan.className = `codebox ${hasEnoughBalance ? "ok" : "warn"}`.trim();
  }

  function closePlanModal() {
    if (!planModal) return;
    planModal.classList.add("hidden");
    planModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function renderOrderRow(order) {
    return `<div class="row"><span>${escapeHtml(order.plans?.products?.name || "ETX Product")} / ${escapeHtml(order.plans?.name || "Plan")}</span><b class="${statusClass(order.status)}">${escapeHtml(formatStatus(order.status))}</b></div>`;
  }

  function renderSubscriptionRow(subscription) {
    const expiry = subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString() : "No expiry";
    return `<div class="row"><span>${escapeHtml(subscription.products?.name || "ETX Product")}</span><b class="ok">${escapeHtml(formatStatus(subscription.status))} until ${escapeHtml(expiry)}</b></div>`;
  }

  function renderPaymentRow(payment) {
    const proof = payment.proof_file_name ? ` / ${payment.proof_file_name}` : "";
    const note = payment.review_notes ? `<small>Admin note: ${escapeHtml(payment.review_notes)}</small>` : "";
    const resubmitted = payment.resubmitted_from ? `<small>Resubmitted proof</small>` : "";
    return `
      <div class="row">
        <span>${escapeHtml(payment.orders?.plans?.products?.name || "ETX Product")} / ${escapeHtml(payment.transaction_reference || "No reference")}${escapeHtml(proof)} ${note}${resubmitted}</span>
        <b class="${statusClass(payment.status)}">${escapeHtml(formatStatus(payment.status))}</b>
      </div>
    `;
  }

  function renderDepositRequestRow(deposit) {
    const note = deposit.review_notes ? `<small>Admin note: ${escapeHtml(deposit.review_notes)}</small>` : "";
    const paidCurrency = deposit.paid_currency || deposit.currency || "USD";
    const paidAmount = Number(deposit.paid_amount || deposit.amount || 0);
    const walletCredit = Number(deposit.wallet_credit_amount || deposit.amount || 0);
    const rate = deposit.platform_rate ? ` <small>Rate: ${escapeHtml(formatRate(deposit.platform_rate))}</small>` : "";
    return `
      <div class="row">
        <span>${escapeHtml(formatMoney(paidAmount, paidCurrency))} / ${escapeHtml(formatStatus(deposit.method))} / ${escapeHtml(deposit.transaction_reference || "No reference")}${rate}${note}</span>
        <small>USD credit ${escapeHtml(formatMoney(walletCredit, "USD"))}</small>
        <b class="${statusClass(deposit.status)}">${escapeHtml(formatStatus(deposit.status))}</b>
      </div>
    `;
  }

  function renderWalletTransactionRow(transaction) {
    const sign = transaction.direction === "credit" ? "+" : "-";
    return `
      <div class="row">
        <span>${escapeHtml(transaction.description || formatStatus(transaction.type))} <small>${escapeHtml(formatDateTime(transaction.created_at))}</small></span>
        <b class="${transaction.direction === "credit" ? "ok" : "warn"}">${sign}${escapeHtml(formatMoney(Number(transaction.amount), transaction.currency))}</b>
      </div>
    `;
  }

  function renderSupportTicketRow(ticket) {
    const date = ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "Today";
    const replyCount = Array.isArray(ticket.support_replies) ? ticket.support_replies.length : 0;
    return `
      <div class="row">
        <span>${escapeHtml(ticket.subject)} <small>${escapeHtml(date)} / ${replyCount} replies</small></span>
        <b class="${statusClass(ticket.status)}">${escapeHtml(formatStatus(ticket.status))}</b>
        <button class="secondary-btn compact-btn" type="button" data-view-ticket="${escapeHtml(ticket.id)}">View Thread</button>
      </div>
    `;
  }

  function syncClientFlowState(orders, payments, subscriptions, supportTickets = [], notifications = [], deposits = []) {
    const latestDeposit = deposits[0];
    const hasPendingPayment = deposits.some((deposit) => ["pending", "under_review"].includes(deposit.status));
    const hasActiveSubscription = subscriptions.some((subscription) => ["active", "trial"].includes(subscription.status));

    if (hasActiveSubscription) {
      setClientFlow("subscription", "Congratulations. Your subscription is now active and reflected in your account.");
      renderSubscriptionSummary(subscriptions, payments);
    } else if (latestDeposit?.status === "rejected") {
      setClientFlow("payment", "Deposit was rejected. Please submit corrected top-up details or proof.");
      renderSubscriptionSummary(subscriptions, payments);
    } else if (hasPendingPayment) {
      setClientFlow("verification", "Deposit submitted. Please wait for admin verification.");
      renderSubscriptionSummary(subscriptions, payments);
    } else if (walletBalance > 0) {
      setClientFlow("select", "Wallet funded. Select a plan and buy using your wallet balance.");
      renderSubscriptionSummary(subscriptions, payments);
    } else {
      setClientFlow("payment", "Deposit funds first. Products can only be purchased using approved wallet balance.");
      renderSubscriptionSummary(subscriptions, payments);
    }

    if (!lastClientSnapshot.hasActiveSubscription && hasActiveSubscription) {
      goToTab("subscriptions");
    }

    lastClientSnapshot = { hasPendingPayment, hasActiveSubscription };
    updateBadge(notificationBadge, notifications.filter((notification) => notification.status === "unread").length);
    renderClientNotifications(notifications, orders, payments, subscriptions, supportTickets, deposits);
  }

  function renderClientNotifications(savedNotifications, orders, payments, subscriptions, supportTickets, deposits = []) {
    if (!clientNotifications) return;

    if (savedNotifications?.length) {
      clientNotifications.innerHTML = savedNotifications
        .map((notification) => `
          <div class="notice-row ${notification.status === "unread" ? "warn" : "ok"}">
            <strong>${escapeHtml(notification.title)}</strong>
            <span>${escapeHtml(notification.message)}</span>
            <small>${escapeHtml(formatDateTime(notification.created_at))} / ${escapeHtml(formatStatus(notification.status))}</small>
            ${notification.status === "unread" ? `<button class="secondary-btn compact-btn" type="button" data-notification-read="${escapeHtml(notification.id)}">Mark Read</button>` : ""}
          </div>
        `)
        .join("");
      bindNotificationReadButtons();
      return;
    }

    const latestPayment = payments[0];
    const latestDeposit = deposits[0];
    const activeSubscription = subscriptions.find((subscription) => ["active", "trial"].includes(subscription.status));
    const openTicket = supportTickets.find((ticket) => ["open", "pending_admin", "pending_client"].includes(ticket.status));
    const notifications = [];

    if (activeSubscription) {
      notifications.push(["Subscription active", `${activeSubscription.products?.name || "ETX Product"} is active until ${formatDate(activeSubscription.expires_at)}.`, "ok"]);
    } else if (latestDeposit?.status === "under_review") {
      notifications.push(["Deposit under review", "Your top-up proof was received. Please wait for admin verification.", "warn"]);
    } else if (latestDeposit?.status === "rejected") {
      notifications.push(["Deposit rejected", "Please submit corrected deposit details or proof.", "rejected"]);
    } else if (walletBalance > 0) {
      notifications.push(["Wallet ready", "Select a plan and buy using your approved wallet balance.", "ok"]);
    } else {
      notifications.push(["Deposit first", "Top up your wallet, wait for admin approval, then buy a plan.", ""]);
    }

    if (openTicket) {
      notifications.push(["Support ticket open", `${openTicket.subject} is ${formatStatus(openTicket.status)}.`, "warn"]);
    }

    clientNotifications.innerHTML = notifications
      .map(([title, detail, tone]) => `<div class="notice-row ${tone}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div>`)
      .join("");
  }

  function bindNotificationReadButtons() {
    document.querySelectorAll("[data-notification-read]").forEach((button) => {
      button.addEventListener("click", () => markSingleNotificationRead(button.dataset.notificationRead));
    });
  }

  function renderSupportThread(ticket) {
    if (!supportThread) return;

    const replies = (ticket.support_replies || [])
      .slice()
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const canReply = !["resolved", "closed"].includes(ticket.status);
    const replyRows = replies.length
      ? replies
          .map((reply) => `
            <div class="thread-message ${reply.is_admin_reply ? "admin-reply" : "client-reply"}">
              <strong>${reply.is_admin_reply ? "ETX Support" : "You"}</strong>
              <p>${escapeHtml(reply.message)}</p>
              <small>${escapeHtml(formatDateTime(reply.created_at))}</small>
            </div>
          `)
          .join("")
      : `<p class="codebox">No replies yet.</p>`;

    supportThread.innerHTML = `
      <div class="support-thread">
        <div class="thread-message client-reply">
          <strong>${escapeHtml(ticket.subject)}</strong>
          <p>${escapeHtml(ticket.message)}</p>
          <small>${escapeHtml(formatDateTime(ticket.created_at))} / ${escapeHtml(formatStatus(ticket.status))}</small>
        </div>
        ${replyRows}
        <form class="reply-form" data-client-support-reply-form data-ticket-id="${escapeHtml(ticket.id)}">
          <textarea name="reply" placeholder="${canReply ? "Write your reply..." : "Ticket is already closed."}" ${canReply ? "required" : "disabled"}></textarea>
          <button class="primary-btn" type="submit" ${canReply ? "" : "disabled"}>Send Reply</button>
        </form>
      </div>
    `;
    bindClientSupportTicketActions();
  }

  function renderSubscriptionSummary(subscriptions, payments) {
    const activeSubscription = subscriptions.find((subscription) => ["active", "trial"].includes(subscription.status));
    const latestPayment = payments[0];

    if (activeSubscription) {
      const expiry = activeSubscription.expires_at ? new Date(activeSubscription.expires_at) : null;
      const daysLeft = expiry ? Math.max(0, Math.ceil((expiry - new Date()) / 86400000)) : "--";
      setText("[data-subscription-state]", formatStatus(activeSubscription.status));
      setText("[data-subscription-detail]", `${activeSubscription.products?.name || "ETX Product"} / ${activeSubscription.plans?.name || "Plan"}`);
      setText("[data-renewal-days]", String(daysLeft));
    } else {
      setText("[data-subscription-state]", latestPayment ? "Pending" : "None");
      setText("[data-subscription-detail]", latestPayment ? "Waiting for admin verification" : "No active subscription yet");
      setText("[data-renewal-days]", "--");
    }

    setText("[data-latest-payment-state]", latestPayment ? formatStatus(latestPayment.status) : "None");
  }

  function setClientFlow(step, message) {
    document.querySelectorAll("[data-flow-step]").forEach((item) => {
      item.classList.toggle("active", item.dataset.flowStep === step);
      item.classList.toggle("complete", flowStepOrder(item.dataset.flowStep) < flowStepOrder(step));
    });

    if (clientFlowAlert) {
      clientFlowAlert.textContent = message;
      clientFlowAlert.className = `codebox ${step === "subscription" ? "ok" : step === "verification" ? "warn" : ""}`.trim();
    }

    if (clientNextActions) {
      clientNextActions.innerHTML = renderNextActions(step);
    }
  }

  function renderNextActions(step) {
    const rows = {
      select: [
        ["Choose a plan", "Required", "warn"],
        ["Deposit funds", walletBalance > 0 ? "Funded" : "Required", walletBalance > 0 ? "ok" : "warn"],
        ["Buy using wallet", "Waiting", ""],
      ],
      payment: [
        ["Deposit funds", "Required", "warn"],
        ["Admin verification", "Waiting", ""],
        ["Buy using wallet", "After approval", ""],
      ],
      verification: [
        ["Deposit submitted", "Done", "ok"],
        ["Admin verification", "In review", "warn"],
        ["Wallet credit", "Waiting", ""],
      ],
      subscription: [
        ["Deposit funded", "Done", "ok"],
        ["Wallet purchase", "Done", "ok"],
        ["Admin verification", "Approved", "ok"],
      ],
    }[step] || [];

    return rows.map(([label, value, tone]) => `<div class="row"><span>${escapeHtml(label)}</span><b class="${tone}">${escapeHtml(value)}</b></div>`).join("");
  }

  function goToTab(tabId) {
    if (typeof window.activatePortalTab === "function") {
      window.activatePortalTab(tabId);
    }
  }

  function flowStepOrder(step) {
    return { select: 1, payment: 2, verification: 3, subscription: 4 }[step] || 0;
  }

  function statusClass(status) {
    if (["approved", "active", "trial", "available", "paid", "resolved", "closed"].includes(status)) return "ok";
    if (["rejected", "cancelled", "expired", "voided"].includes(status)) return "rejected";
    return "warn";
  }

  function formatStatus(status) {
    return String(status || "").replace(/_/g, " ");
  }

  function renderCommissionRequestRow(request) {
    return `<div class="row"><span>${escapeHtml(request.payout_method)} / ${escapeHtml(formatMoney(Number(request.amount), "USD"))}</span><b class="${statusClass(request.status)}">${escapeHtml(formatStatus(request.status))}</b></div>`;
  }

  function getReferralCode() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("ref");
    if (fromUrl) {
      window.localStorage.setItem("etx_referral_code", fromUrl.trim().toUpperCase());
      return fromUrl.trim().toUpperCase();
    }
    return window.localStorage.getItem("etx_referral_code") || "";
  }

  function renderAdminProductRow(product) {
    const nextStatus = product.status === "active" ? "hidden" : "active";
    const actionButton = hasAdminWriteAccess()
      ? `<button class="secondary-btn" type="button" data-admin-product-status="${escapeHtml(nextStatus)}" data-product-id="${escapeHtml(product.id)}">${escapeHtml(nextStatus)}</button>`
      : "";
    return `
      <div class="row">
        <span>${escapeHtml(product.name)} <small>${escapeHtml(product.code)}</small></span>
        <b class="${product.status === "active" ? "ok" : "warn"}">${escapeHtml(product.status)}</b>
        ${actionButton}
      </div>
    `;
  }

  function renderAdminPlanRow(plan) {
    const nextStatus = plan.status === "active" ? "hidden" : "active";
    const actionButton = hasAdminWriteAccess()
      ? `<button class="secondary-btn" type="button" data-admin-plan-status="${escapeHtml(nextStatus)}" data-plan-id="${escapeHtml(plan.id)}">${escapeHtml(nextStatus)}</button>`
      : "";
    return `
      <div class="row">
        <span>${escapeHtml(plan.products?.name || "ETX Product")} / ${escapeHtml(plan.name)}</span>
        <b>${escapeHtml(formatMoney(Number(plan.price_amount), plan.currency))}</b>
        ${actionButton}
      </div>
    `;
  }

  function renderAdminPaymentMethodRow(method) {
    const nextStatus = method.status === "active" ? "hidden" : "active";
    const actionButton = hasAdminWriteAccess()
      ? `<button class="secondary-btn" type="button" data-admin-method-status="${escapeHtml(nextStatus)}" data-method-id="${escapeHtml(method.id)}">${escapeHtml(nextStatus)}</button>`
      : `<span class="warn">View only</span>`;
    const account = [method.account_name, method.account_number].filter(Boolean).join(" / ") || "No account details";
    const network = method.network ? ` / ${method.network}` : "";

    return `
      <div class="approval-card">
        <div>
          <strong>${escapeHtml(method.name)}</strong>
          <p>${escapeHtml(account)}${escapeHtml(network)}</p>
          <p>${escapeHtml(method.instructions || "No instructions yet.")}</p>
        </div>
        <span class="${method.status === "active" ? "ok" : "warn"}">${escapeHtml(method.status)}</span>
        <b>${escapeHtml(method.method_key)}</b>
        ${actionButton}
      </div>
    `;
  }

  function renderDepositReviewCard(deposit) {
    const clientName = deposit.profiles?.full_name || deposit.profiles?.email || "Client";
    const clientEmail = deposit.profiles?.email || "No email";
    const methodName = deposit.payment_methods?.name || formatStatus(deposit.method || "deposit");
    const proofMeta = [deposit.proof_file_name, formatFileSize(deposit.proof_file_size), deposit.proof_file_type].filter(Boolean).join(" / ");
    const reviewNote = deposit.review_notes ? `<p>Review note: ${escapeHtml(deposit.review_notes)}</p>` : "";
    const paidCurrency = deposit.paid_currency || deposit.currency || "USD";
    const paidAmount = Number(deposit.paid_amount || deposit.amount || 0);
    const walletCredit = Number(deposit.wallet_credit_amount || deposit.amount || 0);
    const conversionMeta = paidCurrency === "PHP"
      ? `<p>Rate: ${escapeHtml(formatRate(deposit.exchange_rate))} + ${escapeHtml(formatRate(deposit.exchange_markup))} = ${escapeHtml(formatRate(deposit.platform_rate))} PHP/USD</p>`
      : `<p>Rate: 1 ${escapeHtml(paidCurrency)} = 1 USD</p>`;
    const proofButton = deposit.proof_path
      ? `<button class="secondary-btn" type="button" data-proof-path="${escapeHtml(deposit.proof_path)}" data-deposit-id="${escapeHtml(deposit.id)}">View Proof</button>`
      : `<span class="warn">No file</span>`;
    const canReview = ["pending", "under_review"].includes(deposit.status) && hasAdminWriteAccess();
    const reviewButtons = canReview
      ? `
        <label class="compact-field">USD Credit<input type="number" min="0.01" step="0.01" value="${escapeHtml(walletCredit)}" data-admin-credit-amount data-deposit-id="${escapeHtml(deposit.id)}" /></label>
        <button class="primary-btn" type="button" data-admin-approve data-deposit-id="${escapeHtml(deposit.id)}">Approve</button>
        <button class="secondary-btn" type="button" data-admin-reject data-deposit-id="${escapeHtml(deposit.id)}">Reject</button>
      `
      : `<span class="review-final-badge ${statusClass(deposit.status)}">${escapeHtml(deposit.status === "approved" ? "Credited final" : deposit.status === "rejected" ? "Correction requested" : "View only")}</span>`;
    const reviewedDate = deposit.reviewed_at ? `<p>Reviewed: ${escapeHtml(formatDateTime(deposit.reviewed_at))}</p>` : "";

    return `
      <div class="approval-card deposit-review-card ${canReview ? "review-open" : "review-final"}" data-deposit-card="${escapeHtml(deposit.id)}">
        <div>
          <strong>${escapeHtml(clientName)}</strong>
          <p>${escapeHtml(clientEmail)} / ${escapeHtml(formatDateTime(deposit.created_at))}</p>
          <p>Paid: ${escapeHtml(formatMoney(paidAmount, paidCurrency))}</p>
          <p>Wallet credit: ${escapeHtml(formatMoney(walletCredit, "USD"))}</p>
          ${conversionMeta}
          <p>Method: ${escapeHtml(methodName)}</p>
          <p>Ref: ${escapeHtml(deposit.transaction_reference || "No reference")}</p>
          <p>Proof: ${escapeHtml(proofMeta || "No metadata")}</p>
          ${reviewedDate}
          ${reviewNote}
        </div>
        <span class="${statusClass(deposit.status)}">${escapeHtml(formatStatus(deposit.status))}</span>
        ${proofButton}
        <button class="secondary-btn" type="button" data-deposit-audit="${escapeHtml(deposit.id)}">Audit</button>
        ${reviewButtons}
      </div>
    `;
  }

  function renderAdminWalletLedgerRow(transaction) {
    const clientName = transaction.profiles?.full_name || transaction.profiles?.email || "Client";
    const sign = transaction.direction === "credit" ? "+" : "-";
    const related = [transaction.related_table, shortId(transaction.related_id)].filter(Boolean).join(" / ");

    return `
      <div class="row report-row wallet-ledger-row">
        <span>${escapeHtml(clientName)} <small>${escapeHtml(transaction.description || formatStatus(transaction.type))} / ${escapeHtml(formatDateTime(transaction.created_at))}${related ? ` / ${escapeHtml(related)}` : ""}</small></span>
        <b class="${transaction.direction === "credit" ? "ok" : "warn"}">${sign}${escapeHtml(formatMoney(Number(transaction.amount || 0), transaction.currency || "USD"))} <small>Bal ${escapeHtml(formatMoney(Number(transaction.balance_after || 0), transaction.currency || "USD"))}</small></b>
      </div>
    `;
  }

  function renderAdminReferralRow(referral) {
    const referrer = referral.referrer?.full_name || referral.referrer?.email || "Referrer";
    const referred = referral.referred?.full_name || referral.referred?.email || "Client";
    const code = referral.referrer?.referral_code || "ETX";
    return `
      <div class="row">
        <span>${escapeHtml(referrer)} <small>${escapeHtml(code)} -> ${escapeHtml(referred)}</small></span>
        <b class="${statusClass(referral.commission_status)}">${escapeHtml(formatMoney(Number(referral.commission_amount), referral.orders?.currency || "USD"))} / ${escapeHtml(formatStatus(referral.commission_status))}</b>
      </div>
    `;
  }

  function buildClientRows(profiles, subscriptions, payments) {
    return profiles.map((profile) => {
      const active = subscriptions.find((subscription) => subscription.profiles?.email === profile.email && ["active", "trial"].includes(subscription.status));
      const review = payments.find((payment) => payment.profiles?.email === profile.email && ["pending", "under_review"].includes(payment.status));
      const label = profile.full_name || profile.email || "Client";
      const balance = formatMoney(Number(profile.wallet_balance || 0), "USD");
      const status = active ? `active / ${balance}` : review ? `purchase review / ${balance}` : `wallet ${balance}`;
      const tone = active ? "ok" : review ? "warn" : "";
      return [label, status, tone];
    });
  }

  function buildExpiringRows(subscriptions) {
    return subscriptions
      .filter((subscription) => ["active", "trial"].includes(subscription.status) && isWithinDays(subscription.expires_at, 7))
      .map((subscription) => {
        const clientName = subscription.profiles?.full_name || subscription.profiles?.email || "Client";
        const product = subscription.products?.name || "ETX Product";
        const days = daysUntil(subscription.expires_at);
        return [`${product} - ${clientName}`, `${days} days`, "warn"];
      });
  }

  function renderAdminSubscriptionRow(subscription) {
    const clientName = subscription.profiles?.full_name || subscription.profiles?.email || "Client";
    const product = subscription.products?.name || "ETX Product";
    return `<div class="row"><span>${escapeHtml(product)} <small>${escapeHtml(clientName)}</small></span><b class="${statusClass(subscription.status)}">${escapeHtml(formatStatus(subscription.status))} until ${escapeHtml(formatDate(subscription.expires_at))}</b></div>`;
  }

  function renderCommissionReviewCard(request) {
    const clientName = request.profiles?.full_name || request.profiles?.email || "Client";
    const canReview = request.status === "requested" && hasAdminWriteAccess();
    const actions = canReview
      ? `
        <button class="primary-btn" type="button" data-admin-commission-approve data-request-id="${escapeHtml(request.id)}">Approve</button>
        <button class="secondary-btn" type="button" data-admin-commission-reject data-request-id="${escapeHtml(request.id)}">Reject</button>
      `
      : `<span class="${statusClass(request.status)}">${hasAdminWriteAccess() ? "Final" : "View only"}</span>`;
    return `
      <div class="approval-card" data-commission-card="${escapeHtml(request.id)}">
        <div>
          <strong>${escapeHtml(clientName)}</strong>
          <p>${escapeHtml(request.payout_method)} / ${escapeHtml(request.payout_details || "No payout notes")}</p>
        </div>
        <span class="${statusClass(request.status)}">${escapeHtml(formatStatus(request.status))}</span>
        <strong>${escapeHtml(formatMoney(Number(request.amount), "USD"))}</strong>
        ${actions}
      </div>
    `;
  }

  function renderSupportReviewCard(ticket) {
    const clientName = ticket.profiles?.full_name || ticket.profiles?.email || "Client";
    const canWork = !["resolved", "closed"].includes(ticket.status);
    const replies = (ticket.support_replies || [])
      .slice()
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const latestReply = replies[replies.length - 1];
    return `
      <div class="approval-card" data-ticket-card="${escapeHtml(ticket.id)}">
        <div>
          <strong>${escapeHtml(ticket.subject)}</strong>
          <p>${escapeHtml(clientName)} / ${escapeHtml(ticket.message)}</p>
          ${latestReply ? `<p>Latest reply: ${escapeHtml(latestReply.message)}</p>` : `<p>No replies yet.</p>`}
          <form class="reply-form admin-reply-form" data-admin-support-reply-form data-ticket-id="${escapeHtml(ticket.id)}">
            <textarea name="reply" placeholder="${canWork ? "Reply to client..." : "Ticket is already closed."}" ${canWork ? "required" : "disabled"}></textarea>
            <button class="secondary-btn" type="submit" ${canWork ? "" : "disabled"}>Send Reply</button>
          </form>
        </div>
        <span class="${statusClass(ticket.status)}">${escapeHtml(formatStatus(ticket.status))}</span>
        <button class="secondary-btn" type="button" data-admin-ticket-status="pending_client" data-ticket-id="${escapeHtml(ticket.id)}"${canWork ? "" : " disabled"}>Need Client</button>
        <button class="primary-btn" type="button" data-admin-ticket-status="resolved" data-ticket-id="${escapeHtml(ticket.id)}"${canWork ? "" : " disabled"}>Resolve</button>
      </div>
    `;
  }

  function renderAdminNotificationRow(notification) {
    const recipient = notification.recipient?.full_name || notification.recipient?.email || "Client";
    return `
      <div class="notice-row admin-notice ${notification.status === "unread" ? "warn" : "ok"}">
        <strong>${escapeHtml(notification.title)}</strong>
        <small>${escapeHtml(recipient)} / ${escapeHtml(formatStatus(notification.category))} / ${escapeHtml(formatDateTime(notification.created_at))}</small>
        <span>${escapeHtml(notification.message)}</span>
      </div>
    `;
  }

  function hydrateAdminProductOptions(products) {
    if (!adminPlanProductSelect) return;
    adminPlanProductSelect.innerHTML = products
      .map((product) => `<option value="${escapeHtml(product.id)}">${escapeHtml(product.name)}</option>`)
      .join("");
  }

  function renderList(selector, rows, renderer, emptyText) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.innerHTML = rows?.length ? rows.map(renderer).join("") : `<p class="codebox">${escapeHtml(emptyText)}</p>`;
  }

  function renderListElement(target, rows, renderer, emptyText) {
    if (!target) return;
    target.innerHTML = rows?.length ? rows.map(renderer).join("") : `<p class="codebox">${escapeHtml(emptyText)}</p>`;
  }

  async function withButtonLoading(button, loadingText, action, fallbackError = "Action could not be completed.") {
    if (!button) {
      try {
        return await action();
      } catch (error) {
        setStatus(error?.message || fallbackError, "warn");
        return null;
      }
    }

    if (button.disabled && button.dataset.busy === "true") return null;

    const originalText = button.textContent;
    button.disabled = true;
    button.dataset.busy = "true";
    button.classList.add("is-processing");
    button.textContent = loadingText;

    try {
      return await action();
    } catch (error) {
      setStatus(error?.message || fallbackError, "warn");
      return null;
    } finally {
      button.disabled = false;
      button.dataset.busy = "false";
      button.classList.remove("is-processing");
      button.textContent = originalText;
    }
  }

  async function copyText(value, successMessage = "Copied.") {
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }
      setStatus(successMessage, "ok");
    } catch (error) {
      setStatus("Copy failed. Please copy the detail manually.", "warn");
    }
  }

  function setStatus(message, tone) {
    authStatuses.forEach((authStatus) => {
      const isPortalStatus = authStatus.classList.contains("portal-status");
      authStatus.textContent = message;
      authStatus.className = `codebox${isPortalStatus ? " portal-status" : ""}${tone ? ` ${tone}` : ""}`;
    });
    showToast(message, tone);
  }

  function showToast(message, tone = "info") {
    const text = String(message || "").trim();
    if (!text || text.toLowerCase().startsWith("checking ")) return;

    const host = getToastHost();
    const toast = document.createElement("div");
    const normalizedTone = tone === "ok" ? "ok" : tone === "warn" || tone === "rejected" ? "warn" : "info";
    toast.className = `toast ${normalizedTone}`;
    toast.setAttribute("role", normalizedTone === "warn" ? "alert" : "status");
    toast.innerHTML = `
      <span>${escapeHtml(toastTitle(normalizedTone))}</span>
      <strong>${escapeHtml(text)}</strong>
    `;
    host.appendChild(toast);

    while (host.children.length > 4) {
      host.firstElementChild?.remove();
    }

    window.setTimeout(() => {
      toast.classList.add("leaving");
      window.setTimeout(() => toast.remove(), 220);
    }, normalizedTone === "warn" ? 5200 : 3600);
  }

  function getToastHost() {
    if (toastHost) return toastHost;
    toastHost = document.createElement("div");
    toastHost.className = "toast-stack";
    toastHost.setAttribute("aria-live", "polite");
    document.body.appendChild(toastHost);
    return toastHost;
  }

  function toastTitle(tone) {
    if (tone === "ok") return "Success";
    if (tone === "warn") return "Needs attention";
    return "Working";
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((target) => {
      target.textContent = value;
    });
  }

  function setField(form, name, value) {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) field.value = value;
  }

  function makeReferralCode(seed) {
    const safeSeed = String(seed).split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "ETX";
    return `${safeSeed}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  function formatMoney(amount, currency) {
    return formatCurrencyValue(amount, currency, true);
  }

  function formatReportMoney(amount, currency) {
    return formatCurrencyValue(amount, currency, false);
  }

  function formatCurrencyValue(amount, currency, zeroAsFree) {
    const value = Number(amount || 0);
    const code = String(currency || "USD").toUpperCase();
    if (zeroAsFree && value === 0) return "Free";

    if (code === "USDT") {
      return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} USDT`;
    }

    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(value);
    } catch (error) {
      return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} ${code}`;
    }
  }

  function roundMoney(amount) {
    return Math.round((Number(amount || 0) + Number.EPSILON) * 100) / 100;
  }

  function formatRate(rate) {
    const value = Number(rate || 0);
    return value ? value.toFixed(4) : "0.0000";
  }

  function formatFileSize(size) {
    const bytes = Number(size || 0);
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : "No expiry";
  }

  function formatDateTime(value) {
    return value ? new Date(value).toLocaleString() : "Just now";
  }

  function todayInputValue() {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
  }

  function shortId(value) {
    if (!value) return "n/a";
    const text = String(value);
    return text.length > 8 ? text.slice(0, 8) : text;
  }

  function daysUntil(value) {
    if (!value) return "--";
    return Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 86400000));
  }

  function isToday(value) {
    if (!value) return false;
    const date = new Date(value);
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  }

  function isWithinDays(value, days) {
    if (!value) return false;
    const date = new Date(value);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return diff >= 0 && diff <= days * 86400000;
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function csvCell(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
