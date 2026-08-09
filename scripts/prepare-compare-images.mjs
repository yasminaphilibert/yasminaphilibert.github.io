/**
 * Prepare the "BEIRUT, SERVED." model-comparison images for the web.
 *
 * The nine posters were re-staged by two image models. Sources are 78 MB across
 * 18 PNGs, and a comparison page loads BOTH halves of every pair, so they are
 * re-encoded to WebP before going near public/.
 *
 * Target is 1520x1024 — gpt-image's native size. Encoding to anything larger
 * would upscale that side, which would make the A/B dishonest. The nano-banana
 * side is downscaled with a ~0.65% centre crop (2528x1692 is 1.4941, the target
 * is 1.4844), so both land on an identical pixel grid: the wipe lines up exactly
 * and the <img> intrinsic sizes match, giving zero layout shift.
 *
 * Run: node scripts/prepare-compare-images.mjs
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = '/Users/christiandimitri/Documents/Github/pocs/closclub-ai-os/brand/posters/recontext';
const OUT = 'public/images/services/visual-identity/beirut-served';

// The published folders are deliberately named version-a/version-b rather than
// after the models — the page credits neither, so the URLs must not either.
const SETS = [
  { from: '02-orange-flatlay-gptimage', to: 'version-a' },
  { from: '01-orange-flatlay-nanobanana', to: 'version-b' },
];

// source index -> web basename, identical in both sets so pairs match by name
const NAMES = [
  '01-kabis-w-bess',
  '02-ya-salam',
  '03-5pm-chez-teta',
  '04-rihet-el-arz',
  '05-taht-el-tin',
  '06-sunset',
  '07-limo-nana-mich-maarouf',
  '08-ghazel-el-banat',
  '09-medita-nerean-kiss',
];

const W = 1520;
const H = 1024;

const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';

async function run() {
  let inTotal = 0;
  let outTotal = 0;

  for (const set of SETS) {
    const srcDir = join(SRC, set.from);
    const outDir = join(OUT, set.to);
    await mkdir(outDir, { recursive: true });

    const files = (await readdir(srcDir))
      .filter((f) => f.endsWith('.png') && !f.startsWith('_'))
      .sort();

    if (files.length !== NAMES.length) {
      throw new Error(`${set.from}: expected ${NAMES.length} posters, found ${files.length}`);
    }

    console.log(`\n${set.from}  ->  ${outDir}`);
    for (let i = 0; i < files.length; i++) {
      const src = join(srcDir, files[i]);
      const out = join(outDir, `${NAMES[i]}.webp`);
      const before = (await stat(src)).size;

      await sharp(src)
        .resize(W, H, { fit: 'cover', position: 'centre' })
        .webp({ quality: 80, effort: 5 })
        .toFile(out);

      const after = (await stat(out)).size;
      inTotal += before;
      outTotal += after;
      console.log(`  ${NAMES[i].padEnd(26)} ${mb(before).padStart(9)} -> ${mb(after).padStart(9)}`);
    }
  }

  console.log(
    `\ntotal ${mb(inTotal)} -> ${mb(outTotal)}  (${(100 - (outTotal / inTotal) * 100).toFixed(1)}% smaller)`
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
