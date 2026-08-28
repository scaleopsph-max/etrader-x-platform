const tabButtons = document.querySelectorAll("[data-tab]");
const tabs = document.querySelectorAll(".portal-tab");
const selectedPlan = document.getElementById("selected-plan");
const adminActionLog = document.getElementById("admin-action-log");

function activateTab(id) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === id);
  });

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.id === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
});

document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedPlan.textContent = button.dataset.plan;
  });
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.jump));
});

document.querySelectorAll("[data-approve], [data-reject]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-payment]");
    const status = card.querySelector(".warn, .ok, .rejected");
    const isApproved = button.hasAttribute("data-approve");
    const action = isApproved ? "approved" : "rejected";

    status.textContent = isApproved ? "Approved" : "Rejected";
    status.className = isApproved ? "ok" : "rejected";

    if (adminActionLog) {
      adminActionLog.textContent = `${card.dataset.payment} marked as ${action}.`;
    }
  });
});
