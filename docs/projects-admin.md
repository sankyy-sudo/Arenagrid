# Projects admin integration

Status: migration applied on 2026-10-28 after approval to migrate all pending changes. No seed was run and no project records were added/deleted during verification.

## Fields and workflow

At `/admin/projects`, New/Edit provides Title (stored in existing `name`), location, before image, after image, description and project progress (integer percentage 0–100). Both image controls accept URL or file upload and support removal. Each stage has one image. Slug and Draft/Published/Archived remain available. Publish status and completion percentage are independent: publishing a 35% project shows ongoing work; 100% does not auto-publish it.

Existing project relationships and other hidden fields are omitted from form updates and preserved. Existing role checks govern create/edit/delete. All active image uploads must finish before Save is enabled.

The public `/projects` page fetches only published projects from `/api/projects`; cards display title/location, labeled before/after images, description and progress. Missing images have a fallback. Loading/error/retry/empty states do not invent demo projects. No project section was restored to the homepage.

## Migration

The prepared transactional SQL adds nullable `beforeImageUrl` and `afterImageUrl`, plus `progress` defaulting to 0 with a database check constraint restricting it to 0–100. Existing images/gallery and other data remain intact. Existing progress is not guessed. Review pending migration history before applying only this approved migration; unrelated migrations must not be deployed implicitly.

## Changed files

- `prisma/schema.prisma` and `prisma/migrations/20261028160000_project_images_progress/migration.sql`
- `shared/validation.ts`, `shared/projects.ts`
- `server/resources.ts`, `server/lib/publicProjects.ts`, `server/routes/public.ts`
- `src/admin/resourceConfig.ts`, `src/admin/pages/ResourceFormPage.tsx`
- `src/ui/hooks/useProjects.ts`, `src/ui/components/ProjectsContent.tsx`, `src/ui/styles/projects.css`
- `tests/projects.test.ts`, `tests/api.test.ts`

## Verification

24 tests pass, including mocked-database HTTP CRUD/publish/archive/delete/permissions and progress/image validation. Lint and production build pass; the existing Vite large-bundle warning remains. Prisma client regenerated successfully after restarting the local API to release the Windows DLL lock. Browser checks using mocked responses passed for admin controls, image rendering, progress, no horizontal overflow at 360/768/1280px, empty/error/retry. Real persistence and uploads are not verified until the migration is approved and applied.


## Migration applied ? 2026-10-28

Following explicit approval to migrate all pending changes, `prisma migrate deploy` successfully applied both `20261021070000_remove_resources` and `20261028160000_project_images_progress`. The Resources migration removes Resource records and their join tables; shared entities remain. Prisma reports no pending migrations.

Read-only live checks returned HTTP 200 for `/api/ready`, `/api/projects`, `/api/products` and `/api/sports`. Projects returned two existing published records with both image fields and integer progress. No demo content was inserted. The missing `Project.beforeImageUrl` column error is resolved.


## Progress simplified

The admin form, admin list and public page now show only Ongoing / Completed; percentage controls and bars are removed. Storage remains compatible with the existing integer column: 0 represents Ongoing, 100 represents Completed. Existing intermediate values display as Ongoing and normalize to 0 when edited. API writes accept only 0 or 100. This update requires no database migration and does not bulk-update existing records.
