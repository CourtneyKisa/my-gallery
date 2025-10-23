'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/photos', label: 'Photos' },
  { href: '/videos', label: 'Videos' },
  { href: '/blog', label: 'Blog' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/60 backdrop-blur border-b">
      <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">CK</Link>

        <button
          className="md:hidden border rounded px-2 py-1 text-sm"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <ul className="hidden md:flex gap-6 text-sm">
          {links.map(l => {
            const active =
              pathname === l.href ||
              (l.href !== '/' && pathname?.startsWith(l.href + '/'));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    'hover:underline underline-offset-4 ' +
                    (active ? 'font-semibold' : 'text-neutral-600')
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <ul className="md:hidden px-4 pb-3 space-y-2 border-t bg-white/90 dark:bg-black/70">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="block py-2" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
