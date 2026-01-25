import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const svgPath = join(publicDir, 'yasyntha_logo.svg');
const svgBuffer = readFileSync(svgPath);

// Generate favicon files - making logo fill more space by cropping to center
async function generateFavicon() {
  const faviconSizes = [
    { size: 256, name: 'favicon-16x16.png' },
    { size: 512, name: 'favicon-32x32.png' },
    { size: 768, name: 'favicon-48x48.png' },
    { size: 1536, name: 'favicon-96x96.png' },
    { size: 2048, name: 'favicon-128x128.png' },
    { size: 3072, name: 'favicon-192x192.png' },
    { size: 4096, name: 'favicon-512x512.png' },
  ];

  // Generate all favicon sizes - crop to center 65% to zoom in on logo
  await Promise.all(
    faviconSizes.map(async ({ size, name }) => {
      // Render at high resolution first, then crop to center (cap at 4096)
      const renderSize = Math.min(size * 2, 4096);
      const tempBuffer = await sharp(svgBuffer)
        .resize(renderSize, renderSize, { 
          fit: 'contain', 
          background: { r: 255, g: 255, b: 255, alpha: 0 },
          kernel: sharp.kernel.lanczos3
        })
        .toBuffer();
      
      const metadata = await sharp(tempBuffer).metadata();
      const width = metadata.width;
      const height = metadata.height;
      
      // Crop to center 65% to zoom in on logo
      const cropWidth = Math.floor(width * 0.65);
      const cropHeight = Math.floor(height * 0.65);
      const left = Math.floor((width - cropWidth) / 2);
      const top = Math.floor((height - cropHeight) / 2);
      
      await sharp(tempBuffer)
        .extract({ left, top, width: cropWidth, height: cropHeight })
        .resize(size, size, { kernel: sharp.kernel.lanczos3 })
        .png()
        .toFile(join(publicDir, name));
    })
  );

  // Generate Apple touch icon
  await sharp(svgBuffer)
    .resize(4096, 4096, { 
      fit: 'contain', 
      background: { r: 255, g: 255, b: 255, alpha: 0 },
      kernel: sharp.kernel.lanczos3
    })
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));

  // Create favicon.ico - high quality version with cropping
  const icoRenderSize = 512;
  const icoTempBuffer = await sharp(svgBuffer)
    .resize(icoRenderSize, icoRenderSize, { 
      fit: 'contain', 
      background: { r: 255, g: 255, b: 255, alpha: 0 },
      kernel: sharp.kernel.lanczos3
    })
    .toBuffer();
  
  const icoMetadata = await sharp(icoTempBuffer).metadata();
  const icoCropWidth = Math.floor(icoMetadata.width * 0.65);
  const icoCropHeight = Math.floor(icoMetadata.height * 0.65);
  const icoLeft = Math.floor((icoMetadata.width - icoCropWidth) / 2);
  const icoTop = Math.floor((icoMetadata.height - icoCropHeight) / 2);
  
  await sharp(icoTempBuffer)
    .extract({ left: icoLeft, top: icoTop, width: icoCropWidth, height: icoCropHeight })
    .resize(64, 64, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile(join(publicDir, 'favicon.ico'));

  console.log('✅ Favicon files generated successfully (zoomed in on logo)!');
  faviconSizes.forEach(({ name, size }) => console.log(`   - ${name} (${size}x${size} rendered)`));
  console.log('   - apple-touch-icon.png (4096x4096)');
  console.log('   - favicon.ico (64x64)');
}

generateFavicon().catch(console.error);
