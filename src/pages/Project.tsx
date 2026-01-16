import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projectsData: Record<string, {
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  infoColor: string;
  description: string;
  additionalInfo: string;
  galleryImages: string[];
}> = {
  "chromatic-visions": {
    title: "Chromatic Visions",
    category: "Visual Identity",
    location: "Los Angeles, CA",
    year: "2024",
    image: project1,
    infoColor: "#6BCB77",
    description: "A comprehensive visual identity project exploring the intersection of color theory and brand storytelling. The project involved creating a complete visual system that could adapt across digital and physical touchpoints while maintaining brand recognition.",
    additionalInfo: "Chromatic Visions was recognized with the 'Best Visual Identity' award at Design Week LA 2024.",
    galleryImages: [project2, project3]
  },
  "noir-typography": {
    title: "Noir Typography",
    category: "Graphic Design",
    location: "New York, NY",
    year: "2023",
    image: project2,
    infoColor: "#7B5EA7",
    description: "An exploration of contrast and negative space through typography-driven design. This project pushed the boundaries of readability while maintaining visual impact through strategic use of monochromatic palettes and neon accents.",
    additionalInfo: "Featured in Communication Arts Typography Annual 2023.",
    galleryImages: [project1, project3]
  },
  "resonance-studio": {
    title: "Resonance Studio",
    category: "Sound Engineering",
    location: "London, UK",
    year: "2022",
    image: project3,
    infoColor: "#E8A87C",
    description: "A complete audio engineering project for an independent recording studio, encompassing acoustic design consultation and full production services. The project involved mixing and mastering over 40 tracks across multiple genres.",
    additionalInfo: "Resonance Studio's signature sound has been sought by artists worldwide since launch.",
    galleryImages: [project1, project2]
  }
};

const projectOrder = ["chromatic-visions", "noir-typography", "resonance-studio"];

const Project = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;
  
  // Find next project
  const currentIndex = slug ? projectOrder.indexOf(slug) : -1;
  const nextSlug = projectOrder[(currentIndex + 1) % projectOrder.length];
  const nextProject = projectsData[nextSlug];

  if (!project) {
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
          style={{ backgroundColor: project.infoColor }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12">
              {/* Category - Left */}
              <div className="md:col-span-2">
                <span className="text-sm text-black/70">{project.category}</span>
              </div>

              {/* Title & Description - Center */}
              <div className="md:col-span-6">
                <h1 className="font-display text-3xl md:text-4xl font-medium text-black mb-6">
                  {project.title}
                </h1>
                <p className="text-xl md:text-2xl text-black/80 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Location, Year & Additional Info - Right */}
              <div className="md:col-span-4 space-y-8">
                <div>
                  <p className="text-sm text-black/70">{project.location}</p>
                  <p className="text-sm text-black/70">{project.year}</p>
                </div>
                <p className="text-sm text-black/90">
                  {project.additionalInfo}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Gallery Images */}
        {project.galleryImages.map((img, index) => (
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
          {/* Back to Projects */}
          <Link 
            to="/" 
            className="w-1/3 md:w-1/4 bg-foreground text-background px-6 py-8 md:px-12 md:py-10 rounded-br-[2rem] flex items-center"
          >
            <span className="font-display text-lg md:text-2xl font-medium">
              Back to projects
            </span>
          </Link>

          {/* Next Project */}
          <Link 
            to={`/project/${nextSlug}`}
            className="flex-1 px-6 py-8 md:px-12 md:py-10 rounded-b-[2rem] flex items-center justify-between"
            style={{ backgroundColor: nextProject.infoColor === project.infoColor ? "#7B5EA7" : nextProject.infoColor }}
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
          style={{ backgroundColor: project.infoColor }}
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
