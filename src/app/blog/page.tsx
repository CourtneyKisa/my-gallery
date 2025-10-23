import { getAllPostsMeta } from '../../lib/posts';
import BlogSearch from '../../components/BlogSearch';

export const metadata = {
  title: 'Blog | My Gallery',
  alternates: { canonical: '/blog' },
};
export const revalidate = 60;

type SearchP = Promise<{ q?: string; tag?: string; page?: string }>;

export default async function BlogIndexPage({ searchParams }: { searchParams?: SearchP }) {
  const sp = (await searchParams) || {};
  const all = getAllPostsMeta(false);

  const q = (sp.q ?? '').toString();
  const tag = (sp.tag ?? '') || null;
  const pageNum = Math.max(1, Number(sp.page ?? '1') || 1);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Blog</h1>
      <BlogSearch items={all} pageSize={10} initialQ={q} initialTag={tag} initialPage={pageNum} />
    </main>
  );
}
