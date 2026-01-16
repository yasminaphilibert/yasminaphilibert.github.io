import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { getProjectBySlug, services, getServiceBySlug } from "@/data/services";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const galleryImages = [project1, project2, project3];

const Project = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : null;
  
  // Find next project within the same service
  const service = project ? getServiceBySlug(project.serviceSlug) : null;
  const projectsInService = service?.projects || [];
  const currentIndex = projectsInService.findIndex(p => p.slug === slug);
  const nextProject = projectsInService[(currentIndex + 1) % projectsInService.length];
  const nextProjectColor = service?.infoColor || "#6BCB77";

  if (!project || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-muted-foreground">Project not found.</p>
            <Link to="/" className="text-foreground underline underline-offset-4 mt-4 inline-block">
              Return home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-[50vh] md:h-[70vh] object-cover"
          />
        </motion.div>

        {/* Project Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full px-6 py-12 md:px-12 md:py-16 rounded-b-[2rem]"
          style={{ backgroundColor: project.serviceColor }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Category - Left */}
              <div className="md:col-span-2">
                <span className="text-sm text-black/70">{project.serviceTitle}</span>
              </div>

              {/* Title & Description - Center */}
              <div className="md:col-span-6">
                <h1 className="font-display text-3xl md:text-4xl font-medium text-black mb-6">
                  {project.title}
                </h1>
                <div className="space-y-4">
                  {project.description.map((paragraph, index) => (
                    <p key={index} className="text-xl md:text-2xl text-black/80 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Location & Year - Right */}
              <div className="md:col-span-4 space-y-8">
                <div>
                  <p className="text-sm text-black/70">{project.location}</p>
                  <p className="text-sm text-black/70">{project.year}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Gallery Images */}
        {galleryImages.filter(img => img !== project.image).slice(0, 2).map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <img 
              src={img} 
              alt={`${project.title} gallery ${index + 1}`}
              className="w-full h-[50vh] md:h-[70vh] object-cover"
            />
          </motion.div>
        ))}

        {/* Navigation Footer */}
        <div className="flex w-full">
          {/* Back to Service */}
          <Link 
            to={`/services/${project.serviceSlug}`} 
            className="w-1/3 md:w-1/4 bg-foreground text-background px-6 py-8 md:px-12 md:py-10 rounded-br-[2rem] flex items-center"
          >
            <span className="font-display text-lg md:text-2xl font-medium">
              Back to {project.serviceTitle}
            </span>
          </Link>

          {/* Next Project */}
          <Link 
            to={`/project/${nextProject.slug}`}
            className="flex-1 px-6 py-8 md:px-12 md:py-10 rounded-b-[2rem] flex items-center justify-between"
            style={{ backgroundColor: nextProjectColor }}
          >
            <div className="flex items-center gap-4 md:gap-8">
              <span className="font-display text-lg md:text-2xl font-medium text-white">
                Next: {nextProject.title}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">{nextProject.location}</p>
              <p className="text-sm text-white/80">{nextProject.year}</p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer 
          className="w-full px-6 py-12 md:px-12 md:py-16 rounded-t-[2rem]"
          style={{ backgroundColor: project.serviceColor }}
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-black/70">
              © 2018–{new Date().getFullYear()}. Marcus Chen
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Project;
