import homeProjects from "@/data/home-projects.json";

export type ProjectCategory = "Brand" | "AI Visual" | "Motion" | "Music";
export type Category = "All" | ProjectCategory;

export type Project = {
  title: string;
  category: ProjectCategory;
  image: string;
  href: string;
};

export const projects = homeProjects as Project[];

export const categories: readonly Category[] = [
  "All",
  ...new Set(projects.map((project) => project.category)),
];
