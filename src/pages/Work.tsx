import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectGridCard from "@/components/ProjectGridCard";
import Label from "@/components/Label";
import { getAllProjects } from "@/data/services";
import { getWorkContent } from "@/lib/content";
import { sortByNewest } from "@/lib/projects";

const Work = () => {
  const allProjects = sortByNewest(getAllProjects());
  const workContent = getWorkContent();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <div className="container-custom">
        <motion.section
          className="mt-4 card-surface bg-lilac px-7 py-14 md:px-14 md:py-20"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <Label>Archive</Label>
          <h1 className="display-heading mt-6 text-[2.1rem] md:text-[3.5rem]">{workContent.title}</h1>
          <p className="body-copy mt-7 max-w-[52ch] text-lg font-medium">{workContent.subtitle}</p>
        </motion.section>

        <section className="mt-16 md:mt-20 pb-4">
          <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-ink/20">
            <Label>Selected work</Label>
            <Label>{allProjects.length} projects</Label>
          </div>

          <div className="mt-6 columns-1 md:columns-2 gap-4">
            {allProjects.map((project, index) => (
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

export default Work;
