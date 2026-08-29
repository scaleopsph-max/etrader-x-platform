/* ==============================
   ETX / Yugo Ashi Landing Page
   Step 3: JS Only
   ============================== */

document.addEventListener("DOMContentLoaded", function () {
  initCountdownTimer();
  initFaqAccordion();
  initSmoothScroll();
  initCtaTracking();
  initStickyMobileCta();
});

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

      clearInterval(countdownInterval);
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

  const countdownInterval = setInterval(updateCountdown, 1000);
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
