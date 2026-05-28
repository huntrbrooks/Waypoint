const faqButtons = document.querySelectorAll<HTMLButtonElement>(".faq");
const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const mobileMenu = document.querySelector<HTMLElement>("[data-mobile-menu]");

const closeMenu = () => {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  mobileMenu.classList.add("hidden");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle?.addEventListener("click", () => {
  if (!mobileMenu) {
    return;
  }

  const isOpen = !mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden", isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

mobileMenu?.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

faqButtons.forEach((button) => {
  const answer = button.querySelector<HTMLParagraphElement>(".answer");
  if (!answer) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = !answer.classList.contains("hidden");
    document.querySelectorAll<HTMLParagraphElement>(".answer").forEach((item) => {
      item.classList.add("hidden");
      item.textContent = "";
    });

    if (!isOpen) {
      answer.textContent = button.dataset.answer ?? "";
      answer.classList.remove("hidden");
    }
  });
});
