import "./ui/styles/rich-text.css";
import { DetailPage } from "./ui/pages/DetailPage";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./ui/App";
import { HomePage } from "./ui/pages/HomePage";
import { ListingPage } from "./ui/pages/ListingPage";
import { ContactPage } from "./ui/pages/ContactPage";
import { adminRoutes } from "./admin/routes";
import "./styles.css";
import "./ui/styles/home.css";
import "./ui/styles/home-sections.css";
import "./ui/styles/home-motion.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <ListingPage title="About Arena Grid Infra" kind="Company" /> },
      { path: "products", element: <ListingPage title="Products" kind="Product systems" /> },
      { path: "sports", element: <ListingPage title="Sports & Solutions" kind="Sports infrastructure" /> },
      { path: "services", element: <ListingPage title="Services" kind="End-to-end capability" /> },
      { path: "industries", element: <ListingPage title="Industries" kind="Institutional sectors" /> },
      { path: "projects", element: <ListingPage title="Projects" kind="Portfolio" /> },
      { path: "case-studies", element: <ListingPage title="Case Studies" kind="Outcomes" /> },
      { path: "blog", element: <ListingPage title="Blog & News" kind="Insights" /> },
      { path: "gallery", element: <ListingPage title="Gallery" kind="Media library" /> },
      { path: "products/:slug", element: <DetailPage section="products" /> },
      { path: "sports/:slug", element: <DetailPage section="sports" /> },
      { path: "industries/:slug", element: <DetailPage section="industries" /> },
      { path: "projects/:slug", element: <DetailPage section="projects" /> },
      { path: "contact", element: <ContactPage /> }
    ]
  },
  ...adminRoutes
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
