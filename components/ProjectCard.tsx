import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="project-card reveal">
      <Link className="project-link" href={project.href} aria-label={project.title}>
        <div className="project-media image-hover">
          <Image
            src={project.image}
            alt={`${project.title} project thumbnail`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={priority}
          />
          <span className="project-badge">{project.category}</span>
          <span className="project-arrow" aria-hidden="true">
            ↗
          </span>
          <h2 className="project-title">{project.title}</h2>
        </div>
      </Link>
    </article>
  );
}
