"use client";

import { useEffect } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectGrid() {
  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="work" id="work">
      <div className="portfolio-grid" aria-live="polite">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
