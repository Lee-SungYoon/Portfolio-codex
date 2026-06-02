import type { Project } from "@/types/project";
import RevealMedia from "./RevealMedia";
export default function ProjectHero({ project }: { project: Project }) { return <section className="project-hero"><RevealMedia src={project.heroMedia.url} alt={project.heroMedia.caption} eager /><div className="project-hero-overlay"><p>{project.categoryLabel} / {project.year}</p><h1>{project.title}</h1></div></section>; }
