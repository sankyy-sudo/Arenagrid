# Homepage redesign - Stage 3 final report

Completed work and verification recorded on 2026-10-22, following the user's approval of Stage 3. Stage 1 and Stage 2 reviews are in [homepage-stage1.md](homepage-stage1.md) and [homepage-stage2.md](homepage-stage2.md).

## Result and scope

The approved sports infrastructure and project-enquiry homepage now has subtle motion, keyboard-accessible navigation, smaller responsive photographs, improved photo-overlay contrast, metadata, and measured production performance. All 13 sports, four product systems, five service stages, eight industries, three project summaries and both approved testimonials remain. All seven main homepage sections remain. The Resources feature stays removed.

All requested Lighthouse thresholds were met in each of the three final mobile lab runs.

The stack remains React 19, TypeScript, React Router 7 and Vite 7 with plain CSS. The existing Express/Prisma/PostgreSQL backend is unchanged by this stage. No business logic, authentication logic, schema, database data, production dependencies or lockfile changed. No project files were deleted or moved in this stage. Nothing was pushed to GitHub. Earlier uncommitted work was preserved.

## Component and file organization

Before Stage 3, the homepage already used the seven focused components introduced in Stages 1-2. Stage 3 extends that structure:

```text
src/ui/
  App.tsx                         # Skip link, main target, contact landmark
  pages/HomePage.tsx               # Composes the existing homepage sections
  hooks/useHomeMotion.ts           # One observer, motion preference and focus handling
  components/
    Header.tsx
    DesktopNavGroup.tsx            # Hover/focus, ArrowDown and Escape interaction
    home/
      HomeHero.tsx
      HomeDiscovery.tsx
      HomeDelivery.tsx
      HomeCommunity.tsx
      HomeProjects.tsx
      HomeEnquiry.tsx
      HomePhoto.tsx                # Responsive AVIF with WebP fallbacks
  styles/
    home.css
    home-sections.css
    home-motion.css
src/admin/
  routes.tsx                      # Same paths, lazy screen imports
  components/AdminRoot.tsx         # Loads the existing admin CSS
  components/AdminShell.tsx        # Same ProtectedRoute + AdminLayout composition
public/
  favicon.svg
  robots.txt
  images/home/                    # 33 local photo variants, including the social card
```

## Problems corrected

- The hero was discovered after the application JavaScript, contributing to a 4.2-second baseline LCP. A small homepage-only preload starts the correct responsive AVIF earlier. Other routes do not download this hero.
- The homepage loaded admin screens and admin CSS eagerly. The existing admin route tree now loads those screens and CSS on demand, with its original authentication guard and paths retained.
- The initial stylesheet blocked rendering. Production HTML now embeds the entry stylesheet when it is below 48 KiB uncompressed; larger stylesheets fall back to external delivery. Admin styles remain external and lazy. This trades about 8.5 kB of CSS in each document for one fewer blocking request; the page design is unchanged.
- A missing favicon caused a browser console error. A missing robots.txt returned SPA HTML to crawlers. Both now have real local files.
- Some accessible link names omitted their visible text. Sports enquiry labels now include their visible wording; brand links use their native text names.
- Desktop dropdowns could not be dismissed with Escape. The new small navigation component adds dismissal, focus return and ArrowDown entry, while preserving the route links and appearance.
- There was no skip-navigation link, and the floating contact link lacked a landmark. Both are corrected. Homepage navigation targets meet the 44px minimum at the tested sizes.
- Direct checks found insufficient contrast for the mobile community-photo caption and the tablet hero eyebrow. Stronger homepage overlays correct these cases without changing the layout.

## Motion and responsiveness

The existing hero entrance remains. Headings, sport cards, product rows, delivery steps, benefits, projects, testimonials and the final CTA reveal once when they enter view. Cards use a maximum 150ms stagger. Fine-pointer hover adds a 3.5% image zoom; buttons, arrows and navigation chevrons use small transform interactions.

Only opacity and transform animate in the new motion layer. A single IntersectionObserver provides asynchronous geometry; there is no scroll handler for section motion. Offscreen content does not animate during startup. Content remains visible if the observer is unavailable. Reduced motion works both at initial load and when the preference changes. Focus immediately reveals any pending content, so keyboard users do not encounter invisible controls. Header scroll state only updates when the compact threshold changes.

Browser geometry checks passed at **320, 375, 768, 1024, 1241, 1440 and 1920px**: no document/content horizontal overflow, no undersized visible homepage/navigation/footer controls, no missing rendered images and no unrevealed content after scrolling. Screenshots of mobile, tablet and desktop layouts were inspected. Expanded disclosures were checked separately.

