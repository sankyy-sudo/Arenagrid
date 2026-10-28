import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type HtmlTagDescriptor } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.API_PROXY_TARGET || `http://localhost:${env.PORT || 4000}`;
  const socialTags: HtmlTagDescriptor[] = [];
  if (env.VITE_SITE_URL?.trim()) {
    const site = new URL(env.VITE_SITE_URL.trim());
    if (!["https:", "http:"].includes(site.protocol) || site.username || site.password
      || site.pathname !== "/" || site.search || site.hash) {
      throw new Error("VITE_SITE_URL must be a public HTTP(S) origin without credentials, path, query or fragment.");
    }
    const image = new URL("/images/home/arena-social.jpg", site).href;
    socialTags.push(
      { tag: "meta", attrs: { property: "og:url", content: site.href } },
      { tag: "meta", attrs: { property: "og:image", content: image } },
      { tag: "meta", attrs: { property: "og:image:type", content: "image/jpeg" } },
      { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
      { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
      { tag: "meta", attrs: { property: "og:image:alt", content: "A football pitch and adjacent court framed by palm trees." } },
      { tag: "meta", attrs: { name: "twitter:image", content: image } }
    );
  }
  return {
    plugins: [
      react(),
      { name: "site-social-metadata", transformIndexHtml: () => socialTags },
      {
        name: "inline-small-entry-styles",
        apply: "build",
        transformIndexHtml: {
          order: "post",
          handler(html, { bundle }) {
            // The entry CSS is under 10 kB gzip. Inlining removes a render-blocking
            // round trip; larger stylesheets and lazy admin styles remain external.
            return html.replace(/<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="([^"]+)")[^>]*>/g, (tag, href: string) => {
              const asset = bundle?.[href.replace(/^\//, "")];
              if (asset?.type !== "asset" || typeof asset.source !== "string"
                || asset.source.length > 48 * 1024 || /<\/style/i.test(asset.source)) return tag;
              return `<style>${asset.source}</style>`;
            });
          }
        }
      }
    ],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": target,
        "/uploads": target
      }
    },
    build: {
      sourcemap: true
    }
  };
});
