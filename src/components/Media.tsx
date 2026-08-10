import { CSSProperties, ReactNode, SyntheticEvent } from "react";
import Video from "./Video";
import { cn, normalizePublicAssetPath } from "@/lib/utils";

interface MediaProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
  // For images
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string; // CSS object-position value (e.g., "center top")
  // For videos
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  // Container props
  containerClassName?: string;
  containerStyle?: CSSProperties;
  children?: ReactNode;
  /** Images only — lets a caller read the natural dimensions once loaded. */
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Smart Media component that automatically detects if src is a video or image
 * and renders the appropriate component
 */
const Media = ({
  src,
  alt,
  className,
  aspectRatio,
  objectFit = "cover",
  objectPosition,
  autoplay = false,
  loop = true,
  muted = false, // Audio enabled by default
  controls = true, // Full controls: play/pause, mute, volume, fullscreen
  poster,
  containerClassName,
  containerStyle,
  children,
  onLoad,
}: MediaProps) => {
  // Normalize paths so public/videos/... -> /videos/... (required for production)
  const normalizedSrc = normalizePublicAssetPath(src);


  // Check if the source is a video file
  const isVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(normalizedSrc);

  // Generate poster path if not provided (same name with _poster.jpg)
  const videoPoster = normalizePublicAssetPath(
    poster || (isVideo ? normalizedSrc.replace(/\.(mp4|webm|mov|avi|mkv)$/i, "_poster.jpg") : "")
  ) || undefined;
  
  // For videos, if src ends with .mp4, try to use .webm version if available
  // The Video component will handle the fallback

  if (isVideo) {
    // Height belongs on the wrapper, not on the <video>. Match responsive
    // variants too — grabbing only the first match dropped the `md:` height and
    // left a dangling `md:` prefix in the class list.
    const HEIGHT_CLASS = /(?:[a-z0-9]+:)?h-(?:\[[^\]]+\]|\d+|full|screen|auto)/g;
    const heightClasses = className?.match(HEIGHT_CLASS)?.join(" ") ?? "";

    return (
      <div className={cn("w-full", containerClassName)} style={containerStyle}>
        <div className={cn("w-full", heightClasses || "h-full")}>
          <Video
            src={normalizedSrc}
            poster={videoPoster}
            alt={alt}
            className={cn(className?.replace(HEIGHT_CLASS, ""), "w-full h-full")}
            // Without an explicit ratio the video should fill the height the
            // caller asked for; Video's own default is a square crop.
            aspectRatio={aspectRatio ?? "auto"}
            autoplay={autoplay}
            loop={loop}
            muted={muted}
            controls={controls}
          />
        </div>
        {children}
      </div>
    );
  }

  // Render as image (encoding for Unicode filenames is done in services.ts)
  return (
    <div className={cn("w-full overflow-hidden", containerClassName)} style={containerStyle}>
      <img
        src={normalizedSrc}
        alt={alt}
        className={cn("w-full h-full", `object-${objectFit}`, className)}
        style={objectPosition ? { objectPosition } : undefined}
        onLoad={onLoad}
      />
      {children}
    </div>
  );
};

export default Media;
