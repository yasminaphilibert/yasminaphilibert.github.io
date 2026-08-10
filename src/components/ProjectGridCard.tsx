import { useState, SyntheticEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Media from "./Media";
import Label from "./Label";
import { tintFor } from "@/lib/palette";
import { snapToTileRatio, TILE_RATIOS } from "@/lib/projects";

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
  // The tile takes its shape from the image, snapped to one of a few standard
  // ratios. Dimensions are only known once the file loads, so it starts on the
  // landscape default and settles when the image arrives.
  const [ratio, setRatio] = useState<string>(TILE_RATIOS[2].css);
  const adoptImageShape = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setRatio(snapToTileRatio(naturalWidth, naturalHeight).css);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: Math.min(index, 3) * 0.06 }}
      className="w-full"
    >
      <Link
        to={`/project/${slug}`}
        className="group block card-surface p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60"
        style={{ backgroundColor: tint ?? tintFor(index) }}
        aria-label={`Go to ${title}`}
      >
        <Media
          src={image}
          alt={title}
          className="w-full h-full transition-transform duration-[850ms] ease-out group-hover:scale-[1.035]"
          // Fills the tile: because the tile already matches the image's shape
          // closely, this crops a few percent at most rather than beheading
          // the portrait shots the way a fixed box did.
          objectFit="cover"
          containerClassName="media-frame"
          containerStyle={{ aspectRatio: ratio }}
          onLoad={adoptImageShape}
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
