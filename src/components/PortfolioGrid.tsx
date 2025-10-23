'use client';

import { useMemo, useState } from 'react';

export type Project = {
  slug: string;
  title: string;
  description?: string;
  year?: number;
  tags?: string[];
  url?: string;
  github?: string;
  image?: string;
};

export default function PortfolioGrid({ items }: { items: Project[] }) {
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of items) (p.tags || []).forEach((t) => s.add(String(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    if (!tag) return items;
    return items.filter((p) => (p.tags || []).includes(tag));
  }, [items, tag]);

  const tagBtn =
    'rounded-full border px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10 transition';

  return (
    <div>
      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            className={`${tagBtn} ${tag === null ? 'bg-black/5 dark:bg-white/10' : ''}`}
            onClick={() => setTag(null)}
          >
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              className={`${tagBtn} ${tag === t ? 'bg-black/5 dark:bg-white/10' : ''}`}
              onClick={() => setTag(tag === t ? null : t)}
              aria-pressed={tag === t}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-500">No projects for this tag.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.slug} className="group rounded-2xl overflow-hidden border">
              <a href={`/portfolio/${p.slug}`}>
                <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{p.title}</h2>
                  {p.year ? <p className="text-xs text-neutral-500 mt-0.5">{p.year}</p> : null}
                  {p.tags?.length ? (
                    <p className="mt-2 text-xs text-neutral-500">#{p.tags.join(' #')}</p>
                  ) : null}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
