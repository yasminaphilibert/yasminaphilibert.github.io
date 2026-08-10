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
