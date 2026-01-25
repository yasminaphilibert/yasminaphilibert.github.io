import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TextScrambleProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  scramblePercentage?: number; // 0-100, controls how many chars in radius get scrambled
  scrambleRadius?: number; // radius of the scramble circle in pixels
  scrambleChars?: string; // characters to use for scrambling
  scrambleSpeed?: number; // milliseconds between scrambles
  onHover?: boolean; // if true, only scrambles on hover
  autoTrigger?: boolean; // if true, automatically triggers scramble animation on mount
  autoTriggerDuration?: number; // duration of auto-trigger animation in milliseconds
}

const DEFAULT_SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
const DEFAULT_SCRAMBLE_SPEED = 50;
const DEFAULT_SCRAMBLE_RADIUS = 100;
const DEFAULT_SCRAMBLE_PERCENTAGE = 100;

export const TextScramble = ({
  children,
  as: Component = "p",
  className,
  scramblePercentage = DEFAULT_SCRAMBLE_PERCENTAGE,
  scrambleRadius = DEFAULT_SCRAMBLE_RADIUS,
  scrambleChars = DEFAULT_SCRAMBLE_CHARS,
  scrambleSpeed = DEFAULT_SCRAMBLE_SPEED,
  onHover = true,
  autoTrigger = false,
  autoTriggerDuration = 2000,
}: TextScrambleProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [scrambledChars, setScrambledChars] = useState<Map<number, string>>(new Map());
  const containerRef = useRef<HTMLElement>(null);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const scrambleIntervalRef = useRef<number>();
  const autoTriggerAnimationRef = useRef<number>();

  // Get random scramble character
  const getRandomScrambleChar = useCallback(() => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }, [scrambleChars]);

  // Calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Get character positions and scramble
  const scrambleText = useCallback(() => {
    if (!mousePosition || !containerRef.current) {
      setScrambledChars(new Map());
      return;
    }

    const charPositions: Array<{ index: number; x: number; y: number; distance: number }> = [];
    
    charRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        const distance = getDistance(mousePosition.x, mousePosition.y, x, y);
        
        if (distance <= scrambleRadius) {
          charPositions.push({ index, x, y, distance });
        }
      }
    });

    // Sort by distance and take percentage
    charPositions.sort((a, b) => a.distance - b.distance);
    const charsToScramble = Math.floor((charPositions.length * scramblePercentage) / 100);
    const indicesToScramble = charPositions.slice(0, charsToScramble).map((pos) => pos.index);

    // Update scrambled characters map
    const newScrambledChars = new Map<number, string>();
    indicesToScramble.forEach((index) => {
      newScrambledChars.set(index, getRandomScrambleChar());
    });
    setScrambledChars(newScrambledChars);
  }, [mousePosition, scramblePercentage, scrambleRadius, getRandomScrambleChar]);

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePosition(null);
    setScrambledChars(new Map());
  }, []);

  // Initialize char refs array
  useEffect(() => {
    charRefs.current = new Array(children.length).fill(null);
  }, [children]);

  // Auto-trigger animation on mount
  useEffect(() => {
    if (!autoTrigger || !containerRef.current) return;

    // Wait for refs to be populated
    const timeoutId = setTimeout(() => {
      if (!containerRef.current || charRefs.current.length === 0) return;

      // Get container dimensions
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerY = containerRect.height / 2;
      
      // Calculate text bounds
      let minX = Infinity;
      let maxX = -Infinity;
      charRefs.current.forEach((ref) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const relativeX = rect.left - containerRect.left + rect.width / 2;
          minX = Math.min(minX, relativeX);
          maxX = Math.max(maxX, relativeX);
        }
      });

      if (minX === Infinity || maxX === -Infinity) return;

      const startX = minX;
      const endX = maxX;
      const startTime = Date.now();
      const duration = autoTriggerDuration;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentX = startX + (endX - startX) * easedProgress;

        setMousePosition({ x: currentX, y: centerY });
        setIsHovering(true);

        if (progress < 1) {
          autoTriggerAnimationRef.current = requestAnimationFrame(animate);
        } else {
          // After animation completes, clear the scramble after a short delay
          setTimeout(() => {
            setMousePosition(null);
            setIsHovering(false);
            setScrambledChars(new Map());
          }, 300);
        }
      };

      animate();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (autoTriggerAnimationRef.current) {
        cancelAnimationFrame(autoTriggerAnimationRef.current);
      }
    };
  }, [autoTrigger, autoTriggerDuration, children]);

  // Animation loop
  useEffect(() => {
    if ((!onHover || (onHover && isHovering)) && mousePosition) {
      scrambleText();
      scrambleIntervalRef.current = window.setInterval(() => {
        scrambleText();
      }, scrambleSpeed);
    }

    return () => {
      if (scrambleIntervalRef.current) {
        clearInterval(scrambleIntervalRef.current);
      }
    };
  }, [isHovering, mousePosition, onHover, scrambleSpeed, scrambleText]);

  return (
    <Component
      ref={containerRef}
      className={cn("cursor-default select-none inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children.split("").map((char, index) => {
        const displayChar = scrambledChars.has(index) ? scrambledChars.get(index)! : char;
        
        return (
          <span
            key={index}
            ref={(el) => {
              charRefs.current[index] = el;
            }}
            className="inline-block"
          >
            {displayChar === " " ? "\u00A0" : displayChar}
          </span>
        );
      })}
    </Component>
  );
};

export default TextScramble;
