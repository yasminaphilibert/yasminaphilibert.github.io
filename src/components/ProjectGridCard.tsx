import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Media from "./Media";
import Label from "./Label";
import { tintFor } from "@/lib/palette";

interface ProjectGridCardProps {
  title: string;
  location: string;
  year: string;
  image: string;
  slug: string;
  index: number;
  /** Overrides the rotation when a grid needs a fixed tint. */
  tint?: string;
}

const ProjectGridCard = ({ title, location, year, image, slug, index, tint }: ProjectGridCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: Math.min(index, 3) * 0.06 }}
      className="w-full h-full"
    >
      {/* h-full on both: a title that wraps to two lines would otherwise make
          its tint block taller than its neighbour's in the same row. */}
      <Link
        to={`/project/${slug}`}
        className="group block h-full card-surface p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60"
        style={{ backgroundColor: tint ?? tintFor(index) }}
        aria-label={`Go to ${title}`}
      >
        <Media
          src={image}
          alt={title}
          // One box for every card so the grid lines up — natural proportions
          // ranged 169px to 455px and left the rows ragged. Fitted, not
          // cropped, so nothing is cut off; 4:3 because eight of the
          // seventeen thumbnails sit between 1.37 and 1.79 and land snugly in
          // it. The five portrait ones render narrower, with tint at the
          // sides. The frame is transparent, so that tint is the card's own.
          className="w-full h-full transition-transform duration-[850ms] ease-out group-hover:scale-[1.035]"
          objectFit="contain"
          containerClassName="media-frame aspect-[4/3]"
          autoplay={false}
          loop={true}
          muted={true}
          controls={true}
        />

        <div className="px-1.5 pt-5 pb-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-body text-base md:text-lg font-semibold text-ink break-words min-w-0">{title}</h3>
            <Label className="flex-shrink-0">{year}</Label>
          </div>
          {location ? <Label className="mt-2 text-ink/70">{location}</Label> : null}
        </div>
      </Link>
    </motion.article>
  );
};

export default ProjectGridCard;
