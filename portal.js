const tabButtons = document.querySelectorAll("[data-tab]");
const tabs = document.querySelectorAll(".portal-tab");
const selectedPlan = document.getElementById("selected-plan");

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
