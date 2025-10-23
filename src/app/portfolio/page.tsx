import { getProjects } from '../../lib/portfolio';
import PortfolioGrid from '../../components/PortfolioGrid';

export const metadata = {
  title: 'Portfolio | My Gallery',
  alternates: { canonical: '/portfolio' },
};
export const revalidate = 60;

export default function PortfolioPage() {
  const projects = getProjects();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Portfolio</h1>
      <PortfolioGrid items={projects} />
    </main>
  );
}
