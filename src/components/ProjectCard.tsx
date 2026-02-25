import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
      {/* Full-width media (image or video) - not clickable */}
      <Media
        src={image}
        alt={title}
        className="w-full h-[50vh] md:h-[70vh] lg:h-[80vh] transition-transform duration-700 ease-out hover:scale-105"
        autoplay={true}
        loop={true}
        muted={true}
        controls={false}
      />

      {/* Colored info bar - only title + arrow are clickable */}
      <div
        className="w-full px-6 py-8 md:px-12 md:py-10 rounded-b-[2rem] overflow-hidden"
        style={{ backgroundColor: infoColor }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 min-w-0 flex-1">
            <span className="text-sm text-black/70 break-words flex-shrink-0">{category}</span>
            <Link
              to={`/project/${slug}`}
              className="inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded"
              aria-label={`Go to ${title}`}
            >
              <h3 className="font-display text-2xl md:text-3xl font-medium text-black break-words min-w-0 transition-all duration-300 ease-in-out group-hover:scale-105">
                {title}
              </h3>
            </Link>
          </div>

          <div className="flex flex-col md:items-end gap-1 flex-shrink-0">
            <span className="text-sm text-black/70 break-words">{location}</span>
            <span className="text-sm text-black/70 break-words">{year}</span>
          </div>

          <Link
            to={`/project/${slug}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/10 text-black transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black hover:text-white flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 self-center md:self-auto"
            aria-label={`Go to ${title}`}
          >
            <ArrowRight className="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
