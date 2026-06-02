"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import RevealMedia from "@/components/RevealMedia";
import RevealText from "@/components/RevealText";
import VisualFeed from "@/components/VisualFeed";
import { categories, projects } from "@/components/project-data";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const hero = projects[0];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-image img", { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power3.out" });
      gsap.fromTo(".hero-line", { yPercent: 105 }, { yPercent: 0, stagger: 0.12, duration: 1.05, ease: "power4.out", delay: 0.25 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="home-hero" ref={heroRef}>
        <RevealMedia src={hero.coverImage} alt="SY Archive hero" className="hero-image" eager />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">Lee Seongyun / Selected works</p>
          <h1>
            <span className="hero-mask"><b className="hero-line">Technical</b></span>
            <span className="hero-mask"><b className="hero-line">Creative</b></span>
            <span className="hero-mask"><b className="hero-line">Archive</b></span>
          </h1>
          <div className="hero-bottom">
            <p>Brand / Motion / AI / Music</p>
            <span>Scroll to explore <i>↓</i></span>
          </div>
        </div>
      </section>

      <section className="page-section home-intro">
        <RevealText>
          <div className="section-kicker">01 / Recent entries <span>Updated Jun. 2026</span></div>
          <h2>Visual work,<br /><em>in sequence.</em></h2>
        </RevealText>
      </section>

      <section className="page-section feed-section">
        <VisualFeed projects={projects.slice(0, 4)} />
      </section>

      <section className="page-section category-section">
        <RevealText>
          <div className="section-kicker">02 / Explore archive</div>
          <h2>Browse by<br /><em>discipline.</em></h2>
        </RevealText>
        <div className="category-links">
          {categories.slice(1).map((category, index) => (
            <Link href={`/category/${category.value}`} key={category.value}>
              <span>0{index + 1}</span>
              <strong>{category.label}</strong>
              <i>↗</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section about-preview">
        <RevealText>
          <div className="section-kicker">03 / About</div>
          <p>Building visual systems across brand, moving image, sound, and machine imagination.</p>
          <Link className="outline-link" href="/about">About the archive <i>↗</i></Link>
        </RevealText>
      </section>
    </>
  );
}
