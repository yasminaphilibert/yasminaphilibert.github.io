import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Media from "./Media";
import Label from "./Label";
import { PALETTE } from "@/lib/palette";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
  index: number;
  homeIntro?: string;
}

const ServiceCard = ({ title, subtitle, description, image, slug, index, homeIntro }: ServiceCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: Math.min(index, 3) * 0.06 }}
      className="w-full"
    >
      <Link
        to={`/services/${slug}`}
        className="group flex h-full flex-col card-surface px-6 py-8 md:px-9 md:py-10 transition-transform duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60"
        style={{ backgroundColor: index % 2 === 0 ? PALETTE.sand : PALETTE.lilac }}
        aria-label={`Go to ${title}`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <Label>{String(index + 1).padStart(2, "0")}</Label>
          <Label>{subtitle}</Label>
        </div>

        <h3 className="display-heading mt-4 text-[1.6rem] md:text-[2rem] break-words">{title}</h3>

        {homeIntro ? (
          <p className="serif-accent mt-4 text-lg md:text-xl text-ink/85 max-w-[38ch]">
            &ldquo;{homeIntro}&rdquo;
          </p>
        ) : null}

        <Media
          src={image}
          alt={title}
          className="w-full h-[220px] md:h-[260px] transition-transform duration-[850ms] ease-out group-hover:scale-[1.035]"
          containerClassName="media-frame mt-7"
          autoplay={true}
          loop={true}
          muted={true}
          controls={false}
        />

        <p className="body-copy mt-6 max-w-[46ch] font-medium">{description}</p>

        <span className="link-cta mt-7">View &rarr;</span>
      </Link>
    </motion.article>
  );
};

export default ServiceCard;
