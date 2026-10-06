import Link from "next/link";
import type { Project } from "@/types/project";
import RevealMedia from "./RevealMedia";
import RevealText from "./RevealText";

export default function ArchiveProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className={`archive-card archive-card--${project.category}`}>
      <Link
        href={`/works/${project.slug}`}
        className="archive-card-link"
        aria-label={`View ${project.title}`}
      >
        <RevealMedia src={project.coverImage} alt={`${project.title} cover`} className="archive-card-media" />
        <div className="archive-card-badge">{project.categoryLabel}</div>
        <div className="archive-card-arrow" aria-hidden="true">
          ↗
        </div>
        <RevealText className="archive-card-copy" delay={0.05 + index * 0.02}>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
        </RevealText>
      </Link>
    </article>
  );
}
