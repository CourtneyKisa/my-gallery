import Link from 'next/link';
import { getAllPostsMeta } from '../../../../lib/posts';

export const revalidate = 60;

export function generateStaticParams() {
  const posts = getAllPostsMeta(false);
  const tags = new Set<string>();
  posts.forEach((p) => (p.tags ?? []).forEach((t) => tags.add(t)));
  return Array.from(tags).map((t) => ({ tag: t }));
}

// Next 16: params is a Promise
type ParamsP = Promise<{ tag: string }>;
type Props = { params: ParamsP };

function fmt(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const all = getAllPostsMeta(false);
  const posts = all.filter((p) => (p.tags ?? []).includes(tag));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Posts tagged “{tag}”
      </h1>

      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500">No posts with this tag yet.</p>
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
    </main>
  );
}
