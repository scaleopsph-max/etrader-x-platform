const { chromium } = require("C:/Users/Richmond Sevilla/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const routes = [
  { name: "landing", url: "https://etrader-x-platform.pages.dev/" },
  { name: "client", url: "https://etrader-x-platform.pages.dev/client" },
  { name: "admin", url: "https://etrader-x-platform.pages.dev/admin" },
];

async function inspectRoute(browser, route) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleErrors.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const response = await page.goto(route.url, { waitUntil: "networkidle", timeout: 45000 });
  const result = await page.evaluate((routeName) => {
    const clientShellHidden = document.querySelector("[data-client-app-shell]")?.classList.contains("hidden");
    const adminShellHidden = document.querySelector("[data-admin-shell]")?.classList.contains("hidden");
    return {
      title: document.title,
      width: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      hasPageOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1 ||
        document.body.scrollWidth > window.innerWidth + 1,
      hasClientLogin: Boolean(document.querySelector("[data-sign-in-form]")),
      hasClientSignupToggle: Boolean(document.querySelector("[data-show-signup]")),
      clientShellHidden: routeName === "client" ? clientShellHidden : undefined,
      adminShellHidden: routeName === "admin" ? adminShellHidden : undefined,
      hasAdminLogin: routeName === "admin" ? Boolean(document.querySelector("[data-sign-in-form]")) : undefined,
      hasLandingCta: routeName === "landing" ? Boolean(document.querySelector('a[href*="client"]')) : undefined,
    };
  }, route.name);

  await page.close();
  return {
    route: route.name,
    url: route.url,
    status: response?.status(),
    consoleErrors,
    pageErrors,
    ...result,
  };
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const results = [];
  for (const route of routes) {
    results.push(await inspectRoute(browser, route));
  }
  await browser.close();

  const failures = results.filter((result) => {
    if (result.status !== 200 || result.hasPageOverflow || result.pageErrors.length) return true;
    if (result.route === "client" && (!result.hasClientLogin || !result.hasClientSignupToggle || !result.clientShellHidden)) return true;
    if (result.route === "admin" && (!result.hasAdminLogin || !result.adminShellHidden)) return true;
    if (result.route === "landing" && !result.hasLandingCta) return true;
    return false;
  });

  console.log(JSON.stringify({ totalChecks: results.length, failing: failures.length, results }, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
