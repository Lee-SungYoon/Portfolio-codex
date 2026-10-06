const fs = require("fs");
const http = require("http");
const path = require("path");

const hostname = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 5317);
const root = __dirname;
const publicRoot = path.join(root, "public");
const dataPath = path.join(root, "data", "projects.json");

const projects = JSON.parse(fs.readFileSync(dataPath, "utf8")).sort((left, right) =>
  right.publishedAt.localeCompare(left.publishedAt),
);

const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
};

const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[char];
  });
}

function safeMediaUrl(value) {
  const candidate = String(value || "").trim();
  if (!candidate || candidate.startsWith("//")) {
    return "";
  }

  if (candidate.startsWith("/")) {
    return candidate;
  }

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:" ? candidate : "";
  } catch {
    return "";
  }
}

function renderImage(src, alt, loading = "lazy") {
  const safeSrc = safeMediaUrl(src);
  if (!safeSrc) {
    return `<div class="media-fallback" role="img" aria-label="Media unavailable"><span>Preview is temporarily unavailable.</span><small>SY ARCHIVE / MEDIA</small></div>`;
  }

  return `<img src="${escapeHtml(safeSrc)}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async" />`;
}

function resolveSafePath(basePath, requestPath) {
  const absoluteBase = path.resolve(basePath);
  const relativeRequest = String(requestPath || "").replace(/^[/\\]+/, "");
  const candidatePath = path.resolve(absoluteBase, relativeRequest);
  const relativePath = path.relative(absoluteBase, candidatePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return candidatePath;
}

function renderShell({ title, description, content }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles/globals.css" />
  </head>
  <body>
    ${content}
    <script>
      const revealItems = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      revealItems.forEach((item) => observer.observe(item));
    </script>
  </body>
</html>`;
}

function renderHeader() {
  return `<header class="site-header reveal">
      <a class="brand" href="/" aria-label="Lee. Sung Yoon home">SY ARCHIVE</a>
      <nav class="top-links" aria-label="Primary menu">
        <a class="text-link" href="/#work">WORK</a>
        <a class="text-link" href="/#about">ABOUT</a>
        <a class="talk-button" href="/#contact">MESSAGE</a>
      </nav>
    </header>`;
}

function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}

function getNextProject(slug) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

function getDetailVisuals(project) {
  const projectImages = [project.heroMedia, ...project.media]
    .filter((item) => item.type === "image")
    .map((item) => ({ url: item.url, caption: item.caption }));

  const relatedImages = projects
    .filter((item) => item.slug !== project.slug)
    .filter((item) => item.category === project.category || item.featured)
    .map((item) => ({ url: item.coverImage, caption: item.title }))
    .slice(0, 4);

  const seen = new Set();
  return [...projectImages, ...relatedImages].filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function renderHome() {
  const cards = projects
    .map(
      (project, index) => `
        <article class="project-card reveal" data-category="${escapeHtml(project.categoryLabel)}">
          <a class="project-link" href="/works/${escapeHtml(project.slug)}" aria-label="${escapeHtml(project.title)}">
            <div class="project-media image-hover">
              ${renderImage(project.coverImage, `${project.title} project thumbnail`, index < 2 ? "eager" : "lazy")}
              <span class="project-badge">${escapeHtml(project.categoryLabel)}</span>
              <span class="project-arrow" aria-hidden="true">↗</span>
              <h2 class="project-title">${escapeHtml(project.title)}</h2>
            </div>
          </a>
        </article>`,
    )
    .join("");

  return renderShell({
    title: "Lee. Sung Yoon - Portfolio",
    description: "Portfolio homepage for Lee. Sung Yoon.",
    content: `
      ${renderHeader()}
      <main>
        <section class="hero" id="about">
          <div class="hero-title-wrap reveal"><h1>Lee. Sung Yoon</h1></div>
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
      <footer class="footer-cta" id="contact">
        <p class="reveal">Available for Work</p>
        <a class="contact-link reveal" href="mailto:hello@example.com">Get in Touch</a>
        <div class="socials" aria-label="Social links">
          <a class="text-link" href="#">Behance</a>
          <a class="text-link" href="#">Dribbble</a>
          <a class="text-link" href="#">Instagram</a>
          <a class="text-link" href="#">LinkedIn</a>
        </div>
      </footer>`,
  });
}

function renderProjectDetail(project) {
  const nextProject = getNextProject(project.slug);
  const visuals = getDetailVisuals(project);
  const openingVisual = visuals[0];
  const gallery = visuals
    .slice(1)
    .map(
      (item, index) => `
        <figure class="detail-gallery-item ${index === 2 ? "is-wide" : ""} reveal">
          ${renderImage(item.url, item.caption)}
          <figcaption>${String(index + 1).padStart(2, "0")} / ${escapeHtml(item.caption)}</figcaption>
        </figure>`,
    )
    .join("");

  const story = project.history
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  return renderShell({
    title: `${project.title} - Lee. Sung Yoon`,
    description: project.summary,
    content: `
      ${renderHeader()}
      <main class="detail-page">
        <section class="detail-hero page-section">
          <div class="detail-hero-top reveal">
            <a class="detail-back-link" href="/#work">Back to Work</a>
            <div class="detail-hero-meta">
              <span>${escapeHtml(project.categoryLabel)}</span>
              <span>${escapeHtml(project.year)}</span>
            </div>
          </div>
          <div class="detail-title-row reveal">
            <h1>${escapeHtml(project.title)}</h1>
            <div class="detail-intro">
              <p class="detail-summary">${escapeHtml(project.summary)}</p>
              <p class="detail-caption">Structured after an editorial case-study rhythm, with a fixed archive header and layered media flow.</p>
            </div>
          </div>
        </section>

        <section class="detail-hero-media reveal">
          <figure class="detail-lead-figure">
            ${renderImage(openingVisual.url, openingVisual.caption, "eager")}
            <figcaption>${escapeHtml(openingVisual.caption)}</figcaption>
          </figure>
        </section>

        <section class="detail-content page-section">
          <div class="detail-content-grid">
            <aside class="detail-sidebar reveal">
              <div>
                <span class="detail-label">Role</span>
                <p>${escapeHtml(project.role.join(" / "))}</p>
              </div>
              <div>
                <span class="detail-label">Tools</span>
                <p>${escapeHtml(project.tools.join(" / "))}</p>
              </div>
              <div>
                <span class="detail-label">Release</span>
                <p>${escapeHtml(project.publishedAt)}</p>
              </div>
            </aside>

            <div class="detail-story">
              <div class="detail-section reveal">
                <span class="detail-label">Overview</span>
                ${story}
              </div>
              <div class="detail-section reveal">
                <span class="detail-label">Approach</span>
                <p>This placeholder copy marks out the future case-study area for process, references, campaign framing, and execution notes. The composition is tuned for generous vertical rhythm and image-first pacing.</p>
                <p>Once you are ready, we can swap this with final credits, challenge/solution sections, motion links, or production notes without changing the layout system.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="detail-gallery page-section">
          <div class="detail-gallery-grid">
            ${gallery}
          </div>
        </section>

        <section class="detail-pagination page-section reveal">
          <a class="next-project-card" href="/works/${escapeHtml(nextProject.slug)}" aria-label="Next project ${escapeHtml(nextProject.title)}">
            <div class="next-project-copy">
              <span>Next project</span>
              <h2>${escapeHtml(nextProject.title)}</h2>
              <p>${escapeHtml(nextProject.categoryLabel)} / ${escapeHtml(nextProject.year)}</p>
            </div>
            <div class="next-project-media">
              ${renderImage(nextProject.coverImage, `${nextProject.title} cover image`)}
            </div>
          </a>
        </section>
      </main>`,
  });
}

function sendHtml(res, html) {
  res.writeHead(200, {
    ...securityHeaders,
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(res.req?.method === "HEAD" ? undefined : html);
}

function sendFile(res, filePath) {
  if (!filePath) {
    res.writeHead(404, { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      ...securityHeaders,
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
      "Content-Length": data.length,
    });
    res.end(res.req?.method === "HEAD" ? undefined : data);
  });
}

http
  .createServer((req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { ...securityHeaders, Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" });
      res.end("Method not allowed");
      return;
    }

    let requestPath;
    try {
      requestPath = decodeURIComponent(new URL(req.url, `http://${hostname}:${port}`).pathname);
    } catch {
      res.writeHead(400, { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad request");
      return;
    }

    if (requestPath === "/" || requestPath === "/index.html") {
      sendHtml(res, renderHome());
      return;
    }

    if (requestPath.startsWith("/works/")) {
      const slug = requestPath.replace(/^\/works\//, "").replace(/\/$/, "");
      const project = getProject(slug);
      if (!project) {
        res.writeHead(302, { ...securityHeaders, Location: "/" });
        res.end();
        return;
      }
      sendHtml(res, renderProjectDetail(project));
      return;
    }

    if (requestPath.startsWith("/styles/")) {
      sendFile(res, resolveSafePath(root, requestPath));
      return;
    }

    sendFile(res, resolveSafePath(publicRoot, requestPath));
  })
  .listen(port, hostname, () => {
    console.log(`Lee Sung Yoon portfolio ready at http://127.0.0.1:${port}`);
  });
