import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./ui/App";
import { HomePage } from "./ui/pages/HomePage";
import { ListingPage } from "./ui/pages/ListingPage";
import { ContactPage } from "./ui/pages/ContactPage";
import "./styles.css";

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
      { path: "resources", element: <ListingPage title="Resources" kind="Guides and documents" /> },
      { path: "blog", element: <ListingPage title="Blog & News" kind="Insights" /> },
      { path: "gallery", element: <ListingPage title="Gallery" kind="Media library" /> },
      { path: "contact", element: <ContactPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
