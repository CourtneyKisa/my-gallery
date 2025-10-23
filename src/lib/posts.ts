import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PostMeta = {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  slug: string;
  draft?: boolean;
  ogImage?: string; // optional front-matter
  image?: string;   // alias
};

export type Post = PostMeta & { content: string };

const postsDir = path.join(process.cwd(), 'content', 'posts');

function getSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.(md|mdx)$/i, ''));
}

function readOne(slug: string): Post | null {
  const md = path.join(postsDir, `${slug}.md`);
  const mdx = path.join(postsDir, `${slug}.mdx`);
  const full = fs.existsSync(md) ? md : fs.existsSync(mdx) ? mdx : null;
  if (!full) return null;

  const raw = fs.readFileSync(full, 'utf8');
  const { data, content } = matter(raw);

  const meta: PostMeta = {
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    excerpt: data.excerpt ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    slug,
    draft: Boolean(data.draft ?? false),
    ogImage: typeof data.ogImage === 'string' ? data.ogImage : undefined,
    image: typeof data.image === 'string' ? data.image : undefined,
  };

  return { ...meta, content };
}

export function getAllPostsMeta(includeDrafts = process.env.NODE_ENV !== 'production'): PostMeta[] {
  const items = getSlugs().map((s) => readOne(s)).filter(Boolean) as Post[];
  const filtered = items.filter((p) => includeDrafts || !p.draft);
  return filtered
    .map((p) => ({
      title: p.title,
      date: p.date,
      excerpt: p.excerpt,
      tags: p.tags,
      slug: p.slug,
      draft: p.draft,
      ogImage: p.ogImage,
      image: p.image,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string, includeDrafts = process.env.NODE_ENV !== 'production'): Post | null {
  const p = readOne(slug);
  if (!p) return null;
  if (!includeDrafts && p.draft) return null;
  return p;
}

export function getAllSlugs() {
  return getSlugs();
}
