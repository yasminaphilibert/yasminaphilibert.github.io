import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Media from "./Media";

interface ProjectCardProps {
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  slug: string;
  index: number;
  infoColor: string;
}

const ProjectCard = ({ title, category, location, year, image, slug, index, infoColor }: ProjectCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full"
    >
      <Link to={`/project/${slug}`} className="block">
        {/* Full-width media (image or video) - no rounded corners on top to attach flush to previous section */}
        <Media
          src={image}
          alt={title}
          className="w-full h-[50vh] md:h-[70vh] lg:h-[80vh] transition-transform duration-700 ease-out hover:scale-105"
          autoplay={true}
          loop={true}
          muted={true}
          controls={false}
        />
        
        {/* Colored info bar with rounded bottom corners */}
        <div 
          className="w-full px-6 py-8 md:px-12 md:py-10 rounded-b-[2rem] overflow-hidden"
          style={{ backgroundColor: infoColor }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 min-w-0">
              <span className="text-sm text-black/70 break-words flex-shrink-0">{category}</span>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-black break-words min-w-0">
                {title}
              </h3>
            </div>
            
            <div className="flex flex-col md:items-end gap-1 flex-shrink-0">
              <span className="text-sm text-black/70 break-words">{location}</span>
              <span className="text-sm text-black/70 break-words">{year}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProjectCard;
