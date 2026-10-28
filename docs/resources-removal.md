# Resources feature removal

The Resources feature is removed from the public site, admin CMS, API, validation and active Prisma schema. Shared CMS code and other pages remain.

## Removed functionality

- Public `/resources` route and shared route/module declarations.
- Desktop/mobile navigation, footer link, and the homepage Resources section and guide titles.
- Resources-specific CMS definition; the sidebar derives its links from that definition, so it no longer includes Resources. Generic admin URLs for unknown modules fall back to the admin dashboard rather than rendering a Resources page.
- Resources CRUD registration under `/api/admin/resources`, including item URLs.
- Feature-specific create/update validation schemas.
- Prisma `Resource` model and inverse references on `Product`, `Sport`, `MediaAsset` and `SeoMetadata`.
- `.resource-grid` styles and selectors. Declarations and selectors for all retained components were verified unchanged using a parsed CSS comparison.
- Descriptive Resources references in the listing template and FAQ copy.

There was no dedicated Resources page/component file: it used `ListingPage`, `ResourceListPage`, `ResourceFormPage` and the generic CMS router. Those shared files remain for other features. Likewise, `server/resources.ts` configures all CMS entities; its name does not mean it is exclusive to the removed Resources feature.

## File inventory for this change

No whole existing files were deleted. Feature-only blocks were removed from shared files.

Modified files:

| File | Change |
| --- | --- |
| `src/main.tsx` | Remove public route. |
| `src/ui/components/Header.tsx` | Remove desktop and mobile navigation entries. |
| `src/ui/components/Footer.tsx` | Remove footer link. |
| `src/ui/components/FAQAccordion.tsx` | Remove obsolete feature reference. |
| `src/ui/pages/HomePage.tsx` | Remove homepage section and its dedicated data. |
| `src/ui/pages/ListingPage.tsx` | Remove obsolete feature reference in template copy. |
| `src/admin/resourceConfig.ts` | Remove Resources CMS definition and generated sidebar entry. |
| `src/styles.css` | Remove only Resources-exclusive selectors/rules. |
| `server/resources.ts` | Remove Resources API configuration/registration. |
| `shared/types.ts` | Remove public route and admin module entries. |
| `shared/validation.ts` | Remove Resources input schemas. |
| `prisma/schema.prisma` | Remove Resource model and its inverse relations. |
| `tests/api.test.ts` | Assert all former CRUD endpoints return 404 for a simulated authenticated administrator. |
| `README.md` | Explain the database cleanup migration before deployment. |
| `docs/architecture.md` | Update active model inventory and removal status. |
| `docs/audit-report.md` | Mark the previous audit as historical and link this follow-up. |

Added files:

- `prisma/migrations/20261021070000_remove_resources/migration.sql`: reviewed forward database cleanup, not applied.
- `tests/resources-removal.test.ts`: rendered navigation/homepage, actual public route declarations and generated Prisma-model checks.
- `docs/resources-removal.md`: this change summary.

No exclusive asset files or npm dependencies were found. Package manifests/lockfile, shared icons, media uploads and shared components were retained. Unrelated uncommitted changes from the earlier maintenance task were preserved.

## Database migration status

Prisma's file-to-file schema diff confirmed exactly these removed tables:

- `Resource`
- `_ResourceProducts`
- `_ResourceSports`

The new transactional migration drops their foreign keys and tables. It does not delete products, sports, media files/metadata, SEO metadata or other shared records. Existing uploaded files were not purged because shared ownership cannot be determined without database access.

The initial migration is intentionally unchanged to preserve migration history. Historical migration SQL still names Resource because it describes the original database, not the current application model.

**The cleanup migration has not been applied.** PostgreSQL remains unavailable in this environment. Applying it to an existing database will permanently delete stored Resources records and join rows, and requires approval of the target database and migration. No database records were changed during this task. Do not use `db:push` to bypass this review. After approval, the existing `npm run db:deploy` command applies pending migrations; no new package script is needed.

## Verification

- `npm run db:generate`: passed; generated Prisma Client no longer contains the Resource model.
- `npx prisma validate`: passed with a PostgreSQL-shaped environment URL; no database connection required.
- `npm run typecheck`: passed.
- `npm run lint`: passed with zero warnings.
- `npm test`: **15 passed, zero failed**. Tests cover unchanged product/lead/auth/media behavior as well as feature removal. The retired API CRUD checks use a stubbed identity lookup and a real HTTP listener; they do not connect to PostgreSQL.
- Public route matching: `/resources`, `/resources/` and `/resources/old-guide` have no match in the actual public route declarations; `/products` still matches.
- Rendered React markup: no Resources links, section or CMS lookup entry; other public navigation links remain.
- Authenticated old API list/create/read/update/delete URLs: all return 404 JSON.
- `npm run build`: passed; frontend bundle produced successfully (1711 modules, approximately 353.20 kB JavaScript and 25.81 kB CSS).
- Parsed CSS comparison against the original stylesheet: every rule for retained components is unchanged.
- `git diff --check`: passed.

The API was briefly stopped to release Prisma's Windows engine file for client regeneration, then restarted on port 4000. The existing frontend remains on port 5173. Live HTTP smoke checks were performed after restarting. Interactive browser/visual testing and a live database migration were not performed.
