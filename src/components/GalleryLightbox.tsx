'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

export default function GalleryLightbox({
  images,
  thumbClassName = 'aspect-square w-full rounded-xl object-cover',
  gridClassName = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3',
}) {
  const list = useMemo(() => {
    return (images || []).map((it) =>
      typeof it === 'string' ? { src: it, alt: '' } : { alt: '', ...it }
    );
  }, [images]);

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const dialogRef = useRef(null);

  const show = useCallback((i) => {
    setIdx(i);
    setOpen(true);
    const el = dialogRef.current;
    if (el && typeof el.showModal === 'function') el.showModal();
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    const el = dialogRef.current;
    if (el && typeof el.close === 'function') el.close();
  }, []);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + list.length) % list.length);
  }, [list.length]);

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % list.length);
  }, [list.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, hide, prev, next]);

  return (
    <>
      <div className={gridClassName}>
        {list.map((img, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Open image ${i + 1}`}
            onClick={() => show(i)}
            className="group relative"
          >
            <Image
              src={img.src}
              alt={img.alt || `Image ${i + 1}`}
              width={img.width || 800}
              height={img.height || 800}
              className={thumbClassName + ' transition hover:opacity-90'}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 group-hover:ring-black/15" />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/70 w-full max-w-[min(92vw,1100px)] rounded-2xl p-0"
        onClose={() => setOpen(false)}
      >
        {open && list.length > 0 && (
          <div className="relative">
            <Image
              src={list[idx].src}
              alt={list[idx].alt || `Image ${idx + 1}`}
              width={list[idx].width || 1600}
              height={list[idx].height || 1200}
              className="h-auto w-full rounded-2xl"
              priority
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
              <button
                type="button"
                onClick={hide}
                className="rounded-lg bg-black/60 px-3 py-1 text-white backdrop-blur hover:bg-black/70"
                aria-label="Close"
              >
                ✕
              </button>
              <span className="rounded-lg bg-black/60 px-3 py-1 text-sm text-white backdrop-blur">
                {idx + 1} / {list.length}
              </span>
            </div>

            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button
                type="button"
                onClick={prev}
                className="rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/60"
                aria-label="Previous"
              >
                &larr;
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                type="button"
                onClick={next}
                className="rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/60"
                aria-label="Next"
              >
                &rarr;
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
