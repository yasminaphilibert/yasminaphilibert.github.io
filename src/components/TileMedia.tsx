import { useState, SyntheticEvent } from "react";
import Media from "./Media";
import { snapToTileRatio, TILE_RATIOS } from "@/lib/projects";

interface TileMediaProps {
  src: string;
  alt: string;
  /** Applied to the image itself — hover transforms belong here. */
  className?: string;
  /** Applied alongside `media-frame` on the tile. */
  containerClassName?: string;
}

/**
 * An image in a tile shaped like the image itself.
 *
 * Left to their own proportions the tiles look accidental, and forced into one
 * shape they either crop badly or leave empty margins around whatever disagrees.
 * So each tile takes its image's shape, snapped to one of the few in
 * TILE_RATIOS — the image then fills it, with a few percent of crop at most.
 *
 * A browser only knows an image's dimensions once the file loads, so the tile
 * starts on the landscape default and settles as the image arrives.
 */
const TileMedia = ({ src, alt, className, containerClassName }: TileMediaProps) => {
  const [ratio, setRatio] = useState<string>(TILE_RATIOS[2].css);

  const adoptImageShape = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setRatio(snapToTileRatio(naturalWidth, naturalHeight).css);
  };

  return (
    <Media
      src={src}
      alt={alt}
      className={className}
      objectFit="cover"
      containerClassName={`media-frame ${containerClassName ?? ""}`.trim()}
      containerStyle={{ aspectRatio: ratio }}
      onLoad={adoptImageShape}
      autoplay={false}
      loop={true}
      muted={true}
      controls={true}
    />
  );
};

export default TileMedia;
