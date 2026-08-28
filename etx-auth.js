(function () {
  const config = window.ETX_SUPABASE || {};
  const sdk = window.supabase;
  const authPanels = document.querySelectorAll("[data-auth-panel]");
  const authStatus = document.querySelector("[data-auth-status]");
  const authUser = document.querySelector("[data-auth-user]");
  const profileForm = document.querySelector("[data-profile-form]");
  const signInForm = document.querySelector("[data-sign-in-form]");
  const signUpForm = document.querySelector("[data-sign-up-form]");
  const signOutButtons = document.querySelectorAll("[data-sign-out]");
  const dynamicPlanGrid = document.querySelector("[data-dynamic-plans]");
  const selectedPlan = document.getElementById("selected-plan");
  const paymentForm = document.querySelector("[data-payment-form]");
  const adminGate = document.querySelector("[data-admin-gate]");
  const adminShell = document.querySelector("[data-admin-shell]");
  const adminProductForm = document.querySelector("[data-admin-product-form]");
  const adminPlanForm = document.querySelector("[data-admin-plan-form]");
  const adminProductsList = document.querySelector("[data-admin-products-list]");
  const adminPlansList = document.querySelector("[data-admin-plans-list]");
  const adminPaymentQueue = document.querySelector("[data-admin-payment-queue]");
  const adminPlanProductSelect = document.querySelector("[data-admin-plan-product]");
  const clientAuthGate = document.querySelector("[data-client-auth-gate]");
  const clientAppShell = document.querySelector("[data-client-app-shell]");

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

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    bindAuthForms();
    bindProfileForm();
    bindPaymentForm();
    bindAdminForms();
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
          referral_code_used: String(form.get("referral_code") || "").trim() || null,
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

        setStatus("Plan selected. Continue to payment when ready.", "ok");
      });
    });
  }

  async function hydrateClientData() {
    if (!currentUser) return;

    const [orders, subscriptions, referrals] = await Promise.all([
      client.from("orders").select("id,status,total_amount,currency,created_at,plans(name,products(name))").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("subscriptions").select("status,expires_at,products(name),plans(name)").eq("client_id", currentUser.id).order("created_at", { ascending: false }).limit(5),
      client.from("referrals").select("commission_amount,commission_status").eq("referrer_id", currentUser.id),
    ]);

    renderList("[data-orders-list]", orders.data, renderOrderRow, "No orders yet.");
    renderList("[data-subscriptions-list]", subscriptions.data, renderSubscriptionRow, "No subscriptions yet.");

    const totalCommission = (referrals.data || []).reduce((sum, item) => sum + Number(item.commission_amount || 0), 0);
    setText("[data-referral-code]", currentProfile?.referral_code || "Pending");
    setText("[data-referral-link]", `${window.location.origin}/?ref=${currentProfile?.referral_code || ""}`);
    setText("[data-commission-total]", formatMoney(totalCommission, "USD"));
  }

  function renderSignedOut() {
    authPanels.forEach((panel) => panel.classList.toggle("is-signed-in", false));
    toggleClientShell(false);
    setText("[data-auth-email]", "Not signed in");
    setStatus("Sign in or create a client account to continue.", "warn");
    renderAdminGate(null);
  }

  function renderSignedIn() {
    authPanels.forEach((panel) => panel.classList.toggle("is-signed-in", true));
    toggleClientShell(true);
    setText("[data-auth-email]", currentUser.email || "Signed in");
    renderProfile(currentProfile);
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
    if (!adminGate || !adminShell) return;

    const isAdmin = user?.app_metadata?.role === "admin";
    adminGate.classList.toggle("hidden", isAdmin);
    adminShell.classList.toggle("hidden", !isAdmin);

    if (!user) {
      setText("[data-admin-gate-title]", "Admin sign in required");
      return;
    }

    if (!isAdmin) {
      setText("[data-admin-gate-title]", "Signed in, but admin role is required");
      return;
    }

    setStatus("Admin verified. Loading operations workspace...", "ok");
    loadAdminData();
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

    const [products, plans, payments] = await Promise.all([
      client.from("products").select("*").order("sort_order", { ascending: true }),
      client.from("plans").select("*,products(name,code)").order("created_at", { ascending: false }),
      client
        .from("payments")
        .select("*,orders(id,status,total_amount,currency,plan_id,plans(name,duration_days,bonus_days,product_id,products(name))),profiles!payments_client_id_fkey(full_name,email,telegram_username)")
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

    if (products.error || plans.error || payments.error) {
      setStatus(products.error?.message || plans.error?.message || payments.error?.message, "warn");
      return;
    }

    renderListElement(adminProductsList, products.data, renderAdminProductRow, "No products yet.");
    renderListElement(adminPlansList, plans.data, renderAdminPlanRow, "No plans yet.");
    renderListElement(adminPaymentQueue, payments.data, renderPaymentReviewCard, "No payments in queue.");
    hydrateAdminProductOptions(products.data || []);
    bindAdminPaymentActions();
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
      .select("*,orders(id,plan_id,client_id,plans(duration_days,bonus_days,product_id))")
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

    const error = paymentError || orderError || subscriptionError;
    if (error) {
      setStatus(error.message, "warn");
      return;
    }

    await logAdminAction("payment.approved", "payments", payment.id);
    setStatus("Payment approved and subscription activated.", "ok");
    await loadAdminData();
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
    const isAdmin = currentUser?.app_metadata?.role === "admin";
    if (!isAdmin && showMessage) {
      setStatus("Admin role required.", "warn");
    }
    return isAdmin;
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
    return `<div class="row"><span>${escapeHtml(order.plans?.products?.name || "ETX Product")} / ${escapeHtml(order.plans?.name || "Plan")}</span><b class="warn">${escapeHtml(order.status)}</b></div>`;
  }

  function renderSubscriptionRow(subscription) {
    const expiry = subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString() : "No expiry";
    return `<div class="row"><span>${escapeHtml(subscription.products?.name || "ETX Product")}</span><b class="ok">${escapeHtml(subscription.status)} until ${escapeHtml(expiry)}</b></div>`;
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
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.className = `codebox${tone ? ` ${tone}` : ""}`;
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

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
