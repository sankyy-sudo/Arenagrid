import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Check, Dumbbell } from "lucide-react";
import type { Product } from "./config";

export function ProductSkeleton() { return <div className="product-skeleton" aria-hidden="true" />; }

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(product.image ? "loading" : "error");
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (!cardRef.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.05 });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <article ref={cardRef} className={"product-card " + (visible ? "product-card--visible" : "")} style={{ "--card-delay": `${index * 80}ms` } as CSSProperties}>
      <div className="product-image" aria-busy={status === "loading"}>
        {status === "loading" && <ProductSkeleton />}
        {status === "error" ? <div className="product-image-fallback" role="img" aria-label={`${product.title}: image unavailable`}><Dumbbell size={48} aria-hidden="true" /><span>{product.title}</span></div> :
          <img src={product.image} alt={product.alt} style={{ objectPosition: product.imagePosition }} loading={index < 2 ? "eager" : "lazy"} decoding="async" width="960" height="720" onLoad={() => setStatus("loaded")} onError={() => setStatus("error")} />}
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-body">
        <h3>{product.title}</h3><p className="product-tagline">{product.tagline}</p>
        <p className="product-description">{product.description}</p>
        <ul className="product-features">{product.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
        <ul className="product-pills" aria-label="Best for">{product.bestFor.map(use => <li key={use}>{use}</li>)}</ul>
        <details ref={detailsRef} id={`details-${product.id}`} className="product-details"><summary>Product details</summary><p style={{ whiteSpace: "pre-line" }}>{product.fullDescription}</p></details>
        <div className="product-actions">
          <a className="product-button" href={`/contact?product=${encodeURIComponent(product.id)}`}>Get a Quote</a>
          <a className="product-learn" href={product.learnMoreHref} onClick={() => { if (detailsRef.current) detailsRef.current.open = true; }}>Learn more <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </article>
  );
}
