import projectsJson from "@/data/projects.json";
import type { Category, Project } from "@/types/project";
export const projects=[...(projectsJson as Project[])].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
export const categories:{value:"all"|"brand"|"ai"|"motion"|"music";label:string;short:string;description:string}[]=[
{value:"all",label:"All",short:"All",description:"Full showcase"},
{value:"brand",label:"Brand",short:"Brand",description:"Identity and brand systems"},
{value:"ai",label:"Visual AI",short:"Visual AI",description:"Generative visual experiments"},
{value:"motion",label:"Motion",short:"Motion",description:"Moving visual language"},
{value:"music",label:"Music",short:"Music",description:"Sound, album, and composition"}
];
export function getProject(slug:string){return projects.find(project=>project.slug===slug);}
export function getNextProject(slug:string){const index=projects.findIndex(project=>project.slug===slug);return projects[(index+1)%projects.length];}
