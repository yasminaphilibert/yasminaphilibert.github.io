import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Label from "@/components/Label";
import { getAboutContent } from "@/lib/content";

const About = () => {
  const about = getAboutContent();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <div className="container-custom">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mt-4 card-surface bg-lilac px-7 py-14 md:px-14 md:py-20"
        >
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <Label>{about.label}</Label>
            </div>

            <div className="md:col-span-6">
              <div className="flex items-center gap-4 md:gap-5">
                {/* Decorative — the name is right beside it as text. Sized well
                    above the heading: the chrome shading is what carries the
                    pink, and at thumbnail size it dissolves against the panel. */}
                <img
                  src={`${import.meta.env.BASE_URL}yasyntha_logo.png`}
                  alt=""
                  aria-hidden="true"
                  className="h-16 md:h-28 w-auto flex-shrink-0"
                />
                <h1 className="display-heading text-[2.1rem] md:text-[3.2rem]">{about.title}</h1>
              </div>
              <div className="mt-8 space-y-6">
                {about.introParagraphs.map((paragraph, index) => (
                  <p key={index} className="body-copy text-base md:text-lg font-medium">
                    {paragraph}
                  </p>
                ))}
                <p className="serif-accent text-xl md:text-2xl text-ink">{about.location}</p>
              </div>
            </div>

            <div className="md:col-span-4 space-y-12">
              <div>
                <Label className="mb-4">Contact</Label>
                <a
                  href={`mailto:${about.email}`}
                  className="text-base md:text-lg font-semibold text-ink underline underline-offset-[6px] decoration-ink/40 hover:decoration-ink transition-colors"
                >
                  {about.email}
                </a>
              </div>

              <div>
                <Label className="mb-4">Services</Label>
                <ul className="space-y-2.5">
                  {about.services.map((service, index) => (
                    <li key={index} className="text-base font-medium text-ink/85">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-20 md:py-28"
        >
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <Label>{about.experienceLabel}</Label>
            </div>
            <div className="md:col-span-6">
              <p className="serif-accent text-[1.5rem] md:text-[2.2rem] leading-[1.2] text-ink">
                {about.experienceText}
              </p>
            </div>
            <div className="md:col-span-4">
              <p className="body-copy font-medium">{about.experienceNote}</p>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
