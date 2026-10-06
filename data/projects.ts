export const categories = ["All", "Brand", "AI Visual", "Motion", "Music"] as const;

export type Category = (typeof categories)[number];

export type Project = {
  title: string;
  category: Exclude<Category, "All">;
  image: string;
  href: string;
};

export const projects: Project[] = [
  {
    title: "Psycho Killer",
    category: "Music",
    image: "/images/projects/psycho-killer.jpg",
    href: "/works/psycho-killer",
  },
  {
    title: "Music Senses",
    category: "Music",
    image: "/images/projects/music-senses.jpg",
    href: "/works/music-senses",
  },
  {
    title: "Vitra Campaign",
    category: "Brand",
    image: "/images/projects/vitra-campaign.jpg",
    href: "/works/vitra-campaign",
  },
  {
    title: "4tential",
    category: "Music",
    image: "/images/projects/music-4tential.jpg",
    href: "/works/4tential",
  },
  {
    title: "Kanebo Beauty",
    category: "Brand",
    image: "/images/projects/kanebo-beauty.jpg",
    href: "/works/kanebo-beauty",
  },
  {
    title: "Clear Water",
    category: "AI Visual",
    image: "/images/projects/clear-water.jpg",
    href: "/works/clear-water",
  },
  {
    title: "Berserk VFX",
    category: "Motion",
    image: "/images/projects/berserk-vfx.jpg",
    href: "/works/berserk-vfx",
  },
  {
    title: "YSL, 2026FW",
    category: "Brand",
    image: "/images/projects/ysl-2026fw.jpg",
    href: "/works/ysl-2026fw",
  },
  {
    title: "Visual Concept",
    category: "AI Visual",
    image: "/images/projects/visual-concept.jpg",
    href: "/works/visual-concept",
  },
];
