import Link from "next/link";
import RevealText from "@/components/RevealText";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="about-page page-section">
      <RevealText>
        <p className="eyebrow">SY / Profile</p>
        <h1>Quietly<br /><em>technical.</em><br />Visually<br /><em>restless.</em></h1>
      </RevealText>
      <RevealText className="about-statement">
        <p>I am Lee Seongyun, a multidisciplinary creative working across brand identity, motion, generative visual research, and sound.</p>
      </RevealText>
      <div className="about-grid">
        <RevealText>
          <span>Capabilities</span>
          <p>Brand Strategy<br />Visual Identity<br />Art Direction<br />Motion Design<br />Generative AI<br />Sound Design</p>
        </RevealText>
        <RevealText delay={0.08}>
          <span>Selected tools</span>
          <p>Illustrator<br />Photoshop<br />After Effects<br />Cinema 4D<br />Ableton Live<br />GPT</p>
        </RevealText>
      </div>
      <RevealText className="contact-block">
        <div className="section-kicker">Contact / Collaboration</div>
        <a href="mailto:hello@example.com">hello@example.com</a>
        <Link className="outline-link" href="/install">Install this archive <i>↗</i></Link>
      </RevealText>
    </section>
  );
}
