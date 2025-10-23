import PortfolioFilters from '@/components/PortfolioFilters';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects } from '@/lib/projects';

type Project = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string | { src: string };
  tags?: string[];
  images?: any[];
};

export const revalidate = 60;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = (params.q || '').toLowerCase();
  const tagParam = params.tag;
  const activeTags = Array.isArray(tagParam) ? tagParam : tagParam ? [tagParam] : [];

  const projects: Project[] = await getAllProjects();
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags || []))).sort();

  const filtered = projects.filter((p) => {
    const matchesQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q));
    const matchesTags = !activeTags.length || activeTags.every((t) => (p.tags || []).includes(t));
    return matchesQ && matchesTags;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight">Portfolio</h1>

      <PortfolioFilters allTags={allTags} initialQuery={q} initialTags={activeTags} />

      {filtered.length === 0 ? (
        <p className="text-zinc-600">No projects found.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const cover = typeof p.cover === 'string' ? p.cover : p.cover?.src;
            return (
              <li key={p.slug} className="group rounded-2xl border">
                <Link href={`/portfolio/${p.slug}`} className="block">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={p.title}
                      width={1200}
                      height={800}
                      className="h-56 w-full rounded-t-2xl object-cover"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-56 w-full rounded-t-2xl bg-zinc-100" />
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-medium">{p.title}</h2>
                    {p.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{p.excerpt}</p>
                    ) : null}
                    {p.tags?.length ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <li key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                            {t}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
