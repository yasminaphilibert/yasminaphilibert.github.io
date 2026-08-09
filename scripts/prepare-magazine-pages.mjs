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
 * Every page is portrait, but the sources span 0.666 to 0.841, so they are
 * FITTED rather than cropped: cropping to a common ratio would cut the headline
 * off, which is the one thing the page exists to show. The letterbox is filled
 * with a colour sampled from the poster's own border, so the bars read as the
 * poster's ground instead of as a black frame.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = '/Users/christiandimitri/Documents/Github/pocs/closclub-ai-os/brand/posters';
const OUT = 'public/images/services/visual-identity/clos-club';

// 3:4. The commonest source shape, so the fewest pages need bars.
const W = 1024, H = 1365;

const PAGES = [
  ['upscaled/16A42435-B9B3-4E96-8E3E-04FCCA2DBB03.png', 'clothes-remember'],
  ['upscaled/B4546BDD-57FE-4A90-B370-B14B01040011.png', 'pieces-outlive'],
  ['upscaled/6F2552D9-1D6B-4F6C-93FC-86E60960982A.png', 'collected-over-time'],
  ['upscaled/D59CCDA5-B58B-4803-ACA2-387E7480393E.png', 'never-stay-still'],
  ['upscaled2/2046D12C-C5A9-467B-B67F-380E06B666D8-00.png', 'dont-stay-they-travel'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-07.png', 'wardrobe-never-ends'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-00.png', 'some-pieces-find-you'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-03.png', 'another-chapter'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-04.png', 'keep-passing-on'],
  ['upscaled2/2046D12C-C5A9-467B-B67F-380E06B666D8-02.png', 'not-new-not-old'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-01.png', 'personal-language'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-03.png', 'make-sense'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-00.png', 'has-a-past'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-01.png', 'style-travels'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-01.png', 'should-be-new'],
  ['upscaled2/2046D12C-C5A9-467B-B67F-380E06B666D8-05.png', 'every-you-a-future'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-05.png', 'next-story'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-04.png', 'nothing-new'],
  ['upscaled2/5C3AE4F5-AD66-42AF-989F-1A1837EE7E96-00.png', 'its-next'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-02.png', 'collected-slowly'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-03.png', 'exceptional-things-travel'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-05.png', 'beautiful-things-keep-moving'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-02.png', 'a-cycle'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-07.png', 'quality-in-style'],
  ['upscaled2/2046D12C-C5A9-467B-B67F-380E06B666D8-03.png', 'a-journey-not-a-season'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-05.png', 'shared-closely'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-06.png', 'worn-well-lived-in'],
  ['upscaled2/5F055291-50E7-44E0-BD54-CEE820D02831-04.png', 'whats-meant-for-you'],
  ['upscaled2/BF639F75-E10A-4A69-898D-A0E72F0ED6F0-00.png', 'better-memories'],
  ['upscaled2/1CAE2165-2F9A-4BF5-BAAA-B4279EAA9831-06.png', 'someone-loved-it'],
  ['upscaled2/5C3AE4F5-AD66-42AF-989F-1A1837EE7E96-02.png', 'yours-now'],
  ['upscaled2/5C3AE4F5-AD66-42AF-989F-1A1837EE7E96-04.png', 'some-get-to-be-worn'],
];

/**
 * Average the poster's outermost pixels. A 1px frame resized to 1x1 gives the
 * mean of the border, which is what the letterbox should be — the bars then
 * continue the poster's own ground rather than cutting it with black.
 */
async function edgeColour(file) {
  const { width, height } = await sharp(file).metadata();
  const strips = await Promise.all([
    sharp(file).extract({ left: 0, top: 0, width, height: 2 }).resize(1, 1).raw().toBuffer(),
    sharp(file).extract({ left: 0, top: height - 2, width, height: 2 }).resize(1, 1).raw().toBuffer(),
    sharp(file).extract({ left: 0, top: 0, width: 2, height }).resize(1, 1).raw().toBuffer(),
    sharp(file).extract({ left: width - 2, top: 0, width: 2, height }).resize(1, 1).raw().toBuffer(),
  ]);
  const avg = i => Math.round(strips.reduce((a, s) => a + s[i], 0) / strips.length);
  return { r: avg(0), g: avg(1), b: avg(2) };
}

await mkdir(OUT, { recursive: true });

let total = 0;
for (let i = 0; i < PAGES.length; i++) {
  const [rel, slug] = PAGES[i];
  const src = join(SRC, rel);
  const out = join(OUT, `${String(i + 1).padStart(2, '0')}-${slug}.webp`);
  const info = await sharp(src)
    .resize(W, H, { fit: 'contain', background: await edgeColour(src) })
    .webp({ quality: 78, effort: 5 })
    .toFile(out);
  total += info.size;
  console.log(`${out}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`\n${PAGES.length} pages, ${(total / 1024 / 1024).toFixed(2)} MB`);
