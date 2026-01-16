import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectGridCard from "@/components/ProjectGridCard";
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
        <Footer bgColor="#6BCB77" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero section - full width image flush with header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <div className="w-full overflow-hidden">
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-[50vh] md:h-[60vh] object-cover"
          />
        </div>
        
        {/* Colored info section */}
        <div 
          className="w-full px-6 py-10 md:px-12 md:py-14 rounded-b-[2rem]"
          style={{ backgroundColor: service.infoColor }}
        >
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to services</span>
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="text-sm text-black/60 block mb-2">{service.subtitle}</span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-black">
                  {service.title}
                </h1>
              </div>
              <p className="text-black/80 max-w-md text-lg">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid - 2 columns */}
      <main className="py-16 md:py-24">
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
                infoColor={service.infoColor}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer bgColor={service.infoColor} />
    </div>
  );
};

export default Service;
