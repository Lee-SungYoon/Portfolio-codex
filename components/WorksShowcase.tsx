"use client";

import { useMemo, useState } from "react";
import workProjects from "@/data/work-projects.json";

type WorkFilter = "All" | "Brand" | "AI Visual" | "Motion" | "Music";
type WorkProject = {
  title: string;
  category: "Brand" | "AI" | "Motion" | "Music" | "Strategy";
  description?: string;
  date?: string;
  filterGroup: Exclude<WorkFilter, "All">;
  layout:
    | "case-study"
    | "editorial"
    | "masonry-tall"
    | "masonry-wide"
    | "poster"
    | "video-wide"
    | "video-grid"
    | "video-tall"
    | "album"
    | "album-wide";
  image: string;
  href: string;
};

const filters: WorkFilter[] = ["All", "Brand", "AI Visual", "Motion", "Music"];
const projects = workProjects as WorkProject[];

function getWorkCardClass(index: number) {
  return index % 7 === 0 || index % 7 === 3 ? "works-card--wide" : "works-card--standard";
}

export default function WorksShowcase() {
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("All");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    return projects.filter((project) => project.filterGroup === activeFilter);
  }, [activeFilter]);

  return (
    <section className="works-page">
      <div className="works-head reveal">
        <div>
          <p className="works-kicker">Portfolio Index</p>
          <h1>Work</h1>
        </div>
        <p className="works-summary">
          Newest project order, fixed category filters, and layout logic tuned to each project type.
        </p>
      </div>

      <div className="works-filter-nav reveal" aria-label="Work categories" role="tablist">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter}
            className={`works-filter${activeFilter === filter ? " is-active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="works-grid reveal" aria-live="polite">
        {filteredProjects.map((project, index) => (
          <article
            key={`${project.filterGroup}-${project.title}`}
            className={`works-card ${getWorkCardClass(index)} reveal`}
            data-filter-group={project.filterGroup}
            data-category={project.category}
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <a className="works-card-link" href={project.href} aria-label={project.title}>
              <div className="works-media image-hover">
                <img
                  src={project.image}
                  alt={`${project.title} thumbnail`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="works-badge">{project.category}</span>
                <span className="works-arrow" aria-hidden="true">↗</span>
                <div className="works-copy">
                  <h2 className="works-title">{project.title}</h2>
                  <p className="works-description">{project.description}</p>
                  <p className="works-date">{project.date}</p>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
