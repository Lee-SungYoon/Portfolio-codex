import Link from "next/link";
import { notFound } from "next/navigation";
import MediaGallery from "@/components/MediaGallery";
import ProjectHero from "@/components/ProjectHero";
import RevealMedia from "@/components/RevealMedia";
import RevealText from "@/components/RevealText";
import { getNextProject, getProject, projects } from "@/components/project-data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const next = getNextProject(project.slug);

  return (
    <article className="detail-page">
      <Link href="/works" className="back-link">← Back to works</Link>
      <ProjectHero project={project} />
      <section className="detail-copy page-section">
        <RevealText>
          <div className="section-kicker">Project notes / {project.year}</div>
          <p className="detail-lede">{project.summary}</p>
        </RevealText>
        <div className="metadata-grid">
          <div><span>Role</span><p>{project.role.join(" / ")}</p></div>
          <div><span>Tools</span><p>{project.tools.join(" / ")}</p></div>
        </div>
        <section className="history-block">
          <div className="section-kicker">Production history</div>
          {project.history.map((paragraph, index) => (
            <RevealText key={paragraph} delay={index * 0.06}><p>{paragraph}</p></RevealText>
          ))}
        </section>
        <MediaGallery media={project.media} />
      </section>
      <Link className="next-project" href={`/works/${next.slug}`}>
        <RevealMedia src={next.coverImage} alt={`${next.title} cover`} />
        <div>
          <span>Next project</span>
          <h2>{next.title}</h2>
          <i>↗</i>
        </div>
      </Link>
    </article>
  );
}
