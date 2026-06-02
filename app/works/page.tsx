import CategoryFilter from "@/components/CategoryFilter";
import RevealText from "@/components/RevealText";
import { projects } from "@/components/project-data";

export const metadata = { title: "Works" };

export default function WorksPage() {
  return (
    <section className="archive-page page-section">
      <RevealText className="archive-heading">
        <p className="eyebrow">SY / Complete index</p>
        <h1>Works<span>.</span></h1>
        <div className="archive-count">{String(projects.length).padStart(2, "0")} Entries / 2026</div>
      </RevealText>
      <CategoryFilter projects={projects} />
    </section>
  );
}
