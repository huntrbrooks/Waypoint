const faqButtons = document.querySelectorAll<HTMLButtonElement>(".faq");

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
