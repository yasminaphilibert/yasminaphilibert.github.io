import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ProjectGridCardProps {
  title: string;
  location: string;
  year: string;
  image: string;
  slug: string;
  index: number;
  infoColor: string;
}

const ProjectGridCard = ({ title, location, year, image, slug, index, infoColor }: ProjectGridCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full"
    >
      <Link to={`/project/${slug}`} className="block">
        {/* Image container */}
        <div className="w-full overflow-hidden rounded-t-[1.5rem]">
          <img 
            src={image} 
            alt={title}
            className="w-full h-[40vh] md:h-[50vh] object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>
        
        {/* Colored info bar with rounded bottom corners */}
        <div 
          className="w-full px-5 py-6 md:px-6 md:py-8 rounded-b-[1.5rem]"
          style={{ backgroundColor: infoColor }}
        >
          <h3 className="font-display text-xl md:text-2xl font-medium text-black mb-3">
            {title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-black/70">
            <span>{location}</span>
            <span>•</span>
            <span>{year}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProjectGridCard;
