import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, r, g, b, isMaskable = false) {
  // Simple uncompressed PNG builder using standard Node zlib
  const buffer = Buffer.alloc(width * height * 4);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width * (isMaskable ? 0.45 : 0.48);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (isMaskable) {
        // Deep emerald background
        buffer[idx] = 8;     // R
        buffer[idx + 1] = 26; // G
        buffer[idx + 2] = 16; // B
        buffer[idx + 3] = 255;
      } else {
        // Rounded icon background
        if (dist <= radius) {
          buffer[idx] = 8;     // R
          buffer[idx + 1] = 26; // G
          buffer[idx + 2] = 16; // B
          buffer[idx + 3] = 255;
        } else {
          buffer[idx] = 0;
          buffer[idx + 1] = 0;
          buffer[idx + 2] = 0;
          buffer[idx + 3] = 0;
        }
      }

      // Draw sprout / leaf emblem in center (lime / emerald)
      const leafDx = (x - centerX) / (width * 0.28);
      const leafDy = (y - centerY) / (height * 0.28);
      const inSprout = (leafDx * leafDx + (leafDy + 0.2) * (leafDy + 0.2) <= 0.35) ||
                       (Math.abs(leafDx) < 0.12 && leafDy >= -0.2 && leafDy <= 0.5);

      if (inSprout && buffer[idx + 3] > 0) {
        buffer[idx] = 16;    // R
        buffer[idx + 1] = 185; // G (Emerald)
        buffer[idx + 2] = 129; // B
        buffer[idx + 3] = 255;
      }
    }
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression method
  ihdrData[11] = 0; // Filter method
  ihdrData[12] = 0; // Interlace method
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk (scanlines with filter byte 0)
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    rawData[rowOffset] = 0; // None filter
    buffer.copy(rawData, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    crc = crc ^ byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 16, 185, 129, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 16, 185, 129, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 16, 185, 129, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 16, 185, 129, true));

// Also generate high-quality SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="#081A10"/>
  <circle cx="256" cy="256" r="210" fill="#0E2B1C" stroke="#10B981" stroke-width="8" stroke-dasharray="16 8"/>
  <path d="M256 120 C180 120 140 180 140 260 C140 340 200 390 256 400 C312 390 372 340 372 260 C372 180 332 120 256 120 Z" fill="#10B981" opacity="0.9"/>
  <path d="M256 160 C210 200 190 260 256 360 C322 260 302 200 256 160 Z" fill="#34D399"/>
  <path d="M256 400 L256 220" stroke="#052E16" stroke-width="12" stroke-linecap="round"/>
  <path d="M256 280 Q210 250 180 270" stroke="#052E16" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M256 240 Q302 210 332 230" stroke="#052E16" stroke-width="10" stroke-linecap="round" fill="none"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('PWA icons created successfully in public directory!');
