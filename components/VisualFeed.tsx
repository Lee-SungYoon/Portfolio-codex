import type { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
export default function VisualFeed({ projects }: { projects:Project[] }) { return <div className="visual-feed">{projects.map((project,index)=><ProjectCard project={project} index={index} key={project.slug} />)}</div>; }
