const fs = require("fs");
const http = require("http");
const path = require("path");

const hostname = "127.0.0.1";
const port = Number(process.env.PORT || 5317);
const root = __dirname;
const fallbackHomeProjects = require(path.join(root, "data", "home-projects.json"));
const aboutContent = require(path.join(root, "data", "about-content.json"));
const fallbackWorkProjects = require(path.join(root, "data", "work-projects.json"));
const generatedProjectsPath = path.join(root, "data", "nas-projects.generated.json");
const fileCache = new Map();

const mimeTypes = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

const socialLinks = ["Behance", "Dribbble", "Instagram", "LinkedIn"];
const socialMarkup = socialLinks
  .map((label) => `<a class="text-link" href="#">${escapeHtml(label)}</a>`)
  .join("");
const categoryTagMap = {
  Brand: ["Brand Platform", "Identity System", "Campaign Application"],
  AI: ["AI Visual", "Generative System", "Digital Expression"],
  "AI Visual": ["AI Visual", "Generative System", "Digital Expression"],
  Motion: ["Motion System", "Narrative Frame", "Campaign Motion"],
  Music: ["Sound Direction", "Visual Identity", "Editorial Story"],
  Strategy: ["Brand Strategy", "Audience Framing", "Experience Direction"],
};

function renderHeader({ workHref, aboutHref, dark = false }) {
  return `
    <header class="site-header reveal${dark ? " site-header--dark" : ""}">
      <a class="header-cta${dark ? " header-cta--light" : ""}" href="#contact">MASSAGE</a>
      <nav class="top-links" aria-label="Primary menu">
        <a class="text-link" href="/">HOME</a>
        <a class="text-link" href="${workHref}">WORK</a>
        <a class="text-link" href="${aboutHref}">ABOUT</a>
      </nav>
    </header>`;
}

function getWorkCardClass(index) {
  return index % 7 === 0 || index % 7 === 3 ? "works-card--wide" : "works-card--standard";
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProjectHref(project) {
  if (project.href && project.href.startsWith("/")) {
    return project.href;
  }

  return `/works/${project.slug || slugify(project.title)}`;
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

function renderMediaTag(src, alt, eager = false) {
  const isVideo = /\.mp4$/i.test(src);
  if (isVideo) {
    return `<video src="${escapeHtml(src)}" autoplay muted loop playsinline controls poster="" ${eager ? 'preload="auto"' : 'preload="metadata"'}></video>`;
  }

  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" ${eager ? 'loading="eager" fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} />`;
}

function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function toIsoDate(value) {
  const text = String(value || "").trim();
  const shortMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (shortMatch) {
    return `20${shortMatch[1]}-${shortMatch[2]}-${shortMatch[3]}`;
  }

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  return "";
}

function normalizeProjectRecord(project) {
  const slug = project.slug || slugify(project.title);
  const filterGroup =
    project.filterGroup || (project.category === "AI" || project.category === "AI Visual" ? "AI Visual" : project.category === "Strategy" ? "Brand" : project.category || "Brand");
  const category = project.category === "AI Visual" ? "AI" : project.category || "Brand";
  const thumbnail = project.thumbnail || project.coverImage || project.heroImage || project.image;
  const heroImage = project.heroImage || project.coverImage || project.thumbnail || project.image;
  const coverImage = project.coverImage || project.thumbnail || project.heroImage || project.image;

  return {
    title: project.title,
    slug,
    href: project.href || `/works/${slug}`,
    status: project.status || "published",
    category,
    filterGroup,
    date: project.date || "",
    publishedAt: project.publishedAt || toIsoDate(project.date),
    year: String(project.year || "2026"),
    location: project.location || "Seoul, KR",
    summary: project.summary || project.description || "",
    description: project.description || project.summary || "",
    tags: Array.isArray(project.tags) ? project.tags : [],
    thumbnail,
    heroImage,
    coverImage,
    gallery: Array.isArray(project.gallery) ? project.gallery : [],
    fullMedia: Array.isArray(project.fullMedia) ? project.fullMedia : [],
    splitMedia: Array.isArray(project.splitMedia) ? project.splitMedia : [],
    videos: Array.isArray(project.videos) ? project.videos : [],
    quote: project.quote || "",
    quoteName: project.quoteName || "Lee Sung Yoon",
    quoteRole: project.quoteRole || "Creative Director",
  };
}

function fallbackPortfolioProjects() {
  return fallbackWorkProjects.map((project) =>
    normalizeProjectRecord({
      title: project.title,
      slug: slugify(project.title),
      href: project.href,
      category: project.category,
      filterGroup: project.filterGroup,
      date: project.date,
      summary: project.description,
      description: project.description,
      thumbnail: project.image,
      heroImage: project.image,
      coverImage: project.image,
      gallery: [project.image],
      fullMedia: [project.image],
      splitMedia: [project.image],
      videos: [],
    }),
  );
}

function loadPortfolioProjects() {
  const generated = readJsonFile(generatedProjectsPath, []);
  const normalized = Array.isArray(generated) ? generated.map(normalizeProjectRecord) : [];
  const projects = normalized.length > 0 ? normalized : fallbackPortfolioProjects();
  return projects.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "") || a.title.localeCompare(b.title));
}

