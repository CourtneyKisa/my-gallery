import type { MetadataRoute } from 'next';
import { getAllPostsMeta } from '../lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const nowISO = new Date().toISOString();

  const posts = getAllPostsMeta(false);

  const urls: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: nowISO, changeFrequency: 'weekly', priority: 1 },
    { url: `${site}/photos`, lastModified: nowISO, changeFrequency: 'monthly' },
    { url: `${site}/videos`, lastModified: nowISO, changeFrequency: 'monthly' },
    { url: `${site}/blog`, lastModified: posts[0]?.date || nowISO, changeFrequency: 'weekly' },
    { url: `${site}/portfolio`, lastModified: nowISO, changeFrequency: 'monthly' },
  ];

  for (const p of posts) {
    urls.push({
      url: `${site}/blog/${encodeURIComponent(p.slug)}`,
      lastModified: new Date(p.date).toISOString(),
      changeFrequency: 'monthly',
    });
  }

  return urls;
}
import type { MetadataRoute } from 'next';
import { getAllPostsMeta } from '../lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const nowISO = new Date().toISOString();

  const posts = getAllPostsMeta(false);

  const urls: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: nowISO, changeFrequency: 'weekly', priority: 1 },
    { url: `${site}/photos`, lastModified: nowISO, changeFrequency: 'monthly' },
    { url: `${site}/videos`, lastModified: nowISO, changeFrequency: 'monthly' },
    { url: `${site}/blog`, lastModified: posts[0]?.date || nowISO, changeFrequency: 'weekly' },
    { url: `${site}/portfolio`, lastModified: nowISO, changeFrequency: 'monthly' },
  ];

  for (const p of posts) {
    urls.push({
      url: `${site}/blog/${encodeURIComponent(p.slug)}`,
      lastModified: new Date(p.date).toISOString(),
      changeFrequency: 'monthly',

