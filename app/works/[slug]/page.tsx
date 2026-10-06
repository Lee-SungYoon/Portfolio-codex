import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { getNextProject, getProject, projects } from "@/components/project-data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

function getDetailVisuals(slug: string) {
  const current = getProject(slug);
  if (!current) return [];

  const projectImages = [current.heroMedia, ...current.media]
    .filter((item) => item.type === "image")
    .map((item) => ({ url: item.url, caption: item.caption }));

  const relatedImages = projects
    .filter((item) => item.slug !== current.slug)
    .filter((item) => item.category === current.category || item.featured)
    .map((item) => ({ url: item.coverImage, caption: item.title }))
    .slice(0, 4);

  const seen = new Set<string>();
  return [...projectImages, ...relatedImages].filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);
  const visuals = getDetailVisuals(project.slug);
  const openingVisual = visuals[0] ?? { url: project.coverImage, caption: project.title };

  return (
    <>
      <Header />
      <main className="detail-page">
        <section className="detail-hero page-section">
          <div className="detail-hero-top reveal">
            <Link className="detail-back-link" href="/#work">
              Back to Work
            </Link>
            <div className="detail-hero-meta">
              <span>{project.categoryLabel}</span>
              <span>{project.year}</span>
            </div>
          </div>

          <div className="detail-title-row reveal">
            <h1>{project.title}</h1>
            <div className="detail-intro">
              <p className="detail-summary">{project.summary}</p>
              <p className="detail-caption">
                Structured after an editorial case-study rhythm, with a fixed archive header
                and layered media flow.
              </p>
            </div>
          </div>
        </section>

        <section className="detail-hero-media reveal">
          <figure className="detail-lead-figure">
            <img src={openingVisual.url} alt={openingVisual.caption} />
            <figcaption>{openingVisual.caption}</figcaption>
          </figure>
        </section>

        <section className="detail-content page-section">
          <div className="detail-content-grid">
            <aside className="detail-sidebar reveal">
              <div>
                <span className="detail-label">Role</span>
                <p>{project.role.join(" / ")}</p>
              </div>
              <div>
                <span className="detail-label">Tools</span>
                <p>{project.tools.join(" / ")}</p>
              </div>
              <div>
                <span className="detail-label">Release</span>
                <p>{project.publishedAt}</p>
              </div>
            </aside>

            <div className="detail-story">
              <div className="detail-section reveal">
                <span className="detail-label">Overview</span>
                {project.history.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="detail-section reveal">
                <span className="detail-label">Approach</span>
                <p>
                  This placeholder copy marks out the future case-study area for process,
                  references, campaign framing, and execution notes. The composition is tuned
                  for generous vertical rhythm and image-first pacing.
                </p>
                <p>
                  Once you are ready, we can swap this with final credits, challenge and
                  solution sections, motion links, or production notes without changing the
                  layout system.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="detail-gallery page-section">
          <div className="detail-gallery-grid">
            {visuals.slice(1).map((item, index) => (
              <figure
                className={`detail-gallery-item reveal ${index === 2 ? "is-wide" : ""}`.trim()}
                key={`${item.url}-${index}`}
              >
                <img src={item.url} alt={item.caption} />
                <figcaption>
                  {String(index + 1).padStart(2, "0")} / {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="detail-pagination page-section reveal">
          <Link
            className="next-project-card"
            href={`/works/${next.slug}`}
            aria-label={`Next project ${next.title}`}
          >
            <div className="next-project-copy">
              <span>Next project</span>
              <h2>{next.title}</h2>
              <p>
                {next.categoryLabel} / {next.year}
              </p>
            </div>
            <div className="next-project-media">
              <img src={next.coverImage} alt={`${next.title} cover image`} />
            </div>
          </Link>
        </section>
      </main>
    </>
  );
}
