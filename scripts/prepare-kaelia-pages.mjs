/**
 * Encode the KAELIA production pack as flipbook pages.
 *
 * Run from the repo root:  node scripts/prepare-kaelia-pages.mjs
 *
 * The five source sheets were generated at three different shapes — a portrait
 * model sheet, a very tall five-view mockup, and three landscape technical
 * sheets — and the flipbook needs every page identical at 1024x1399.
 *
 * NOTHING IS CROPPED. These are technical documents: the pattern sheets carry
 * seam-allowance notes and Pantone chips at their edges, and the model sheet
 * runs its palette along the bottom. Filling the page the way the CLŌS CLUB
 * posters do would trim exactly the parts that make these sheets worth showing.
 *
 * So each sheet is FITTED inside the page and the leftover is filled with that
 * sheet's own paper tone, sampled from its border. The fill is therefore
 * invisible: a landscape sheet just reads as a page with deep top and bottom
 * margins, which is what a technical plate looks like in print anyway. The tone
 * is sampled per sheet rather than shared because the five were generated in
 * separate passes and their papers differ by a few units — close enough that
 * facing pages look consistent, far enough that one shared value would leave a
 * visible seam on at least two of them.
 *
 * The five-view mockup is split into its two rows so the dresses are not
 * reduced to 700px on a 1024px page. The split is found rather than hardcoded:
 * `findRowGap` looks for the flattest row of pixels in the middle third, which
 * is the paper band between the rows. The two halves are pages 1 and 2 so the
 * library pairs them into one spread and the turnaround reads whole.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

// The originals, as saved off the phone (May 2026). Kept outside the repo:
// they are 2-3 MB PNGs and only this script ever reads them.
const SRC = join(homedir(), 'Downloads');
const OUT = 'public/images/services/ai-station/009/pages';

const W = 1024, H = 1399;

/** [file, slug, split?] in reading order. `split: 'rows'` cuts into two pages. */
const SHEETS = [
  ['IMG_3010.PNG', 'dress-turnaround', 'rows'],
  ['IMG_3027.PNG', 'model-sheet-kaelia'],
  ['IMG_3011.PNG', 'pattern-pieces'],
  ['IMG_3012.PNG', 'production-pack'],
  ['IMG_3017.PNG', 'seamless-manufacturing'],
];

/**
 * The sheet's paper tone, as the median of its four border strips.
 *
 * Median rather than mean: every one of these sheets runs artwork close to at
 * least one edge, and a single dark pattern swatch bleeding into the strip
 * would drag a mean far enough off the paper to show as a band.
 */
async function paperTone(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const at = (x, y) => [data[(y * w + x) * ch], data[(y * w + x) * ch + 1], data[(y * w + x) * ch + 2]];
  const band = 6;
  const samples = [];
  for (let i = 0; i < band; i++) {
    for (let x = 0; x < w; x += 4) { samples.push(at(x, i)); samples.push(at(x, h - 1 - i)); }
    for (let y = 0; y < h; y += 4) { samples.push(at(i, y)); samples.push(at(w - 1 - i, y)); }
  }
  const median = i => {
    const v = samples.map(s => s[i]).sort((a, b) => a - b);
    return v[Math.floor(v.length / 2)];
  };
  return { r: median(0), g: median(1), b: median(2) };
}

/**
 * Row index of the paper band between the two rows of mockups.
 *
 * Scored on flatness plus lightness so a row of pale sky inside the artwork
 * cannot beat the actual gap: only the paper is both.
 */
async function findRowGap(file) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let best = { y: Math.floor(h / 2), score: -Infinity };
  for (let y = Math.floor(h * 0.35); y < Math.floor(h * 0.65); y++) {
    let sum = 0, sum2 = 0;
    for (let x = 0; x < w; x += 2) { const v = data[y * w + x]; sum += v; sum2 += v * v; }
    const n = Math.ceil(w / 2);
    const mean = sum / n;
    const sd = Math.sqrt(Math.max(0, sum2 / n - mean * mean));
    const score = mean - sd * 4;
    if (score > best.score) best = { y, score };
  }
  return best.y;
}

/** Fit `input` inside the page, filling the rest with the sheet's own paper. */
async function page(input, tone, out) {
  const info = await sharp(input)
    .resize(W, H, { fit: 'contain', background: tone })
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  return info.size;
}

await mkdir(OUT, { recursive: true });

let n = 0, total = 0;
for (const [file, slug, split] of SHEETS) {
  const src = join(SRC, file);
  const tone = await paperTone(src);
  const { width, height } = await sharp(src).metadata();

  const parts = [];
  if (split === 'rows') {
    const gap = await findRowGap(src);
    parts.push(
      [await sharp(src).extract({ left: 0, top: 0, width, height: gap }).png().toBuffer(), `${slug}-a`],
      [await sharp(src).extract({ left: 0, top: gap, width, height: height - gap }).png().toBuffer(), `${slug}-b`],
    );
    console.log(`${file}  split at y=${gap} of ${height}`);
  } else {
    parts.push([src, slug]);
  }

  for (const [input, name] of parts) {
    const out = join(OUT, `${String(++n).padStart(2, '0')}-${name}.webp`);
    const size = await page(input, tone, out);
    total += size;
    console.log(`${out}  ${(size / 1024).toFixed(0)} KB  paper rgb(${tone.r},${tone.g},${tone.b})`);
  }
}
console.log(`\n${n} pages at ${W}x${H}, ${(total / 1024 / 1024).toFixed(2)} MB`);
