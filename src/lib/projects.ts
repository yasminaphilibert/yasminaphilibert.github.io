/**
 * Ordering for every project grid: newest first.
 *
 * A year is free text in the markdown and is sometimes a range ("2025 — 2026"),
 * so a project is dated by the most recent year it names. Ties keep the order
 * the content gave them — sort is stable, so the `order` frontmatter still
 * decides between two projects from the same year.
 *
 * The value is typed as a string but does not always arrive as one: the
 * frontmatter parser turns any all-digit value into a number, so a plain
 * "2025" is 2025 here while "2025 — 2026" is a string. Hence the coercion.
 */
const latestYear = (year: string) => {
  const years = String(year ?? "").match(/\d{4}/g);
  return years ? Math.max(...years.map(Number)) : 0;
};

export const sortByNewest = <T extends { year: string }>(projects: T[]): T[] =>
  [...projects].sort((a, b) => latestYear(b.year) - latestYear(a.year));

/**
 * The shapes a thumbnail tile is allowed to take.
 *
 * Thumbnails arrive at seventeen different proportions, which made the grid
 * look accidental. Each one is rounded to the nearest shape here instead, so
 * the tiles read as a set. The image then fills its tile — no empty margins —
 * at the cost of a small centre crop where the two do not quite agree.
 */
export const TILE_RATIOS = [
  { name: "tall", value: 9 / 16, css: "9 / 16" },
  { name: "portrait", value: 3 / 4, css: "3 / 4" },
  { name: "square", value: 1, css: "1 / 1" },
  { name: "landscape", value: 4 / 3, css: "4 / 3" },
  { name: "wide", value: 16 / 9, css: "16 / 9" },
] as const;

/**
 * Where a tile starts before its image reports a size. Named rather than
 * indexed so adding a shape above can't silently change it.
 */
export const DEFAULT_TILE_RATIO = TILE_RATIOS.find((r) => r.name === "landscape")!;

/** The tile a thumbnail sits in. Falls back to landscape before it loads. */
export const snapToTileRatio = (width: number, height: number) => {
  if (!width || !height) return DEFAULT_TILE_RATIO;
  const ratio = width / height;
  // Compared on a log scale: proportions are multiplicative, so 16:9 is no
  // further from 4:3 than 4:3 is from 1:1, which a plain difference gets wrong.
  return TILE_RATIOS.reduce((best, candidate) =>
    Math.abs(Math.log(ratio / candidate.value)) < Math.abs(Math.log(ratio / best.value))
      ? candidate
      : best
  );
};
