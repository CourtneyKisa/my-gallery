import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug } from '../../../lib/posts';
import { getSiteUrl } from '../../../lib/site';
import { resolveOgImage } from '../../../lib/og';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import html from 'remark-html';

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

type ParamsP = Promise<{ slug: string }>;
type Props = { params: ParamsP };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const site = getSiteUrl();
  const url = `${site}/blog/${encodeURIComponent(slug)}`;
  const og = resolveOgImage(slug, post);
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: new Date(post.date).toISOString(),
      images: [{ url: og, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: [og],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const contentWithResolvedImages = post.content.replace(
    /(\]\()\.\/(?!\/)/g,
    `$1/blog/${slug}/`
  );

  const processed = await remark().use(gfm).use(html).process(contentWithResolvedImages);
  const contentHtml = processed.toString();

  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(post.date));
  const site = getSiteUrl();
  const url = `${site}/blog/${encodeURIComponent(slug)}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: 'Courtney Kisa' }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>{post.title}</h1>
        <p className="not-prose text-sm text-neutral-500">{date}</p>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>
    </main>
  );
}
