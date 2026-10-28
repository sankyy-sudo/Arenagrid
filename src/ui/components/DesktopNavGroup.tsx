import { ChevronDown } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

export function DesktopNavGroup({ label, href, children, wide = false }: {
  label: string;
  href: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = `navigation-${label.toLowerCase()}`;

  return (
    <div className={`nav-cluster ${open ? "is-open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) setOpen(false);
      }}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(":hover")) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          triggerRef.current?.focus();
          setOpen(false);
        } else if (event.key === "ArrowDown" && event.target === triggerRef.current) {
          event.preventDefault();
          setOpen(true);
          requestAnimationFrame(() => menuRef.current?.querySelector("a")?.focus());
        }
      }}>
      <NavLink ref={triggerRef} to={href} className="nav-trigger" aria-expanded={open} aria-controls={menuId}>
        {label} <ChevronDown size={14} aria-hidden="true" />
      </NavLink>
      <div ref={menuRef} id={menuId} className={`mega-menu ${wide ? "mega-menu-wide" : ""}`}>
        {children}
      </div>
    </div>
  );
}
