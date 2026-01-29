import { ReactNode } from "react";
import Video from "./Video";
import { cn, normalizePublicAssetPath, encodeAssetUrl } from "@/lib/utils";

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
  children?: ReactNode;
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
  children,
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
    // Extract height classes from className to apply to container
    const heightMatch = className?.match(/h-\[[\w\d]+vh\]|h-\[[\w\d]+px\]|h-\d+/);
    const heightClass = heightMatch ? heightMatch[0] : "";
    
    return (
      <div className={cn("w-full", containerClassName)}>
        <div className={cn("w-full", heightClass || "h-full")}>
          <Video
            src={normalizedSrc}
            poster={videoPoster}
            alt={alt}
            className={cn(className.replace(/h-\[[\w\d]+vh\]|h-\[[\w\d]+px\]|h-\d+/g, ""), "w-full h-full")}
            aspectRatio={aspectRatio}
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

  // Render as image (encode Unicode for GitHub Pages / strict servers)
  return (
    <div className={cn("w-full overflow-hidden", containerClassName)}>
      <img
        src={encodeAssetUrl(normalizedSrc)}
        alt={alt}
        className={cn("w-full h-full", `object-${objectFit}`, className)}
        style={objectPosition ? { objectPosition } : undefined}
      />
      {children}
    </div>
  );
};

export default Media;
