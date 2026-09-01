const path = require("node:path");
const { chromium } = require("C:/Users/Richmond Sevilla/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const repoDir = path.resolve(__dirname, "..");
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const viewports = [
  { width: 320, height: 800, name: "mobile-320" },
  { width: 390, height: 844, name: "mobile-390" },
  { width: 768, height: 1024, name: "tablet-768" },
  { width: 1365, height: 900, name: "desktop-1365" },
];

const clientTabs = [
  "overview",
  "profile",
  "buy",
  "payments",
  "subscriptions",
  "referrals",
  "about",
  "support",
];

const adminTabs = [
  "admin-overview",
  "admin-products",
  "admin-plans",
  "admin-methods",
  "admin-rates",
  "admin-payments",
  "admin-expenses",
  "admin-clients",
  "admin-client-profile",
  "admin-landing",
  "admin-subscriptions",
  "admin-referrals",
  "admin-support",
  "admin-pam",
  "admin-reports",
  "admin-audit",
  "admin-roles",
];

async function checkOverflow(page, label) {
  return page.evaluate((label) => {
    function isInsideHorizontalScroller(el) {
      let node = el.parentElement;
      while (node && node !== document.body) {
        const style = getComputedStyle(node);
        const overflowX = style.overflowX;
        const canScroll = node.scrollWidth > node.clientWidth + 1;
        if (canScroll && ["auto", "scroll", "overlay"].includes(overflowX)) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    }

    const offenders = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return false;
        if (isInsideHorizontalScroller(el)) return false;
        return rect.width > 0 && (rect.right > window.innerWidth + 1 || rect.left < -1);
      })
      .slice(0, 8)
      .map((el) => ({
        tag: el.tagName,
        className: String(el.className || ""),
        text: (el.textContent || "").trim().slice(0, 80),
        left: Math.round(el.getBoundingClientRect().left),
        right: Math.round(el.getBoundingClientRect().right),
      }));

    return {
      label,
      width: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      hasHorizontalOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1 ||
        document.body.scrollWidth > window.innerWidth + 1 ||
        offenders.length > 0,
      offenders,
    };
  }, label);
}

async function runTabChecks(page, tabs, kind, viewport) {
  const results = [];
  for (const tab of tabs) {
    await page.evaluate((tab) => {
      document
        .querySelectorAll(".portal-tab")
        .forEach((el) => el.classList.toggle("active", el.id === tab));
      document
        .querySelectorAll(".portal-sidebar button[data-tab]")
        .forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));
    }, tab);
    results.push(await checkOverflow(page, `${kind} ${tab} ${viewport.name}`));
  }
  return results;
}

async function runPage(browser, fileName, kind) {
  const results = [];
  const fileUrl = `file:///${path.join(repoDir, fileName).replace(/\\/g, "/").replace(/ /g, "%20")}`;

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto(fileUrl, { waitUntil: "load" });
    results.push(await checkOverflow(page, `${kind} signed-out ${viewport.name}`));

    if (kind === "client") {
      await page.evaluate(() => {
        document.querySelector("[data-client-auth-gate]")?.classList.add("hidden");
        document.querySelector("[data-client-app-shell]")?.classList.remove("hidden");
      });
      results.push(...(await runTabChecks(page, clientTabs, kind, viewport)));
    } else {
      await page.evaluate(() => {
        document.querySelector("[data-admin-auth-gate]")?.classList.add("hidden");
        document.querySelector("[data-admin-shell]")?.classList.remove("hidden");
      });
      results.push(...(await runTabChecks(page, adminTabs, kind, viewport)));
    }

    await page.close();
  }

  return results;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const results = [
    ...(await runPage(browser, "client.html", "client")),
    ...(await runPage(browser, "admin.html", "admin")),
  ];
  await browser.close();

  const failures = results.filter((result) => result.hasHorizontalOverflow);
  console.log(JSON.stringify({ totalChecks: results.length, failing: failures.length, failures }, null, 2));

  if (failures.length) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
