import Link from "next/link";
import RevealMedia from "@/components/RevealMedia";
import RevealText from "@/components/RevealText";
import VisualFeed from "@/components/VisualFeed";
import { categories, projects } from "@/components/project-data";

export default function HomePage() {
  const hero = projects[0];

  return (
    <>
      <section className="home-hero">
        <RevealMedia src={hero.coverImage} alt={`${hero.title} featured project`} className="hero-image" eager />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">Creative Director / Korea</p>
          <h1>Identity.<br />Motion.<br />Experience.</h1>
          <div className="hero-bottom">
            <p>{hero.title} / Featured project</p>
            <span>01 / 04</span>
          </div>
        </div>
      </section>

      <section className="page-section home-intro">
        <RevealText>
          <div className="section-kicker">01 / Ambition <span>Strategy in motion</span></div>
          <h2>I create media-driven brand experiences where strategy moves, identity speaks, and culture connects.</h2>
        </RevealText>
      </section>

      <section className="page-section feed-section">
        <div className="section-kicker">02 / Selected projects <span>Identity / Motion / Experience</span></div>
        <VisualFeed projects={projects.slice(0, 4)} />
      </section>

      <section className="page-section approach-section" id="approach">
        <RevealText>
          <div className="section-kicker">03 / Approach <span>From thought to touchpoint</span></div>
          <h2>Ideas become systems.<br /><em>Systems become experiences.</em></h2>
        </RevealText>
        <div className="approach-grid">
          {["Strategy", "Identity", "Motion", "Experience"].map((title, index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{[
                "Finding the clear idea that gives every decision a direction.",
                "Turning strategy into a visual and verbal language people remember.",
                "Building movement into the system so the brand feels alive.",
                "Connecting every touchpoint into one coherent, useful experience.",
              ][index]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section category-section">
        <RevealText>
          <div className="section-kicker">04 / Explore archive</div>
          <h2>Selected<br /><em>experiments.</em></h2>
        </RevealText>
        <div className="category-links">
          {categories.slice(1).map((category, index) => (
            <Link href={`/category/${category.value}`} key={category.value}>
              <span>0{index + 1}</span><strong>{category.label}</strong><i>↗</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section about-preview" id="contact">
        <RevealText>
          <div className="section-kicker">05 / Contact <span>Start a conversation</span></div>
          <p>Building brand experiences for a moving world.</p>
          <a className="outline-link" href="mailto:hello@example.com">hello@example.com <i>↗</i></a>
        </RevealText>
      </section>
    </>
  );
}
