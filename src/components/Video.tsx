import { useState, useRef, useEffect } from "react";
import { cn, normalizePublicAssetPath, encodeAssetUrl } from "@/lib/utils";

interface VideoProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  aspectRatio?: "square" | "video" | "auto";
}

const Video = ({
  src,
  poster,
  alt,
  className,
  autoplay = false,
  loop = false,
  muted = false, // Audio enabled by default
  playsInline = true,
  controls = true, // Full controls: play/pause, mute, volume, fullscreen
  aspectRatio = "square",
}: VideoProps) => {
  // Normalize paths so public/videos/... -> /videos/... (required for production)
  const normalizedSrc = normalizePublicAssetPath(src);
  const normalizedPoster = poster ? normalizePublicAssetPath(poster) : undefined;
  // Encode Unicode in URLs so GitHub Pages and strict servers can resolve the file (e.g. Ākāsadhātu)
  const srcUrl = encodeAssetUrl(normalizedSrc);
  const posterUrl = normalizedPoster ? encodeAssetUrl(normalizedPoster) : undefined;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load video when in viewport (lazy), and trigger load on mount so hero videos start immediately
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.load();
          }
        });
      },
      { rootMargin: "50px", threshold: 0.1 }
    );
    observer.observe(el);
    // Hero videos: trigger load immediately so we don't wait for observer callback
    const t = requestAnimationFrame(() => {
      if (videoRef.current) videoRef.current.load();
    });
    return () => {
      observer.unobserve(el);
      cancelAnimationFrame(t);
    };
  }, []);

  // Handle video loaded
  const handleLoadedData = () => {
    setIsLoaded(true);
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, user interaction required
      });
    }
  };

  // Handle play/pause
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  // Get aspect ratio class
  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
      ? "aspect-video"
      : "";

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", aspectClass, !aspectRatio && "h-full", className)}
    >
      {/* Poster image - shown before video loads */}
      {posterUrl && !isLoaded && (
        <img
          src={posterUrl}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
        </div>
      )}

      {/* Video element with full controls */}
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        poster={posterUrl}
        preload="auto"
        playsInline={playsInline}
        muted={muted}
        loop={loop}
        controls={controls} // Provides: play/pause, mute, volume, fullscreen, progress
        onLoadedData={handleLoadedData}
        onPlay={handlePlay}
        onPause={handlePause}
      >
        {/* WebM only - best compression for web */}
        <source src={srcUrl.replace(/\.(mp4|mov|avi|mkv)$/i, ".webm")} type="video/webm" />
        <source src={srcUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Play button overlay for non-autoplay videos (only show if controls are disabled) */}
      {!autoplay && !isPlaying && isLoaded && !controls && (
        <button
          onClick={() => videoRef.current?.play()}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors z-10"
          aria-label="Play video"
        >
          <svg
            className="h-16 w-16 text-white drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Video;
