import { useCallback, useLayoutEffect, useRef } from "react";
import { cn, normalizePublicAssetPath } from "@/lib/utils";

interface CompareSliderProps {
  leftSrc: string;
  rightSrc: string;
  leftLabel?: string;
  rightLabel?: string;
  alt?: string;
  /** Fold position at rest, 0-100. 100 = top sheet fully down. */
  initial?: number;
  /** Matches the encoded assets (1520x1024) so there is no layout shift. */
  aspectRatio?: string;
  /** Load immediately rather than lazily — use for the first pair only. */
  eager?: boolean;
  className?: string;
  labelClassName?: string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Two images stacked as sheets of paper. Click and the top sheet rolls away to
 * reveal the one beneath; click again and it rolls back.
 *
 * The fold position lives in a CSS custom property written straight to the DOM
 * via ref — never in React state, so the roll animates without re-rendering the
 * subtree sixty times a second.
 *
 * The top layer is revealed with clip-path rather than a width-constrained
 * wrapper: clipping leaves the inner <img> geometry untouched, so both images
 * stay pixel-registered throughout the turn.
 */
const CompareSlider = ({
  leftSrc,
  rightSrc,
  leftLabel = "A",
  rightLabel = "B",
  alt = "",
  initial = 100,
  aspectRatio = "1520 / 1024",
  eager = false,
  className,
  labelClassName,
}: CompareSliderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(initial);
  const rafRef = useRef<number | null>(null);
  const tweenRef = useRef<number | null>(null);
  const widthRef = useRef(0);
  const shownRef = useRef(true); // true = top sheet down, showing `left`
  const labelRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  const paint = useCallback(() => {
    rafRef.current = null;
    const pct = posRef.current;
    const root = rootRef.current;
    root?.style.setProperty("--pos", `${pct}%`);
    // The curl needs the fold position in px, not %, to place the mirrored
    // underside — see the geometry note on the curl element below.
    root?.style.setProperty("--posPx", `${(pct / 100) * widthRef.current}px`);
  }, []);

  const setPos = useCallback(
    (pct: number) => {
      posRef.current = clamp(pct);
      // Coalesce to one write per frame; pointermove can outpace the compositor.
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(paint);
    },
    [paint]
  );

  // Set --pos imperatively before first paint, never via the style prop: React
  // re-applies inline styles on every render, which would snap a dragged divider
  // back to `initial`. clip-path carries a fallback for the pre-effect frame.
  useLayoutEffect(() => {
    const el = rootRef.current;
    const w0 = el?.getBoundingClientRect().width ?? 0;
    if (el && w0 > 0) {
      widthRef.current = w0;
      el.style.setProperty("--w", `${w0}px`);
    }
    paint();
    // The curl's mirrored underside is positioned in px, so it has to be
    // recomputed whenever the card is resized.
    const ro = new ResizeObserver(([entry]) => {
      // Ignore zero-width observations — a hidden or not-yet-laid-out ancestor
      // reports 0, which would park the curl off-screen and leave it there.
      const w = entry.contentRect.width;
      if (w <= 0) return;
      widthRef.current = w;
      rootRef.current?.style.setProperty("--w", `${w}px`);
      paint();
    });
    if (el) ro.observe(el);
    return () => {
      ro.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (tweenRef.current !== null) cancelAnimationFrame(tweenRef.current);
    };
  }, [paint]);

  // Roll the sheet to `target` with an eased tween. Runs entirely on refs +
  // direct style writes, so a 800ms turn costs zero React renders.
  const rollTo = useCallback(
    (target: number) => {
      if (tweenRef.current !== null) cancelAnimationFrame(tweenRef.current);
      const from = posRef.current;
      if (from === target) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dur = reduced ? 0 : 780;
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = dur ? Math.min(1, (now - t0) / dur) : 1;
        // easeInOutCubic — slow at the fold's start and finish, like a real page
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        posRef.current = from + (target - from) * e;
        paint();
        tweenRef.current = k < 1 ? requestAnimationFrame(tick) : null;
      };
      tweenRef.current = requestAnimationFrame(tick);
    },
    [paint]
  );

