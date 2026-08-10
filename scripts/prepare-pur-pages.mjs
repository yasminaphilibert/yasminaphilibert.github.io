/**
 * Encode the PUR campaign as flipbook pages.
 *
 * Run from the repo root:  node scripts/prepare-pur-pages.mjs
 *
 * The sources are five 2022 campaign posters, saved off a phone at four
 * different shapes, plus two packaging sheets built in this pass. The flipbook
 * needs every page identical at 1024x1399.
 *
 * Nothing is cropped — the posters carry the wordmark at the top and the
 * vegan/non-GMO line and URL along the bottom, and filling the page would trim
 * one or the other. Each poster is fitted instead.
 *
 * The leftover is filled with a blown-up, heavily blurred copy of the poster
 * itself rather than a flat colour. These are full-bleed gradient designs: the
 * hero runs amber on its left edge to purple on its right, so any single fill
 * value seams visibly down one side, and sampling a median just yields mud. A
 * blurred enlargement of the poster puts amber behind the amber edge and purple
 * behind the purple one, so the bars read as the poster's own light spilling
 * past the frame and the join disappears.
 *
 * The two packaging sheets are authored at exactly 2048x2798 — twice the page —
 * so for them the fit is a straight downscale and the blur never shows.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

// The posters as saved off the phone (October 2022). Kept outside the repo:
// they are 2-4 MB PNGs and only this script ever reads them.
const SRC = join(homedir(), 'Downloads');
const SHEETS = 'public/images/services/visual-identity/pur/sheets';
const OUT = 'public/images/services/visual-identity/pur/pages';

const W = 1024, H = 1399;

/** [file, slug] in reading order. Bare names resolve against ~/Downloads. */
const PAGES = [
  ['F0FE03AD-B0E9-4685-A47B-4DEA0C331144.PNG', 'daily-balance'],
  ['99C6989E-1803-4DA5-9511-2DB7ED894343.PNG', 'powered-by-nature'],
  ['37D211FD-3307-4272-B45B-A965F41D76E3.PNG', 'rest-reset-replenish'],
  ['6548AEAC-C0AD-4733-BF3C-A21E0F1E1929.PNG', 'night-flat-lay'],
  ['AA7A5415-E62F-4B64-9CD6-263968C8AC6D.PNG', 'in-the-basket'],
  [`${SHEETS}/lucidity-packaging.webp`, 'lucidity-packaging'],
  [`${SHEETS}/snooz-packaging.webp`, 'snooz-packaging'],
];

/** Fit `input` inside the page over a blurred enlargement of itself. */
async function page(input, out) {
  const backdrop = await sharp(input)
    .resize(W, H, { fit: 'cover' })
    .blur(28)
    .modulate({ brightness: 0.82 })   // sit the spill back so the poster edge still reads
    .toBuffer();
  const front = await sharp(input)
    .resize(W, H, { fit: 'inside' })
    .toBuffer();
  const { width, height } = await sharp(front).metadata();
  const info = await sharp(backdrop)
    .composite([{ input: front, left: Math.round((W - width) / 2), top: Math.round((H - height) / 2) }])
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  return { size: info.size, inset: [W - width, H - height] };
}

await mkdir(OUT, { recursive: true });

let n = 0, total = 0;
for (const [file, slug] of PAGES) {
  const src = file.includes('/') ? file : join(SRC, file);
  const out = join(OUT, `${String(++n).padStart(2, '0')}-${slug}.webp`);
  const { size, inset } = await page(src, out);
  total += size;
  console.log(`${out}  ${(size / 1024).toFixed(0)} KB  bars ${inset[0]}x${inset[1]}`);
}
console.log(`\n${n} pages, ${(total / 1024 / 1024).toFixed(1)} MB total`);
