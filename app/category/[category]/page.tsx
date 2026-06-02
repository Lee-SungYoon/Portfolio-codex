import { notFound } from "next/navigation";
import VisualFeed from "@/components/VisualFeed";
import { categories, projects } from "@/components/project-data";
import RevealText from "@/components/RevealText";
import type { Category } from "@/types/project";

export function generateStaticParams() {
  return categories.slice(1).map((category) => ({ category: category.value }));
}

export default function CategoryPage({ params }: { params: { category: Category } }) {
  const category = categories.find((entry) => entry.value === params.category);
  if (!category || category.value === "all") notFound();
  const filtered = projects.filter((project) => project.category === category.value);

  return (
    <section className="archive-page page-section">
      <RevealText className="archive-heading">
        <p className="eyebrow">SY / Discipline</p>
        <h1>{category.short}<span>.</span></h1>
        <div className="archive-count">{String(filtered.length).padStart(2, "0")} Entries / Curated</div>
      </RevealText>
      <VisualFeed projects={filtered} />
    </section>
  );
}
