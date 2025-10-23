import Image from 'next/image';
import { notFound } from 'next/navigation';
import GalleryLightbox from '@/components/GalleryLightbox';
import { getProjectBySlug, getAllProjects } from '@/lib/projects';

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Portfolio`,
    openGraph: {
      title: project.title,
      images: (project.images || []).slice(0, 1).map((img: any) =>
        typeof img === 'string' ? img : img.src
      ),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        {project.tags?.length ? (
          <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-600">
            {project.tags.map((t: string) => (
              <li key={t} className="rounded-full bg-zinc-100 px-2 py-0.5">{t}</li>
            ))}
          </ul>
        ) : null}
      </header>

      {project.description ? (
        <p className="mb-6 text-zinc-700 leading-relaxed">{project.description}</p>
      ) : null}

      {Array.isArray(project.images) && project.images.length > 0 ? (
        <GalleryLightbox images={project.images} />
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-zinc-500">
          No images for this project yet.
        </div>
      )}

      {project.cover && (
        <div className="mt-10">
          <Image
            src={typeof project.cover === 'string' ? project.cover : project.cover.src}
            alt={project.title}
            width={1600}
            height={900}
            className="w-full rounded-2xl"
            priority
          />
        </div>
      )}
    </main>
  );
}
