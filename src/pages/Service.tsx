import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectGridCard from "@/components/ProjectGridCard";
import Media from "@/components/Media";
import { getServiceBySlug } from "@/data/services";

const Service = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-muted-foreground">Service not found.</p>
            <Link to="/" className="text-foreground underline underline-offset-4 mt-4 inline-block">
              Return home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero section - full width media (image or video) flush with header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <Media
          src={service.heroImage}
          alt={service.title}
          className="w-full h-[50vh] md:h-[60vh] transition-transform duration-700 ease-out hover:scale-105"
          autoplay={false}
          loop={true}
          muted={false}
          controls={true}
        />
        
        {/* Colored info section */}
        <div 
          className="w-full px-6 py-10 md:px-12 md:py-14 rounded-b-[2rem] overflow-hidden"
          style={{ backgroundColor: service.infoColor }}
        >
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm break-words">Back to services</span>
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="min-w-0">
                <span className="text-sm text-black/60 block mb-2 break-words">{service.subtitle}</span>
                <h1 className="service-card-title font-megna text-2xl md:text-5xl lg:text-6xl font-black text-black break-words">
                  {service.title}
                </h1>
              </div>
              <div className="text-black/80 max-w-md text-sm md:text-lg break-words space-y-2">
                <p>{service.description}</p>
                {'soundCloudUrl' in service && service.soundCloudUrl && (
                  <a
                    href={service.soundCloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-black font-medium underline underline-offset-2 hover:no-underline"
                  >
                    Listen on SoundCloud →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid - 2 columns */}
      <main 
        className="py-16 md:py-24"
        style={service.projectsGridBackground ? { backgroundColor: service.projectsGridBackground } : undefined}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display text-2xl md:text-3xl font-medium mb-12"
          >
            Selected Projects
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {service.projects.map((project, index) => (
              <ProjectGridCard
                key={project.slug}
                {...project}
                index={index}
                infoColor={project.barColor || service.infoColor}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Service;
