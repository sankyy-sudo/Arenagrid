import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { WhatsAppButton } from "./components/WhatsAppButton";

export function App() {
  const { key } = useLocation();
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
