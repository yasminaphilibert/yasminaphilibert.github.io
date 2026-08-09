import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn, normalizePublicAssetPath } from "@/lib/utils";

interface PosterMagazineProps {
  /** Page images in reading order. An even count keeps every spread complete. */
  pages: string[];
  /** Names the work for screen readers, e.g. the project title. */
  label?: string;
  /** Page shape. Must match the encoded assets exactly, or object-cover crops again. */
  pageRatio?: number;
  className?: string;
}

/**
 * A magazine, not a carousel: an open two-page spread whose right-hand leaves
 * turn on the spine like paper. Each leaf is a real 3D element — its front face
 * is one page and its back face is the next — so a turn reveals the following
 * spread exactly the way paper does.
 *
 * Ported from the CLŌS Club site's own MagazineBook, with one change that
 * matters: there, the left page was a photograph and the right page was the
 * poster's type set as live HTML, because those images had their graphics
 * stripped. These posters carry their typography in the pixels, so every page
 * here is simply an image and a leaf spans two of them.
 *
 * Turning is click- and keyboard-driven only. There is deliberately no
 * auto-advance: the reader sets the pace, and a page that turns on its own
 * reads as a slideshow rather than as a book.
 *
 * `turned` — the number of leaves already flipped — is the only state; the
 * whole spread derives from it.
 */
const PosterMagazine = ({ pages, label = "", pageRatio = 1024 / 1397, className }: PosterMagazineProps) => {
  const srcs = useMemo(() => pages.map(normalizePublicAssetPath), [pages]);
  // Leaf i shows page 2i+1 on its front and page 2i+2 on its back, so the very
  // first page sits under every leaf as the left half of the opening spread.
  // With page one held as the base, an even page count leaves the last leaf a
  // spare face. `back: null` renders the end paper there rather than printing
  // the final poster twice.
  const leaves = useMemo(() => {
    const out: { front: string; back: string | null; frontNo: number }[] = [];
    for (let i = 1; i < srcs.length; i += 2) {
      out.push({ front: srcs[i], back: srcs[i + 1] ?? null, frontNo: i + 1 });
    }
    return out;
  }, [srcs]);

  const n = leaves.length;
  const [turned, setTurned] = useState(0);
  // The leaf mid-turn is lifted above its neighbours, otherwise it slides
  // *through* the stack instead of over it.
  const [moving, setMoving] = useState(-1);
  const movingTimer = useRef<number>(0);

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(n, target));
      setTurned(t => {
        if (clamped === t) return t;
        setMoving(clamped > t ? t : clamped);
        window.clearTimeout(movingTimer.current);
        movingTimer.current = window.setTimeout(() => setMoving(-1), 960);
        return clamped;
      });
    },
    [n]
  );

  useEffect(() => () => window.clearTimeout(movingTimer.current), []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(turned + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(turned - 1); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(n); }
  };

  if (srcs.length === 0) return null;

  // Two pages side by side, so the open book is twice as wide as one page.
  const spread = `${pageRatio * 2} / 1`;
  const single = `${pageRatio} / 1`;

  const page = (src: string, pageNo: number, side: "left" | "right", eager = false) => (
    <div className="relative h-full w-full overflow-hidden bg-[#141210]">
      <img
        src={src}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute bottom-2 left-0 right-0 px-3 text-[9px] tabular-nums text-white/60"
        style={{ textAlign: side === "left" ? "left" : "right" }}>
        {pageNo}
      </span>
      {/* Pages darken toward the gutter, which is what makes the fold read. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-0 w-10",
          side === "left" ? "right-0 bg-gradient-to-l from-black/30 to-transparent" : "left-0 bg-gradient-to-r from-black/40 to-transparent"
        )}
      />
    </div>
  );

  const endPaper = (side: "left" | "right") => (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-[#141210] px-8 text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">End of issue</p>
      <p className="font-display text-2xl font-light leading-tight text-white/90">
        Wear it. Love it.<br />Pass it on.
      </p>
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-0 w-10",
          side === "left" ? "right-0 bg-gradient-to-l from-black/30 to-transparent" : "left-0 bg-gradient-to-r from-black/40 to-transparent"
        )}
      />
    </div>
  );

  return (
    <div className={cn("relative", className)}>
      <div
        className="book-scene mx-auto w-full"
        role="group"
        aria-roledescription="magazine"
        aria-label={`${label ? label + " — " : ""}${srcs.length} pages. Use the left and right arrow keys to turn.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Desktop: an open two-page spread. */}
        <div className="relative hidden w-full md:block" style={{ aspectRatio: spread }}>
          <div className="preserve-3d absolute inset-0 rounded-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            {/* Left base — page one, under every leaf. */}
            <button
              type="button"
              aria-label="Previous page"
              onClick={() => goTo(turned - 1)}
              disabled={turned === 0}
              // A hair past half: at odd container widths two exact halves round
              // apart and leave a hairline of background down the fold. The
              // overlap sits under the leaves, so it is never visible.
              className="absolute inset-y-0 left-0 w-[50.2%] cursor-w-resize overflow-hidden rounded-l-sm disabled:cursor-default"
            >
              {page(srcs[0], 1, "left", true)}
            </button>

            {/* Right base — the back cover, revealed once every leaf is turned. */}
            <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-sm">
              {endPaper("right")}
            </div>

            {leaves.map((leaf, i) => {
              const isTurned = i < turned;
              return (
                <button
                  key={leaf.front}
                  type="button"
                  aria-label={isTurned ? `Turn back to page ${leaf.frontNo}` : `Turn to page ${leaf.frontNo + 1}`}
                  onClick={() => goTo(isTurned ? i : i + 1)}
                  className="book-leaf preserve-3d absolute inset-y-0 right-0 w-1/2"
                  style={{
                    transform: isTurned ? "rotateY(-180deg)" : "rotateY(0deg)",
                    zIndex: i === moving ? n + 2 : isTurned ? i + 1 : n - i,
                    cursor: isTurned ? "w-resize" : "e-resize",
                  }}
                >
                  <div className="backface-hidden absolute inset-0 overflow-hidden rounded-r-sm">
                    {page(leaf.front, leaf.frontNo, "right", i === 0)}
                  </div>
                  <div
                    className="backface-hidden absolute inset-0 overflow-hidden rounded-l-sm"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    {leaf.back ? page(leaf.back, leaf.frontNo + 1, "left") : endPaper("left")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: one page at a time. Half of a 3:4 spread on a phone is
            narrower than a business card — the type would be unreadable. */}
        <div className="relative w-full overflow-hidden rounded-sm md:hidden" style={{ aspectRatio: single }}>
          {srcs.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: i === Math.min(turned, srcs.length - 1) ? 1 : 0, pointerEvents: i === turned ? "auto" : "none" }}
              aria-hidden={i !== Math.min(turned, srcs.length - 1)}
            >
              {page(src, i + 1, "left", i === 0)}
            </div>
          ))}
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => goTo(turned - 1)}
            className="absolute inset-y-0 left-0 w-1/3"
          />
          <button
            type="button"
            aria-label="Next page"
            onClick={() => goTo(turned + 1)}
            className="absolute inset-y-0 right-0 w-2/3"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => goTo(turned - 1)}
          disabled={turned === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:text-white disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="flex flex-wrap justify-center gap-1.5">
          {Array.from({ length: n + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to spread ${i + 1}`}
              aria-current={i === turned}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === turned ? "w-6 bg-white/90" : "w-1.5 bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => goTo(turned + 1)}
          disabled={turned === n}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:text-white disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PosterMagazine;