function homeProjectsFromPortfolio(allProjects) {
  if (allProjects.length > 0) {
    return allProjects.slice(0, 6).map((project) => ({
      title: project.title,
      category: project.filterGroup,
      description: project.description,
      date: project.date,
      image: project.coverImage || project.thumbnail || project.heroImage,
      href: project.href,
      slug: project.slug,
    }));
  }

  return fallbackHomeProjects;
}

function loadCaseStudyBySlug(slug) {
  const allProjects = loadPortfolioProjects();
  const index = allProjects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return null;
  }

  return buildCaseStudy(allProjects[index], index, allProjects);
}

function buildCaseStudy(project, index, allProjects) {
  const slug = slugify(project.title);
  const mediaPool = allProjects.flatMap((item) => [
    item.heroImage,
    item.coverImage,
    item.thumbnail,
    ...item.gallery,
    ...item.fullMedia,
    ...item.splitMedia,
  ]).filter(Boolean);
  const allImages = mediaPool.length > 0 ? mediaPool : fallbackWorkProjects.map((item) => item.image);
  const pickImage = (offset) => allImages[(index + offset) % allImages.length];
  const tags = project.tags && project.tags.length > 0 ? project.tags : [project.filterGroup, ...(categoryTagMap[project.filterGroup] || categoryTagMap[project.category] || categoryTagMap.Brand)];
  const categoryTone = project.filterGroup === "Music" ? "sound-led storytelling" : project.filterGroup === "Motion" ? "motion-first digital identity" : project.filterGroup === "AI Visual" ? "generative image-making" : "editorial brand direction";
  const splitImage = project.splitMedia[0] || project.gallery[0] || project.heroImage || pickImage(1);
  const fullImage = project.fullMedia[0] || project.gallery[1] || project.coverImage || pickImage(2);
  const motionPoster = project.videos[0] || project.gallery[2] || project.heroImage || pickImage(3);
  const toolkitImages = [project.gallery[0], project.gallery[1], project.gallery[2]].filter(Boolean);
  const galleryImages = [...project.gallery, ...project.fullMedia].filter(Boolean).slice(0, 4);

  return {
    slug,
    title: project.title,
    category: project.category,
    filterGroup: project.filterGroup,
    tags,
    date: project.date,
    summary: project.summary || `${project.title} is presented as a premium case study around ${categoryTone}, combining expressive imagery, digital touchpoints, and a refined visual system.`,
    challenge: [
      `The challenge was to turn ${project.title.toLowerCase()} into a flexible brand world that feels immediate, distinct, and memorable across campaign, editorial, and digital environments.`,
      "The system needed to stay visually sharp at thumbnail scale while also expanding into long-form storytelling, interface moments, and large-format applications.",
    ],
    strategyTitle: `A visual system that stretches from concept to lived brand experience`,
    strategyBody:
      "We shaped the narrative around clarity, mood, and repeatable assets, allowing the identity to move naturally from hero moments into product storytelling, motion surfaces, and campaign applications.",
    closingTitle: "A case-study framework built to carry images, story, and motion together",
    closingBody:
      "This shared template gives each project room for large visuals, concise narrative sections, and future motion or embedded media while keeping the reading rhythm calm and premium.",
    quote:
      project.quote || "The new format lets us present each project as a real story, not just a gallery of frames, while keeping the experience clear and restrained.",
    quoteName: project.quoteName || "Lee Sung Yoon",
    quoteRole: project.quoteRole || "Creative Director",
    heroImage: project.heroImage || project.coverImage || project.thumbnail || pickImage(0),
    splitImage,
    fullImage,
    motionPoster,
    toolkitImages: toolkitImages.length > 0 ? toolkitImages : [pickImage(4), pickImage(5), pickImage(6)],
    galleryImages: galleryImages.length > 0 ? galleryImages : [pickImage(7), pickImage(8), pickImage(9), pickImage(10)],
    lifestyleImage: project.gallery[3] || project.coverImage || pickImage(11),
    colorPalette: ["#111111", "#d9d3cd", "#8f5a3c", "#bcc7d5"],
    typographySample: "Editorial clarity meets cinematic restraint.",
    href: `/works/${slug}`,
  };
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
  const cards = homeProjectsFromPortfolio(loadPortfolioProjects())
    .map(
      ({ title, category, description, date, image, href }, index) => `
        <article class="project-card reveal" data-category="${escapeHtml(category)}">
          <a class="project-link" href="${escapeHtml(getProjectHref({ title, href }))}" aria-label="${escapeHtml(title)}">
            <div class="project-media image-hover">
              <img src="${escapeHtml(image)}" alt="${escapeHtml(title)} project thumbnail" ${index < 2 ? 'loading="eager" fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} />
              <span class="project-badge">${escapeHtml(category)}</span>
              <span class="project-arrow" aria-hidden="true">↗</span>
              <div class="project-copy">
                <h2 class="project-title">${escapeHtml(title)}</h2>
                <p class="project-description">${escapeHtml(description || "")}</p>
                <p class="project-date">${escapeHtml(date || "")}</p>
              </div>
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
  const workProjects = loadPortfolioProjects();
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
          class="works-card ${getWorkCardClass(index)} reveal"
          data-filter-group="${escapeHtml(project.filterGroup)}"
          data-category="${escapeHtml(project.category)}"
          style="transition-delay: ${index * 80}ms;"
        >
          <a class="works-card-link" href="${escapeHtml(getProjectHref(project))}" aria-label="${escapeHtml(project.title)}">
            <div class="works-media image-hover">
              <img src="${escapeHtml(project.coverImage || project.thumbnail || project.heroImage)}" alt="${escapeHtml(project.title)} thumbnail" loading="lazy" decoding="async" />
              <span class="works-badge">${escapeHtml(project.filterGroup)}</span>
              <span class="works-arrow" aria-hidden="true">↗</span>
              <div class="works-copy">
                <h2 class="works-title">${escapeHtml(project.title)}</h2>
                <p class="works-description">${escapeHtml(project.description || project.summary || "")}</p>
                <p class="works-date">${escapeHtml(project.date || "")}</p>
              </div>
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

function renderCaseStudy(study) {
  const tagsMarkup = study.tags
    ? study.tags.map((tag) => `<span class="case-tag">${escapeHtml(tag)}</span>`).join("")
    : "";
  const challengeMarkup = study.challenge
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  const toolkitMarkup = study.toolkitImages
    .map(
      (image, index) => `
        <figure class="case-stacked-item reveal">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(study.title)} toolkit view ${index + 1}" loading="lazy" decoding="async" />
        </figure>`,
    )
    .join("");
  const galleryMarkup = study.galleryImages
    .map(
      (image, index) => `
        <figure class="case-gallery-item${index === 2 ? " case-gallery-item--wide" : ""} reveal">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(study.title)} application view ${index + 1}" loading="lazy" decoding="async" />
        </figure>`,
    )
    .join("");
  const swatchMarkup = study.colorPalette
    .map(
      (color) => `
        <div class="case-swatch">
          <span style="background:${escapeHtml(color)}"></span>
          <small>${escapeHtml(color)}</small>
        </div>`,
    )
    .join("");
  const moreWorkMarkup = loadPortfolioProjects()
    .filter((item) => item.slug !== study.slug)
    .slice(0, 2)
    .map(
      (item) => `
        <article class="case-more-card reveal">
          <a href="${escapeHtml(getProjectHref(item))}" class="case-more-link">
            <div class="case-more-media image-hover">
              <img src="${escapeHtml(item.heroImage || item.coverImage || item.thumbnail)}" alt="${escapeHtml(item.title)} preview" loading="lazy" decoding="async" />
            </div>
            <div class="case-more-copy">
              <p>${escapeHtml(item.filterGroup || item.category)}</p>
              <h3>${escapeHtml(item.title)}</h3>
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
    <title>${escapeHtml(study.title)} - Lee Sung Yoon</title>
    <meta name="description" content="${escapeHtml(study.summary)}" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles/globals.css" />
    <script src="/scripts/reveal.js" defer></script>
  </head>
  <body class="page-case">
    ${renderHeader({ workHref: "/works", aboutHref: "/about" })}
    <main class="case-page">
      <section class="case-hero">
        <div class="case-hero-copy reveal">
          <a class="case-back text-link" href="/works">Back to Work</a>
          <p class="case-kicker">Case Study</p>
          <h1>${escapeHtml(study.title)}</h1>
          <div class="case-tags">${tagsMarkup}</div>
        </div>
        <div class="case-hero-media reveal">
          ${renderMediaTag(study.heroImage, `${study.title} hero image`, true)}
        </div>
      </section>

      <section class="case-summary reveal">
        <p class="case-label">Project Summary</p>
        <div>
          <h2>${escapeHtml(study.summary)}</h2>
          <p class="case-meta-line">${escapeHtml(study.category)} / ${escapeHtml(study.date)}</p>
        </div>
      </section>

      <section class="case-text-grid reveal">
        <p class="case-label">The Challenge</p>
        <div class="case-richtext">
          ${challengeMarkup}
        </div>
      </section>

      <section class="case-split reveal">
        <div class="case-split-copy">
          <p class="case-label">Brand Idea</p>
          <h2>${escapeHtml(study.strategyTitle)}</h2>
          <p>${escapeHtml(study.strategyBody)}</p>
        </div>
        <div class="case-split-media">
          ${renderMediaTag(study.splitImage, `${study.title} strategy visual`)}
        </div>
      </section>

      <section class="case-media-full reveal">
        ${renderMediaTag(study.fullImage, `${study.title} full width visual`)}
      </section>

      <section class="case-brand-system">
        <div class="case-system-head reveal">
          <p class="case-label">Identity System</p>
          <h2>Logo, color, type, motion, and applications arranged as one editorial story.</h2>
        </div>
        <div class="case-stacked-media">
          ${toolkitMarkup}
        </div>
      </section>

      <section class="case-motion reveal">
        <div class="case-motion-copy">
          <p class="case-label">Motion / Video</p>
          <h2>A dedicated media block ready for showreels, motion tests, or campaign films.</h2>
          <p>For now this section is populated with still imagery, but the layout is prepared so future projects can drop in video without changing the overall page rhythm.</p>
        </div>
        <div class="case-motion-media">
          ${renderMediaTag(study.motionPoster, `${study.title} motion media`)}
        </div>
      </section>

      <section class="case-color-type">
        <div class="case-color reveal">
          <p class="case-label">Color System</p>
          <div class="case-swatch-grid">${swatchMarkup}</div>
        </div>
        <div class="case-type reveal">
          <p class="case-label">Typography</p>
          <div class="case-type-sample">Aa</div>
          <p>${escapeHtml(study.typographySample)}</p>
        </div>
      </section>

      <section class="case-gallery">
        <div class="case-system-head reveal">
          <p class="case-label">Applications</p>
          <h2>Billboard, social, digital, and campaign surfaces shown as a flexible image grid.</h2>
        </div>
        <div class="case-gallery-grid">
          ${galleryMarkup}
        </div>
      </section>

      <section class="case-lifestyle reveal">
        <p class="case-label">Lifestyle Photography</p>
        <div class="case-lifestyle-media">
          ${renderMediaTag(study.lifestyleImage, `${study.title} lifestyle image`)}
        </div>
      </section>

      <section class="case-closing reveal">
        <p class="case-label">Closing Statement</p>
        <h2>${escapeHtml(study.closingTitle)}</h2>
        <p>${escapeHtml(study.closingBody)}</p>
      </section>

      <section class="case-quote reveal">
        <blockquote>${escapeHtml(study.quote)}</blockquote>
        <footer>
          <strong>${escapeHtml(study.quoteName)}</strong>
          <span>${escapeHtml(study.quoteRole)}</span>
        </footer>
      </section>

      <section class="case-more-work">
        <div class="case-system-head reveal">
          <p class="case-label">More Work</p>
          <h2>Explore another project from the archive.</h2>
        </div>
        <div class="case-more-grid">
          ${moreWorkMarkup}
        </div>
      </section>
    </main>
    ${renderFooter(false)}
  </body>
</html>`;
}

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
      res.end(req.method === "HEAD" ? "" : renderHome());
      return;
    }

    if (requestPath === "/about" || requestPath === "/about/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(req.method === "HEAD" ? "" : renderAbout());
      return;
    }

    if (requestPath === "/works" || requestPath === "/works/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(req.method === "HEAD" ? "" : renderWorks());
      return;
    }

    if (requestPath.startsWith("/works/")) {
      const slug = requestPath.replace(/^\/works\//, "").replace(/\/$/, "");
      const study = loadCaseStudyBySlug(slug);

      if (study) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
        res.end(req.method === "HEAD" ? "" : renderCaseStudy(study));
        return;
      }
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
