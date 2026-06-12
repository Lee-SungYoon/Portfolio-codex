import aboutContent from "@/data/about-content.json";
import FooterCTA from "@/components/FooterCTA";
import Header from "@/components/Header";

export const metadata = { title: "About" };

export default function AboutPage() {
  const { title, intro, portraitImage, servicesHeading, servicesIntro, services, highlightsHeading, highlightsIntro, highlights } =
    aboutContent;

  const [titleFirstLine, titleSecondLine] = title.split(" ");

  return (
    <>
      <Header />
      <section className="about-page">
        <div className="about-hero reveal">
          <h1 className="about-title">
            <span>{titleFirstLine}</span>
            <span>{titleSecondLine}</span>
          </h1>
          <p className="about-intro">{intro}</p>
          <div className="about-portrait-wrap">
            <img className="about-portrait" src={portraitImage} alt="Lee. Sung Yoon portrait" />
          </div>
        </div>

        <section className="about-section reveal">
          <div className="about-section-copy">
            <h2>{servicesHeading}</h2>
            <p>{servicesIntro}</p>
          </div>
          <div className="about-list">
            {services.map((service) => (
              <article className="about-list-item" key={service.index}>
                <span>{service.index}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section reveal">
          <div className="about-section-copy">
            <h2>{highlightsHeading}</h2>
            <p>{highlightsIntro}</p>
          </div>
          <div className="about-list">
            {highlights.map((item) => (
              <article className="about-list-item about-list-item--highlight" key={item.title}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.label}</p>
                </div>
                <div>
                  <p>{item.detail}</p>
                </div>
                <span>{item.year}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
      <FooterCTA panel />
    </>
  );
}
