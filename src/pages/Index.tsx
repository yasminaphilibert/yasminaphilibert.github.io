import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    title: "Chromatic Visions",
    category: "Visual Identity",
    location: "Los Angeles, CA",
    year: "2024",
    image: project1,
    slug: "chromatic-visions",
    infoColor: "#6BCB77",
  },
  {
    title: "Noir Typography",
    category: "Graphic Design",
    location: "New York, NY",
    year: "2023",
    image: project2,
    slug: "noir-typography",
    infoColor: "#7B5EA7",
  },
  {
    title: "Resonance Studio",
    category: "Sound Engineering",
    location: "London, UK",
    year: "2022",
    image: project3,
    slug: "resonance-studio",
    infoColor: "#E8A87C",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            {...project}
            index={index}
          />
        ))}
      </main>

      <Footer bgColor="#6BCB77" />
    </div>
  );
};

export default Index;