## Images and credits

The homepage uses the same five photographs approved in Stage 2: Didier Bn (football/hero), CHUTTERSNAP (basketball), Tim Chow (tennis), Charan S (athletics), and Matteo Paganelli (community). All are local, credited Unsplash images. See [IMAGE_CREDITS.md](../IMAGE_CREDITS.md) for source pages, license, crops, dimensions, encoding settings and every filename.

This stage adds 18 AVIF variants and one JPEG social card. The 14 existing WebP variants remain fallbacks. The larger mobile hero is now **56,737 bytes**, down from its **176,604-byte** WebP fallback, a **67.9% reduction**. Sports images include an intermediate 768px size and more accurate display-size hints. Below-fold photographs retain native lazy loading, asynchronous decoding, descriptive alternatives and intrinsic dimensions. All 33 photo files decoded successfully; none are missing or placeholders. Homepage resource requests remain same-origin. The favicon reuses the existing AG monogram and brand colors.

## Lighthouse and bundle results

Audited the production preview at http://127.0.0.1:5174/ using Lighthouse **13.0.1**, an isolated Chrome profile, the default mobile viewport and standard simulated throttling. No score-relevant audits were skipped and no throttling multipliers were reduced. Three final runs used the same built application and fresh browser sessions. These are local lab measurements, not real-user field data or a production-hosting guarantee.

| Run | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Total blocking time |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Stage 2 baseline | 84 | 100 | 96 | 92 | 4.17 s | 0 | 133 ms |
| Final 1 | 95 | 100 | 100 | 100 | 2.36 s | 0 | 169 ms |
| Final 2 | 95 | 100 | 100 | 100 | 2.36 s | 0 | 190 ms |
| Final 3 | 97 | 100 | 100 | 100 | 2.32 s | 0 | 95 ms |

Final median Performance: **95**. Median LCP: **2.36 seconds**. Requested thresholds: Performance >=90, Accessibility >=95, Best Practices >=90, SEO >=95, LCP <2.5 seconds and CLS <0.1.

One final run reported that the host CPU was slower than Lighthouse expected. The standard throttling settings were retained; all three runs still met the requested targets. The exact warning and configuration are recorded in audit-summary.json.

Initial JavaScript decreased from 357.57 kB (112.06 kB gzip) to **334.53 kB (107.48 kB gzip)**. Entry styles total **39.96 kB (8.49 kB gzip)** and are embedded in the **42.07 kB HTML (9.32 kB gzip)**. Admin CSS is a separate **3.67 kB** file. No animation library or production dependency was added. Lighthouse and axe tooling was installed only in an ignored local cache.

Raw reports and screenshots are local ignored artifacts under .vite/stage3/. The final Lighthouse files are final-inline-1.report.html, final-inline-2.report.html and final-inline-3.report.html, with matching JSON files. audit-summary.json captures browser/settings and exact numbers. Intermediate reports are retained and are not substituted for the final run set.

## Verification

| Check | Result |
| --- | --- |
| npm run lint | Passed, zero warnings |
| npm test | Passed, 15/15 existing tests |
| npm run build | Passed, including TypeScript checking |
| git diff --check | Passed; Git only reported existing line-ending normalization notices |
| Development startup | HTTP 200 on port 5173; all seven homepage sections rendered at 375px without overflow or uncaught exceptions |
| Responsive checks | Passed at all seven widths above |
| Axe accessibility | Zero violations in five states: full mobile/desktop content, desktop menu open, mobile dialog open, all disclosures expanded |
| Photo/gradient text contrast | 102 text/viewport samples checked separately; the final photo-overlay samples meet their AA thresholds |
| Keyboard | Skip link, dropdown entry/Escape/Tab, modal focus containment/return, and disclosure Enter controls passed |
| Motion | Scroll reveal, focus reveal, live reduced-motion changes and observer-unavailable fallback passed |
| Images | All 33 local variants decoded; source and production copies checked |
| Homepage destinations | /, /about, /products, /sports, /services, /industries, /projects, /contact, /case-studies rendered correctly |
| Shared routes | Homepage variants absent; hero preload absent on unrelated routes |
| Admin splitting | Login and stylesheet loaded; protected route still returned to login when session lookup failed |
| Browser runtime | No uncaught JavaScript exceptions in completed checks |
| Resources removal | Existing public-route, navigation, API and Prisma regression tests passed |
| Optional domain metadata | Unset emits no invented domain; a test-only origin generated the correct seven absolute social tags without changing an environment file |

