'use client';

import Link from 'next/link';
import { InstagramIcon } from './Icons';
import { getInstagramUrl } from '../lib/site';

export default function Navbar() {
  const ig = getInstagramUrl();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">Courtney Kisa</Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-zinc-700 hover:text-zinc-900">Home</Link>
          <Link href="/blog" className="text-zinc-700 hover:text-zinc-900">Blog</Link>
          <Link href="/portfolio" className="text-zinc-700 hover:text-zinc-900">Portfolio</Link>
          <Link href="/about" className="text-zinc-700 hover:text-zinc-900">About</Link>
          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="ml-2 inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-zinc-700 hover:border-zinc-300"
          >
            <InstagramIcon className="h-4 w-4" />
            <span className="sr-only">Instagram</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
