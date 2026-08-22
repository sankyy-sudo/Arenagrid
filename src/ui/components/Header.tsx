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
          <NavLink to="/products">
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
                  {product.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="nav-cluster">
          <NavLink to="/sports">
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
                  {sport.name}
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
      <div className={`mobile-drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="drawer-panel">
          <div className="drawer-top">
            <strong>ARENA GRID INFRA</strong>
            <button className="icon-button" aria-label="Close navigation" onClick={() => setIsOpen(false)}>
              <X size={21} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {navItems.map(([label, href]) => (
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
