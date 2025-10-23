import Link from 'next/link';
import { getAllPostsMeta } from '../../../lib/posts';

export const revalidate = 60;

export default function TagsIndexPage() {
  const posts = getAllPostsMeta(false);
  const counts = new Map<string, number>();
  posts.forEach((p) => (p.tags ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  const items = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Tags</h1>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">No tags yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {items.map(([tag, n]) => (
            <li key={tag}>
              <Link href={`/blog/tags/${encodeURIComponent(tag)}`} className="rounded-full border px-3 py-1 text-sm">
                #{tag} <span className="text-neutral-500">({n})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
