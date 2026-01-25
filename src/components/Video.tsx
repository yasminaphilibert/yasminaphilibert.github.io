import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            // Only load video when it's in viewport
            if (videoRef.current && !isLoaded) {
              videoRef.current.load();
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isLoaded]);

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
      {poster && !isLoaded && (
        <img
          src={poster}
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
        poster={poster}
        preload="metadata" // Only load metadata initially
        playsInline={playsInline}
        muted={muted}
        loop={loop}
        controls={controls} // Provides: play/pause, mute, volume, fullscreen, progress
        onLoadedData={handleLoadedData}
        onPlay={handlePlay}
        onPause={handlePause}
      >
        {/* WebM only - best compression for web */}
        <source src={src.replace(/\.(mp4|mov|avi|mkv)$/i, ".webm")} type="video/webm" />
        <source src={src} type="video/webm" />
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
