# Architecture

## Runtime boundaries

This is one npm package with separate frontend and backend entry points. React 19, React Router 7 and Vite 7 serve the public site and CMS. Express 5 serves JSON APIs and uploaded media. Prisma 6 targets PostgreSQL. Shared Zod 4 schemas validate API input. Global and admin CSS are unchanged.

- `src/main.tsx`: public router and admin route composition.
- `src/ui/`: existing public shell, shared visual components, pages and static website content.
- `src/admin/routes.tsx`: admin route declarations.
- `src/admin/components/AdminRoot.tsx`: authentication provider and route outlet.
- `src/admin/auth/`: context, user/role types and provider.
- `src/admin/hooks/useAuth.ts`: typed authentication access.
- `src/admin/services/api.ts`: credentialed admin requests and CSRF headers.
- `src/services/apiConfig.ts`: shared admin/public API and media address resolution.
- `server/app.ts`: Express middleware and router composition; no listening side effects.
- `server/index.ts`: listener lifecycle, startup errors and shutdown.
- `server/config.ts`, `server/db.ts`, `server/errors.ts`: environment, Prisma client and error boundary.
- `server/routes/`: public, authentication, admin, user and media HTTP handlers.
- `server/middleware/auth.ts`: identity lookup, authentication, RBAC and CSRF enforcement.
- `server/resources.ts`: declarative CMS model/relationship/permission configurations.
- `server/lib/`: generic resource router, session cookies/JWTs and audit logging.
- `shared/`: configuration validation, API input validation and existing module declarations.
- `prisma/`: unchanged database schema and initial migration, plus optional demo seed.
- `tests/`: isolated regression tests using Node's test runner and tsx.

The frontend/backend were already separated appropriately. A monorepo/workspace conversion, controller/service duplication or full directory migration would add risk without helping this small application. The enclosing workspace and nested Git repository were preserved.

## Request flow

Public routes render static React content. The contact form POSTs to `/api/leads`; `/api/catalog` exposes published database records. The public site currently does not read catalog/CMS content dynamically. That is an existing product limitation, not a broken import.

Admin login validates email/password with bcrypt and sets an HTTP-only JWT session cookie plus a CSRF cookie. Subsequent admin requests resolve an active database user, use the current database role and enforce route-specific permissions. Mutations require a matching CSRF header and cookie; login and authenticated session restoration return the CSRF token to the client. Logout also enforces CSRF. Session cookies expire after ADMIN_SESSION_MINUTES. Production cookies require HTTPS.

The generic CMS router validates input, transforms relationship IDs into Prisma nested writes, executes the mutation and records an audit log. Products replace submitted specification collections with a nested write; omitted collections are preserved. Partial update schemas omit creation defaults so untouched fields do not reset. Lead assignees expose only id and name.

Multer writes media to MEDIA_STORAGE_PATH. The server chooses extensions from permitted MIME types, limits size and serves uploaded documents with a sandbox content security policy. MIME declarations are not full file-content verification. Persistent storage and stronger file inspection remain deployment work.

## Database

The checked-in schema and migrations use PostgreSQL, including native enums and relational join tables. Models cover users, media, product categories/products/specifications, sports, services, industries, projects, case studies, blog posts, FAQs, pages, menus, leads, audit logs, SEO metadata and website settings.

The Resources feature has been removed from the public site, CMS, API, validation and Prisma schema. The forward migration `20261021070000_remove_resources` removes its table and two join tables while retaining shared records. It has not been applied to a database. The initial migration remains unchanged for migration-history consistency. See `resources-removal.md` for the change inventory and verification.

The old SQLite example and architecture notes were stale. Use a real PostgreSQL URL. `/api/health` is process liveness; `/api/ready` makes a database query. Readiness passing does not prove migrations are applied: verify migration status and representative CRUD after provisioning.

## Hosting

Development uses Vite on 5173 and Express on 4000 with `/api` and `/uploads` proxies. The API target follows PORT or API_PROXY_TARGET. Strict frontend port selection keeps APP_ORIGIN predictable.

Production needs a static frontend host, an Express/Node process, PostgreSQL, durable uploads and HTTPS. The existing Vercel rewrite serves SPA routes only. Prefer same-origin API/media proxying; separate hosting needs build-time VITE_API_BASE_URL and server-side APP_ORIGIN. TRUST_PROXY_HOPS defaults to zero and must match the actual deployment topology.

## Scope limits

Several public routes are editorial placeholders; search/filter/pagination controls are presentational. Public copy and images are static. The shared module list declares future modules not all implemented as routes. No search product, dynamic public CMS rendering, new visual design, account recovery, MFA, storage provider or major architecture was introduced during this maintenance task. See the audit report for verified results and remaining risks.
