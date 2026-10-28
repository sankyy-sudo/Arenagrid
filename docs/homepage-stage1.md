# Homepage redesign — Stage 1 review

Completed on 2026-10-21 after approval of the infrastructure/enquiry direction.

## Implemented

- Extracted the homepage hero into `HomeHero`, preserving the existing `ButtonLink` convention.
- Added a photographic hero with the headline “Built for play. Made to last.”, a concise service description, and existing Contact and Sports destinations.
- Replaced the old hero's decorative CAD panel and statistics strip with a compact list of existing project services.
- Added opt-in homepage tokens for typography, spacing, radius, shadow and button treatment. Existing green, graphite and off-white branding is retained.
- Added four local WebP variants of one credited photograph, with responsive art direction, intrinsic dimensions and high loading priority. No image service is contacted by the new hero at runtime.
- Added staggered text entrances and button interactions using CSS transform/opacity. Reduced motion disables the hero entrance.
- Refined the homepage header without applying its new visual treatment to other routes.
- Removed the inactive shared header search control. Converted mobile navigation to a native modal dialog with accessible expanded state, initial focus, background inertness, Escape/backdrop dismissal, focus restoration and desktop-resize cleanup.
- Preserved the mobile close button's 44px size and bridged the pointer gap above desktop dropdowns.
- Removed superseded hero CSS and fixed homepage clipping at a 320px viewport with a desktop scrollbar.

The lower homepage sections were compared against the pre-edit source and are unchanged. No dependencies, backend code, authentication logic or database schemas were changed in this stage. Resources remains removed. Nothing was pushed to GitHub.

## Component structure

```text
src/ui/
  App.tsx                       # Selects homepage header variant
  components/
    Header.tsx                  # Shared navigation and native mobile dialog
    home/HomeHero.tsx            # Homepage-only hero
  pages/HomePage.tsx             # Hero followed by existing sections
  styles/home.css               # Opt-in homepage design foundation
public/images/home/             # Four local responsive hero variants
```

## Files changed in this stage

Modified:

- `src/main.tsx` — imports the scoped homepage stylesheet.
- `src/styles.css` — shared header/dialog support and removal of retired hero rules.
- `src/ui/App.tsx` — selects the header variant from the current route.
- `src/ui/components/Header.tsx` — functional and accessibility improvements.
- `src/ui/pages/HomePage.tsx` — replaces the inline hero with `HomeHero`.

Added:

- `src/ui/components/home/HomeHero.tsx`
- `src/ui/styles/home.css`
- `public/images/home/arena-field-wide.webp`
- `public/images/home/arena-field-medium.webp`
- `public/images/home/arena-field-mobile.webp`
- `public/images/home/arena-field-mobile-small.webp`
- `IMAGE_CREDITS.md`
- `docs/homepage-stage1.md`

No project files were deleted. Earlier uncommitted changes remain in the working tree and are outside this stage's file list. Browser checks and screenshots were generated in ignored local cache directories.

## Images

The hero uses illustrative facility photography by Didier Bn from Unsplash, not a claimed Arena Grid project or bookable venue. See [IMAGE_CREDITS.md](../IMAGE_CREDITS.md) for the source page, license and exact processing details.

Individual variants range from 74,280 to 329,660 bytes. The browser requested exactly one appropriate hero variant in each production smoke check. All four files decoded successfully at their documented dimensions. Existing lower-page photographs are unchanged and await the Stage 2 asset audit.

## Verification

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, no warnings |
| `npm test` | Passed, 15/15 tests |
| `npm run build` | Passed, including TypeScript checking |
| `git diff --check` | Passed |
| Headless Chrome at 320, 375, 768, 1024, 1440 and 1920px | Passed geometry checks; screenshots visually inspected |
| Homepage horizontal overflow | None detected at the tested widths |
| Hero CTA sizes | At least 44px in both dimensions; rendered height 55px |
| Hero Contact/Sports links | Both reached their existing pages |
| Mobile menu | Initial focus, inert background, keyboard navigation, Escape, backdrop, focus restoration and resize cleanup checked |
| Reduced motion | Hero entrance disabled |
| Other-page styling | Sports page visually inspected; homepage header variant absent on Sports and Contact |
| Lower homepage sections | Source content unchanged |
| Browser exceptions during checks | None |
| Production preview | Rendered at mobile and desktop widths; all four local images decoded; Contact/Sports direct routes rendered |
| Existing frontend and API liveness | Both HTTP 200 |
| API database readiness | HTTP 503; still unavailable |

Test workers and isolated Chrome required execution outside the filesystem sandbox because process spawning was initially blocked with `EPERM`. The completed runs above succeeded. Browser checks used a temporary local profile, not the user's browser profile.

These checks cover Stage 1. Lighthouse scores, LCP/CLS measurements, a full WCAG audit, physical-device testing and a whole-site link audit have not been completed. No performance target is claimed as achieved.

## Remaining work and approval boundary

- Stage 2 section consolidation and remaining image work await approval.
- Existing hardcoded project/testimonial authenticity remains unverified.
- Database-backed enquiry submission cannot be verified while readiness is 503.
- Existing listing-page search/filter controls and recipient-free WhatsApp links remain outside this homepage hero stage.
- Stage 3 motion refinements, metadata, accessibility and Lighthouse validation await their later approval.

## Run locally

The application directory is the nested repository:

```powershell
cd E:\arena\Arenagrid\Arenagrid
npm run dev
```

Open `http://localhost:5173/`. If the existing dev server is already running there, open or refresh it instead of starting another instance.

For the API, use a second terminal in the same directory with the existing environment configuration:

```powershell
npm run dev:api
```

The homepage and destination pages can render without successful database readiness; completing enquiry submissions still requires a working database configuration.
