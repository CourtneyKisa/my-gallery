'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PortfolioFilters({
  allTags,
  initialQuery,
  initialTags,
}: {
  allTags: string[];
  initialQuery: string;
  initialTags: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(initialQuery || '');
  const [active, setActive] = useState<string[]>(initialTags || []);

  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setActive(searchParams.getAll('tag'));
  }, [searchParams]);

  const commit = useCallback(
    (nextQ: string, nextTags: string[]) => {
      const params = new URLSearchParams();
      if (nextQ.trim()) params.set('q', nextQ.trim());
      nextTags.forEach((t) => params.append('tag', t));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      commit(q, active);
    },
    [commit, q, active]
  );

  const toggle = useCallback(
    (t: string) => {
      const next = active.includes(t) ? active.filter((x) => x !== t) : [...active, t];
      setActive(next);
      commit(q, next);
    },
    [active, commit, q]
  );

  const clear = useCallback(() => {
    setQ('');
    setActive([]);
    router.replace(pathname);
  }, [pathname, router]);

  const tagCounts = useMemo(() => {
    return Object.fromEntries(allTags.map((t) => [t, undefined]));
  }, [allTags]);

  return (
    <form onSubmit={onSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <label className="sr-only" htmlFor="portfolio-search">Search</label>
        <input
          id="portfolio-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects…"
          className="w-full rounded-xl border px-3 py-2 outline-none ring-0 focus:border-zinc-400"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {allTags.map((t) => {
          const isActive = active.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={
                'rounded-full border px-3 py-1 text-sm ' +
                (isActive
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300')
              }
              aria-pressed={isActive}
            >
              {t}{typeof tagCounts[t] === 'number' ? ` · ${tagCounts[t]}` : ''}
            </button>
          );
        })}
        <button
          type="button"
          onClick={clear}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-600 hover:border-zinc-300"
        >
          Clear
        </button>
        <button
          type="submit"
          className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
