import Link from "next/link";
import type { Project } from "@/types/project";
import RevealMedia from "./RevealMedia";
import RevealText from "./RevealText";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card accent-${project.accent}`}>
      <Link href={`/works/${project.slug}`} className="project-card-link" aria-label={`View ${project.title}`}>
        <RevealMedia src={project.coverImage} alt={`${project.title} cover`} className="card-media" />
        <div className="card-pattern" aria-hidden="true">
          {Array.from({ length: 6 }, () => project.title).join(" ")}
        </div>
        <div className="card-index">{String(index + 1).padStart(2, "0")}</div>
        <RevealText className="card-copy" delay={0.08}>
          <div className="meta-row">
            <span>{project.categoryLabel}</span>
            <span>{project.year}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <span className="view-link">View project <i>↗</i></span>
        </RevealText>
      </Link>
    </article>
  );
}
