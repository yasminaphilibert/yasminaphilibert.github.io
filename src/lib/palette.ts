/**
 * The whole site runs on these five colours.
 *
 * The markdown frontmatter still carries per-service and per-section colours
 * (infoColor, heroBackgroundColor, galleryBackground …). They are deliberately
 * ignored by the components — the point of this palette is that nine hues
 * collapse into four tints plus ink. Leaving the fields in the content means
 * nothing breaks in the loaders and they are there if the direction changes.
 */
export const PALETTE = {
  paper: "#F1ECE3",
  ink: "#1A1720",
  blush: "#F6C9DE",
  lilac: "#D3CAE9",
  sand: "#E7DBC8",
} as const;

/**
 * Alternating rather than cycling through all three evenly — lilac twice is
 * what keeps a long grid from reading as a paint chart.
 */
export const TINTS = [PALETTE.blush, PALETTE.lilac, PALETTE.sand, PALETTE.lilac] as const;

export const tintFor = (index: number) => TINTS[((index % TINTS.length) + TINTS.length) % TINTS.length];
