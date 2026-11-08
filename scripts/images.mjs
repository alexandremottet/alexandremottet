import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const DIR = 'src/content/projects';
const MAX_EDGE = 2400;
const MAX_BYTES = 3 * 1024 * 1024;
const check = process.argv.includes('--check');

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';
let flagged = 0;

for (const f of files) {
  const path = join(DIR, f);
  const { size } = await stat(path);
  const { width, height } = await sharp(path).metadata();
  const edge = Math.max(width, height);
  if (edge <= MAX_EDGE && size <= MAX_BYTES) continue;
  flagged++;

  if (check) {
    console.warn(`! ${f}: ${width}x${height}, ${mb(size)} (run: npm run images)`);
    continue;
  }
  const img = sharp(await readFile(path)).rotate().resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });
  const out = await (/\.png$/i.test(f) ? img.png({ compressionLevel: 9 }) : /\.webp$/i.test(f) ? img.webp({ quality: 82 }) : img.jpeg({ quality: 82, mozjpeg: true })).toBuffer();
  await writeFile(path, out);
  console.log(`✓ ${f}: ${mb(size)} -> ${mb(out.length)}${out.length > MAX_BYTES ? ' (still over limit)' : ''}`);
}

if (!flagged) console.log(`images ok (${files.length} checked)`);
