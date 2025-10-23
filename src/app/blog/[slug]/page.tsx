import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug } from '../../../lib/posts';
import { remark } from 'remark';
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
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(post.date));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>{post.title}</h1>
        <p className="not-prose text-sm text-neutral-500">{date}</p>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </main>
  );
}
