import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, Expand } from "lucide-react";
import { DetailImage } from "../DetailImage";

type Photo = { url: string; alt: string };
function Lightbox({ images, initial, onClose }: { images: Photo[]; initial: number; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(initial);
  const move = (direction: number) => setIndex(current => (current + direction + images.length) % images.length);
  useEffect(() => {
    const dialog = dialogRef.current!;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { dialog.close(); document.body.style.overflow = overflow; trigger?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialogRef} className="product-lightbox" aria-label="Photo gallery" onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
    if (event.key === "Tab") {
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
  }}>
    <div className="product-lightbox-top"><span aria-live="polite" aria-atomic="true">Photo {index + 1} of {images.length}</span><button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo gallery"><X size={24} /></button></div>
    <div className="product-lightbox-stage" onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => {
      const start = touch.current; touch.current = null;
      if (!start) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
    }}>
      <DetailImage key={images[index].url} url={images[index].url} alt={images[index].alt} />
      {images.length > 1 && <><button type="button" className="product-lightbox-prev" onClick={() => move(-1)} aria-label="Previous photo"><ArrowLeft size={24} /></button><button type="button" className="product-lightbox-next" onClick={() => move(1)} aria-label="Next photo"><ArrowRight size={24} /></button></>}
    </div>
    <p className="product-lightbox-caption">{images[index].alt}</p>
  </dialog>;
}
export function ProductGallery({ images, name }: { images: Photo[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  if (!images.length) return <div className="product-gallery-empty"><DetailImage alt={name} /></div>;
  const tile = (photo: Photo, index: number, badge = false) => <button type="button" key={photo.url} className="product-gallery-tile" aria-label={`Open photo ${index + 1} of ${images.length}: ${photo.alt}`} aria-haspopup="dialog" onClick={() => setOpen(index)}>
    <DetailImage url={photo.url} alt={photo.alt} />
    {badge ? <span className="product-photo-count">+{images.length - 3} photos</span> : <span className="product-photo-expand" aria-hidden="true"><Expand size={18} /></span>}
  </button>;
  return <section className="product-gallery" aria-label={`${name} photos`}>
    <div className={`product-mosaic product-mosaic-${Math.min(images.length, 3)}`}>{images.slice(0, 3).map((photo, index) => tile(photo, index, index === 2 && images.length > 3))}</div>
    <div className="product-carousel-wrap">
      <div className="product-carousel" ref={carousel} onScroll={() => {
        const el = carousel.current;
        if (el) setActive(Math.min(images.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
      }}>{images.map((photo, index) => tile(photo, index))}</div>
      {images.length > 1 && <div className="product-gallery-dots" role="group" aria-label="Choose photo">{images.map((photo, index) => <button key={photo.url} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={active === index} onClick={() => {
        const el = carousel.current;
        el?.scrollTo({ left: index * el.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      }}><span /></button>)}</div>}
    </div>
    {open !== null && <Lightbox images={images} initial={open} onClose={() => setOpen(null)} />}
  </section>;
}