Some early browser harness failures came from a background test tab, asynchronous focus updates and screenshot viewport resizing. The harness was corrected, then rerun. Those failures were not hidden with application workarounds. The separate contrast check intentionally sampled text bounding rectangles over screenshots with text made transparent; axe's photographic-background limitations were not treated as a pass by themselves.

## Files changed in Stage 3

Modified, relative to the Stage 2 snapshot:

- `.env.example`
- `IMAGE_CREDITS.md`
- `index.html`
- `src/admin/components/AdminRoot.tsx`
- `src/admin/routes.tsx`
- `src/main.tsx`
- `src/styles.css`
- `src/ui/App.tsx`
- `src/ui/components/Header.tsx`
- `src/ui/components/home/HomeCommunity.tsx`
- `src/ui/components/home/HomeDelivery.tsx`
- `src/ui/components/home/HomeDiscovery.tsx`
- `src/ui/components/home/HomeEnquiry.tsx`
- `src/ui/components/home/HomeHero.tsx`
- `src/ui/components/home/HomePhoto.tsx`
- `src/ui/components/home/HomeProjects.tsx`
- `src/ui/pages/HomePage.tsx`
- `src/ui/styles/home.css`
- `src/ui/styles/home-sections.css`
- `vite.config.ts`

Added source and support files:

- src/ui/hooks/useHomeMotion.ts
- src/ui/components/DesktopNavGroup.tsx
- src/ui/styles/home-motion.css
- src/admin/components/AdminShell.tsx
- public/favicon.svg
- public/robots.txt
- docs/homepage-stage3.md

Added photographs, all under public/images/home/:

- `arena-field-medium.avif`
- `arena-field-mobile-small.avif`
- `arena-field-mobile.avif`
- `arena-field-wide.avif`
- `arena-social.jpg`
- `athletics-640.avif`
- `athletics-768.avif`
- `athletics-960.avif`
- `basketball-640.avif`
- `basketball-768.avif`
- `basketball-960.avif`
- `community-1280.avif`
- `community-640.avif`
- `football-640.avif`
- `football-768.avif`
- `football-960.avif`
- `tennis-640.avif`
- `tennis-768.avif`
- `tennis-960.avif`

No existing project files were deleted. Temporary audit utilities, profiles, source snapshots and screenshots are ignored cache artifacts, outside the production source file list.

## Remaining configuration and verification limits

- The real production origin has not been supplied. Set **VITE_SITE_URL** to that public HTTP(S) origin before building for deployment; .env.example documents a safe placeholder. This enables absolute Open Graph URL/image tags and the JPEG social card. Titles, descriptions, site name, theme color and social-card type are already in the initial HTML. No production canonical URL was invented. The application body remains client rendered.
- The live database-backed enquiry submission and successful administrator login were not verified. The separate API/database is not configured for this stage. Its existing environment requirements remain in .env.example, including DATABASE_URL and JWT_SECRET. No secrets or database data were changed.
- The existing WhatsApp links have no company recipient number and open the generic WhatsApp flow. Delivery to the business cannot be verified without that number; no message was sent.
- Existing listing-page search/filter/pagination controls and legacy assets on unrelated pages remain outside the homepage redesign scope.
- Physical-device, Safari/Firefox, screen-reader and deployed HTTPS/social-crawler testing remain outstanding. Automated checks and contrast sampling do not constitute a full accessibility certification.

## Install, run and reproduce

The package root is the nested Arenagrid folder. On a fresh checkout, install from the existing lockfile:

```powershell
cd E:\arena\Arenagrid\Arenagrid
npm ci
```

Start the frontend once:

```powershell
cd E:\arena\Arenagrid\Arenagrid
npm run dev
```

Use http://127.0.0.1:5173/ when the verified development server is running. Reuse that server instead of launching another on port 5173. To run the existing API after configuring real environment values, use npm run dev:api in a separate terminal. This report does not claim a live database connection or completed enquiry delivery.

Production checks:

```powershell
npm run lint
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 5174 --strictPort
```

The local Lighthouse CLI follows the [official Lighthouse CLI workflow](https://github.com/GoogleChrome/lighthouse#using-the-node-cli). Its temporary installation and repeatable command are:

```powershell
npm install --prefix node_modules/.cache/arena-stage3 --no-save --package-lock=false --ignore-scripts lighthouse@13.0.1
node node_modules/.cache/arena-stage3/node_modules/lighthouse/cli/index.js http://127.0.0.1:5174/ --chrome-flags="--headless=new --no-first-run --disable-extensions" --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path=.vite/stage3/recheck
```
