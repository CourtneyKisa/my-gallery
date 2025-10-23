'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  initialQ = '',
  initialTag = null,
  initialPage = 1,
}: {
  items: PostMeta[];
  pageSize?: number;
  initialQ?: string;
  initialTag?: string | null;
  initialPage?: number;
}) {
  const router = useRouter();

  const [q, setQ] = useState(initialQ);
  const [tag, setTag] = useState<string | null>(initialTag);
  const [page, setPage] = useState(Math.max(1, Number(initialPage) || 1));

  // all unique tags
  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of items) (p.tags || []).forEach((t) => s.add(String(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [items]);

  // filter by query + tag
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((p) => {
      if (tag && !(p.tags || []).includes(tag)) return false;
      if (!needle) return true;
      const inTitle = p.title?.toLowerCase().includes(needle);
      const inExcerpt = p.excerpt?.toLowerCase().includes(needle);
      const inTags = (p.tags || []).join(' ').toLowerCase().includes(needle);
      return inTitle || inExcerpt || inTags;
    });
  }, [items, q, tag]);

  // sync URL (?q=&tag=&page=) for shareable filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (tag) params.set('tag', tag);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.replace(`/blog${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [q, tag, page, router]);

  // paging
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

  const tagBtn =
    'rounded-full border px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10 transition';

  return (
    <div>
      {/* Search */}
      <div className="mb-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search posts by title, excerpt, or tag…"
          className="w-full max-w-xl rounded-md border px-3 py-2 text-sm bg-white/70 dark:bg-black/40"
          aria-label="Search posts"
        />
        <p className="mt-2 text-xs text-neutral-500">
          {filtered.length} result{filtered.length === 1 ? '' : 's'}
          {q ? ` for “${q}”` : ''} {tag ? ` in #${tag}` : ''}
        </p>
      </div>

      {/* Tag chips */}
      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            className={`${tagBtn} ${tag === null ? 'bg-black/5 dark:bg-white/10' : ''}`}
            onClick={() => {
              setTag(null);
              setPage(1);
            }}
          >
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              className={`${tagBtn} ${tag === t ? 'bg-black/5 dark:bg-white/10' : ''}`}
              onClick={() => {
                setTag(tag === t ? null : t);
                setPage(1);
              }}
              aria-pressed={tag === t}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
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

      {/* Pager */}
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
