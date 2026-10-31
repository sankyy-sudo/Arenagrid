import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { WhatsAppButton } from "./components/WhatsAppButton";

export function App() {
  const { key, pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      let id = hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Keep malformed hashes harmless. */ }
      document.getElementById(id)?.scrollIntoView();
    }
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [key, pathname, hash]);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header key={key} />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <aside aria-label="Quick contact"><WhatsAppButton /></aside>
    </>
  );
}
