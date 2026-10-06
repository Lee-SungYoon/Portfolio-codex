export const categories = ["All", "Brand", "AI Visual", "Motion", "Music"] as const;

export type Category = (typeof categories)[number];

export type Project = {
  title: string;
  category: Exclude<Category, "All">;
  image: string;
  href: string;
};

import { projects as archiveProjects } from "@/components/project-data";

function toCardCategory(category: string): Project["category"] {
  if (category === "ai") return "AI Visual";
  if (category === "motion") return "Motion";
  if (category === "music") return "Music";
  return "Brand";
}

export const projects: Project[] = archiveProjects.map((project) => ({
  title: project.title,
  category: toCardCategory(project.category),
  image: project.coverImage,
  href: `/works/${project.slug}`,
}));
