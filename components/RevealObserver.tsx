"use client";

import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (revealItems.length === 0) {
      return;
    }

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

    revealItems.forEach((item) => {
      if (!item.classList.contains("is-visible")) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
