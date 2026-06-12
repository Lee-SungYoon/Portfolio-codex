(() => {
  const heroTitle = document.querySelector(".js-fit-hero");
  const heroWrap = document.querySelector(".hero-title-wrap");

  if (!heroTitle || !heroWrap) {
    return;
  }

  const desktopMin = 64;
  const desktopMax = 264;
  const mobileMin = 48;
  const mobileMax = 92;
  let frameId = 0;

  const fitTitle = () => {
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth <= 768;
    const minSize = isMobile ? mobileMin : desktopMin;
    const maxSize = isMobile ? mobileMax : desktopMax;
    const availableWidth = heroWrap.clientWidth;

    heroTitle.style.whiteSpace = isMobile ? "normal" : "nowrap";
    heroTitle.style.fontSize = `${maxSize}px`;

    let low = minSize;
    let high = maxSize;
    let best = minSize;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      heroTitle.style.fontSize = `${mid}px`;

      const titleWidth = Math.ceil(heroTitle.getBoundingClientRect().width);

      if (titleWidth <= availableWidth) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    heroTitle.style.fontSize = `${best}px`;

    while (
      Math.ceil(heroTitle.getBoundingClientRect().width) > availableWidth &&
      parseFloat(heroTitle.style.fontSize) > minSize
    ) {
      heroTitle.style.fontSize = `${parseFloat(heroTitle.style.fontSize) - 1}px`;
    }
  };

  const queueFit = () => {
    window.cancelAnimationFrame(frameId);
    frameId = window.requestAnimationFrame(fitTitle);
  };

  queueFit();
  window.addEventListener("resize", queueFit);

  const resizeObserver = new ResizeObserver(queueFit);
  resizeObserver.observe(heroWrap);
})();
