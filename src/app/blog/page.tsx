import { getAllPostsMeta } from '../../lib/posts';
import BlogSearch from '../../components/BlogSearch';

export const metadata = { title: 'Blog | My Gallery' };
export const revalidate = 60;

export default function BlogIndexPage() {
  const all = getAllPostsMeta(false);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Blog</h1>
      <BlogSearch items={all} pageSize={10} />
    </main>
  );
}
