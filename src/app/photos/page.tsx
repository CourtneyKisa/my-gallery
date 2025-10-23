import fs from "fs/promises";
import path from "path";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Photos | My Gallery" };

// Read /public/photos at build/request time (server component)
async function getImages() {
  const dir = path.join(process.cwd(), "public", "photos");
  const files = await fs.readdir(dir);
  // show only common photo formats; add more if you like
  return files.filter((f) => /\.(png|jpe?g|webp|gif|avif)$/i.test(f));
}

export default async function PhotosPage() {
  const images = await getImages();

  return (
    <main className="p-6">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Photos</h1>
        <nav className="space-x-4 text-sm underline">
          <Link href="/">Home</Link>
          <Link href="/videos">Videos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/portfolio">Portfolio</Link>
        </nav>
      </header>

      {images.length === 0 ? (
        <p className="text-gray-500">Drop some images into <code>public/photos</code> to see them here.</p>
      ) : (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((fname) => (
            <figure key={fname} className="relative overflow-hidden rounded-xl shadow-sm">
              <Image
                src={`/photos/${fname}`}
                alt={fname}
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
                priority
              />
            </figure>
          ))}
        </section>
      )}
    </main>
  );
}
