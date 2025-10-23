import ActiveLink from '@/components/ActiveLink';
import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">Courtney Kisa</Link>
        <nav className="flex items-center gap-5 text-sm">
          <ActiveLink href="/" exact>Home</ActiveLink>
          <ActiveLink href="/blog">Blog</ActiveLink>
          <ActiveLink href="/portfolio">Portfolio</ActiveLink>
          <ActiveLink href="/about">About</ActiveLink>
        </nav>
      </div>
    </header>
  );
}
