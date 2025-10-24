#!/usr/bin/env node
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, (a) => res(a.trim())));

const slugify = (s) =>
  s.toLowerCase()
   .normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
   .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

const ensureDir = async (dir) => { await fs.mkdir(dir, { recursive: true }); };

const copyIfProvided = async (src, dest) => {
  if (!src) return null;
  const abs = path.resolve(src);
  if (!fssync.existsSync(abs)) {
    console.warn(`⚠️  Skipped missing file: ${src}`);
    return null;
  }
  await fs.copyFile(abs, dest);
  return dest;
};

const writePlaceholderPNG = async (dest) => {
  const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5Q3eYAAAAASUVORK5CYII=";
  await fs.writeFile(dest, Buffer.from(b64, 'base64'));
};

const DATA_FILE = path.join(process.cwd(), 'src', 'lib', 'projects.data.json');

(async () => {
  console.log('— Add Portfolio Project —');

  const title = await ask('Title: ');
  const suggested = slugify(title || '');
  let slug = await ask(`Slug [${suggested || 'my-project'}]: `);
  if (!slug) slug = suggested || 'my-project';

  const tagsRaw = await ask('Tags (comma-separated, e.g. fashion,studio): ');
  const tags = tagsRaw ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const coverPath = await ask('Cover image file path (optional, drag-drop a file path): ');
  const imagesRaw = await ask('Gallery image file paths (comma-separated, optional): ');
  const imagePaths = imagesRaw ? imagesRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  // Prepare target dirs
  const dstDir = path.join(process.cwd(), 'public', 'images', slug);
  await ensureDir(dstDir);
  await ensureDir(path.join(process.cwd(), 'public'));

  // Copy cover (or make placeholder)
  let coverRel;
  if (coverPath) {
    const ext = path.extname(coverPath) || '.png';
    const dst = path.join(dstDir, `cover${ext}`);
    const copied = await copyIfProvided(coverPath, dst);
    if (copied) coverRel = `/images/${slug}/cover${ext}`;
  }
  if (!coverRel) {
    const dst = path.join(dstDir, 'cover.png');
    await writePlaceholderPNG(dst);
    coverRel = `/images/${slug}/cover.png`;
  }

  // Copy gallery images
  const gallery = [];
  let idx = 1;
  for (const p of imagePaths) {
    const ext = path.extname(p) || '.png';
    const dst = path.join(dstDir, `${idx}${ext}`);
    const copied = await copyIfProvided(p, dst);
    if (copied) {
      gallery.push(`/images/${slug}/${idx}${ext}`);
      idx++;
    }
  }
  if (gallery.length === 0) {
    // add at least one placeholder so the lightbox shows something
    const dst = path.join(dstDir, '1.png');
    await writePlaceholderPNG(dst);
    gallery.push(`/images/${slug}/1.png`);
  }

  // Read/Init data file
  let arr = [];
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    arr = JSON.parse(raw);
    if (!Array.isArray(arr)) arr = [];
  } catch {
    await ensureDir(path.dirname(DATA_FILE));
    arr = [];
  }

  // Upsert by slug
  const obj = {
    slug,
    title: title || slug,
    excerpt: '',
    cover: coverRel,
    tags,
    description: '',
    images: gallery
  };
  const i = arr.findIndex((p) => p.slug === slug);
  if (i >= 0) arr[i] = obj; else arr.push(obj);

  await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2));
  rl.close();

  console.log('\n✅ Project saved!');
  console.log(`- Page:   /portfolio/${slug}`);
  console.log(`- Images: public/images/${slug}/`);
  console.log('\nNext steps:');
  console.log('  1) Replace the placeholder images with your real photos in that folder.');
  console.log('  2) Edit src/lib/projects.data.json to fill in excerpt/description if you want.');
  console.log('  3) git add -A && git commit -m "content: add ' + slug + '" && git push');
})();
