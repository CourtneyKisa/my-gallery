export const metadata = { title: 'Portfolio | My Gallery' };

type Item = { title: string; href: string; img: string; desc: string };

const items: Item[] = [
  {
    title: 'Thrift Drop 01',
    href: 'https://example.com',
    img: 'https://picsum.photos/seed/a/900/600',
    desc: 'Vintage denim & tees.',
  },
  {
    title: 'Photo Zine',
    href: 'https://example.com',
    img: 'https://picsum.photos/seed/b/900/600',
    desc: 'Black & white street series.',
  },
  {
    title: 'Short Film',
    href: 'https://example.com',
    img: 'https://picsum.photos/seed/c/900/600',
    desc: '2-min travel montage.',
  },
];

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Portfolio</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <a
            key={it.title}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl overflow-hidden border hover:shadow-lg transition"
          >
            <div className="relative aspect-[3/2] bg-neutral-100 dark:bg-neutral-900">
              <img
                src={it.img}
                alt={it.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold group-hover:underline underline-offset-4">{it.title}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{it.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
