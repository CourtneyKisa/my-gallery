'use client';

import { useEffect, useMemo, useState } from 'react';

export default function LightboxImages({ selector = 'article img' }: { selector?: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number>(-1);
  const [imgs, setImgs] = useState<HTMLImageElement[]>([]);

  // Collect images and attach click handlers
  useEffect(() => {
    const found = Array.from(document.querySelectorAll<HTMLImageElement>(selector));
    found.forEach((img) => (img.style.cursor = 'zoom-in'));
    setImgs(found);

    const onClick = (e: Event) => {
      const el = e.currentTarget as HTMLImageElement;
      const i = found.indexOf(el);
      if (i >= 0) {
        setIndex(i);
        setOpen(true);
      }
    };
    found.forEach((img) => img.addEventListener('click', onClick));
    return () => found.forEach((img) => img.removeEventListener('click', onClick));
  }, [selector]);

  const total = imgs.length;
  const src = useMemo(
    () => (index >= 0 && index < total ? imgs[index].currentSrc || imgs[index].src : null),
    [imgs, index, total]
  );
  const alt = useMemo(
    () => (index >= 0 && index < total ? imgs[index].alt || '' : ''),
    [imgs, index, total]
  );

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') setIndex((i) => (i <= 0 ? total - 1 : i - 1));
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, total]);

  if (!open || !src) return null;

  const goPrev = () => setIndex((i) => (i <= 0 ? total - 1 : i - 1));
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-[92vw] max-h-[86vh]" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={alt ?? ''}
          className="max-h-[86vh] w-auto h-auto rounded-lg shadow-2xl"
          draggable={false}
        />
        {alt ? <p className="text-center text-sm text-neutral-300 mt-2">{alt}</p> : null}

        {/* Counter */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-xs text-neutral-300">
          {index + 1} / {total}
        </div>

        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-0 right-0 -mt-3 -mr-3 rounded-full border px-3 py-1 text-sm bg-black/40 hover:bg-black/60"
          aria-label="Close image"
        >
          Close
        </button>

        {/* Prev / Next */}
        {total > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 rounded-full border px-3 py-1 text-sm bg-black/40 hover:bg-black/60"
            >
              ←
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 rounded-full border px-3 py-1 text-sm bg-black/40 hover:bg-black/60"
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
