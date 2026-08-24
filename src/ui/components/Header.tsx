import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { products, sports } from "../content";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Sports", "/sports"],
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Projects", "/projects"],
  ["Resources", "/resources"],
  ["Contact", "/contact"]
] as const;

export function Header() {
  const [isCompact, setIsCompact] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("drawer-lock", isOpen);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("drawer-lock");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <header className={`site-header ${isCompact ? "is-compact" : ""}`}>
      <a className="brand" href="/" aria-label="Arena Grid Infra home">
        <span className="brand-mark">AG</span>
        <span>
          <strong>ARENA GRID INFRA</strong>
          <small>Building Spaces - Enhancing Play - Building Futures</small>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <div className="nav-cluster">
          <NavLink to="/products" className="nav-trigger">
            Products <ChevronDown size={14} />
          </NavLink>
          <div className="mega-menu">
            <div>
              <span className="mega-kicker">Product systems</span>
              <strong>Surface, flooring and equipment lines for sport-led facilities.</strong>
            </div>
            <div className="mega-grid">
              {products.map((product) => (
                <a key={product.name} href="/products">
                  <span>{product.category}</span>
                  <strong>{product.name}</strong>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="nav-cluster">
          <NavLink to="/sports" className="nav-trigger">
            Sports <ChevronDown size={14} />
          </NavLink>
          <div className="mega-menu mega-menu-wide">
            <div>
              <span className="mega-kicker">Explore by sport</span>
              <strong>Connect each sport to products, services, projects and FAQs.</strong>
            </div>
            <div className="mega-grid mega-grid-sports">
              {sports.slice(0, 10).map((sport) => (
                <a key={sport.name} href="/sports">
                  <strong>{sport.name}</strong>
                </a>
              ))}
            </div>
          </div>
        </div>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/industries">Industries</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
      <button className="icon-button" aria-label="Search">
        <Search size={19} />
      </button>
      <a className="quote-button" href="/contact">
        Get a Quote
      </a>
      <button className="mobile-menu-button" aria-label="Open navigation" onClick={() => setIsOpen(true)}>
        <Menu size={22} />
      </button>
      <div className={`mobile-drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen} onClick={() => setIsOpen(false)}>
        <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation" onClick={(event) => event.stopPropagation()}>
          <div className="drawer-top">
            <a className="brand drawer-brand" href="/" onClick={() => setIsOpen(false)} aria-label="Arena Grid Infra home">
              <span className="brand-mark">AG</span>
              <span>
                <strong>ARENA GRID INFRA</strong>
                <small>Building Spaces - Enhancing Play - Building Futures</small>
              </span>
            </a>
            <button className="icon-button" aria-label="Close navigation" onClick={() => setIsOpen(false)}>
              <X size={21} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {navItems.slice(0, 2).map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => setIsOpen(false)}>
                {label}
              </NavLink>
            ))}
            <details>
              <summary>
                Products <ChevronDown size={16} />
              </summary>
              {products.map((product) => (
                <NavLink key={product.name} to="/products" onClick={() => setIsOpen(false)}>
                  {product.name}
                </NavLink>
              ))}
            </details>
            <details>
              <summary>
                Sports <ChevronDown size={16} />
              </summary>
              {sports.slice(0, 8).map((sport) => (
                <NavLink key={sport.name} to="/sports" onClick={() => setIsOpen(false)}>
                  {sport.name}
                </NavLink>
              ))}
            </details>
            {navItems.slice(4).map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => setIsOpen(false)}>
                {label}
              </NavLink>
            ))}
          </nav>
          <a className="button-link button-primary" href="/contact" onClick={() => setIsOpen(false)}>
            Get Quote
          </a>
        </div>
      </div>
    </header>
  );
}
