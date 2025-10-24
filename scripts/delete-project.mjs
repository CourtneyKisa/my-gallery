#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const [, , slug] = process.argv;
if (!slug) {
  console.error('Usage: node scripts/delete-project.mjs <slug>');
  process.exit(1);
}

const DATA = path.join(process.cwd(), 'src', 'lib', 'projects.data.json');
const imgDir = path.join(process.cwd(), 'public', 'images', slug);

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

  const before = arr.length;
  arr = arr.filter(p => p.slug !== slug);
  const removed = before - arr.length;

  if (!removed) {
    console.warn(`⚠️  No project with slug "${slug}" found (JSON unchanged).`);
  } else {
    await fsp.writeFile(DATA, JSON.stringify(arr, null, 2));
    console.log(`✅ Removed project "${slug}" from src/lib/projects.data.json`);
  }

  // Remove images folder
  if (fs.existsSync(imgDir)) {
    await fsp.rm(imgDir, { recursive: true, force: true });
    console.log(`🗑️  Deleted folder: ${imgDir}`);
  } else {
    console.warn(`⚠️  Images folder not found: ${imgDir} (nothing to delete)`);
  }
})();
