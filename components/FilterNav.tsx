"use client";

import type { Category } from "@/data/projects";

type FilterNavProps = {
  activeCategory: Category;
  categories: readonly Category[];
  onChange: (category: Category) => void;
};

export default function FilterNav({
  activeCategory,
  categories,
  onChange,
}: FilterNavProps) {
  return (
    <div className="filter-nav reveal" aria-label="Project categories">
      {categories.map((category) => (
        <button
          className={`filter${category === activeCategory ? " is-active" : ""}`}
          key={category}
          type="button"
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
