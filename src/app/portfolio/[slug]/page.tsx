import { notFound } from 'next/navigation';
import { getAllProjectSlugs, getProjectBySlug } from '../../../lib/portfolio';

export const revalidate = 60;

// derive site base for OG/Canonical (same pattern used elsewhere)
function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

type ParamsP = Promise<{ slug: string }>;
type Props = { params: ParamsP };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return {};
  const site = getSiteUrl();
  const url = `${site}/portfolio/${encodeURIComponent(slug)}`;
  return {
    title: `${p.title} | Portfolio`,
    description: p.description || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: p.title,
      description: p.description || undefined,
      images: p.image ? [{ url: p.image, width: 1200, height: 630, alt: p.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.description || undefined,
      images: p.image ? [p.image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>{p.title}</h1>
        {p.year ? <p className="not-prose text-sm text-neutral-500">{p.year}</p> : null}
        {p.tags?.length ? (
          <p className="not-prose mt-2 text-xs text-neutral-500">#{p.tags.join(' #')}</p>
        ) : null}
        {p.image ? <img src={p.image} alt={p.title} className="rounded-lg shadow mt-4" /> : null}
        {p.description ? <p className="mt-4">{p.description}</p> : null}
        <div className="not-prose mt-4 flex gap-4 text-sm">
          {p.url ? (
            <a className="underline underline-offset-4" href={p.url} target="_blank" rel="noreferrer">
              Live ↗
            </a>
          ) : null}
          {p.github ? (
            <a className="underline underline-offset-4" href={p.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
        </div>
        {p.images?.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {p.images.map((src, i) => (
              <img key={i} src={src} alt={`${p.title} ${i + 1}`} className="rounded-md" />
            ))}
          </div>
        ) : null}
      </article>
    </main>
  );
}
