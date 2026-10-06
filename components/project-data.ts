import projectsJson from "@/data/projects.json";
import generatedProjectsJson from "@/data/nas-projects.generated.json";
import type { Category, Project } from "@/types/project";

type GeneratedProject = {
  title?: string;
  slug?: string;
  status?: string;
  category?: string;
  filterGroup?: string;
  year?: string | number;
  summary?: string;
  description?: string;
  thumbnail?: string;
  heroImage?: string;
  coverImage?: string;
  gallery?: string[];
  fullMedia?: string[];
  splitMedia?: string[];
  videos?: string[];
  role?: string[];
  tools?: string[];
  publishedAt?: string;
};

const categoryValues = new Set<Category>(["brand", "ai", "motion", "music", "strategy"]);

function normalizeCategory(value: string | undefined, filterGroup: string | undefined): Category {
  const raw = String(value || filterGroup || "brand").trim().toLowerCase();
  if (raw === "ai" || raw === "ai visual" || raw === "visual ai") return "ai";
  if (raw === "motion") return "motion";
  if (raw === "music") return "music";
  if (raw === "strategy") return "strategy";
  return categoryValues.has(raw as Category) ? (raw as Category) : "brand";
}

function categoryLabel(category: Category, filterGroup?: string) {
  if (filterGroup === "AI Visual" || category === "ai") return "Visual AI";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function normalizeGeneratedProject(project: GeneratedProject): Project | null {
  const title = String(project.title || "").trim();
  const slug = String(project.slug || "").trim();
  const coverImage = String(project.coverImage || project.thumbnail || project.heroImage || "").trim();
  const heroImage = String(project.heroImage || coverImage).trim();
  if (!title || !slug || !coverImage || project.status === "draft") return null;

  const category = normalizeCategory(project.category, project.filterGroup);
  const mediaUrls = [
    heroImage,
    ...(project.gallery || []),
    ...(project.fullMedia || []),
    ...(project.splitMedia || []),
    ...(project.videos || []),
  ].filter(Boolean);

  return {
    title,
    slug,
    category,
    categoryLabel: categoryLabel(category, project.filterGroup),
    year: Number(project.year || project.publishedAt?.slice(0, 4) || 2026),
    summary: project.summary || project.description || "",
    history: [project.description || project.summary || ""].filter(Boolean),
    role: project.role || [],
    tools: project.tools || [],
    coverImage,
    heroMedia: { type: "image", url: heroImage, caption: `${title} hero image` },
    media: mediaUrls.map((url) => ({
      type: url.toLowerCase().endsWith(".mp4") ? "video" : "image",
      url,
      caption: title,
    })),
    publishedAt: project.publishedAt || "",
    featured: false,
    accent: "warm",
  };
}

const fallbackProjects = projectsJson as Project[];
const generatedProjects = (Array.isArray(generatedProjectsJson) ? generatedProjectsJson : [])
  .map((project) => normalizeGeneratedProject(project as GeneratedProject))
  .filter((project): project is Project => project !== null);
const generatedSlugs = new Set(generatedProjects.map((project) => project.slug));

export const projects = [...generatedProjects, ...fallbackProjects.filter((project) => !generatedSlugs.has(project.slug))].sort(
  (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title),
);
export const categories:{value:"all"|"brand"|"ai"|"motion"|"music";label:string;short:string;description:string}[]=[
{value:"all",label:"All",short:"All",description:"Full showcase"},
{value:"brand",label:"Brand",short:"Brand",description:"Identity and brand systems"},
{value:"ai",label:"Visual AI",short:"Visual AI",description:"Generative visual experiments"},
{value:"motion",label:"Motion",short:"Motion",description:"Moving visual language"},
{value:"music",label:"Music",short:"Music",description:"Sound, album, and composition"}
];
export function getProject(slug:string){return projects.find(project=>project.slug===slug);}
export function getNextProject(slug:string){const index=projects.findIndex(project=>project.slug===slug);return projects[(index+1)%projects.length];}
