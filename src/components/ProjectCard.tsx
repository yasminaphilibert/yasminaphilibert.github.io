import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  slug: string;
  index: number;
}

const ProjectCard = ({ title, category, location, year, image, slug, index }: ProjectCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link to={`/project/${slug}`} className="block">
        <div className="project-card">
          <div className="overflow-hidden rounded-[1.25rem] group">
            <img 
              src={image} 
              alt={title}
              className="project-image"
            />
          </div>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <h3 className="project-title">{title}</h3>
          
          <div className="flex flex-col md:items-end gap-1">
            <span className="project-meta">{location}</span>
            <span className="project-meta">{year}</span>
          </div>
        </div>
        
        <p className="project-meta mt-2">{category}</p>
      </Link>
    </motion.article>
  );
};

export default ProjectCard;
