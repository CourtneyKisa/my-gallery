import Link from 'next/link';
import { getAllPostsMeta } from '../../lib/posts';

export const metadata = { title: 'Blog | My Gallery' };
export const revalidate = 60;

function fmt(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const PAGE_SIZE = 10;

type SearchParamsP = Promise<{ page?: string }>;
type Props = { searchParams: SearchParamsP };

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams;               // Next 16: searchParams is a Promise
  const page = Math.max(parseInt(sp?.page ?? '1', 10) || 1, 1);

  const all = getAllPostsMeta(false);          // hide drafts in production
  const totalPages = Math.max(Math.ceil(all.length / PAGE_SIZE), 1);
  const start = (page - 1) * PAGE_SIZE;
  const posts = all.slice(start, start + PAGE_SIZE);

  const newerHref = page > 1 ? (page - 1 === 1 ? '/blog' : `/blog?page=${page - 1}`) : '/blog';
  const olderHref = page < totalPages ? `/blog?page=${page + 1}` : `/blog?page=${totalPages}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No posts yet. Add files to <code>content/posts</code>.
        </p>
      ) : (
        <ul className="space-y-6">
          {posts.map((p) => (
            <li key={p.slug} className="group">
              <Link className="block" href={`/blog/${p.slug}`}>
                <h2 className="text-xl font-semibold group-hover:underline underline-offset-4">{p.title}</h2>
                <p className="text-sm text-neutral-500 mt-0.5">{fmt(p.date)}</p>
                {p.excerpt ? <p className="mt-2 text-neutral-700 dark:text-neutral-300">{p.excerpt}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Link
          href={newerHref}
          aria-disabled={page === 1}
          className={`text-sm underline underline-offset-4 ${page === 1 ? 'pointer-events-none opacity-40' : ''}`}
        >
          ← Newer
        </Link>
        <span className="text-xs text-neutral-500">Page {page} of {totalPages}</span>
        <Link
          href={olderHref}
          aria-disabled={page === totalPages}
          className={`text-sm underline underline-offset-4 ${page === totalPages ? 'pointer-events-none opacity-40' : ''}`}
        >
          Older →
        </Link>
      </div>
    </main>
  );
}
