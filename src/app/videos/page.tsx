import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export const metadata = { title: "Videos | My Gallery" };

// Read /public/videos for common video formats
async function getVideos() {
  const dir = path.join(process.cwd(), "public", "videos");
  const files = await fs.readdir(dir).catch(() => []);
  return files.filter((f) => /\.(mp4|webm|mov|m4v)$/i.test(f));
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <main className="p-6">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Videos</h1>
        <nav className="space-x-4 text-sm underline">
          <Link href="/">Home</Link>
          <Link href="/photos">Photos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/portfolio">Portfolio</Link>
        </nav>
      </header>

      {videos.length === 0 ? (
        <p className="text-gray-500">
          Drop some videos into <code>public/videos</code> (mp4/webm/mov/m4v) to see them here.
        </p>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((name) => (
            <figure key={name} className="rounded-xl shadow-sm overflow-hidden">
              <video
                src={`/videos/${name}`}
                controls
                preload="metadata"
                className="w-full h-auto"
                playsInline
              />
              <figcaption className="p-2 text-sm text-gray-600">{name}</figcaption>
            </figure>
          ))}
        </section>
      )}
    </main>
  );
}

