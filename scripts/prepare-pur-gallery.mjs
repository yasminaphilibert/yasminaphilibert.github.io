/**
 * Encode the PUR posters and packaging sheets as gallery tiles.
 *
 * Run from the repo root:  node scripts/prepare-pur-gallery.mjs
 *
 * Nothing is padded or cropped — the tiles keep the shape they were designed
 * at. Project.tsx passes `aspectRatio="square"` for gallery items, but Media
 * only forwards that to <Video>; for an image it renders a plain <img> inside a
 * width-only wrapper, so the picture sets its own height. The grid is happy
 * with mixed shapes: the square packshots and these portrait plates sit in the
 * same two columns at different heights.
 *
 * Long edge is capped at 1600. The gallery cell tops out at max-w-xl (576 CSS
 * px), so that still covers a 2x display with room to spare.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

const SRC = join(homedir(), 'Downloads');
const DIR = 'public/images/services/visual-identity/pur';
const OUT = join(DIR, 'plates');

const MAX = 1600;

/** [file, slug] — bare names resolve against ~/Downloads. */
const PLATES = [
  [`${DIR}/sheets/lucidity-packaging.webp`, 'lucidity-packaging'],
  [`${DIR}/sheets/snooz-packaging.webp`, 'snooz-packaging'],
  ['F0FE03AD-B0E9-4685-A47B-4DEA0C331144.PNG', 'daily-balance'],
  ['99C6989E-1803-4DA5-9511-2DB7ED894343.PNG', 'powered-by-nature'],
  ['37D211FD-3307-4272-B45B-A965F41D76E3.PNG', 'rest-reset-replenish'],
  ['6548AEAC-C0AD-4733-BF3C-A21E0F1E1929.PNG', 'night-flat-lay'],
  ['AA7A5415-E62F-4B64-9CD6-263968C8AC6D.PNG', 'in-the-basket'],
];

await mkdir(OUT, { recursive: true });

let n = 0, total = 0;
for (const [file, slug] of PLATES) {
  const src = file.includes('/') ? file : join(SRC, file);
  const out = join(OUT, `${String(++n).padStart(2, '0')}-${slug}.webp`);
  const info = await sharp(src)
    .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  total += info.size;
  console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`\n${n} plates, ${(total / 1024 / 1024).toFixed(1)} MB total`);
