import projectsJson from "@/data/projects.json";
import type { Category,Project } from "@/types/project";
export const projects=[...(projectsJson as Project[])].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
export const categories:{value:"all"|Category;label:string;short:string}[]=[{value:"all",label:"All Works",short:"All"},{value:"brand-design",label:"Brand Design",short:"Brand"},{value:"motion-graphic",label:"Motion Graphic",short:"Motion"},{value:"music",label:"Music",short:"Music"},{value:"generative-ai",label:"Generative AI",short:"AI"}];
export function getProject(slug:string){return projects.find(project=>project.slug===slug);}
export function getNextProject(slug:string){const index=projects.findIndex(project=>project.slug===slug);return projects[(index+1)%projects.length];}
