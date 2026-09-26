import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const mark = await readFile(join(publicDir, 'favicon.svg'));

await sharp(mark).resize(32, 32).png().toFile(join(publicDir, 'favicon-32.png'));
await sharp(mark).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'));

const og = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f3efe7"/>
  <rect width="10" height="630" fill="#7a3324"/>
  <text x="88" y="210" fill="#7a3324" font-family="Liberation Sans, sans-serif" font-size="26" letter-spacing="4">DASTAN AITZHANOV</text>
  <text x="88" y="310" fill="#1c1916" font-family="Liberation Serif, serif" font-size="74">AI systems,</text>
  <text x="88" y="400" fill="#1c1916" font-family="Liberation Serif, serif" font-size="68">governance, ownership.</text>
  <rect x="88" y="448" width="96" height="3" fill="#7a3324"/>
  <text x="88" y="520" fill="#5c564c" font-family="Liberation Sans, sans-serif" font-size="28">dastan.aitzhanov.com</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(join(publicDir, 'og.png'));
