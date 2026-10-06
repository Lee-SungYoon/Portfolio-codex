import type { Project } from "@/types/project";
import ArchiveProjectCard from "./ArchiveProjectCard";

export default function VisualFeed({
  projects,
  layout = "all",
}: {
  projects: Project[];
  layout?: "all" | "brand" | "ai" | "motion" | "music";
}) {
  return (
    <div className={`visual-feed visual-feed--${layout}`}>
      {projects.map((project, index) => (
        <ArchiveProjectCard project={project} index={index} key={project.slug} />
      ))}
    </div>
  );
}
