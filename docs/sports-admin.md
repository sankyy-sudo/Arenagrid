# Admin-managed Sports

Open `/admin/sports` after signing in. New and Edit forms provide Sport name, Sport image (URL or file upload), Description, slug and publish status. Each sport has one primary image using the existing `heroImageUrl` field. Uploading replaces the selected image reference; removing it does not delete shared media.

Save as PUBLISHED to display the sport on `/sports` and the homepage sports list. DRAFT and ARCHIVED stay hidden. Existing records retain their short description and product/service relationships because hidden fields are omitted from updates. Existing short descriptions remain a display fallback until Description is entered. Delete uses existing confirmation and server permission checks. SUPER_ADMIN/CONTENT_MANAGER can delete; EDITOR can create/edit.

The public API `/api/sports` selects only public fields of published sports. Pages fetch on entry, refresh on window focus and offer retry on failure. No static sports fallback appears when the database is empty or unavailable. Search matches the name and displayed description. Missing or failed images show an icon fallback with reserved image space.

## Files

- Shared image editor: `src/admin/components/ImageField.tsx` (renamed from ProductImageField), `src/admin/pages/ResourceFormPage.tsx`, `src/admin/resourceConfig.ts`.
- API and validation: `shared/sports.ts`, `shared/validation.ts`, `server/lib/publicSports.ts`, `server/routes/public.ts`.
- Public UI: `src/ui/hooks/useSports.ts`, `src/ui/components/SportImage.tsx`, `src/ui/components/SportsContent.tsx`, `src/ui/components/home/HomeDiscovery.tsx`, `src/ui/styles/sports.css`.
- Tests: `tests/api.test.ts`, `tests/sports.test.ts`.
- Existing schema alignment: removed stale SKU references from `prisma/seed.ts`, `server/resources.ts`, validation, admin columns and `tests/products.test.ts`. The current schema already lacked SKU. No schema alteration, migration or seed was executed.

## Verification

22 automated tests passed, including HTTP Sports create/publish/edit/archive/delete and denied-role checks with a mocked database adapter. Browser checks with mocked API responses covered the admin name/image/description controls, cards and actual local image loading at 360/768/1280px, search, empty/error/retry states and homepage rendering. The real `/api/sports` endpoint returned HTTP 200 with two published sports. Real admin login/upload and persistent mutation were not exercised; no live sports were added or deleted. Production build and lint passed; Vite's existing large-bundle warning remains.
