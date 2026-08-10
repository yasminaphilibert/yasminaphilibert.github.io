import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import ProjectGridCard from "@/components/ProjectGridCard";
import Footer from "@/components/Footer";
import Label from "@/components/Label";
import { services, getAllProjects } from "@/data/services";
import { getIndexContent } from "@/lib/content";
import { sortByNewest } from "@/lib/projects";

const HOME_PROJECT_COUNT = 6;

/**
 * The heading is one long sentence in the content. Setting all of it in bold
 * uppercase is a wall; the first sentence carries the shout and whatever
 * follows drops into the italic serif, which is the whole typographic idea.
 */
const splitHeading = (heading: string) => {
  const match = heading.match(/^(.*?[.!?])\s+(.+)$/s);
  if (!match) return { lead: heading, accent: "" };
  return { lead: match[1], accent: match[2] };
};

const Index = () => {
  const indexContent = getIndexContent();
  const projects = sortByNewest(getAllProjects()).slice(0, HOME_PROJECT_COUNT);
  const { lead, accent } = splitHeading(indexContent.heroTitle || "");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <div className="container-custom">
        <motion.section
          className="mt-4 card-surface bg-blush px-7 py-14 md:px-14 md:py-20"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <Label>Creative direction — Paris / Barcelona</Label>

          {lead ? (
            <h1 className="display-heading mt-6 text-[2.1rem] md:text-[3.5rem] max-w-[16ch] md:max-w-[20ch]">
              {lead}{" "}
              {accent ? <span className="serif-accent">{accent}</span> : null}
            </h1>
          ) : null}

          {indexContent.heroSubtitle ? (
            <p className="body-copy mt-7 max-w-[52ch] text-lg font-medium">{indexContent.heroSubtitle}</p>
          ) : null}
        </motion.section>

        <section className="mt-16 md:mt-20">
          <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-ink/20">
            <Label>Selected work</Label>
            <Link to="/work" className="link-cta">
              All work &rarr;
            </Link>
          </div>

          <div className="mt-6 columns-1 md:columns-2 gap-4 [column-fill:balance]">
            {projects.map((project, index) => (
              <div key={project.slug} className="break-inside-avoid mb-4">
                <ProjectGridCard
                  title={project.title}
                  location={project.location}
                  year={project.year}
                  image={project.image}
                  slug={project.slug}
                  index={index}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-ink/20">
            <Label>Services</Label>
            <Label>{services.length} disciplines</Label>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {services.map((service, index) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
                image={service.image}
                slug={service.slug}
                homeIntro={service.homeIntro}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className="py-20 md:py-28">
          <p className="serif-accent max-w-[24ch] text-[1.8rem] md:text-[2.8rem] leading-[1.15] text-ink">
            I work in two directions at once — the thing itself, and the world it has to survive in.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
