export type Category =
  | "brand-design"
  | "motion-graphic"
  | "music"
  | "generative-ai";

export type Media = {
  type: "image" | "video" | "audio";
  url: string;
  caption: string;
  poster?: string;
  externalUrl?: string;
};

export type Project = {
  title: string;
  slug: string;
  category: Category;
  categoryLabel: string;
  year: number;
  summary: string;
  history: string[];
  role: string[];
  tools: string[];
  coverImage: string;
  heroMedia: Media;
  media: Media[];
  publishedAt: string;
  featured: boolean;
  accent: "warm" | "blue" | "lime";
};
