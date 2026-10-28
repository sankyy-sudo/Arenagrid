import { useEffect, useRef } from "react";

/** Enhance only content below the viewport; never delay the hero or hide a focused control. */
export function useHomeMotion() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;

    const reveal = (element: Element) => {
      element.classList.remove("is-reveal-pending");
      observer?.unobserve(element);
    };
    const reset = () => {
      observer?.disconnect();
      targets.forEach((element) => {
        element.classList.remove("home-reveal", "is-reveal-pending");
        element.style.removeProperty("--reveal-delay");
      });
    };
    const configure = () => {
      reset();
      if (preference.matches) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting || element.contains(document.activeElement)) {
            reveal(element);
          } else if (entry.boundingClientRect.top >= window.innerHeight) {
            const group = element.parentElement;
            const index = group?.hasAttribute("data-reveal-group")
              ? Array.from(group.children).indexOf(element) : 0;
            element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 50}ms`);
            element.classList.add("home-reveal", "is-reveal-pending");
          } else {
            // Already visible or above the viewport (for example after history restoration).
            reveal(element);
          }
        });
      }, { threshold: 0.08 });
      // Observer geometry is asynchronous; setup never forces layout before the first paint.
      targets.forEach((element) => observer?.observe(element));
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        const target = event.target.closest("[data-reveal]");
        if (target) reveal(target);
      }
    };

    configure();
    preference.addEventListener("change", configure);
    root.addEventListener("focusin", onFocus);
    return () => {
      reset();
      preference.removeEventListener("change", configure);
      root.removeEventListener("focusin", onFocus);
    };
  }, []);

  return rootRef;
}
