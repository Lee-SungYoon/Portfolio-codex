import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectGrid() {
  return (
    <section className="work" id="work">
      <div className="portfolio-grid" aria-live="polite">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
