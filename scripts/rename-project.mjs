#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const [, , oldSlug, newSlug] = process.argv;
if (!oldSlug || !newSlug) {
  console.error('Usage: node scripts/rename-project.mjs <old-slug> <new-slug>');
  process.exit(1);
}

const DATA = path.join(process.cwd(), 'src', 'lib', 'projects.data.json');
const imgDirOld = path.join(process.cwd(), 'public', 'images', oldSlug);
const imgDirNew = path.join(process.cwd(), 'public', 'images', newSlug);

const replacePath = (val) => {
  if (typeof val !== 'string') return val;
  return val.replace(`/images/${oldSlug}/`, `/images/${newSlug}/`);
};

(async () => {
  // Backup JSON
  if (fs.existsSync(DATA)) {
    await fsp.copyFile(DATA, DATA + '.bak');
  }

  // Read JSON
  let arr;
  try {
    arr = JSON.parse(await fsp.readFile(DATA, 'utf8'));
    if (!Array.isArray(arr)) throw new Error('projects.data.json is not an array');
  } catch (e) {
    console.error('Failed to read src/lib/projects.data.json:', e.message);
    process.exit(1);
  }

  // Find project
  const i = arr.findIndex(p => p.slug === oldSlug);
  if (i < 0) {
    console.error(`No project with slug "${oldSlug}" found.`);
    process.exit(1);
  }

  // Update slug + paths
  const p = arr[i];
  p.slug = newSlug;

  if (typeof p.cover === 'string') p.cover = replacePath(p.cover);
  if (Array.isArray(p.images)) {
    p.images = p.images.map(v => typeof v === 'string' ? replacePath(v) : v);
  }

  await fsp.writeFile(DATA, JSON.stringify(arr, null, 2));

  // Move images folder if present
  if (fs.existsSync(imgDirOld)) {
    await fsp.mkdir(path.dirname(imgDirNew), { recursive: true });
    await fsp.rename(imgDirOld, imgDirNew);
    console.log(`Moved images: ${imgDirOld} -> ${imgDirNew}`);
  } else {
    console.warn(`⚠️  Images folder not found: ${imgDirOld} (skipped move)`);
  }

  console.log(`✅ Renamed project ${oldSlug} -> ${newSlug}`);
  console.log(`   JSON updated: src/lib/projects.data.json`);
})();
