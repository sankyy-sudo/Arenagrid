import { BrandMark } from "./BrandMark";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Sports", "/sports"],
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Projects", "/projects"]
] as const;

export function Header() {
  const [isCompact, setIsCompact] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let compact: boolean | undefined;
    const onScroll = () => {
      const next = window.scrollY > 24;
      if (next !== compact) {
        compact = next;
        setIsCompact(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
      closeButtonRef.current?.focus();
      document.body.classList.add("drawer-lock");
    } else if (dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.classList.remove("drawer-lock");
    };
  }, [isOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1241px)");
    const onResize = () => {
      if (desktop.matches) setIsOpen(false);
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  function onDialogClose() {
    setIsOpen(false);
    const trigger = menuButtonRef.current;
    if (trigger?.getClientRects().length) trigger.focus();
    else brandRef.current?.focus();
  }

  return (
    <header className={`site-header site-header--shared ${isCompact ? "is-compact" : ""}`}>
      <Link ref={brandRef} className="brand" to="/" title="Arena Grid Infra home">
        <BrandMark />
        <span>
          <strong>ARENA GRID INFRA</strong>
          <small>Building Spaces - Enhancing Play - Building Futures</small>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/sports">Sports</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/industries">Industries</NavLink>
        <NavLink to="/projects">Projects</NavLink>
      </nav>
      <Link className="quote-button" to="/contact">
        contact us
      </Link>
      
      <button
        ref={menuButtonRef}
        className="mobile-menu-button"
        type="button"
        aria-label="Open navigation"
        aria-expanded={isOpen}
        aria-controls="site-navigation-dialog"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={22} aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        id="site-navigation-dialog"
        className={`mobile-drawer ${isOpen ? "is-open" : ""}`}
        aria-label="Mobile navigation"
        onCancel={(event) => {
          event.preventDefault();
          setIsOpen(false);
        }}
        onClose={onDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <div className="drawer-panel">
          <div className="drawer-top">
            <Link className="brand drawer-brand" to="/" onClick={() => setIsOpen(false)} title="Arena Grid Infra home">
              <BrandMark />
              <span>
                <strong>ARENA GRID INFRA</strong>
                <small>Building Spaces - Enhancing Play - Building Futures</small>
              </span>
            </Link>
            <button ref={closeButtonRef} type="button" className="icon-button" aria-label="Close navigation" onClick={() => setIsOpen(false)}>
              <X size={21} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {navItems.map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => setIsOpen(false)}>
                {label}
              </NavLink>
            ))}
          </nav>
          <Link className="button-link button-primary" to="/contact" onClick={() => setIsOpen(false)}>
            Start Your Project
          </Link>
        </div>
      </dialog>
    </header>
  );
}
