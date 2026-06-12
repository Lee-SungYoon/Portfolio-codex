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

  const fitTitle = () => {
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth <= 768;
    const minSize = isMobile ? mobileMin : desktopMin;
    const maxSize = isMobile ? mobileMax : desktopMax;

    heroTitle.style.fontSize = `${maxSize}px`;

    while (
      heroTitle.scrollWidth > heroWrap.clientWidth &&
      parseFloat(heroTitle.style.fontSize) > minSize
    ) {
      heroTitle.style.fontSize = `${parseFloat(heroTitle.style.fontSize) - 2}px`;
    }
  };

  fitTitle();
  window.addEventListener("resize", fitTitle);
})();
