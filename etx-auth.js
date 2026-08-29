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
  const adminReviewNotes = document.getElementById("admin-review-notes");
  const adminPlanProductSelect = document.querySelector("[data-admin-plan-product]");
  const adminReferralList = document.querySelector("[data-admin-referral-list]");
  const adminCommissionQueue = document.querySelector("[data-admin-commission-queue]");
  const adminSupportQueue = document.querySelector("[data-admin-support-queue]");
  const adminPriorityList = document.querySelector("[data-admin-priority-list]");
  const adminHealthList = document.querySelector("[data-admin-health-list]");
  const adminRevenueList = document.querySelector("[data-admin-revenue-list]");
  const reportRangeFilter = document.querySelector("[data-report-range]");
  const reportStatusFilter = document.querySelector("[data-report-status]");
  const reportMethodFilter = document.querySelector("[data-report-method]");
  const reportSearchFilter = document.querySelector("[data-report-search]");
  const reportDepositsList = document.querySelector("[data-report-deposits-list]");
  const reportSubscriptionsList = document.querySelector("[data-report-subscriptions-list]");
  const reportReferralsList = document.querySelector("[data-report-referrals-list]");
  const adminClientsList = document.querySelector("[data-admin-clients-list]");
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
  const walletTransactionsList = document.querySelector("[data-wallet-transactions-list]");
  const depositRequestsList = document.querySelector("[data-deposit-requests-list]");
  const commissionForm = document.querySelector("[data-commission-form]");
  const supportForm = document.querySelector("[data-support-form]");
  const supportThread = document.querySelector("[data-support-thread]");
  const clientNotifications = document.querySelector("[data-client-notifications]");
  const notificationBadge = document.querySelector("[data-notification-badge]");
  const notificationButton = document.querySelector("[data-notification-button]");
  const markNotificationsReadButton = document.querySelector("[data-mark-notifications-read]");
  const aiChatForm = document.querySelector("[data-ai-chat-form]");
  const aiChatMessages = document.querySelector("[data-ai-chat-messages]");
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
  let supportTicketsCache = [];
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
    bindDepositEstimate();
    bindNotificationActions();
    bindCommissionForm();
    bindSupportForm();
    bindAiSupportChat();
    bindAdminForms();
    bindExchangeRateForm();
    bindAdminRoleForm();
    bindReportFilters();
    bindReportExports();
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
  }

  function bindAuthForms() {
    if (signInForm) {
      signInForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = new FormData(signInForm);
        setStatus("Signing in...");

        const { error } = await client.auth.signInWithPassword({
          email: String(form.get("email") || "").trim(),
          password: String(form.get("password") || ""),
        });

        setStatus(error ? error.message : "Signed in successfully.", error ? "warn" : "ok");
      });
    }

    if (signUpForm) {
      signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();
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
  }

  function bindPaymentForm() {
    if (!paymentForm) return;

    paymentForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!currentUser) {
        setStatus("Please sign in before submitting a deposit.", "warn");
        return;
      }

      const form = new FormData(paymentForm);
      const selectedMethod = paymentMethodsCache.find((method) => method.method_key === String(form.get("method") || ""));
      if (!selectedMethod) {
        setStatus("Select an active deposit method first.", "warn");
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
  }

  function bindWalletPurchase() {
    if (!walletPurchaseButton) return;

    walletPurchaseButton.addEventListener("click", async () => {
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
        setClientFlow("payment", "Deposit funds first. Products can only be purchased using approved wallet balance.");
        goToTab("payments");
        return;
      }

      const { data, error } = await client.rpc("purchase_plan_with_wallet", {
        target_plan_id: currentPlan.id,
        referral_code: String(walletReferralCode?.value || referredByCode || "").trim().toUpperCase() || null,
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
      goToTab("subscriptions");
      await hydrateClientData();
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
    if (!markNotificationsReadButton) return;
    markNotificationsReadButton.addEventListener("click", markClientNotificationsRead);
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
  }

  function bindSupportForm() {
    if (!supportForm) return;

    supportForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!currentUser) {
        setStatus("Please sign in before sending a support request.", "warn");
        return;
      }

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
  }

  function bindAiSupportChat() {
    if (!aiChatForm || !aiChatMessages) return;

    aiChatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(aiChatForm);
      const question = String(form.get("message") || "").trim();
      if (!question) return;

      appendAiMessage(question, "user");
      appendAiMessage(getFaqAnswer(question), "bot");
      aiChatForm.reset();
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    });
  }

  function appendAiMessage(message, role) {
    if (!aiChatMessages) return;
    const bubble = document.createElement("div");
    bubble.className = `ai-message ${role}`;
    bubble.textContent = message;
    aiChatMessages.appendChild(bubble);
  }

  function getFaqAnswer(question) {
    const text = question.toLowerCase();

    if (text.includes("deposit") || text.includes("top up") || text.includes("payment") || text.includes("bayad") || text.includes("proof") || text.includes("gcash") || text.includes("bpi") || text.includes("usdt")) {
      return "For deposits: open Wallet / Deposit, select a method, enter paid amount and reference, then upload proof. GCash/BPI PHP deposits are converted to USD using the platform rate. USDT is credited 1:1 after admin approval.";
    }

    if (text.includes("subscribe") || text.includes("subscription") || text.includes("plan") || text.includes("buy")) {
      return "For subscriptions: deposit funds first, wait for admin approval, then go to Subscribe / Buy and purchase your ETX plan using wallet balance.";
    }

    if (text.includes("referral") || text.includes("refer") || text.includes("commission") || text.includes("withdraw")) {
      return "For referrals: copy your referral link from the Referral page. You earn 5% when a referred client buys a plan using wallet balance. Withdrawal requests are reviewed by admin.";
    }

    if (text.includes("verify") || text.includes("verification") || text.includes("approved") || text.includes("pending") || text.includes("rejected")) {
      return "Verification status appears in Wallet and Notifications. Pending means admin is reviewing your deposit. Approved credits your wallet. Rejected means you need to resend corrected proof or details.";
    }

    if (text.includes("login") || text.includes("account") || text.includes("password") || text.includes("profile")) {
      return "For account concerns: check your Profile details after login. If you cannot access your account, send a support ticket with your email and Telegram username.";
    }

    if (text.includes("support") || text.includes("help") || text.includes("ticket")) {
      return "For manual help, submit a Support Request below this chat. Include your plan, deposit reference, and a short explanation so ETX can review faster.";
    }

    return "I can help with ETX wallet deposits, subscriptions, referrals, verification, login, and support tickets. For account-specific concerns, send a support request below.";
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

        const { error } = await client.from("products").upsert(payload, { onConflict: "code" });
        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        adminProductForm.reset();
        setStatus("Product saved.", "ok");
        await loadAdminData();
        await loadPlans();
      });
    }

    if (adminPlanForm) {
      adminPlanForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!requireAdminWrite()) return;

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

        const { error } = await client.from("plans").insert(payload);
        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        adminPlanForm.reset();
        setStatus("Plan created.", "ok");
        await loadAdminData();
        await loadPlans();
      });
    }

    if (adminPaymentMethodForm) {
      adminPaymentMethodForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!requireAdminWrite()) return;

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

        const { error } = await client.from("payment_methods").upsert(payload, { onConflict: "method_key" });
        if (error) {
          setStatus(error.message, "warn");
          return;
        }

        adminPaymentMethodForm.reset();
        setStatus("Payment method saved.", "ok");
        await loadPaymentMethods();
        await loadAdminData();
      });
    }
  }

  function bindExchangeRateForm() {
    if (fetchLiveRateButton) {
      fetchLiveRateButton.addEventListener("click", async () => {
        if (!requireAdminWrite()) return;

        fetchLiveRateButton.disabled = true;
        setStatus("Fetching live USD/PHP rate...");
        try {
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
          setStatus("Live USD/PHP rate loaded. Review markup, then save.", "ok");
        } catch (error) {
          setStatus(error.message, "warn");
        } finally {
          fetchLiveRateButton.disabled = false;
        }
      });
    }

    if (!adminExchangeRateForm) return;

    adminExchangeRateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireAdminWrite()) return;

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
      await logAdminAction("exchange_rate.updated", "exchange_rates", null);
      setStatus("Conversion rate saved.", "ok");
      await loadAdminData();
    });
  }

  function bindAdminRoleForm() {
    if (!adminRoleForm) return;

    adminRoleForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!requireSuperUser()) return;

      const form = new FormData(adminRoleForm);
      const roleKey = normalizeRoleKey(form.get("role_key"));
      const payload = {
        name: String(form.get("name") || "").trim(),
        role_key: roleKey,
        description: String(form.get("description") || "").trim(),
        created_by: currentUser.id,
      };

      const { error } = await client.from("admin_roles").upsert(payload, { onConflict: "role_key" });
      if (error) {
        setStatus(error.message, "warn");
        return;
      }

      adminRoleForm.reset();
      setStatus("Role saved. Assign the matching app_metadata role after final permission mapping.", "ok");
      await loadAdminRoles();
    });
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

    dynamicPlanGrid.innerHTML = data.map(renderPlanCard).join("");
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
        };

        if (selectedPlan) {
          selectedPlan.textContent = `${currentPlan.product_name} - ${currentPlan.name} - ${formatMoney(currentPlan.price_amount, currentPlan.currency)}`;
        }

        if (paymentContext) {
          paymentContext.textContent = `Wallet deposit mode. Approved balance required before buying ${currentPlan.product_name} / ${currentPlan.name}.`;
        }

        setStatus("Plan selected. Buy with wallet balance or deposit funds first.", "ok");
        setClientFlow("payment", "Plan selected. Use approved wallet balance to buy, or deposit funds first.");
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

    const account = method.account_number ? method.account_number : "Admin will provide the final account details.";
    const meta = [method.account_name, method.network].filter(Boolean).join(" / ");
    const paidCurrency = getDepositCurrency(method);
    const currencyNote = paidCurrency === "PHP" ? `Enter PHP amount. Platform rate: ${formatRate(getPlatformRate())} PHP per USD.` : "Enter USDT amount. Wallet credit is 1:1 USD.";
    const qr = method.qr_image_url
      ? `<a href="${escapeHtml(method.qr_image_url)}" target="_blank" rel="noopener">Open QR / payment image</a>`
      : "";

    paymentMethodDetails.innerHTML = `
      <strong>${escapeHtml(method.name)}</strong>
      <span>${escapeHtml(meta || method.type)}</span>
      <span>${escapeHtml(account)}</span>
      <span>${escapeHtml(currencyNote)}</span>
      <small>${escapeHtml(method.instructions || "Send exact top-up amount, then upload proof for verification.")}</small>
      ${qr}
    `;
  }

  async function hydrateClientData() {
    if (!currentUser) return;

    const [profile, orders, payments, subscriptions, referrals, commissionRequests, supportTickets, notifications, deposits, walletTransactions] = await Promise.all([
      client.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
      client.from("orders").select("id,status,total_amount,currency,created_at,plans(name,products(name))").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("payments").select("id,status,amount,currency,method,transaction_reference,proof_file_name,proof_file_size,proof_file_type,resubmitted_from,review_notes,created_at,payment_methods(name,network),orders(plans(name,products(name)))").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("subscriptions").select("status,expires_at,products(name),plans(name)").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("referrals").select("commission_amount,commission_status").eq("referrer_id", currentUser.id),
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

    const [products, plans, paymentMethods, payments, deposits, walletTransactions, referrals, commissionRequests, supportTickets, subscriptions, orders, profiles, notifications, roles, exchangeRates] = await Promise.all([
      client.from("products").select("*").order("sort_order", { ascending: true }),
      client.from("plans").select("*,products(name,code)").order("created_at", { ascending: false }),
      client.from("payment_methods").select("*").order("sort_order", { ascending: true }),
      client
        .from("payments")
        .select("*,payment_methods(name,network),orders(id,status,total_amount,currency,plan_id,plans(name,duration_days,bonus_days,product_id,products(name))),profiles!payments_client_id_fkey(full_name,email,telegram_username)")
        .order("created_at", { ascending: false })
        .limit(30),
      client
        .from("deposit_requests")
        .select("*,payment_methods(name,network),profiles!deposit_requests_client_id_fkey(full_name,email,telegram_username)")
        .order("created_at", { ascending: false })
        .limit(30),
      client
        .from("wallet_transactions")
        .select("*,profiles!wallet_transactions_client_id_fkey(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(50),
      client
        .from("referrals")
        .select("id,commission_amount,commission_status,created_at,referrer:profiles!referrals_referrer_id_fkey(full_name,email,referral_code),referred:profiles!referrals_referred_client_id_fkey(full_name,email),orders(total_amount,currency)")
        .order("created_at", { ascending: false })
        .limit(30),
      client
        .from("commission_requests")
        .select("id,client_id,amount,status,payout_method,payout_details,created_at,profiles!commission_requests_client_id_fkey(full_name,email,telegram_username)")
        .order("created_at", { ascending: false })
        .limit(30),
      client
        .from("support_tickets")
        .select("id,client_id,subject,message,status,created_at,updated_at,profiles!support_tickets_client_id_fkey(full_name,email,telegram_username),support_replies(id,author_id,message,is_admin_reply,created_at)")
        .order("created_at", { ascending: false })
        .limit(30),
      client
        .from("subscriptions")
        .select("id,status,expires_at,created_at,products(name),plans(name),profiles!subscriptions_client_id_fkey(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(100),
      client
        .from("orders")
        .select("id,status,total_amount,currency,created_at,plans(name,products(name)),profiles!orders_client_id_fkey(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(100),
      client
        .from("profiles")
        .select("id,full_name,email,telegram_username,role,created_at,referral_code,wallet_balance")
        .eq("role", "client")
        .order("created_at", { ascending: false })
        .limit(100),
      client
        .from("notifications")
        .select("*,recipient:profiles!notifications_recipient_id_fkey(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(20),
      roleRequest,
      client.from("exchange_rates").select("*").eq("quote_currency", "PHP").maybeSingle(),
    ]);

    if (products.error || plans.error || paymentMethods.error || payments.error || deposits.error || walletTransactions.error || referrals.error || commissionRequests.error || supportTickets.error || subscriptions.error || orders.error || profiles.error || notifications.error || roles.error || exchangeRates.error) {
      setStatus(products.error?.message || plans.error?.message || paymentMethods.error?.message || payments.error?.message || deposits.error?.message || walletTransactions.error?.message || referrals.error?.message || commissionRequests.error?.message || supportTickets.error?.message || subscriptions.error?.message || orders.error?.message || profiles.error?.message || notifications.error?.message || roles.error?.message || exchangeRates.error?.message, "warn");
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
    renderListElement(adminPaymentQueue, deposits.data, renderDepositReviewCard, "No deposits in queue.");
    renderListElement(adminReferralList, referrals.data, renderAdminReferralRow, "No referral records yet.");
    renderListElement(adminCommissionQueue, commissionRequests.data, renderCommissionReviewCard, "No withdrawal requests yet.");
    renderListElement(adminSupportQueue, supportTickets.data, renderSupportReviewCard, "No support tickets yet.");
    renderListElement(adminClientsList, buildClientRows(profiles.data || [], subscriptions.data || [], payments.data || []), renderMetricRow, "No client accounts yet.");
    renderListElement(adminSubscriptionsList, subscriptions.data, renderAdminSubscriptionRow, "No subscriptions yet.");
    renderListElement(adminExpiringList, buildExpiringRows(subscriptions.data || []), renderMetricRow, "No renewals due yet.");
    renderListElement(adminNotificationsList, notifications.data, renderAdminNotificationRow, "No notifications yet.");
    renderListElement(adminRolesList, roles.data, renderAdminRoleRow, "No custom roles yet.");
    updateBadge(adminNotificationBadge, (notifications.data || []).filter((notification) => notification.status === "unread").length);
    hydrateAdminProductOptions(products.data || []);
    bindAdminPaymentActions();
    bindAdminPaymentMethodActions();
    bindAdminCommissionActions();
    bindAdminSupportActions();
    adminReportSnapshot = {
      products: products.data || [],
      plans: plans.data || [],
      paymentMethods: paymentMethods.data || [],
      payments: payments.data || [],
      deposits: deposits.data || [],
      walletTransactions: walletTransactions.data || [],
      referrals: referrals.data || [],
      commissionRequests: commissionRequests.data || [],
      supportTickets: supportTickets.data || [],
      subscriptions: subscriptions.data || [],
      orders: orders.data || [],
      profiles: profiles.data || [],
      notifications: notifications.data || [],
      roles: roles.data || [],
      exchangeRates: exchangeRates.data ? [exchangeRates.data] : [],
    };
    renderAdminReports(adminReportSnapshot);
    paymentMethodsCache = paymentMethods.data || [];
    renderPaymentMethodOptions();
  }

  function bindAdminPaymentActions() {
    document.querySelectorAll("[data-admin-approve], [data-admin-reject], [data-proof-path], [data-admin-product-status], [data-admin-plan-status]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (button.hasAttribute("data-proof-path")) {
          if (!requireAdmin()) return;
          await openProof(button.dataset.proofPath);
          return;
        }

        if (!requireAdminWrite()) return;

        if (button.hasAttribute("data-admin-product-status")) {
          await updateRecordStatus("products", button.dataset.productId, button.dataset.adminProductStatus);
          return;
        }

        if (button.hasAttribute("data-admin-plan-status")) {
          await updateRecordStatus("plans", button.dataset.planId, button.dataset.adminPlanStatus);
          return;
        }

        const depositId = button.dataset.depositId;
        if (button.hasAttribute("data-admin-approve")) {
          await approveDeposit(depositId);
          return;
        }

        await rejectDeposit(depositId);
      });
    });
  }

  function bindAdminPaymentMethodActions() {
    document.querySelectorAll("[data-admin-method-status]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!requireAdminWrite()) return;
        await updateRecordStatus("payment_methods", button.dataset.methodId, button.dataset.adminMethodStatus);
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

  function renderAdminReports(snapshot) {
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

    setText("[data-report-pending-payments]", String(pendingDeposits.length));
    setText("[data-report-active-subscriptions]", String(activeSubscriptions.length));
    setText("[data-report-approved-revenue]", formatMoney(approvedRevenue, "USD"));
    setText("[data-report-payments-today]", String(paymentsToday.length));
    setText("[data-report-pending-revenue]", formatMoney(pendingRevenue, "USD"));
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
        ["Commission liability", formatMoney(commissionLiability, "USD"), commissionLiability ? "warn" : "ok"],
        ["Approved deposits", String(filtered.deposits.filter((deposit) => deposit.status === "approved").length), "ok"],
        ["PHP deposits", formatMoney(sumDepositsByCurrency(filtered.deposits, "PHP"), "PHP"), "warn"],
        ["USDT deposits", formatMoney(sumDepositsByCurrency(filtered.deposits, "USDT"), "USD"), "ok"],
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

  function bindReportExports() {
    reportExportButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (!requireAdmin()) return;
        if (!adminReportSnapshot) {
          setStatus("Reports are still loading. Try again after the admin dashboard loads.", "warn");
          return;
        }

        const type = button.dataset.reportExport;
        const rows = buildExportRows(type, getFilteredReportSnapshot() || adminReportSnapshot);
        downloadCsv(`etx-${type}-report.csv`, rows);
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

  function renderMetricRow([label, value, tone]) {
    return `<div class="row"><span>${escapeHtml(label)}</span><b class="${escapeHtml(tone || "")}">${escapeHtml(value)}</b></div>`;
  }

  function bindAdminCommissionActions() {
    document.querySelectorAll("[data-admin-commission-approve], [data-admin-commission-reject]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!requireAdminWrite()) return;

        if (button.hasAttribute("data-admin-commission-approve")) {
          await updateCommissionRequest(button.dataset.requestId, "approved");
          return;
        }

        await updateCommissionRequest(button.dataset.requestId, "rejected");
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

    await logAdminAction(`commission.${status}`, "commission_requests", requestId);
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
        await updateSupportTicket(button.dataset.ticketId, button.dataset.adminTicketStatus);
      });
    });

    document.querySelectorAll("[data-admin-support-reply-form]").forEach((form) => {
      if (form.dataset.bound === "true") return;
      form.dataset.bound = "true";
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!requireSupportAccess()) return;

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

        await logAdminAction("support.reply", "support_tickets", ticketId);
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

    await logAdminAction(`support.${status}`, "support_tickets", ticketId);
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

    await logAdminAction(`${table}.${status}`, table, id);
    setStatus(`${table.slice(0, -1)} marked as ${status}.`, "ok");
    await loadAdminData();
    await loadPlans();
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

    await logAdminAction("deposit.approved", "deposit_requests", deposit.id);
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

    await logAdminAction("deposit.rejected", "deposit_requests", depositId);
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

  async function logAdminAction(action, entityTable, entityId) {
    await client.from("audit_logs").insert({
      actor_id: currentUser.id,
      action,
      entity_table: entityTable,
      entity_id: entityId,
    });
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
    if (["rejected", "cancelled", "expired"].includes(status)) return "rejected";
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
    const canReview = deposit.status === "under_review" && hasAdminWriteAccess();
    const reviewButtons = canReview
      ? `
        <label class="compact-field">USD Credit<input type="number" min="0.01" step="0.01" value="${escapeHtml(walletCredit)}" data-admin-credit-amount data-deposit-id="${escapeHtml(deposit.id)}" /></label>
        <button class="primary-btn" type="button" data-admin-approve data-deposit-id="${escapeHtml(deposit.id)}">Approve</button>
        <button class="secondary-btn" type="button" data-admin-reject data-deposit-id="${escapeHtml(deposit.id)}">Reject</button>
      `
      : `<span class="${deposit.status === "approved" ? "ok" : deposit.status === "rejected" ? "rejected" : "warn"}">${escapeHtml(deposit.status === "under_review" ? "Review only" : "Final")}</span>`;

    return `
      <div class="approval-card" data-deposit-card="${escapeHtml(deposit.id)}">
        <div>
          <strong>${escapeHtml(clientName)}</strong>
          <p>Paid: ${escapeHtml(formatMoney(paidAmount, paidCurrency))}</p>
          <p>Wallet credit: ${escapeHtml(formatMoney(walletCredit, "USD"))}</p>
          ${conversionMeta}
          <p>Method: ${escapeHtml(methodName)}</p>
          <p>Ref: ${escapeHtml(deposit.transaction_reference || "No reference")}</p>
          <p>Proof: ${escapeHtml(proofMeta || "No metadata")}</p>
          ${reviewNote}
        </div>
        <span class="${deposit.status === "approved" ? "ok" : deposit.status === "rejected" ? "rejected" : "warn"}">${escapeHtml(deposit.status)}</span>
        ${proofButton}
        ${reviewButtons}
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

  function setStatus(message, tone) {
    authStatuses.forEach((authStatus) => {
      const isPortalStatus = authStatus.classList.contains("portal-status");
      authStatus.textContent = message;
      authStatus.className = `codebox${isPortalStatus ? " portal-status" : ""}${tone ? ` ${tone}` : ""}`;
    });
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
    if (Number(amount) === 0) return "Free";
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
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
