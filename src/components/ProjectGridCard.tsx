import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Media from "./Media";

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
      {/* Media container (image or video) - not clickable */}
      <Media
        src={image}
        alt={title}
        className="w-full h-[40vh] md:h-[50vh] transition-transform duration-700 ease-out hover:scale-105"
        containerClassName="rounded-t-[1.5rem] overflow-hidden"
        autoplay={false}
        loop={true}
        muted={true}
        controls={true}
      />

      {/* Colored info bar - only title + arrow are clickable, arrow on the right */}
      <div
        className="w-full px-5 py-6 md:px-6 md:py-8 rounded-b-[1.5rem] overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        style={{ backgroundColor: infoColor }}
      >
        <div className="min-w-0 flex-1">
          <Link
            to={`/project/${slug}`}
            className="inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded"
            aria-label={`Go to ${title}`}
          >
            <h3 className="font-display text-xl md:text-2xl font-medium text-black break-words min-w-0 transition-all duration-300 ease-in-out group-hover:scale-105">
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-4 text-sm text-black/70 flex-wrap mt-3">
            <span className="break-words">{location}</span>
            <span>•</span>
            <span className="break-words">{year}</span>
          </div>
        </div>
        <Link
          to={`/project/${slug}`}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/10 text-black transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black hover:text-white flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 self-start sm:self-center"
          aria-label={`Go to ${title}`}
        >
          <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
};

export default ProjectGridCard;
