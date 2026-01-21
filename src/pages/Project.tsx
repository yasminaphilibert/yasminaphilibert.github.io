import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProjectBySlug, services, getServiceBySlug } from "@/data/services";

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
          className="w-full px-6 py-12 md:px-12 md:py-16 rounded-b-[2rem] overflow-hidden"
          style={{ backgroundColor: project.serviceColor }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Category - Left */}
              <div className="md:col-span-2">
                <span className="text-sm text-black/70 break-words">{project.serviceTitle}</span>
              </div>

              {/* Title & Description - Center */}
              <div className="md:col-span-6 min-w-0">
                <h1 className="font-display text-3xl md:text-4xl font-medium text-black mb-6 break-words">
                  {project.title}
                </h1>
                <div className="space-y-4">
                  {project.description.map((paragraph, index) => (
                    <p key={index} className="text-xl md:text-2xl text-black/80 leading-relaxed break-words">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Location & Year - Right */}
              <div className="md:col-span-4 space-y-8">
                <div>
                  <p className="text-sm text-black/70 break-words">{project.location}</p>
                  <p className="text-sm text-black/70 break-words">{project.year}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Gallery Images Grid */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full px-6 py-12 md:px-12 md:py-16"
            style={project.galleryBackground ? { backgroundColor: project.galleryBackground } : undefined}
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 justify-items-center">
                {project.galleryImages
                  .map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="aspect-square overflow-hidden rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl"
                    >
                      <img 
                        src={img} 
                        alt={`${project.title} gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Navigation Footer */}
        <div className="flex flex-col md:flex-row w-full overflow-hidden">
          {/* Back to Service */}
          <Link 
            to={`/services/${project.serviceSlug}`} 
            className="w-full md:w-1/3 lg:w-1/4 bg-foreground text-background px-6 py-8 md:px-12 md:py-10 md:rounded-br-[2rem] flex items-center"
          >
            <span className="font-display text-lg md:text-2xl font-medium break-words">
              Back to {project.serviceTitle}
            </span>
          </Link>

          {/* Next Project */}
          <Link 
            to={`/project/${nextProject.slug}`}
            className="flex-1 px-6 py-8 md:px-12 md:py-10 rounded-b-[2rem] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{ backgroundColor: nextProjectColor }}
          >
            <div className="flex items-center gap-4 md:gap-8 min-w-0">
              <span className="font-display text-lg md:text-2xl font-medium text-white break-words">
                Next: {nextProject.title}
              </span>
            </div>
            <div className="text-left md:text-right flex-shrink-0">
              <p className="text-sm text-white/80">{nextProject.location}</p>
              <p className="text-sm text-white/80">{nextProject.year}</p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Project;
