import Link from "next/link";
import RevealText from "@/components/RevealText";
import VisualFeed from "@/components/VisualFeed";
import { categories, projects } from "@/components/project-data";

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <h1 className="sr-only">Technical Creative Archive</h1>
        <div className="marquee-track marquee-primary" aria-hidden="true">
          <span>TECHNICAL CREATIVE ARCHIVE</span>
          <span>TECHNICAL CREATIVE ARCHIVE</span>
        </div>
        <div className="marquee-track marquee-secondary" aria-hidden="true">
          <span>BRAND MOTION AI MUSIC</span>
          <span>BRAND MOTION AI MUSIC</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Lee Seongyun / Selected works</p>
          <div className="hero-bottom">
            <p>Creative systems / visual research</p>
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
