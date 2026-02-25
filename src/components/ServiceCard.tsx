import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Media from "./Media";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
  index: number;
  infoColor: string;
  homeIntro?: string;
}

const ServiceCard = ({ title, subtitle, description, image, slug, index, infoColor, homeIntro }: ServiceCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full -mt-8"
    >
      {/* Full-width media (image or video) with optional intro overlay - not clickable */}
      <div className="relative w-full">
        <Media
          src={image}
          alt={title}
          className="w-full h-[50vh] md:h-[70vh] lg:h-[80vh] transition-transform duration-700 ease-out hover:scale-105"
          containerClassName="pt-8"
          autoplay={true}
          loop={true}
          muted={true}
          controls={false}
        />
        {homeIntro ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12 pt-8 pointer-events-none">
            <p className="font-display text-xl md:text-2xl lg:text-3xl text-center text-white max-w-2xl mx-auto italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              &ldquo;{homeIntro}&rdquo;
            </p>
          </div>
        ) : null}
      </div>

      {/* Colored info bar with rounded bottom corners - only title + arrow are clickable */}
      <div
        className="w-full px-6 py-8 md:px-12 md:py-10 rounded-b-[2rem] overflow-hidden"
        style={{ backgroundColor: infoColor }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 min-w-0">
            <span className="text-sm text-black/70 break-words flex-shrink-0">{subtitle}</span>
            <Link
              to={`/services/${slug}`}
              className="inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded"
              aria-label={`Go to ${title}`}
            >
              <h3 className="service-card-title font-megna text-4xl md:text-3xl font-black text-black break-words min-w-0 transition-all duration-300 ease-in-out group-hover:scale-105">
                {title}
              </h3>
              <span
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/10 text-black transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-black group-hover:text-white flex-shrink-0"
                aria-hidden
              >
                <ArrowRight className="w-5 h-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>

          <p className="text-sm text-black/70 max-w-md break-words">
            {description}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

export default ServiceCard;
