import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const logoPath = join(publicDir, 'yasyntha_logo.png');
const logoBuffer = readFileSync(logoPath);

// Generate favicon files. The source mark is already alpha-trimmed, so it fills
// the tile without any extra cropping.
async function generateFavicon() {
  // Each file is rendered at its nominal size. The mark is a full-colour chrome
  // gradient, so over-rendering (the old 2x-4x approach, tuned for a flat SVG)
  // produces multi-megabyte icons for no visible gain.
  const faviconSizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 48, name: 'favicon-48x48.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 128, name: 'favicon-128x128.png' },
    { size: 192, name: 'favicon-192x192.png' },
    { size: 512, name: 'favicon-512x512.png' },
  ];

  const transparent = { r: 255, g: 255, b: 255, alpha: 0 };

  await Promise.all(
    faviconSizes.map(({ size, name }) =>
      sharp(logoBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: transparent,
          kernel: sharp.kernel.lanczos3,
        })
        .png()
        .toFile(join(publicDir, name))
    )
  );

  // Generate Apple touch icon (index.html declares it at 180x180)
  await sharp(logoBuffer)
    .resize(180, 180, {
      fit: 'contain',
      background: transparent,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));

  // Create favicon.ico
  await sharp(logoBuffer)
    .resize(64, 64, {
      fit: 'contain',
      background: transparent,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(join(publicDir, 'favicon.ico'));

  console.log('✅ Favicon files generated successfully!');
  faviconSizes.forEach(({ name, size }) => console.log(`   - ${name} (${size}x${size} rendered)`));
  console.log('   - apple-touch-icon.png (180x180)');
  console.log('   - favicon.ico (64x64)');
}

generateFavicon().catch(console.error);
