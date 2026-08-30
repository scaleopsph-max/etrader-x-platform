/* ==============================
   ETX / Yugo Ashi Landing Page
   Step 3: JS Only
   ============================== */

document.addEventListener("DOMContentLoaded", function () {
  initLandingCreatives();
  initCountdownTimer();
  initFaqAccordion();
  initSmoothScroll();
  initCtaTracking();
  initStickyMobileCta();
});

/* ---------- Admin-Managed Landing Creatives ---------- */

async function initLandingCreatives() {
  const config = window.ETX_SUPABASE;
  const supabaseLibrary = window.supabase;

  if (!config || !supabaseLibrary?.createClient) return;

  try {
    const supabase = supabaseLibrary.createClient(config.url, config.publishableKey);
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("landing_creatives")
      .select("section_key,title,subtitle,body,image_url,cta_label,cta_url,promo_starts_at,promo_ends_at,sort_order")
      .eq("status", "active")
      .or(`promo_starts_at.is.null,promo_starts_at.lte.${now}`)
      .or(`promo_ends_at.is.null,promo_ends_at.gt.${now}`)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(24);

    if (error || !Array.isArray(data) || !data.length) return;

    applyLandingCreative("hero", data.find(function (item) {
      return item.section_key === "hero";
    }));
    applyLandingCreative("promo", data.find(function (item) {
      return item.section_key === "promo" || item.section_key === "urgency";
    }));
    applyLandingCreative("final_cta", data.find(function (item) {
      return item.section_key === "final_cta";
    }));
    renderDynamicPromos(data.filter(function (item) {
      return ["upcoming_promo", "gallery", "testimonial"].includes(item.section_key);
    }));

    initCountdownTimer();
  } catch (error) {
    console.warn("ETX landing creatives unavailable:", error.message);
  }
}

function applyLandingCreative(sectionKey, creative) {
  if (!creative) return;

  setCreativeText(`${sectionKey}.title`, creative.title);
  setCreativeText(`${sectionKey}.subtitle`, creative.subtitle);
  setCreativeText(`${sectionKey}.body`, creative.body);

  const eyebrow = document.querySelector(`[data-creative="${sectionKey}.eyebrow"]`);
  if (eyebrow && creative.section_key) {
    eyebrow.textContent = formatCreativeSection(creative.section_key);
  }

  const cta = document.querySelector(`[data-creative="${sectionKey}.cta"]`);
  if (cta) {
    if (creative.cta_label) cta.textContent = creative.cta_label;
    if (creative.cta_url) cta.setAttribute("href", creative.cta_url);
  }

  const image = document.querySelector(`[data-creative="${sectionKey}.image"]`);
  if (image && creative.image_url) {
    image.setAttribute("src", creative.image_url);
    image.setAttribute("alt", creative.title || "ETrader-X creative");
  }

  if (sectionKey === "promo" && creative.promo_ends_at) {
    const countdownTimer = document.getElementById("countdown-timer");
    if (countdownTimer) {
      countdownTimer.setAttribute("data-deadline", creative.promo_ends_at);
      countdownTimer.classList.remove("countdown-ended");
    }
  }
}

function setCreativeText(key, value) {
  const target = document.querySelector(`[data-creative="${key}"]`);
  if (target && value) target.textContent = value;
}

function renderDynamicPromos(creatives) {
  const section = document.getElementById("dynamic-promos");
  const list = document.querySelector('[data-creative-list="promos"]');

  if (!section || !list || !creatives.length) return;

  list.innerHTML = creatives.map(renderDynamicPromoCard).join("");
  section.hidden = false;
  initCtaTracking();
}

function renderDynamicPromoCard(creative) {
  const windowText = buildPromoWindowText(creative);
  const ctaHref = creative.cta_url || "client.html";
  const ctaLabel = creative.cta_label || "Open Client Portal";

  return `
    <article class="dynamic-promo-card">
      ${creative.image_url ? `<img src="${escapeLandingHtml(creative.image_url)}" alt="${escapeLandingHtml(creative.title || "ETX promo")}" loading="lazy" />` : ""}
      <div>
        <p class="eyebrow">${escapeLandingHtml(formatCreativeSection(creative.section_key))}</p>
        <h3>${escapeLandingHtml(creative.title || "ETX Promo")}</h3>
        ${creative.subtitle ? `<p class="dynamic-promo-subtitle">${escapeLandingHtml(creative.subtitle)}</p>` : ""}
        ${creative.body ? `<p>${escapeLandingHtml(creative.body)}</p>` : ""}
        ${windowText ? `<small>${escapeLandingHtml(windowText)}</small>` : ""}
        <a class="btn btn-secondary" href="${escapeLandingHtml(ctaHref)}" data-cta="dynamic_${escapeLandingHtml(creative.section_key)}">${escapeLandingHtml(ctaLabel)}</a>
      </div>
    </article>
  `;
}

