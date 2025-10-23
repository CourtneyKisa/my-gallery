import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Welcome to My Gallery</h1>
      <p>Photos, videos, a blog, and a portfolio—just like a personal hub.</p>
      <nav className="space-x-4">
        <Link className="underline" href="/photos">Photos</Link>
        <Link className="underline" href="/videos">Videos</Link>
        <Link className="underline" href="/blog">Blog</Link>
        <Link className="underline" href="/portfolio">Portfolio</Link>
      </nav>
    </main>
  );
}
