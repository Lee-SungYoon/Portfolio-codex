const fs = require("fs");
const http = require("http");
const path = require("path");

const hostname = "127.0.0.1";
const port = Number(process.env.PORT || 5317);
const root = __dirname;
const projects = require(path.join(root, "data", "home-projects.json"));
const aboutContent = require(path.join(root, "data", "about-content.json"));
const workProjects = require(path.join(root, "data", "work-projects.json"));
const fileCache = new Map();

const mimeTypes = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

const socialLinks = ["Behance", "Dribbble", "Instagram", "LinkedIn"];
const socialMarkup = socialLinks
  .map((label) => `<a class="text-link" href="#">${escapeHtml(label)}</a>`)
  .join("");

function renderHeader({ workHref, aboutHref, dark = false }) {
  return `
    <header class="site-header reveal${dark ? " site-header--dark" : ""}">
      <a class="brand" href="/" aria-label="Lee. Sung Yoon home">SY ARCHIVE</a>
      <nav class="top-links" aria-label="Primary menu">
        <a class="text-link" href="${workHref}">WORK</a>
        <a class="text-link" href="${aboutHref}">ABOUT</a>
        <a class="talk-button${dark ? " talk-button--light" : ""}" href="#contact">MESSAGE</a>
      </nav>
    </header>`;
}

function renderFooter(panel = false) {
  return `
    <footer class="footer-cta${panel ? " footer-cta--panel" : ""}" id="contact">
      <p class="reveal">Available for Work</p>
      <a class="contact-link reveal" href="mailto:hello@example.com">Get in Touch</a>
      <div class="socials" aria-label="Social links">${socialMarkup}</div>
    </footer>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[char];
  });
}

function getCacheControl(extension) {
  if (extension === ".jpg" || extension === ".jpeg" || extension === ".png" || extension === ".svg") {
    return "public, max-age=86400";
  }

  if (extension === ".js" || extension === ".css") {
    return "public, max-age=0, must-revalidate";
  }

  return "no-store";
}

function getCachedFile(filePath) {
  const stats = fs.statSync(filePath);
  const cacheKey = `${filePath}:${stats.mtimeMs}:${stats.size}`;
  const cached = fileCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  for (const key of fileCache.keys()) {
    if (key.startsWith(`${filePath}:`)) {
      fileCache.delete(key);
    }
  }

  const asset = {
    content: fs.readFileSync(filePath),
    etag: `"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`,
    cacheControl: getCacheControl(path.extname(filePath)),
  };

  fileCache.set(cacheKey, asset);
  return asset;
}

