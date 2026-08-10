import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectGridCard from "@/components/ProjectGridCard";
import Media from "@/components/Media";
import Label from "@/components/Label";
import { getServiceBySlug, services } from "@/data/services";
import { tintFor } from "@/lib/palette";

const Service = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Header />
        <main className="container-custom py-24">
          <h1 className="display-heading text-[2rem] md:text-[3rem]">Service not found.</h1>
          <Link to="/" className="link-cta mt-6">
            Return home &rarr;
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Each service keeps the same tint wherever it appears.
  const tint = tintFor(services.findIndex((s) => s.slug === service.slug));

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <div className="container-custom">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mt-4 card-surface p-4 md:p-5"
          style={{ backgroundColor: tint }}
        >
          <Media
            src={service.heroImage}
            alt={service.title}
            className="w-full h-[42vh] md:h-[56vh]"
            containerClassName="media-frame"
            autoplay={false}
            loop={true}
            muted={false}
            controls={true}
          />

          <div className="px-2 md:px-4 pt-8 pb-3">
            <Link to="/" className="inline-flex items-center gap-2 label hover:text-ink transition-colors">
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              Back to services
            </Link>

            <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="min-w-0">
                <Label>{service.subtitle}</Label>
                <h1 className="display-heading mt-3 text-[2rem] md:text-[3.2rem] break-words">{service.title}</h1>
              </div>

              <div className="max-w-[46ch] space-y-4">
                <p className="body-copy font-medium">{service.description}</p>
                {"soundCloudUrl" in service && service.soundCloudUrl && (
                  <a
                    href={service.soundCloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-cta"
                  >
                    Listen on SoundCloud &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mt-16 md:mt-20 pb-4">
          <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-ink/20">
            <Label>Selected projects</Label>
            <Label>{service.projects.length} projects</Label>
          </div>

          <div className="mt-6 columns-1 md:columns-2 gap-4">
            {service.projects.map((project, index) => (
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
      </div>

      <Footer />
    </div>
  );
};

export default Service;
