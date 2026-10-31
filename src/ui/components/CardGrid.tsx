import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../styles/cards.css";

export function CardGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);
  const count = Children.count(children);
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const measure = () => setColumns(getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length || 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);
  const remaining = count > 0 && count % columns !== 0 ? columns - count % columns : 0;
  return <div ref={ref} className={`catalog-grid ${className}`}>
    {children}
    {remaining > 0 && <Link to="/contact" className="info-card quote-grid-card" style={{ gridColumn: `span ${remaining}` }}>
      <span className="home-label">Made for your space</span><h3>Need a custom surface for your project?</h3><p>Tell us about your facility and we will help you explore the right options.</p><span className="quote-grid-button">Get a Quote <ArrowRight size={18} aria-hidden="true" /></span>
    </Link>}
  </div>;
}
