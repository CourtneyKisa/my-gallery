'use client';

import { useMemo, useState } from 'react';

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
};

export default function BlogSearch({
  items,
  pageSize = 10,
}: {
  items: PostMeta[];
  pageSize?: number;
}) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((p) => {
      const inTitle = p.title?.toLowerCase().includes(needle);
      const inExcerpt = p.excerpt?.toLowerCase().includes(needle);
      const inTags = (p.tags || []).join(' ').toLowerCase().includes(needle);
      return inTitle || inExcerpt || inTags;
    });
  }, [items, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  function fmt(iso?: string) {
    try {
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso || ''));
    } catch {
      return iso || '';
    }
  }

  return (
    <div>
      <div className="mb-6">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1); // reset page on new query
          }}
          placeholder="Search posts by title, excerpt, or tag…"
          className="w-full max-w-xl rounded-md border px-3 py-2 text-sm bg-white/70 dark:bg-black/40"
          aria-label="Search posts"
        />
        <p className="mt-2 text-xs text-neutral-500">
          {filtered.length} result{filtered.length === 1 ? '' : 's'}
          {q ? ` for “${q}”` : ''}
        </p>
      </div>

      {pageItems.length === 0 ? (
        <p className="text-sm text-neutral-500">No matching posts.</p>
      ) : (
        <ul className="space-y-6">
          {pageItems.map((p) => (
            <li key={p.slug} className="group">
              <a className="block" href={`/blog/${p.slug}`}>
                <h2 className="text-xl font-semibold group-hover:underline underline-offset-4">{p.title}</h2>
                <p className="text-sm text-neutral-500 mt-0.5">{fmt(p.date)}</p>
                {p.excerpt ? (
                  <p className="mt-2 text-neutral-700 dark:text-neutral-300">{p.excerpt}</p>
                ) : null}
                {p.tags?.length ? (
                  <p className="mt-1 text-xs text-neutral-500">#{p.tags.join(' #')}</p>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={safePage === 1}
          className={`text-sm underline underline-offset-4 ${safePage === 1 ? 'opacity-40 pointer-events-none' : ''}`}
        >
          ← Newer
        </button>
        <span className="text-xs text-neutral-500">
          Page {safePage} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage === totalPages}
          className={`text-sm underline underline-offset-4 ${safePage === totalPages ? 'opacity-40 pointer-events-none' : ''}`}
        >
          Older →
        </button>
      </div>
    </div>
  );
}