function buildPromoWindowText(creative) {
  const startsAt = formatLandingDate(creative.promo_starts_at);
  const endsAt = formatLandingDate(creative.promo_ends_at);

  if (startsAt && endsAt) return `${startsAt} to ${endsAt}`;
  if (startsAt) return `Starts ${startsAt}`;
  if (endsAt) return `Ends ${endsAt}`;
  return "";
}

function formatLandingDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatCreativeSection(value) {
  return String(value || "ETX Update")
    .replace(/_/g, " ")
    .replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
}

function escapeLandingHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let countdownIntervalId = null;

/* ---------- Countdown Timer ---------- */

function initCountdownTimer() {
  const countdownTimer = document.getElementById("countdown-timer");

  if (!countdownTimer) return;

  const deadlineValue = countdownTimer.getAttribute("data-deadline");
  const deadline = new Date(deadlineValue).getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!deadline || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  if (countdownIntervalId) clearInterval(countdownIntervalId);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = deadline - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";

      countdownTimer.classList.add("countdown-ended");

      const promoButton = document.querySelector('[data-cta="promo_claim"]');

      if (promoButton) {
        promoButton.textContent = "Check Current Offer";
        promoButton.setAttribute("href", "client.html");
      }

      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = formatTime(days);
    hoursEl.textContent = formatTime(hours);
    minutesEl.textContent = formatTime(minutes);
    secondsEl.textContent = formatTime(seconds);
  }

  updateCountdown();

  countdownIntervalId = setInterval(updateCountdown, 1000);
}

function formatTime(value) {
  return String(value).padStart(2, "0");
}

/* ---------- FAQ Accordion ---------- */

function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.addEventListener("click", function () {
      const isOpen = item.classList.contains("active");

      closeAllFaqItems(faqItems);

      if (!isOpen) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function closeAllFaqItems(faqItems) {
  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");

    item.classList.remove("active");

    if (question) {
      question.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- Smooth Scroll With Header Offset ---------- */

function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  if (!internalLinks.length) return;

  internalLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetSection = document.querySelector(targetId);

      if (!targetSection) return;

      event.preventDefault();

      const header = document.getElementById("site-header");
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        targetSection.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight -
        12;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      history.pushState(null, "", targetId);
    });
  });
}

/* ---------- CTA Tracking ---------- */

function initCtaTracking() {
  const ctaButtons = document.querySelectorAll("[data-cta]");

  if (!ctaButtons.length) return;

  ctaButtons.forEach(function (button) {
    if (button.dataset.ctaBound === "true") return;
    button.dataset.ctaBound = "true";

    button.addEventListener("click", function () {
      const ctaName = button.getAttribute("data-cta");
      const ctaText = button.textContent.trim();
      const ctaHref = button.getAttribute("href");

      console.log("ETX CTA Click:", {
        ctaName: ctaName,
        ctaText: ctaText,
        ctaHref: ctaHref,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });

      /*
        Optional tracking integrations:

        Meta Pixel:
        if (typeof fbq === "function") {
          fbq("trackCustom", "YugoAshiCTAClick", {
            cta_name: ctaName,
            cta_text: ctaText
          });
        }

        Google Analytics 4:
        if (typeof gtag === "function") {
          gtag("event", "cta_click", {
            event_category: "Yugo Ashi Landing Page",
            event_label: ctaName
          });
        }
      */
    });
  });
}

/* ---------- Sticky Mobile CTA Behavior ---------- */

function initStickyMobileCta() {
  const stickyCta = document.querySelector(".sticky-mobile-cta");
  const finalCtaSection = document.getElementById("final-cta");
  const footer = document.querySelector(".site-footer");

  if (!stickyCta) return;

  function toggleStickyCta() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;

    const showAfter = 500;
    let shouldShow = scrollY > showAfter;

    if (finalCtaSection) {
      const finalCtaTop =
        finalCtaSection.getBoundingClientRect().top + window.pageYOffset;

      if (scrollY + windowHeight > finalCtaTop) {
        shouldShow = false;
      }
    }

    if (footer) {
      const footerTop = footer.getBoundingClientRect().top + window.pageYOffset;

      if (scrollY + windowHeight > footerTop) {
        shouldShow = false;
      }
    }

    stickyCta.classList.toggle("is-visible", shouldShow);
  }

  toggleStickyCta();

  window.addEventListener("scroll", throttle(toggleStickyCta, 120));
  window.addEventListener("resize", throttle(toggleStickyCta, 120));
}

/* ---------- Utility: Throttle ---------- */

function throttle(callback, delay) {
  let lastCall = 0;

  return function () {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      callback.apply(this, arguments);
    }
  };
}
