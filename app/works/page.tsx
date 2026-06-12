import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import WorksShowcase from "@/components/WorksShowcase";

export const metadata = { title: "Works" };

export default function WorksPage() {
  return (
    <>
      <Header />
      <main>
        <WorksShowcase />
      </main>
      <FooterCTA />
    </>
  );
}
