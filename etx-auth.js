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
  const adminGate = document.querySelector("[data-admin-gate]");
  const adminAuthGate = document.querySelector("[data-admin-auth-gate]");
  const adminShell = document.querySelector("[data-admin-shell]");
  const adminProductForm = document.querySelector("[data-admin-product-form]");
  const adminPlanForm = document.querySelector("[data-admin-plan-form]");
  const adminRoleForm = document.querySelector("[data-admin-role-form]");
  const adminProductsList = document.querySelector("[data-admin-products-list]");
  const adminPlansList = document.querySelector("[data-admin-plans-list]");
  const adminPaymentQueue = document.querySelector("[data-admin-payment-queue]");
  const adminPlanProductSelect = document.querySelector("[data-admin-plan-product]");
  const adminReferralList = document.querySelector("[data-admin-referral-list]");
  const adminCommissionQueue = document.querySelector("[data-admin-commission-queue]");
  const adminSupportQueue = document.querySelector("[data-admin-support-queue]");
  const adminPriorityList = document.querySelector("[data-admin-priority-list]");
  const adminHealthList = document.querySelector("[data-admin-health-list]");
  const adminRevenueList = document.querySelector("[data-admin-revenue-list]");
  const adminClientsList = document.querySelector("[data-admin-clients-list]");
  const adminSubscriptionsList = document.querySelector("[data-admin-subscriptions-list]");
  const adminExpiringList = document.querySelector("[data-admin-expiring-list]");
  const adminRolesList = document.querySelector("[data-admin-roles-list]");
  const superUserOnlyItems = document.querySelectorAll("[data-super-user-only]");
  const adminOpsOnlyItems = document.querySelectorAll(".admin-sidebar [data-tab]:not([data-super-user-only]), .portal-tab:not(#admin-roles)");
  const reportExportButtons = document.querySelectorAll("[data-report-export]");
  const clientAuthGate = document.querySelector("[data-client-auth-gate]");
  const clientAppShell = document.querySelector("[data-client-app-shell]");
  const clientFlowAlert = document.querySelector("[data-client-flow-alert]");
  const paymentContext = document.querySelector("[data-payment-context]");
  const clientNextActions = document.querySelector("[data-client-next-actions]");
  const commissionForm = document.querySelector("[data-commission-form]");
  const supportForm = document.querySelector("[data-support-form]");
  const clientNotifications = document.querySelector("[data-client-notifications]");

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
  let availableCommission = 0;
  let adminReportSnapshot = null;
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
    bindCommissionForm();
    bindSupportForm();
    bindAdminForms();
    bindAdminRoleForm();
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
        setStatus("Please sign in before submitting payment proof.", "warn");
        return;
      }

      if (!currentPlan) {
        setStatus("Select a product plan first.", "warn");
        return;
      }

      const form = new FormData(paymentForm);
      const { data: order, error: orderError } = await client
        .from("orders")
        .insert({
          client_id: currentUser.id,
          plan_id: currentPlan.id,
          total_amount: currentPlan.price_amount,
          currency: currentPlan.currency,
          referral_code_used: String(form.get("referral_code") || referredByCode || "").trim().toUpperCase() || null,
          notes: `Client selected ${currentPlan.product_name} / ${currentPlan.name}`,
        })
        .select()
        .single();

      if (orderError) {
        setStatus(orderError.message, "warn");
        return;
      }

      const file = paymentForm.querySelector('input[type="file"]')?.files?.[0];
      let proofPath = null;
      try {
        proofPath = file ? await uploadPaymentProof(file) : null;
      } catch (error) {
        setStatus(error.message, "warn");
        return;
      }
      const { error: paymentError } = await client.from("payments").insert({
        order_id: order.id,
        client_id: currentUser.id,
        method: String(form.get("method") || "gcash"),
        status: "under_review",
        amount: Number(form.get("amount") || currentPlan.price_amount),
        currency: currentPlan.currency,
        transaction_reference: String(form.get("transaction_reference") || "").trim(),
        proof_path: proofPath,
      });

      if (paymentError) {
        setStatus(paymentError.message, "warn");
        return;
      }

      paymentForm.reset();
      setStatus("Payment submitted for admin review.", "ok");
      setClientFlow("verification", "Payment received. Please wait while admin verifies your payment proof.");
      goToTab("subscriptions");
      await hydrateClientData();
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
      const { error } = await client.from("support_tickets").insert({
        client_id: currentUser.id,
        subject: String(form.get("subject") || "").trim(),
        message: String(form.get("message") || "").trim(),
        status: "open",
      });

      if (error) {
        setStatus(error.message, "warn");
        return;
      }

      supportForm.reset();
      setStatus("Support ticket submitted. ETX admin will review it.", "ok");
      goToTab("support");
      await hydrateClientData();
    });
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
        if (!requireAdmin()) return;

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
        if (!requireAdmin()) return;

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
    if (existing) return existing;

    const meta = user.user_metadata || {};
    const profile = {
      id: user.id,
      role: "client",
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
          paymentContext.textContent = `${currentPlan.product_name} / ${currentPlan.name} / ${formatMoney(currentPlan.price_amount, currentPlan.currency)}`;
        }

        setStatus("Plan selected. Continue to payment when ready.", "ok");
        setClientFlow("payment", "Plan selected. Complete payment details and upload proof for admin verification.");
        goToTab("payments");
      });
    });
  }

  async function hydrateClientData() {
    if (!currentUser) return;

    const [orders, payments, subscriptions, referrals, commissionRequests, supportTickets] = await Promise.all([
      client.from("orders").select("id,status,total_amount,currency,created_at,plans(name,products(name))").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("payments").select("id,status,amount,currency,transaction_reference,created_at,orders(plans(name,products(name)))").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("subscriptions").select("status,expires_at,products(name),plans(name)").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("referrals").select("commission_amount,commission_status").eq("referrer_id", currentUser.id),
      client.from("commission_requests").select("amount,status,payout_method,created_at").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("support_tickets").select("id,subject,message,status,created_at,updated_at").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
    ]);

    renderList("[data-orders-list]", orders.data, renderOrderRow, "No orders yet.");
    renderList("[data-payments-list]", payments.data, renderPaymentRow, "No payment submitted yet.");
    renderList("[data-subscriptions-list]", subscriptions.data, renderSubscriptionRow, "No subscriptions yet.");
    renderList("[data-support-tickets-list]", supportTickets.data, renderSupportTicketRow, "No support tickets yet.");

    syncClientFlowState(orders.data || [], payments.data || [], subscriptions.data || [], supportTickets.data || []);

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
    const isOperationsAdmin = hasOperationsAdminAccess(user);
    adminAuthGate.classList.toggle("hidden", hasAccess);
    adminGate.classList.toggle("hidden", hasAccess);
    adminShell.classList.toggle("hidden", !hasAccess);
    superUserOnlyItems.forEach((item) => item.classList.toggle("hidden", !isSuperUser));
    adminOpsOnlyItems.forEach((item) => item.classList.toggle("hidden", isSuperUser && !isOperationsAdmin));
    setText("[data-admin-role-label]", formatRoleLabel(user?.app_metadata?.role || "none"));

    if (!user) {
      setText("[data-admin-gate-title]", "Admin sign in required");
      return;
    }

    if (!hasAccess) {
      setText("[data-admin-gate-title]", "Signed in, but operations role is required");
      return;
    }

    if (isSuperUser && !isOperationsAdmin) {
      setStatus("SUPER USER verified. Loading role registry...", "ok");
      goToTab("admin-roles");
      loadAdminRoles();
      return;
    }

    setStatus("Admin verified. Loading operations workspace...", "ok");
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

  async function loadAdminData() {
    if (!requireAdmin(false)) return;

    const roleRequest = hasSuperUserAccess() ? client.from("admin_roles").select("*").order("sort_order", { ascending: true }) : Promise.resolve({ data: [], error: null });

    const [products, plans, payments, referrals, commissionRequests, supportTickets, subscriptions, orders, profiles, roles] = await Promise.all([
      client.from("products").select("*").order("sort_order", { ascending: true }),
      client.from("plans").select("*,products(name,code)").order("created_at", { ascending: false }),
      client
        .from("payments")
        .select("*,orders(id,status,total_amount,currency,plan_id,plans(name,duration_days,bonus_days,product_id,products(name))),profiles!payments_client_id_fkey(full_name,email,telegram_username)")
        .order("created_at", { ascending: false })
        .limit(30),
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
        .select("id,client_id,subject,message,status,created_at,updated_at,profiles!support_tickets_client_id_fkey(full_name,email,telegram_username)")
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
        .select("id,full_name,email,telegram_username,role,created_at,referral_code")
        .eq("role", "client")
        .order("created_at", { ascending: false })
        .limit(100),
      roleRequest,
    ]);

    if (products.error || plans.error || payments.error || referrals.error || commissionRequests.error || supportTickets.error || subscriptions.error || orders.error || profiles.error || roles.error) {
      setStatus(products.error?.message || plans.error?.message || payments.error?.message || referrals.error?.message || commissionRequests.error?.message || supportTickets.error?.message || subscriptions.error?.message || orders.error?.message || profiles.error?.message || roles.error?.message, "warn");
      return;
    }

    renderListElement(adminProductsList, products.data, renderAdminProductRow, "No products yet.");
    renderListElement(adminPlansList, plans.data, renderAdminPlanRow, "No plans yet.");
    renderListElement(adminPaymentQueue, payments.data, renderPaymentReviewCard, "No payments in queue.");
    renderListElement(adminReferralList, referrals.data, renderAdminReferralRow, "No referral records yet.");
    renderListElement(adminCommissionQueue, commissionRequests.data, renderCommissionReviewCard, "No withdrawal requests yet.");
    renderListElement(adminSupportQueue, supportTickets.data, renderSupportReviewCard, "No support tickets yet.");
    renderListElement(adminClientsList, buildClientRows(profiles.data || [], subscriptions.data || [], payments.data || []), renderMetricRow, "No client accounts yet.");
    renderListElement(adminSubscriptionsList, subscriptions.data, renderAdminSubscriptionRow, "No subscriptions yet.");
    renderListElement(adminExpiringList, buildExpiringRows(subscriptions.data || []), renderMetricRow, "No renewals due yet.");
    renderListElement(adminRolesList, roles.data, renderAdminRoleRow, "No custom roles yet.");
    hydrateAdminProductOptions(products.data || []);
    bindAdminPaymentActions();
    bindAdminCommissionActions();
    bindAdminSupportActions();
    adminReportSnapshot = {
      products: products.data || [],
      plans: plans.data || [],
      payments: payments.data || [],
      referrals: referrals.data || [],
      commissionRequests: commissionRequests.data || [],
      supportTickets: supportTickets.data || [],
      subscriptions: subscriptions.data || [],
      orders: orders.data || [],
      profiles: profiles.data || [],
      roles: roles.data || [],
    };
    renderAdminReports(adminReportSnapshot);
  }

  function bindAdminPaymentActions() {
    document.querySelectorAll("[data-admin-approve], [data-admin-reject], [data-proof-path], [data-admin-product-status], [data-admin-plan-status]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!requireAdmin()) return;

        if (button.hasAttribute("data-admin-product-status")) {
          await updateRecordStatus("products", button.dataset.productId, button.dataset.adminProductStatus);
          return;
        }

        if (button.hasAttribute("data-admin-plan-status")) {
          await updateRecordStatus("plans", button.dataset.planId, button.dataset.adminPlanStatus);
          return;
        }

        const paymentId = button.dataset.paymentId;
        if (button.hasAttribute("data-proof-path")) {
          await openProof(button.dataset.proofPath);
          return;
        }

        if (button.hasAttribute("data-admin-approve")) {
          await approvePayment(paymentId);
          return;
        }

        await rejectPayment(paymentId);
      });
    });
  }

  function renderAdminReports(snapshot) {
    const pendingPayments = snapshot.payments.filter((payment) => ["pending", "under_review"].includes(payment.status));
    const approvedPayments = snapshot.payments.filter((payment) => payment.status === "approved");
    const paymentsToday = snapshot.payments.filter((payment) => isToday(payment.created_at));
    const activeSubscriptions = snapshot.subscriptions.filter((subscription) => ["active", "trial"].includes(subscription.status));
    const renewalsDue = activeSubscriptions.filter((subscription) => isWithinDays(subscription.expires_at, 7));
    const openSupport = snapshot.supportTickets.filter((ticket) => ["open", "pending_admin", "pending_client"].includes(ticket.status));
    const pendingCommissionRequests = snapshot.commissionRequests.filter((request) => request.status === "requested");
    const pendingRevenue = pendingPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const approvedRevenue = approvedPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const commissionLiability = snapshot.referrals
      .filter((referral) => ["available", "requested", "approved"].includes(referral.commission_status))
      .reduce((sum, referral) => sum + Number(referral.commission_amount || 0), 0);

    setText("[data-report-pending-payments]", String(pendingPayments.length));
    setText("[data-report-active-subscriptions]", String(activeSubscriptions.length));
    setText("[data-report-approved-revenue]", formatMoney(approvedRevenue, "USD"));
    setText("[data-report-payments-today]", String(paymentsToday.length));
    setText("[data-report-pending-revenue]", formatMoney(pendingRevenue, "USD"));
    setText("[data-report-renewals-due]", String(renewalsDue.length));

    renderListElement(
      adminPriorityList,
      buildPriorityRows({ pendingPayments, pendingCommissionRequests, openSupport, renewalsDue }),
      renderMetricRow,
      "No urgent admin actions right now."
    );

    renderListElement(
      adminHealthList,
      [
        ["Open support tickets", String(openSupport.length), openSupport.length ? "warn" : "ok"],
        ["Commission liability", formatMoney(commissionLiability, "USD"), commissionLiability ? "warn" : "ok"],
        ["Active products", String(snapshot.products.filter((product) => product.status === "active").length), "ok"],
        ["Published plans", String(snapshot.plans.filter((plan) => plan.status === "active").length), "ok"],
      ],
      renderMetricRow,
      "No operations metrics yet."
    );

    renderListElement(
      adminRevenueList,
      buildRevenueRows(approvedPayments),
      renderMetricRow,
      "No approved payments yet."
    );
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
        const rows = buildExportRows(type, adminReportSnapshot);
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
        ["Client", "Product", "Plan", "Amount", "Currency", "Status", "Reference", "Created At"],
        ...snapshot.payments.map((payment) => [
          payment.profiles?.email || payment.profiles?.full_name || "",
          payment.orders?.plans?.products?.name || "",
          payment.orders?.plans?.name || "",
          payment.amount || 0,
          payment.currency || "USD",
          payment.status || "",
          payment.transaction_reference || "",
          payment.created_at || "",
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
      pendingPayments.length ? ["Payment proofs", `${pendingPayments.length} to review`, "warn"] : null,
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
        if (!requireAdmin()) return;

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
    setStatus(`Commission withdrawal ${status}.`, status === "approved" ? "ok" : "warn");
    await loadAdminData();
  }

  function bindAdminSupportActions() {
    document.querySelectorAll("[data-admin-ticket-status]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!requireAdmin()) return;
        await updateSupportTicket(button.dataset.ticketId, button.dataset.adminTicketStatus);
      });
    });
  }

  async function updateSupportTicket(ticketId, status) {
    const { error } = await client
      .from("support_tickets")
      .update({
        status,
        assigned_to: currentUser.id,
      })
      .eq("id", ticketId);

    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction(`support.${status}`, "support_tickets", ticketId);
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

  async function approvePayment(paymentId) {
    const { data: payment, error: readError } = await client
      .from("payments")
      .select("*,orders(id,plan_id,client_id,referral_code_used,plans(duration_days,bonus_days,product_id))")
      .eq("id", paymentId)
      .single();

    if (readError) {
      setStatus(readError.message, "warn");
      return;
    }

    const expiresAt = new Date();
    const duration = Number(payment.orders?.plans?.duration_days || 30) + Number(payment.orders?.plans?.bonus_days || 0);
    expiresAt.setDate(expiresAt.getDate() + duration);

    const { error: paymentError } = await client
      .from("payments")
      .update({
        status: "approved",
        reviewed_by: currentUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    const { error: orderError } = await client.from("orders").update({ status: "approved" }).eq("id", payment.order_id);

    const { error: subscriptionError } = await client.from("subscriptions").insert({
      client_id: payment.client_id,
      product_id: payment.orders.plans.product_id,
      plan_id: payment.orders.plan_id,
      order_id: payment.order_id,
      status: payment.amount === 0 ? "trial" : "active",
      expires_at: expiresAt.toISOString(),
      activated_by: currentUser.id,
    });

    const referralError = await createReferralCommission(payment);
    const error = paymentError || orderError || subscriptionError || referralError;
    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction("payment.approved", "payments", payment.id);
    setStatus("Payment approved and subscription activated.", "ok");
    await loadAdminData();
  }

  async function createReferralCommission(payment) {
    const referralCode = payment.orders?.referral_code_used;
    if (!referralCode) return null;

    const { data: referrer, error: referrerError } = await client
      .from("profiles")
      .select("id")
      .eq("referral_code", referralCode)
      .neq("id", payment.client_id)
      .maybeSingle();

    if (referrerError || !referrer) return referrerError || null;

    const commissionAmount = Number((Number(payment.amount || 0) * 0.1).toFixed(2));
    const { error } = await client.from("referrals").upsert(
      {
        referrer_id: referrer.id,
        referred_client_id: payment.client_id,
        order_id: payment.order_id,
        commission_amount: commissionAmount,
        commission_status: "available",
      },
      { onConflict: "referrer_id,referred_client_id" }
    );

    return error || null;
  }

  async function rejectPayment(paymentId) {
    const { data: payment, error: readError } = await client.from("payments").select("order_id").eq("id", paymentId).single();
    if (readError) {
      setStatus(readError.message, "warn");
      return;
    }

    const { error: paymentError } = await client
      .from("payments")
      .update({
        status: "rejected",
        reviewed_by: currentUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    const { error: orderError } = await client.from("orders").update({ status: "rejected" }).eq("id", payment.order_id);
    const error = paymentError || orderError;

    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction("payment.rejected", "payments", paymentId);
    setStatus("Payment rejected.", "ok");
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

  function requireAdmin(showMessage = true) {
    const hasAccess = hasAdminAccess();
    if (!hasAccess && showMessage) {
      setStatus("Operations role required.", "warn");
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
    return ["super_user", "admin"].includes(String(user?.app_metadata?.role || "").toLowerCase());
  }

  function hasOperationsAdminAccess(user = currentUser) {
    return String(user?.app_metadata?.role || "").toLowerCase() === "admin";
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
    return `<div class="row"><span>${escapeHtml(payment.orders?.plans?.products?.name || "ETX Product")} / ${escapeHtml(payment.transaction_reference || "No reference")}</span><b class="${statusClass(payment.status)}">${escapeHtml(formatStatus(payment.status))}</b></div>`;
  }

  function renderSupportTicketRow(ticket) {
    const date = ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "Today";
    return `<div class="row"><span>${escapeHtml(ticket.subject)} <small>${escapeHtml(date)}</small></span><b class="${statusClass(ticket.status)}">${escapeHtml(formatStatus(ticket.status))}</b></div>`;
  }

  function syncClientFlowState(orders, payments, subscriptions, supportTickets = []) {
    const latestPayment = payments[0];
    const hasPendingPayment = payments.some((payment) => ["pending", "under_review"].includes(payment.status));
    const hasActiveSubscription = subscriptions.some((subscription) => ["active", "trial"].includes(subscription.status));

    if (hasActiveSubscription) {
      setClientFlow("subscription", "Congratulations. Your subscription is now active and reflected in your account.");
      renderSubscriptionSummary(subscriptions, payments);
    } else if (latestPayment?.status === "rejected") {
      setClientFlow("payment", "Payment was rejected. Please submit corrected payment details or proof.");
      renderSubscriptionSummary(subscriptions, payments);
    } else if (hasPendingPayment || orders.some((order) => ["pending_payment", "under_review"].includes(order.status))) {
      setClientFlow("verification", "Payment submitted. Please wait for admin verification.");
      renderSubscriptionSummary(subscriptions, payments);
    } else if (!currentPlan) {
      setClientFlow("select", "Select a plan to start your subscription request.");
      renderSubscriptionSummary(subscriptions, payments);
    }

    if (!lastClientSnapshot.hasActiveSubscription && hasActiveSubscription) {
      goToTab("subscriptions");
    }

    lastClientSnapshot = { hasPendingPayment, hasActiveSubscription };
    renderClientNotifications(orders, payments, subscriptions, supportTickets);
  }

  function renderClientNotifications(orders, payments, subscriptions, supportTickets) {
    if (!clientNotifications) return;

    const latestPayment = payments[0];
    const activeSubscription = subscriptions.find((subscription) => ["active", "trial"].includes(subscription.status));
    const openTicket = supportTickets.find((ticket) => ["open", "pending_admin", "pending_client"].includes(ticket.status));
    const notifications = [];

    if (activeSubscription) {
      notifications.push(["Subscription active", `${activeSubscription.products?.name || "ETX Product"} is active until ${formatDate(activeSubscription.expires_at)}.`, "ok"]);
    } else if (latestPayment?.status === "under_review") {
      notifications.push(["Payment under review", "Your proof was received. Please wait for admin verification.", "warn"]);
    } else if (latestPayment?.status === "rejected") {
      notifications.push(["Payment rejected", "Please submit corrected payment details or proof.", "rejected"]);
    } else if (orders.length) {
      notifications.push(["Order created", "Complete your payment proof upload to continue activation.", "warn"]);
    } else {
      notifications.push(["Start subscription", "Select a plan, submit proof, then wait for verification.", ""]);
    }

    if (openTicket) {
      notifications.push(["Support ticket open", `${openTicket.subject} is ${formatStatus(openTicket.status)}.`, "warn"]);
    }

    clientNotifications.innerHTML = notifications
      .map(([title, detail, tone]) => `<div class="notice-row ${tone}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div>`)
      .join("");
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
        ["Submit payment proof", "Waiting", ""],
        ["Admin verification", "Not started", ""],
      ],
      payment: [
        ["Choose a plan", "Done", "ok"],
        ["Submit payment proof", "Required", "warn"],
        ["Admin verification", "Waiting", ""],
      ],
      verification: [
        ["Choose a plan", "Done", "ok"],
        ["Submit payment proof", "Done", "ok"],
        ["Admin verification", "In review", "warn"],
      ],
      subscription: [
        ["Choose a plan", "Done", "ok"],
        ["Submit payment proof", "Done", "ok"],
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
    return `
      <div class="row">
        <span>${escapeHtml(product.name)} <small>${escapeHtml(product.code)}</small></span>
        <b class="${product.status === "active" ? "ok" : "warn"}">${escapeHtml(product.status)}</b>
        <button class="secondary-btn" type="button" data-admin-product-status="${escapeHtml(nextStatus)}" data-product-id="${escapeHtml(product.id)}">${escapeHtml(nextStatus)}</button>
      </div>
    `;
  }

  function renderAdminPlanRow(plan) {
    const nextStatus = plan.status === "active" ? "hidden" : "active";
    return `
      <div class="row">
        <span>${escapeHtml(plan.products?.name || "ETX Product")} / ${escapeHtml(plan.name)}</span>
        <b>${escapeHtml(formatMoney(Number(plan.price_amount), plan.currency))}</b>
        <button class="secondary-btn" type="button" data-admin-plan-status="${escapeHtml(nextStatus)}" data-plan-id="${escapeHtml(plan.id)}">${escapeHtml(nextStatus)}</button>
      </div>
    `;
  }

  function renderPaymentReviewCard(payment) {
    const clientName = payment.profiles?.full_name || payment.profiles?.email || "Client";
    const plan = payment.orders?.plans;
    const productName = plan?.products?.name || "ETX Product";
    const proofButton = payment.proof_path
      ? `<button class="secondary-btn" type="button" data-proof-path="${escapeHtml(payment.proof_path)}" data-payment-id="${escapeHtml(payment.id)}">View Proof</button>`
      : `<span class="warn">No file</span>`;

    return `
      <div class="approval-card" data-payment-card="${escapeHtml(payment.id)}">
        <div>
          <strong>${escapeHtml(clientName)}</strong>
          <p>${escapeHtml(productName)} / ${escapeHtml(plan?.name || "Plan")} / ${escapeHtml(formatMoney(Number(payment.amount), payment.currency))}</p>
          <p>Ref: ${escapeHtml(payment.transaction_reference || "No reference")}</p>
        </div>
        <span class="${payment.status === "approved" ? "ok" : payment.status === "rejected" ? "rejected" : "warn"}">${escapeHtml(payment.status)}</span>
        ${proofButton}
        <button class="primary-btn" type="button" data-admin-approve data-payment-id="${escapeHtml(payment.id)}">Approve</button>
        <button class="secondary-btn" type="button" data-admin-reject data-payment-id="${escapeHtml(payment.id)}">Reject</button>
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
      const status = active ? "active" : review ? "payment review" : "registered";
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
    const canReview = request.status === "requested";
    return `
      <div class="approval-card" data-commission-card="${escapeHtml(request.id)}">
        <div>
          <strong>${escapeHtml(clientName)}</strong>
          <p>${escapeHtml(request.payout_method)} / ${escapeHtml(request.payout_details || "No payout notes")}</p>
        </div>
        <span class="${statusClass(request.status)}">${escapeHtml(formatStatus(request.status))}</span>
        <strong>${escapeHtml(formatMoney(Number(request.amount), "USD"))}</strong>
        <button class="primary-btn" type="button" data-admin-commission-approve data-request-id="${escapeHtml(request.id)}"${canReview ? "" : " disabled"}>Approve</button>
        <button class="secondary-btn" type="button" data-admin-commission-reject data-request-id="${escapeHtml(request.id)}"${canReview ? "" : " disabled"}>Reject</button>
      </div>
    `;
  }

  function renderSupportReviewCard(ticket) {
    const clientName = ticket.profiles?.full_name || ticket.profiles?.email || "Client";
    const canWork = !["resolved", "closed"].includes(ticket.status);
    return `
      <div class="approval-card" data-ticket-card="${escapeHtml(ticket.id)}">
        <div>
          <strong>${escapeHtml(ticket.subject)}</strong>
          <p>${escapeHtml(clientName)} / ${escapeHtml(ticket.message)}</p>
        </div>
        <span class="${statusClass(ticket.status)}">${escapeHtml(formatStatus(ticket.status))}</span>
        <button class="secondary-btn" type="button" data-admin-ticket-status="pending_client" data-ticket-id="${escapeHtml(ticket.id)}"${canWork ? "" : " disabled"}>Need Client</button>
        <button class="primary-btn" type="button" data-admin-ticket-status="resolved" data-ticket-id="${escapeHtml(ticket.id)}"${canWork ? "" : " disabled"}>Resolve</button>
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
      authStatus.textContent = message;
      authStatus.className = `codebox${tone ? ` ${tone}` : ""}`;
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

  function formatDate(value) {
    return value ? new Date(value).toLocaleDateString() : "No expiry";
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