  const turn = useCallback(() => {
    shownRef.current = !shownRef.current;
    const root = rootRef.current;
    root?.setAttribute("aria-pressed", String(!shownRef.current));
    root?.setAttribute(
      "aria-label",
      `${alt ? alt + ": " : ""}showing ${shownRef.current ? leftLabel : rightLabel}. ` +
        `Activate to turn the page to ${shownRef.current ? rightLabel : leftLabel}.`
    );
    // Only one sheet is visible at a time, so only one name may be shown —
    // otherwise the hidden model's label sits on top of the visible poster.
    if (labelRef.current) {
      labelRef.current.textContent = shownRef.current ? leftLabel : rightLabel;
    }
    // The prompt has done its job the moment they turn the first page.
    hintRef.current?.classList.add("opacity-0");
    rollTo(shownRef.current ? 100 : 0);
  }, [rollTo, alt, leftLabel, rightLabel]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    e.preventDefault();
    turn();
  };

  const left = normalizePublicAssetPath(leftSrc);
  const right = normalizePublicAssetPath(rightSrc);
  const chip =
    labelClassName ??
    "bg-black/55 text-white/90 backdrop-blur-sm";

  return (
    <div
      ref={rootRef}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg bg-black/5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
        className
      )}
      style={{ aspectRatio, ["--curl" as string]: "clamp(18px, 3.2vw, 40px)" }}
      role="button"
      tabIndex={0}
      aria-pressed={false}
      aria-label={`${alt ? alt + ": " : ""}showing ${leftLabel}. Activate to turn the page to ${rightLabel}.`}
      onClick={turn}
      onKeyDown={onKeyDown}
    >
      <img
        src={left}
        alt={alt ? `${alt} — ${leftLabel}` : leftLabel}
        width={1520}
        height={1024}
        draggable={false}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        ref={clipRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0 0 var(--pos, 50%))" }}
      >
        <img
          src={right}
          alt={alt ? `${alt} — ${rightLabel}` : rightLabel}
          width={1520}
          height={1024}
          draggable={false}
          decoding="async"
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Which sheet you are looking at now — one name, swapped on turn. */}
      <span
        ref={labelRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-3 left-3 z-30 rounded px-2 py-1 text-[10px] font-medium uppercase tracking-wider md:bottom-4 md:left-4 md:text-xs",
          chip
        )}
      >
        {leftLabel}
      </span>

      {/* Affordance: a dog-eared corner that lifts on hover, plus a prompt that
          retires after the first turn. Without these the card looks like a
          static poster and nobody discovers the second version. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 z-30 h-10 w-10 transition-transform duration-300 ease-out group-hover:scale-125 md:h-14 md:w-14"
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          background:
            "linear-gradient(225deg, rgba(255,255,255,0.92) 0%, rgba(238,236,230,0.9) 45%, rgba(170,166,158,0.9) 100%)",
          boxShadow: "-3px -3px 8px rgba(0,0,0,0.28)",
        }}
      />
      <span
        ref={hintRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-3 right-12 z-30 rounded px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-opacity duration-500 md:bottom-4 md:right-16 md:text-xs",
          chip
        )}
      >
        click to turn
      </span>

      {/* The page curl. Sits just left of the fold and shows the UNDERSIDE of the
          top sheet: a mirrored sliver of the same image, shaded like a cylinder.
          Geometry — a mirrored <img> of width W at left L renders image column
          (L + W - x) at screen x. To show columns [P-C, P] reversed across the
          band, solve L + W - (P - C) = P, giving L = 2P - C - W. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 overflow-hidden"
        style={{
          left: "calc(var(--posPx, 50%) - var(--curl))",
          width: "var(--curl)",
        }}
      >
        <img
          src={left}
          alt=""
          draggable={false}
          className="absolute top-0 h-full max-w-none"
          style={{
            width: "var(--w)",
            left: "calc(2 * var(--posPx) - var(--curl) - var(--w))",
            transform: "scaleX(-1)",
          }}
        />
        {/* cylindrical shading: trough at the fold, crest mid-curl */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 18%, rgba(255,255,255,0.42) 52%, rgba(255,255,255,0.16) 74%, rgba(0,0,0,0.30) 100%)",
          }}
        />
      </div>

      {/* Shadow the curl casts onto the page beneath it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-8"
        style={{
          left: "var(--pos, 50%)",
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0) 100%)",
        }}
      />

    </div>
  );
};

export default CompareSlider;
