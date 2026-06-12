import FooterCTA from "@/components/FooterCTA";
import Header from "@/components/Header";
import HeroIntro from "@/components/HeroIntro";
import ProjectGrid from "@/components/ProjectGrid";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroIntro />
        <ProjectGrid />
      </main>
      <FooterCTA />
    </>
  );
}
