import fs from 'fs';
import path from 'path';

/**
 * Returns a public path (e.g. "/blog/hello-world/og.png" or "/og.png")
 * based on front-matter and on-disk files. Never returns a file system path.
 */
export function resolveOgImage(slug: string, meta?: { ogImage?: string; image?: string }) {
  // 1) explicit overrides from front-matter
  const fm = meta?.ogImage || meta?.image;
  if (fm) {
    // allow absolute URLs or absolute public paths
    if (fm.startsWith('http://') || fm.startsWith('https://') || fm.startsWith('/')) return fm;
    // allow relative file name like "og.png" inside /public/blog/<slug>
    return `/blog/${slug}/${fm}`;
  }

  // 2) conventional file under /public/blog/<slug>/og.png
  const file = path.join(process.cwd(), 'public', 'blog', slug, 'og.png');
  if (fs.existsSync(file)) return `/blog/${slug}/og.png`;

  // 3) fallback to site default
  return '/og.png';
}
