# Shared public layout

The public router renders one Header and one Footer from src/ui/App.tsx. No public page duplicates them. Header state resets on navigation, including browser history, so mobile dialogs and desktop dropdowns cannot carry over to the next destination.

All public pages now use the existing homepage navigation/footer treatment and the same Start Your Project CTA. The header is solid and sticky in normal document flow. Active routes are indicated on desktop and mobile. Native dialog focus containment, Escape dismissal and focus restoration remain in place. Internal header links use React Router.

Public routes: /, /about, /products, /sports, /services, /industries, /projects, /case-studies, /blog, /gallery, /contact (11 routes).

The separate admin layout and its role-aware navigation remain unchanged. This application has no customer signup/profile or turf booking/detail routes. Its conversion flow is project enquiry. No Resources route was restored, and no booking/authentication functionality was invented.

Modified files:
- src/ui/App.tsx
- src/ui/components/Header.tsx
- src/ui/components/Footer.tsx
- src/styles.css
- src/ui/styles/home.css
- src/ui/styles/home-sections.css
- src/ui/styles/home-motion.css

No files or dependencies were deleted. No database changes.

Verification: lint and all 15 existing tests passed. Browser results are recorded in .vite/stage3/shared-layout.json when the verification script completes. Live database-backed submission and successful administrator authentication require external service access and were not verified.

Final verification (2026-10-23):
- Lint, 15/15 tests, production build and git diff --check passed.
- All 11 public routes checked at 375, 768 and 1440 pixels: exactly one header/footer, consistent CTA, no horizontal overflow or initial content overlap.
- Focused Chrome checks passed for native Escape dismissal/focus restoration, link navigation, browser Back, admin login rendering and anonymous dashboard redirect; zero uncaught exceptions. The keyboard harness required the Windows Escape virtual key code (27); no application workaround was needed.
- The focused interaction result is saved in .vite/stage3/shared-layout.json. The 33-route layout pass preceded that focused run.
- Authenticated admin operations and live enquiry delivery remain unverified without the API/database credentials. Admin retains its existing dedicated layout.
