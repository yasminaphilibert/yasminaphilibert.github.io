import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
  index: number;
  infoColor: string;
}

const ServiceCard = ({ title, subtitle, description, image, slug, index, infoColor }: ServiceCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full -mt-8"
    >
      <Link to={`/services/${slug}`} className="block">
        {/* Full-width image */}
        <div className="w-full overflow-hidden pt-8">
          <img 
            src={image} 
            alt={title}
            className="w-full h-[50vh] md:h-[70vh] lg:h-[80vh] object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>
        
        {/* Colored info bar with rounded bottom corners */}
        <div 
          className="w-full px-6 py-8 md:px-12 md:py-10 rounded-b-[2rem]"
          style={{ backgroundColor: infoColor }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-8">
              <span className="text-sm text-black/70">{subtitle}</span>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-black">
                {title}
              </h3>
            </div>
            
            <p className="text-sm text-black/70 max-w-md">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ServiceCard;
