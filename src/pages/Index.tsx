import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    title: "Chromatic Visions",
    category: "Visual Identity & Art Direction",
    location: "Los Angeles, CA",
    year: "2024",
    image: project1,
    slug: "chromatic-visions",
  },
  {
    title: "Noir Typography",
    category: "Graphic Design & Branding",
    location: "New York, NY",
    year: "2023",
    image: project2,
    slug: "noir-typography",
  },
  {
    title: "Resonance Studio",
    category: "Sound Engineering & Production",
    location: "London, UK",
    year: "2022",
    image: project3,
    slug: "resonance-studio",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-spacing">
        <div className="container-custom">
          <div className="space-y-16 md:space-y-24">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                {...project}
                index={index}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
