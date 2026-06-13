(() => {
  const filterButtons = Array.from(document.querySelectorAll(".works-filter"));
  const cards = Array.from(document.querySelectorAll(".works-card"));
  const FILTER_OUT_CLASS = "is-filtered-out";
  const FILTER_IN_CLASS = "is-filtered-in";
  const WIDE_CLASS = "works-card--wide";
  const STANDARD_CLASS = "works-card--standard";

  if (filterButtons.length === 0 || cards.length === 0) {
    return;
  }

  const applyPattern = () => {
    const visibleCards = cards.filter((card) => !card.hidden);

    visibleCards.forEach((card, index) => {
      const isWide = index % 7 === 0 || index % 7 === 3;
      card.classList.remove(WIDE_CLASS, STANDARD_CLASS);
      card.classList.add(isWide ? WIDE_CLASS : STANDARD_CLASS);
    });
  };

  const applyFilter = (filter) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    cards.forEach((card) => {
      const shouldShow = filter === "All" || card.dataset.filterGroup === filter;

      if (shouldShow) {
        card.hidden = false;
        card.classList.remove(FILTER_OUT_CLASS);
        card.classList.add(FILTER_IN_CLASS);
        window.setTimeout(() => card.classList.remove(FILTER_IN_CLASS), 420);
        return;
      }

      card.classList.remove(FILTER_IN_CLASS);
      card.classList.add(FILTER_OUT_CLASS);
      window.setTimeout(() => {
        if (card.classList.contains(FILTER_OUT_CLASS)) {
          card.hidden = true;
        }
      }, 220);
    });

    window.setTimeout(applyPattern, 0);
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter || "All"));
  });

  applyPattern();
})();
