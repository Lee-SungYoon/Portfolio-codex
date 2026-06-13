(() => {
  const heroTitle = document.querySelector(".js-fit-hero");
  const heroWrap = document.querySelector(".hero-title-wrap");

  if (!heroTitle || !heroWrap) {
    return;
  }

  const desktopMin = 64;
  const desktopMax = 420;
  const mobileMin = 48;
  const mobileMax = 92;
  let frameId = 0;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const fitTitle = () => {
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth <= 768;
    const minSize = isMobile ? mobileMin : desktopMin;
    const maxSize = isMobile ? mobileMax : desktopMax;
    const safePadding = isMobile ? 8 : 24;
    const availableWidth = Math.max(heroWrap.clientWidth - safePadding, minSize);
    const styles = window.getComputedStyle(heroTitle);
    const text = (heroTitle.textContent || "").trim();

    context.font = `${styles.fontWeight} 100px ${styles.fontFamily}`;
    const baseWidth = context.measureText(text).width || 1;
    const tracking = parseFloat(styles.letterSpacing) || 0;
    const characters = Math.max(text.length - 1, 0);
    const estimatedWidthAt100 = baseWidth + tracking * characters;
    const fittedSize = Math.floor((availableWidth / estimatedWidthAt100) * 100);

    heroTitle.style.whiteSpace = isMobile ? "normal" : "nowrap";
    heroTitle.style.fontSize = `${Math.max(minSize, Math.min(maxSize, fittedSize))}px`;

    while (
      !isMobile &&
      heroTitle.scrollWidth > availableWidth &&
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
  window.addEventListener("pageshow", queueFit);
  window.setTimeout(queueFit, 60);
  window.setTimeout(queueFit, 180);

  const resizeObserver = new ResizeObserver(queueFit);
  resizeObserver.observe(heroWrap);
})();
