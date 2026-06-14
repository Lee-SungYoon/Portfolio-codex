(() => {
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const staggerGroups = [
    [".portfolio-grid .project-card", 80],
    [".works-grid .works-card", 80],
    [".about-list .about-list-item", 70],
    [".socials .text-link", 60],
  ];

  staggerGroups.forEach(([selector, step]) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * step}ms`);
    });
  });

  if (revealItems.length === 0 || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.16 },
  );

  revealItems.forEach((item) => {
    if (!item.classList.contains("is-visible")) {
      observer.observe(item);
    }
  });
})();
