"use client";
import { useState } from "react";
import type { Category, Project } from "@/types/project";
import { categories } from "./project-data";
import VisualFeed from "./VisualFeed";
export default function CategoryFilter({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<"all" | Category>("all");
  const filtered = selected === "all" ? projects : projects.filter((project) => project.category === selected);
  return <><div className="filter-bar" role="tablist" aria-label="Project categories">{categories.map((category) => <button className={selected === category.value ? "selected" : ""} key={category.value} onClick={() => setSelected(category.value)} role="tab" aria-selected={selected === category.value}>{category.short}</button>)}</div><VisualFeed projects={filtered} /></>;
}
