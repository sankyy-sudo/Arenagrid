# Products: admin-managed catalogue

Only Products is connected in this phase. Sports, Services, Industries and Projects public content remain unchanged. The owner-approved `20261028120000_product_features_best_for` migration was applied on 2026-10-28. No seed was run. The separate Resources-removal migration remains pending and was not applied.

## Admin workflow

1. Start the existing API and frontend, then sign in at `/admin/login` using your existing account.
2. Open `/admin/products`, select New, and enter the name, unique slug, descriptions and optional category.
3. Upload a product image or enter an HTTPS/local image URL. Removing an image clears the product reference, not the shared media asset.
4. Enter Product description, then add individual Features and Best for items with the Add buttons. Remove deletes a list item; an empty list clears all items. These lists are independent of specifications and related sports. Slug and publish status remain available; existing hidden metadata and relationships are preserved.
5. Save as DRAFT to keep the product private. Set status to PUBLISHED and save to include it in `/products` and the homepage product list. Publish the category too if it should appear as a filter.
6. Edit from the product list and save. ARCHIVED hides a product without deleting it. Delete uses the existing confirmation and role checks.

SUPER_ADMIN and CONTENT_MANAGER can delete products. EDITOR can create/edit but cannot delete. Existing server-side authentication, CSRF protection and permissions still apply.

Public pages load current data when opened and refresh on window focus. They do not push updates continuously to already-active tabs. Empty/error states never restore the old hardcoded products.

## Local setup

Use the existing database and admin account. Configure the local `.env` using `.env.example`; do not share credentials. Required server configuration includes DATABASE_URL and JWT_SECRET. APP_ORIGIN must match the frontend origin; the normal local API port is 4000 and Vite port is 5173. VITE_API_BASE_URL defaults to /api/admin.

From the application folder, use separate terminals:

```powershell
npm run dev:api
npm run dev
```

If Vite is already running on 5173, use that instance. Do not run the demo seed against the existing database: it includes demo content and accounts. The prepared migration adds two text-array columns and copies previously displayed specifications/published sports into them. It does not delete existing relationships. Review migration status before applying: other pending migrations must not be applied without review. Prisma client generation alone does not update the database.

## Implementation files

- `shared/products.ts`: public response contract.
- `server/lib/publicProducts.ts`, `server/routes/public.ts`: published-only public product projection and endpoint.
- `shared/validation.ts`: safe product image URL validation, including existing local uploads.
- `src/admin/components/ProductImageField.tsx`, `src/admin/resourceConfig.ts`, `src/admin/pages/ResourceFormPage.tsx`: product image management and save feedback.
- `src/ui/hooks/useProducts.ts`: fetch, refresh, timeout, cancellation and retry.
- `src/ui/components/products/config.ts`, `ProductContent.tsx`, `ProductCard.tsx`: API-driven categories and cards.
- `src/ui/components/home/HomeDiscovery.tsx`: API-driven homepage product list.
- `src/services/apiConfig.ts`: safe environment lookup outside Vite.
- `tests/products.test.ts`, `tests/api.test.ts`: image validation, safe public projection and authenticated CRUD/publishing coverage.

## Verification

- All 18 tests passed. HTTP CRUD lifecycle and permission tests use a mocked database adapter; they do not prove real PostgreSQL persistence.
- ESLint passed with generated `.vite` browser artifacts excluded.
- TypeScript and production build passed. Vite reported a bundle-size warning, not a build failure.
- Headless Chrome checks passed at 360, 768 and 1280 pixels with a mocked public API: real local image loading, no horizontal overflow, details, empty state, API failure/retry and homepage list.
- Real admin login, actual media upload and persistent database CRUD still require the configured local API/database. No real database records were created or deleted during verification.


## Independent product fields update

The main form presents Product image, Product name, Category, Product description, Features and Best for, followed by slug and publish status. The existing-image dropdown and Additional product settings section have been removed. Image URL and upload remain available. Legacy specifications, relations, SKU and short description are omitted from product update payloads and remain unchanged in storage. Features and Best for have individual Add/Remove controls and explicit empty-list clearing. Product cards prefer Product description and show the editable lists directly.

Update verification: 20 tests passed, including list validation, omitted-field preservation, clearing and card mapping. The approved migration has now been applied. The Windows query-engine DLL lock was resolved by restarting this project's API; Prisma client generation succeeded.


## Approved migration verification ? 2026-10-28

Only the Products migration SQL was executed, in a transaction, then recorded with Prisma migrate resolve. A blanket migrate deploy was deliberately not used because the unrelated Resources-removal migration is pending.

Real database reads verified one existing product and zero backfill mismatches for features/bestFor. The restarted API returned HTTP 200 for `/api/ready` (database connected) and `/api/products` (one published product with both arrays). No sample product was inserted and no business record was deleted. Actual browser login/upload/edit/delete remain separate checks; these read-only checks establish the schema, backfill and public API connection.
