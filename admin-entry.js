const adminTrigger = document.querySelector("[data-admin-trigger]");

if (adminTrigger) {
  let adminClickCount = 0;
  let adminClickTimer = null;

  adminTrigger.addEventListener("click", (event) => {
    adminClickCount += 1;

    if (adminClickCount < 3) {
      if (adminClickTimer) {
        window.clearTimeout(adminClickTimer);
      }

      adminClickTimer = window.setTimeout(() => {
        adminClickCount = 0;
      }, 900);
      return;
    }

    event.preventDefault();
    adminClickCount = 0;
    window.location.href = "admin.html";
  });
}
