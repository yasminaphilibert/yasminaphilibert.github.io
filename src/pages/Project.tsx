import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projectsData: Record<string, {
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  description: string[];
}> = {
  "chromatic-visions": {
    title: "Chromatic Visions",
    category: "Visual Identity & Art Direction",
    location: "Los Angeles, CA",
    year: "2024",
    image: project1,
    description: [
      "A comprehensive visual identity project exploring the intersection of color theory and brand storytelling. The project involved creating a complete visual system that could adapt across digital and physical touchpoints.",
      "Working closely with the client, we developed a flexible color palette that shifts based on context while maintaining brand recognition. The identity system includes custom typography treatments, iconography, and a modular grid system.",
      "The result is a living brand that evolves with its audience while staying true to its core values of creativity and innovation."
    ]
  },
  "noir-typography": {
    title: "Noir Typography",
    category: "Graphic Design & Branding",
    location: "New York, NY",
    year: "2023",
    image: project2,
    description: [
      "An exploration of contrast and negative space through typography-driven design. This project pushed the boundaries of readability while maintaining visual impact.",
      "The monochromatic approach was elevated through strategic use of neon accents, creating a visual language that feels both timeless and contemporary.",
      "Delivered as a complete brand package including print collateral, digital assets, and environmental graphics for the client's flagship location."
    ]
  },
  "resonance-studio": {
    title: "Resonance Studio",
    category: "Sound Engineering & Production",
    location: "London, UK",
    year: "2022",
    image: project3,
    description: [
      "A complete audio engineering project for an independent recording studio, encompassing acoustic design consultation and full production services.",
      "The project involved mixing and mastering over 40 tracks across multiple genres, from intimate acoustic sessions to full orchestral arrangements.",
      "Beyond the technical work, we developed the studio's sonic identity—a signature sound that artists now seek out for its warmth and clarity."
    ]
  }
};

const Project = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectsData[slug] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-spacing">
          <div className="container-custom">
            <p className="text-muted-foreground">Project not found.</p>
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
      
      <main className="section-spacing">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to projects</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium">
                {project.title}
              </h1>
              <div className="flex flex-col md:items-end gap-1">
                <span className="text-muted-foreground">{project.location}</span>
                <span className="text-muted-foreground">{project.year}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-12">{project.category}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="overflow-hidden rounded-[1.25rem] mb-16"
          >
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-2xl space-y-6"
          >
            {project.description.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Project;
