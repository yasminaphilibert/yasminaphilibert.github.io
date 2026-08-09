/**
 * Encode the CLŌS CLUB campaign posters as magazine pages.
 *
 * Run from the repo root:  node scripts/prepare-magazine-pages.mjs
 *
 * The 32 posters below were culled from ~430 in the source campaign. Most of
 * that pool has AI spelling defects baked into the artwork — mangled store
 * badges ("Agp Store", "Gouge Pmo"), stray macrons ("CLŪB", "PIĒCES"), dissolved
 * taglines — so every poster listed here had its type read at native resolution
 * first. Do not add to this list without doing the same; the defects live in the
 * small print and are invisible at thumbnail size.
 *
 * PAGE SIZE — every page must be identical, and every page must fill its sheet.
 * An earlier version fitted the posters inside the page and filled the leftover
 * with a colour sampled from each poster's border. That gave every page a
 * different margin and a visible seam where the fill met the artwork. So the
 * posters are CROPPED to fill instead, and the page ratio is chosen to make that
 * safe:
 *
 *   - The page is 1024x1388 — the ratio of the TALLEST poster in the set. No
 *     page ever loses height, so nothing is trimmed off the top or the bottom.
 *   - Wider posters are cropped from the RIGHT (`position: 'left'`), because the
 *     campaign sets all its type flush left: wordmark top-left, headline and URL
 *     bottom-left. The widest loses 12% of its width, all of it background.
 *
 * This is also why the four 2:3 posters from `upscaled/` are not here. They are
 * a different format from the rest of the campaign, and fitting them to a shared
 * page cuts either the wordmark or the store badges.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = '/Users/christiandimitri/Documents/Github/pocs/closclub-ai-os/brand/posters';
const OUT = 'public/images/services/visual-identity/clos-club';

const W = 1024, H = 1388;

// In reading order. The accent colour cycles violet / mint / yellow / orange so
// no two facing pages share a palette.
const PAGES = [
  ['upscaled2/2046D12C-C5A9-467B-B67F-380E06B666D8-00.png', 'dont-stay-they-travel'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-04.png', 'keep-passing-on'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-03.png', 'another-chapter'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-07.png', 'great-taste-doesnt-shout'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-00.png', 'some-pieces-find-you'],
  ['upscaled2/2046D12C-C5A9-467B-B67F-380E06B666D8-02.png', 'not-new-not-old'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-02.png', 'good-taste-never-goes-out'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-03.png', 'make-sense'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-07.png', 'wardrobe-never-ends'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-00.png', 'has-a-past'],
  ['upscaled2/2046D12C-C5A9-467B-B67F-380E06B666D8-05.png', 'every-you-a-future'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-01.png', 'style-travels'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-05.png', 'next-story'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-01.png', 'personal-language'],
  ['upscaled2/5C3AE4F5-AD66-42AF-989F-1A1837EE7E96-00.png', 'its-next'],
  ['upscaled2/5C3AE4F5-AD66-42AF-989F-1A1837EE7E96-02.png', 'yours-now'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-04.png', 'nothing-new'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-03.png', 'exceptional-things-travel'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-01.png', 'should-be-new'],
  ['upscaled2/5C3AE4F5-AD66-42AF-989F-1A1837EE7E96-04.png', 'some-get-to-be-worn'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-05.png', 'beautiful-things-keep-moving'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-02.png', 'a-cycle'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-05.png', 'shared-closely'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-07.png', 'quality-in-style'],
  ['upscaled2/2046D12C-C5A9-467B-B67F-380E06B666D8-03.png', 'a-journey-not-a-season'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-06.png', 'worn-well-lived-in'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-04.png', 'whats-meant-for-you'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-06.png', 'someone-loved-it'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-02.png', 'collected-slowly'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-00.png', 'better-memories'],
  ['upscaled2/5C3AE4F5-AD66-42AF-989F-1A1837EE7E96-01.png', 'every-wardrobe-history'],
  ['upscaled2/5C3AE4F5-AD66-42AF-989F-1A1837EE7E96-05.png', 'belong-to-no-one'],
];

await mkdir(OUT, { recursive: true });

let total = 0;
for (let i = 0; i < PAGES.length; i++) {
  const [rel, slug] = PAGES[i];
  const src = join(SRC, rel);
  const out = join(OUT, `${String(i + 1).padStart(2, '0')}-${slug}.webp`);

  // Guard the promise this script makes: if a source is ever taller than the
  // page, filling it would silently trim the top and bottom off the artwork.
  const meta = await sharp(src).metadata();
  if (meta.width / meta.height < W / H - 0.0005) {
    throw new Error(`${rel} is taller than the page (${(meta.width / meta.height).toFixed(4)} < ${(W / H).toFixed(4)}); filling it would crop the type`);
  }

  const info = await sharp(src)
    .resize(W, H, { fit: 'cover', position: 'left' })
    .webp({ quality: 78, effort: 5 })
    .toFile(out);
  total += info.size;
  console.log(`${out}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`\n${PAGES.length} pages at ${W}x${H}, ${(total / 1024 / 1024).toFixed(2)} MB`);