function renderHome() {
  const cards = projects
    .map(
      ({ title, category, image, href }, index) => `
        <article class="project-card reveal" data-category="${escapeHtml(category)}">
          <a class="project-link" href="${escapeHtml(href)}" aria-label="${escapeHtml(title)}">
            <div class="project-media image-hover">
              <img src="${escapeHtml(image)}" alt="${escapeHtml(title)} project thumbnail" ${index < 2 ? 'loading="eager" fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} />
              <span class="project-badge">${escapeHtml(category)}</span>
              <span class="project-arrow" aria-hidden="true">↗</span>
              <h2 class="project-title">${escapeHtml(title)}</h2>
            </div>
          </a>
        </article>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lee. Sung Yoon - Portfolio</title>
    <meta name="description" content="Portfolio homepage for Lee. Sung Yoon." />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles/globals.css" />
    <script src="/scripts/fit-hero.js" defer></script>
    <script src="/scripts/reveal.js" defer></script>
  </head>
  <body class="page-home">
    ${renderHeader({ workHref: "/works", aboutHref: "/about" })}
    <main>
      <section class="hero" id="about">
        <div class="hero-title-wrap reveal"><h1 class="js-fit-hero">Lee Sung Yoon</h1></div>
        <div class="hero-meta reveal" aria-label="Portfolio summary">
          <p>Web &amp; Digital Experiences</p>
          <p>Design, Motion, Brand Identity</p>
          <p>Seoul, KR</p>
          <p>2026</p>
        </div>
      </section>
      <section class="work" id="work">
        <div class="portfolio-grid" aria-live="polite">${cards}</div>
      </section>
    </main>
    ${renderFooter(false)}
  </body>
</html>`;
}

function renderAbout() {
  const servicesMarkup = aboutContent.services
    .map(
      (service) => `
        <article class="about-list-item">
          <span>${escapeHtml(service.index)}</span>
          <div>
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
          </div>
        </article>`,
    )
    .join("");

  const highlightsMarkup = aboutContent.highlights
    .map(
      (item) => `
        <article class="about-list-item about-list-item--highlight">
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.label)}</p>
          </div>
          <div>
            <p>${escapeHtml(item.detail)}</p>
          </div>
          <span>${escapeHtml(item.year)}</span>
        </article>`,
    )
    .join("");

  const [firstLine, secondLine = ""] = aboutContent.title.split(" ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>About - Lee. Sung Yoon</title>
    <meta name="description" content="About Lee. Sung Yoon." />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles/globals.css" />
    <script src="/scripts/reveal.js" defer></script>
  </head>
  <body class="page-about">
    ${renderHeader({ workHref: "/works", aboutHref: "/about", dark: true })}
    <main>
      <section class="about-page">
        <div class="about-hero reveal">
          <h1 class="about-title">
            <span>${escapeHtml(firstLine)}</span>
            <span>${escapeHtml(secondLine)}</span>
          </h1>
          <p class="about-intro">${escapeHtml(aboutContent.intro)}</p>
          <div class="about-portrait-wrap">
            <img class="about-portrait" src="${escapeHtml(aboutContent.portraitImage)}" alt="Lee. Sung Yoon portrait" loading="eager" fetchpriority="high" decoding="async" />
          </div>
        </div>
        <section class="about-section reveal">
          <div class="about-section-copy">
            <h2>${escapeHtml(aboutContent.servicesHeading)}</h2>
            <p>${escapeHtml(aboutContent.servicesIntro)}</p>
          </div>
          <div class="about-list">${servicesMarkup}</div>
        </section>
        <section class="about-section reveal">
          <div class="about-section-copy">
            <h2>${escapeHtml(aboutContent.highlightsHeading)}</h2>
            <p>${escapeHtml(aboutContent.highlightsIntro)}</p>
          </div>
          <div class="about-list">${highlightsMarkup}</div>
        </section>
      </section>
    </main>
    ${renderFooter(true)}
  </body>
</html>`;
}

function renderWorks() {
  const filterMarkup = ["All", "Brand", "AI Visual", "Motion", "Music"]
    .map(
      (filter, index) => `
        <button
          class="works-filter${index === 0 ? " is-active" : ""}"
          type="button"
          role="tab"
          aria-selected="${index === 0 ? "true" : "false"}"
          data-filter="${escapeHtml(filter)}"
        >
          ${escapeHtml(filter)}
        </button>`,
    )
    .join("");

  const cardsMarkup = workProjects
    .map(
      (project, index) => `
        <article
          class="works-card works-card--${escapeHtml(project.layout)} reveal"
          data-filter-group="${escapeHtml(project.filterGroup)}"
          data-category="${escapeHtml(project.category)}"
          style="transition-delay: ${index * 80}ms;"
        >
          <a class="works-card-link" href="${escapeHtml(project.href)}" aria-label="${escapeHtml(project.title)}">
            <div class="works-media image-hover">
              <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} thumbnail" loading="lazy" decoding="async" />
              <span class="works-badge">${escapeHtml(project.category)}</span>
              <h2 class="works-title">${escapeHtml(project.title)}</h2>
            </div>
          </a>
        </article>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Work - Lee. Sung Yoon</title>
    <meta name="description" content="Work index for Lee. Sung Yoon." />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles/globals.css" />
    <script src="/scripts/reveal.js" defer></script>
    <script src="/scripts/work-filter.js" defer></script>
  </head>
  <body class="page-work">
    ${renderHeader({ workHref: "/works", aboutHref: "/about" })}
    <main>
      <section class="works-page">
        <div class="works-head reveal">
          <div>
            <p class="works-kicker">Portfolio Index</p>
            <h1>Work</h1>
          </div>
          <p class="works-summary">Newest-first project listing with fixed category filters and category-based thumbnail layout rules.</p>
        </div>
        <div class="works-filter-nav reveal" aria-label="Work categories" role="tablist">
          ${filterMarkup}
        </div>
        <div class="works-grid" aria-live="polite">
          ${cardsMarkup}
        </div>
      </section>
    </main>
    ${renderFooter(false)}
  </body>
</html>`;
}

const homePage = renderHome();
const aboutPage = renderAbout();
const worksPage = renderWorks();

function sendFile(req, res, filePath) {
  try {
    const asset = getCachedFile(filePath);

    if (req.headers["if-none-match"] === asset.etag) {
      res.writeHead(304, {
        ETag: asset.etag,
        "Cache-Control": asset.cacheControl,
      });
      res.end();
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": asset.cacheControl,
      ETag: asset.etag,
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    res.end(asset.content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

function resolveSafePath(basePath, requestPath) {
  const normalizedPath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const candidatePath = path.join(basePath, normalizedPath);

  if (!candidatePath.startsWith(basePath)) {
    return null;
  }

  return candidatePath;
}

http
  .createServer((req, res) => {
    const requestPath = decodeURIComponent(new URL(req.url, `http://${hostname}:${port}`).pathname);

    if (requestPath === "/" || requestPath === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(req.method === "HEAD" ? "" : homePage);
      return;
    }

    if (requestPath === "/about" || requestPath === "/about/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(req.method === "HEAD" ? "" : aboutPage);
      return;
    }

    if (requestPath === "/works" || requestPath === "/works/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(req.method === "HEAD" ? "" : worksPage);
      return;
    }

    if (requestPath.startsWith("/styles/")) {
      const filePath = resolveSafePath(root, requestPath);
      if (filePath) {
        sendFile(req, res, filePath);
        return;
      }
    }

    const publicRoot = path.join(root, "public");
    const filePath = resolveSafePath(publicRoot, requestPath);
    if (filePath) {
      sendFile(req, res, filePath);
      return;
    }

    res.writeHead(302, { Location: "/" });
    res.end();
  })
  .listen(port, hostname, () => {
    console.log(`Lee Sung Yoon portfolio ready at http://127.0.0.1:${port}`);
  });
