import SocialLinks from "@/components/SocialLinks";

export default function FooterCTA({ panel = false }: { panel?: boolean }) {
  return (
    <footer className={`footer-cta${panel ? " footer-cta--panel" : ""}`} id="contact">
      <p className="reveal">Available for Work</p>
      <a className="contact-link reveal" href="mailto:hello@example.com">
        Get in Touch
      </a>
      <SocialLinks />
    </footer>
  );
}
