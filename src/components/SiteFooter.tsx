import { getInstagramUrl } from '@/lib/site';
import { InstagramIcon } from '@/components/Icons';

export default function SiteFooter() {
  const ig = getInstagramUrl();
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-zinc-600">
        <p>© {new Date().getFullYear()} Courtney Kisa</p>
        <div className="flex items-center gap-3">
          <a
            href={ig}
            target="_blank"
            rel="me noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 hover:border-zinc-300"
          >
            <InstagramIcon className="h-4 w-4" />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
