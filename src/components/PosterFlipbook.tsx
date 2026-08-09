import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { cn, normalizePublicAssetPath } from "@/lib/utils";

interface PosterFlipbookProps {
  /** Page images in reading order. */
  pages: string[];
  /** Names the work for screen readers, e.g. the project title. */
  label?: string;
  /** Page shape, width / height. Must match the encoded assets. */
  pageRatio?: number;
  className?: string;
}

/**
 * The campaign as a real flip-book.
 *
 * This replaces a hand-rolled CSS 3D version whose leaves rotated flat about the
 * spine. That reads as a turning rectangle rather than paper, and the obvious
 * fix — tilting the rotation axis so the fold runs obliquely — cannot work: a
 * 180 degree turn about a tilted axis leaves the page lying several degrees off
 * the spread. A convincing turn needs the sheet split into strips that each bend
 * a little more than the last, which is what StPageFlip does on a canvas.
 *
 * So the geometry is delegated to react-pageflip, exactly as the YΛSYNTHΛ press
 * kit does it — and, as there, ONLY width and height are passed. Every other
 * option is left at its default; the library's own defaults are what make the
 * curl and its shadows look right, and overriding them piecemeal is how this
 * ends up looking synthetic again.
 *
 * The one thing that has to be solved here rather than inherited: the press kit
 * is a full-screen document, while this sits inside a page column. So the size
 * is measured from the container instead of the window, and the book is
 * remounted on resize — StPageFlip takes its dimensions once, at construction.
 */
/**
 * react-pageflip's types mark every option as required, even though the library
 * defaults all of them at runtime. Passing only width and height is the point —
 * see the note above — so the component is narrowed to the props actually used
 * rather than padded out with a list of defaults restated by hand.
 */
type FlipBookProps = {
  width: number;
  height: number;
  children: React.ReactNode;
  ref?: React.Ref<unknown>;
};
const FlipBook = HTMLFlipBook as unknown as React.ComponentType<FlipBookProps>;

const Page = forwardRef<HTMLDivElement, { src: string; pageNo: number }>(({ src, pageNo }, ref) => (
  <div className="flip-page" ref={ref}>
    <img src={src} alt="" draggable={false} />
    <span className="flip-page-no">{pageNo}</span>
  </div>
));
Page.displayName = "Page";

const PosterFlipbook = ({ pages, label = "", pageRatio = 1024 / 1399, className }: PosterFlipbookProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } } | null>(null);
  const [dim, setDim] = useState<{ w: number; h: number } | null>(null);
  const dimRef = useRef<{ w: number; h: number } | null>(null);

  const measure = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    const available = host.clientWidth;
    // A zero width is what makes StPageFlip throw "Invalid width or height",
    // so never hand it one — wait until the column has actually been laid out.
    if (available <= 0) return;
    // Below the portrait threshold the library shows one page, so the book is
    // one page wide there and two pages wide above it.
    const single = available < 700;
    const w = Math.floor(single ? available : available / 2);
    const h = Math.round(w / pageRatio);
    setDim(prev => {
      if (prev && prev.w === w && prev.h === h) return prev;
      const next = { w, h };
      dimRef.current = next;
      return next;
    });
  }, [pageRatio]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (hostRef.current) ro.observe(hostRef.current);
    window.addEventListener("resize", measure);
    // If the first measurement lands while the column still has no width, the
    // book would never mount at all — so retry for a few frames rather than
    // trusting one observer to deliver.
    let tries = 0;
    const retry = window.setInterval(() => {
      if (dimRef.current || ++tries > 20) window.clearInterval(retry);
      else measure();
    }, 100);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearInterval(retry);
    };
  }, [measure]);

  // Arrow keys, but only while the book has focus — the page has its own
  // horizontal navigation and should not fight with it.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const api = bookRef.current?.pageFlip?.();
    if (!api) return;
    if (e.key === "ArrowRight") { e.preventDefault(); api.flipNext(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); api.flipPrev(); }
  };

  useEffect(() => { document.fonts?.ready?.then(measure).catch(() => {}); }, [measure]);

  const srcs = pages.map(normalizePublicAssetPath);

  return (
    <div
      ref={hostRef}
      className={cn("flip-host relative w-full", className)}
      role="group"
      aria-roledescription="magazine"
      aria-label={`${label ? label + " — " : ""}${srcs.length} pages. Use the left and right arrow keys to turn.`}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {dim && (
        // Remount on resize: StPageFlip reads its dimensions at construction.
        <FlipBook key={`${dim.w}x${dim.h}`} ref={bookRef} width={dim.w} height={dim.h}>
          {srcs.map((src, i) => (
            <Page key={src} src={src} pageNo={i + 1} />
          ))}
        </FlipBook>
      )}

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => bookRef.current?.pageFlip?.().flipPrev()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <span className="text-[10px] uppercase tracking-[0.24em] text-white/45">Drag a corner</span>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => bookRef.current?.pageFlip?.().flipNext()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PosterFlipbook;
