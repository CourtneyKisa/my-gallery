import fs from 'fs';
import path from 'path';

export type Project = {
  slug: string;
  title: string;
  description?: string;
  year?: number;
  tags?: string[];
  url?: string;
  github?: string;
  image?: string; // cover image path
  images?: string[]; // optional gallery images for the detail page
};

function load(): Project[] {
  const file = path.join(process.cwd(), 'content', 'portfolio', 'projects.json');
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf8');
  const list = JSON.parse(raw) as Project[];
  return (list || []).map((p) => ({
    ...p,
    slug: String(p.slug),
    title: String(p.title),
    tags: p.tags || [],
    image: p.image || `/portfolio/${p.slug}/cover.jpg`,
    images: p.images || [],
  }));
}

export function getProjects(): Project[] {
  // newest first by year, then title
  return load().sort((a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title));
}

export function getProjectBySlug(slug: string): Project | null {
  return load().find((p) => p.slug === slug) || null;
}

export function getAllProjectSlugs(): string[] {
  return load().map((p) => p.slug);
}
