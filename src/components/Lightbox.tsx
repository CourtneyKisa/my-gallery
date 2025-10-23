'use client';

import { useEffect, useState } from 'react';

export default function LightboxImages({ selector = 'article img' }: { selector?: string }) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState<string | null>(null);

  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(selector));
    const onClick = (e: Event) => {
      const el = e.currentTarget as HTMLImageElement;
      setSrc(el.currentSrc || el.src);
      setAlt(el.alt || '');
      setOpen(true);
    };
    imgs.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', onClick);
    });
    return () => {
      imgs.forEach((img) => img.removeEventListener('click', onClick));
    };
  }, [selector]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open || !src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={alt ?? ''}
          className="max-h-[85vh] w-auto h-auto rounded-lg shadow-2xl"
        />
        {alt ? (
          <p className="text-center text-sm text-neutral-300 mt-2">{alt}</p>
        ) : null}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-0 right-0 mt-[-8px] mr-[-8px] rounded-full border px-3 py-1 text-sm bg-black/40 hover:bg-black/60"
          aria-label="Close image"
        >
          Close
        </button>
      </div>
    </div>
  );
}
