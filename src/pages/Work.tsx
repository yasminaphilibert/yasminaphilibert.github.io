import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectGridCard from "@/components/ProjectGridCard";
import { getAllProjects } from "@/data/services";

const Work = () => {
  const allProjects = getAllProjects();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="bg-secondary -mt-8 pt-16 pb-12 px-6 md:px-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-secondary-foreground mb-4">
            My Work
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl">
            A collection of projects across visual identity, graphic design, and sound engineering.
          </p>
        </div>
      </motion.section>

      {/* Info Bar */}
      <div 
        className="py-6 px-6 md:px-12 rounded-b-[2rem]"
        style={{ backgroundColor: "#4ECDC4" }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-medium text-white">
            {allProjects.length} Projects
          </span>
          <span className="text-sm font-medium text-white">
            All Categories
          </span>
        </div>
      </div>

      {/* Projects Gallery */}
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allProjects.map((project, index) => (
              <ProjectGridCard
                key={project.slug}
                title={project.title}
                location={project.location}
                year={project.year}
                image={project.image}
                slug={project.slug}
                infoColor={project.serviceColor}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="bg-muted">
        <Link 
          to="/"
          className="block py-12 px-6 md:px-12 hover:bg-muted/80 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground block mb-2">Back to</span>
              <span className="font-display text-2xl md:text-3xl font-semibold text-foreground">Home</span>
            </div>
            <span className="text-4xl text-muted-foreground">←</span>
          </div>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Work;
