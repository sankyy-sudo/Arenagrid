# Industries admin integration

Status: implementation and mocked verification complete; database migration pending approval. Apply the prepared `20261028180000_industry_image_solution` migration before using this version against the live database. No database changes or sample industry records were made in this task.

## Workflow

At `/admin/industries`, New/Edit provides Name, image (URL or upload), Description and Solution, alongside slug and publish status. Solution is free text, with line breaks preserved on the Industries page. Both text fields accept up to 10,000 characters. Images can be cleared without deleting shared media.

Only PUBLISHED industries appear in `/industries` and the homepage industry list. Draft/Archived remain hidden; deletion removes the entry from these lists on reload or window focus. Existing role checks and delete confirmation apply. Existing service/project relationships remain intact; hidden fields are excluded from form updates.

The website uses `/api/industries`, a published-only public projection. Loading, empty, error/retry and missing-image states are supported. Static industry names and fixed solution bullets are no longer used by these components, so adding an arbitrary industry name works. Other sections retain their existing layouts.

## Migration

The transactional SQL adds two nullable columns to Industry: imageUrl and solution. No tables, records or relations are deleted. Existing rows receive null values; no solutions/images are fabricated. Prisma client generation is complete, but generation alone does not update the database.

## Files

- `prisma/schema.prisma`, `prisma/migrations/20261028180000_industry_image_solution/migration.sql`
- `shared/validation.ts`, `shared/industries.ts`
- `server/lib/publicIndustries.ts`, `server/routes/public.ts`
- `src/admin/resourceConfig.ts`, `src/admin/pages/ResourceFormPage.tsx`
- `src/ui/hooks/useIndustries.ts`, `src/ui/components/IndustryImage.tsx`, `src/ui/components/IndustriesContent.tsx`, `src/ui/components/home/HomeCommunity.tsx`, `src/ui/styles/industries.css`
- `tests/api.test.ts`, `tests/industries.test.ts`

## Verification

26 tests pass, including mocked-database HTTP create/publish/edit/archive/delete, denied-role checks, clearing image/solution and partial-update preservation. Lint and production build pass; existing Vite bundle-size warning remains. Mocked browser checks pass for admin controls, images and solution text at 360/768/1280px, empty/error/retry and the homepage list. Real CRUD/upload verification awaits the database migration. The local API was restarted on configured port 4001 after regenerating Prisma to release its Windows engine lock.
