import { useState, useRef, useEffect } from "react";
import { cn, normalizePublicAssetPath } from "@/lib/utils";

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
  // Normalize paths (public/ -> /). Encoding for Unicode filenames is done in services.ts.
  const srcUrl = normalizePublicAssetPath(src);
  const posterUrl = poster ? normalizePublicAssetPath(poster) : undefined;

  // Everything ships as H.264/AAC MP4, the one format every browser and every
  // iOS version decodes. The site previously served VP9/WebM only, which Safari
  // and pre-17.4 iOS simply refuse. Content still names files by their original
  // extension, so resolve to the .mp4 sibling here.
  const mp4Url = srcUrl.replace(/\.(mp4|webm|mov|avi|mkv)$/i, ".mp4");

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Kick off loading once the video is near the viewport. Deliberately one-shot:
  // load() rewinds and re-buffers, so re-firing it on every scroll past would
  // interrupt playback that is already underway.
  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      // Only nudge a video the browser hasn't begun buffering. Calling load()
      // on one that already has data aborts it and re-downloads from zero.
      if (video.readyState === 0) video.load();
    };

    // A media element can reach a usable readyState before React has its
    // handlers on it, and then no further event ever fires — which left the
    // video sitting at opacity-0 behind a spinner while it was fully buffered.
    // Seed from readyState and also listen natively.
    const sync = () => {
      if (video.readyState >= 2) setIsLoaded(true);
    };
    sync();
    video.addEventListener("loadeddata", sync);
    video.addEventListener("canplay", sync);

    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => {
        video.removeEventListener("loadeddata", sync);
        video.removeEventListener("canplay", sync);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", sync);
      video.removeEventListener("canplay", sync);
    };
  }, [srcUrl]);

  // Enough of the video is buffered to show a frame.
  const handleLoadedData = () => {
    setIsLoaded(true);
    setHasError(false);
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked (unmuted autoplay is refused on mobile) — the
        // controls are there for the user to start it.
      });
    }
  };

  // If every <source> fails, reveal the element anyway. Leaving it at opacity-0
  // behind a spinner is what made a broken video look like one that never loads.
  const handleError = () => {
    setIsLoaded(true);
    setHasError(true);
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
        key={srcUrl}
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        poster={posterUrl}
        // "auto" on a phone means eagerly pulling tens of megabytes over
        // cellular before the user has asked for anything. Metadata is enough
        // to render the first frame and wire up the scrubber.
        preload="metadata"
        playsInline={playsInline}
        muted={muted}
        loop={loop}
        controls={controls} // Provides: play/pause, mute, volume, fullscreen, progress
        onLoadedData={handleLoadedData}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
      >
        {/* Some browsers report a dead source only on the <source>, not on the
            media element, so listen on both. */}
        <source src={mp4Url} type="video/mp4" onError={handleError} />
        Your browser does not support the video tag.
      </video>

      {/* Nothing decodable: keep the poster up rather than a dead black box. */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 px-6 text-center">
          <a
            href={mp4Url}
            className="text-sm text-white underline underline-offset-4"
          >
            This video can’t play here — open it directly
          </a>
        </div>
      )}

      {/* Play button overlay for non-autoplay videos (only show if controls are disabled) */}
      {!autoplay && !isPlaying && isLoaded && !controls && !hasError && (
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
