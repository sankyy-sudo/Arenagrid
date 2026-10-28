# Homepage redesign - Stage 2 review

Completed on 2026-10-21 after approval of Stage 2. The user also confirmed that both existing testimonials, from Anika Mehra and Raghav Menon, are genuine and approved for public use.

## Result

The homepage now has seven main sections: the approved hero; sports and surface discovery; project delivery and benefits; community and industries; projects and testimonials; project FAQs; and the final enquiry CTA. The homepage footer has clearer spacing, hierarchy and larger link targets.

All 13 sports, four product systems, five service stages, eight industries, three project summaries and both confirmed testimonials are retained from the existing content. Four sports have photographic introductions; the other nine have native expandable descriptions and enquiry links. All eight industries have expandable descriptions. Project FAQs now answer customer questions using the existing service/product information instead of describing CMS implementation details.

The placeholder partner/certification marquee and empty case-study sequence were retired as approved. The existing case-study route and footer link remain available. Named projects now use text summaries, avoiding any suggestion that generic stock photographs depict those projects. No venues, booking availability, prices, ratings or new business statistics were invented.

## Component structure

```text
src/ui/
  pages/HomePage.tsx
  components/
    Footer.tsx                    # Homepage-only visual variant
    FAQAccordion.tsx              # Optional items; existing defaults retained
    home/
      HomeHero.tsx                # Approved Stage 1 hero, unchanged
      HomeDiscovery.tsx           # Sports and product systems
      HomeDelivery.tsx            # Service stages and existing benefits
      HomeCommunity.tsx           # Community photograph and industries
      HomeProjects.tsx            # Existing projects and confirmed testimonials
      HomeEnquiry.tsx             # Project FAQs and final CTA
      HomePhoto.tsx               # Responsive local photographs
  styles/
    home.css                      # Stage 1 foundation, unchanged
    home-sections.css             # Scoped section and homepage footer styles
```

Shared content, global styles, listing pages and the contact page were compared with pre-edit snapshots and remain unchanged. The redesigned footer is enabled only on the homepage. No backend, authentication, database, dependency or lockfile changes were made. Resources remains removed. Nothing was pushed to GitHub.

## Files modified in this stage

- `src/ui/pages/HomePage.tsx`
- `src/ui/App.tsx`
- `src/ui/components/Footer.tsx`
- `src/ui/components/FAQAccordion.tsx`
- `src/main.tsx`
- `IMAGE_CREDITS.md`

## Files added

- `src/ui/components/home/HomeDiscovery.tsx`
- `src/ui/components/home/HomeDelivery.tsx`
- `src/ui/components/home/HomeCommunity.tsx`
- `src/ui/components/home/HomeProjects.tsx`
- `src/ui/components/home/HomeEnquiry.tsx`
- `src/ui/components/home/HomePhoto.tsx`
- `src/ui/styles/home-sections.css`
- `public/images/home/football-640.webp`
- `public/images/home/football-960.webp`
- `public/images/home/basketball-640.webp`
- `public/images/home/basketball-960.webp`
- `public/images/home/tennis-640.webp`
- `public/images/home/tennis-960.webp`
- `public/images/home/athletics-640.webp`
- `public/images/home/athletics-960.webp`
- `public/images/home/community-640.webp`
- `public/images/home/community-1280.webp`
- `docs/homepage-stage2.md`

No project files were deleted. The working tree also contains earlier uncommitted changes, which are outside this stage's list. Browser check scripts, source snapshots and screenshots are in ignored local cache directories.

## Images and interaction

The credited Stage 1 football photograph is reused for discovery. Four additional photographs cover basketball, tennis, athletics and community play. Ten new WebP variants range from 32,318 to 242,714 bytes. All below-the-fold photographs include intrinsic dimensions, responsive sources, descriptive alt text, lazy loading and asynchronous decoding. The existing hero retains high loading priority.

See [IMAGE_CREDITS.md](../IMAGE_CREDITS.md) for every photographer, source page, license, local filename and transformation. No homepage image is hotlinked. Other routes retain their original assets. There are no missing image placeholders in the redesigned homepage.

Native details/summary controls support mouse and keyboard interaction for sports, industries and FAQs. The Stage 1 hero animation and reduced-motion handling remain intact. Scroll-triggered motion and further interaction polish await Stage 3.

## Verification

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, zero warnings |
| `npm test` | Passed, 15/15 existing tests |
| `npm run build` | Passed, including TypeScript checking |
| `git diff --check` | Passed |
| Geometry at 320, 375, 768, 1024, 1440 and 1920px | No document/content horizontal overflow; visible homepage/footer links and summary controls meet 44px minimum dimensions |
| Visual review | Desktop and mobile section screenshots inspected |
| Homepage photographs | All six rendered image elements loaded at every tested width; five below-fold images use lazy loading |
| Image requests | Homepage requested only same-origin resources |
| Expanders | Click expansion, visible answers and Enter-key collapse passed for sports, industries and FAQs |
| Mobile menu | Modal opening, Escape dismissal and focus restoration preserved |
| Internal destinations | Contact, Sports, Products, Services, About, Industries, Projects and Case Studies rendered successfully |
| Other routes | Homepage styling absent; shared source snapshots unchanged |
| Resources removal | Existing navigation, routing, API and Prisma regression tests passed |
| Browser exceptions | None during the completed checks |
| Production preview | Homepage rendered at 375px and 1440px with bundled CSS and all seven sections |
| Production assets | All 14 local homepage WebP variants, including Stage 1 files, decoded at their documented dimensions |

The browser keyboard harness initially omitted the Enter character event. Correcting that input confirmed the native controls work; no application workaround was added. Node test workers and isolated Chrome ran with the process permissions required by this environment, using a temporary browser profile.

The production build reports 357.57 kB JavaScript (112.06 kB gzip) and 41.96 kB CSS (8.99 kB gzip). These are bundle sizes, not Lighthouse scores or measured Core Web Vitals.

## Remaining work and limits

- Stage 3 motion, performance, metadata and full accessibility validation await approval. Lighthouse, LCP and CLS targets have not yet been measured or claimed as achieved.
- Physical-device and cross-browser testing remain outstanding.
- The separate local API was not running during this stage. Real database-backed enquiry submission remains unverified. No credentials or database data were created or changed.
- The existing listing-page search/filter/pagination controls and recipient-free WhatsApp links remain unchanged. Internal destinations were checked in the browser; external WhatsApp delivery was not tested.
- Legacy images on unrelated pages remain outside this homepage-only asset pass.

## Review and run

The frontend was restarted on `http://127.0.0.1:5173/`. Open or refresh the running server instead of starting a second instance. The temporary production preview was stopped after verification.

If the frontend has stopped:

```powershell
cd E:\arena\Arenagrid\Arenagrid
npm run dev
```

Screenshots from this review are available locally in `.vite/stage2/`, including `discovery-1440.png`, `community-375.png`, `projects-1440.png`, and `footer-375.png`. Stage 3 should begin only after the user's next approval.
