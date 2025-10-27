import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-2xl border px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-600">
        404 • Page Not Found
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">
        Oops, that page doesn’t exist.
      </h1>

      <p className="mt-3 max-w-xl text-zinc-600">
        The link may be broken or the page may have been moved.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Go Home
        </Link>
        <Link
          href="/portfolio"
          className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm text-zinc-700 hover:border-zinc-300"
        >
          View Portfolio
        </Link>
      </div>
    </main>
  );
}
