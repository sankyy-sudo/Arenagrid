# Codebase audit and local verification report

Date: 21 October 2026 (Asia/Kolkata)

This report records the earlier maintenance pass. The subsequent Resources feature removal changes the schema and feature inventory described here; see [Resources removal](resources-removal.md) for the current change and database-migration status.

## 1. Outcome and scope

Frontend and API development servers were started and verified over HTTP. The production frontend build, TypeScript checks, lint, Prisma Client generation, schema validation and eleven regression tests pass. Full database-backed operation is **not verified**: PostgreSQL is unavailable locally, no database URL/credentials were supplied, and Docker Desktop is stopped. Readiness and catalog endpoints correctly return 503 in that state.

No database schema or migration was modified. No migration, seed, data deletion, major dependency upgrade, Git commit or push was performed. Existing environment secrets were not read, printed or overwritten; there was no application `.env` at the start. The running API uses an ephemeral, unprinted session key and a credential-free local PostgreSQL address solely for startup verification. It must be restarted with real configuration for database workflows.

The workspace contains an outer Git repository with pre-existing tracked deletions and a nested application repository at `E:\arena\Arenagrid\Arenagrid`. The nested repository was initially clean. All application edits are in that nested directory. The outer deletions and both Git directories were preserved. Flattening these repositories would need an explicit decision about repository ownership.

## 2. Identified technology stack

| Area | Technology |
| --- | --- |
| Language | TypeScript 5, TSX, CSS |
| Frontend | React 19, React DOM 19, React Router 7 |
| Build/dev | Vite 7, React Vite plugin, npm lockfile |
| Backend | Express 5, tsx |
| Database/ORM | PostgreSQL, Prisma Client/CLI 6.19.3 from existing lockfile |
| Validation | Zod 4 shared schemas |
| Authentication | bcrypt password hashes, JWT session cookie, database-backed active-user/role lookup |
| Authorization | Route-specific RBAC and double-submit CSRF tokens |
| Middleware | Helmet, CORS, cookie-parser, express-rate-limit, Multer |
| UI icons | lucide-react and react-icons |
| Checks | ESLint 9, TypeScript, new Node test-runner regression suite |
| Local toolchain verified | Node.js 24.4.1, npm 11.5.2 |

The old README/architecture and `.env.example` said SQLite, but **both** the actual schema and checked-in initial migration already target PostgreSQL. The example and documentation were corrected to match the implementation.

## 3. Original project structure

```text
E:/arena/Arenagrid/             outer repository (pre-existing deletions)
+-- Arenagrid/                 actual application and nested Git repository
    +-- src/
    ¦   +-- main.tsx, styles.css
    ¦   +-- ui/                public shell, components, pages, static content
    ¦   +-- admin/
    ¦       +-- AuthContext.tsx (context, provider, hook, types, unused helper)
    ¦       +-- api.ts, routes.tsx, resourceConfig.ts, admin.css
    ¦       +-- components/
    ¦       +-- pages/
    +-- server/
    ¦   +-- index.ts           middleware, route composition and listener mixed
    ¦   +-- config.ts, db.ts, errors.ts, resources.ts
    ¦   +-- routes/
    ¦   +-- middleware/
    ¦   +-- lib/
    +-- shared/                config, input validation, module declarations
    +-- prisma/                PostgreSQL schema, migration, demo seed
    +-- docs/architecture.md   stale phase-one/SQLite documentation
    +-- package.json, package-lock.json, Vite/TS/ESLint/Vercel configs
```

There was one npm package and no existing test script or tests. The existing frontend/backend separation was appropriate. No missing source imports or duplicate source trees were found inside the application repository. Several shared declarations and public templates describe future features; they were preserved rather than deleted as supposedly unused code.

## 4. Improved project structure

```text
Arenagrid/
+-- src/
¦   +-- main.tsx, styles.css
¦   +-- services/apiConfig.ts       shared backend/public/media URL resolution
¦   +-- ui/                        existing public components/pages/content
¦   +-- admin/
¦       +-- auth/
¦       ¦   +-- context.ts          context and auth types
¦       ¦   +-- AuthProvider.tsx    provider component only
¦       +-- hooks/useAuth.ts
¦       +-- services/api.ts
¦       +-- components/
¦       ¦   +-- AdminRoot.tsx       provider + outlet
¦       ¦   +-- AdminLayout.tsx
¦       ¦   +-- ProtectedRoute.tsx
¦       +-- pages/
¦       +-- routes.tsx, resourceConfig.ts, admin.css
+-- server/
¦   +-- app.ts                     Express composition, importable by tests
¦   +-- index.ts                   startup and graceful shutdown
¦   +-- config.ts, db.ts, errors.ts, resources.ts
¦   +-- routes/, middleware/, lib/
+-- shared/
+-- prisma/                        schema/migration unchanged
+-- tests/
¦   +-- api.test.ts
¦   +-- auth.test.ts
¦   +-- config.test.ts
¦   +-- resources.test.ts
+-- docs/
    +-- architecture.md
    +-- audit-report.md
```

This keeps existing feature boundaries and avoids introducing unnecessary workspace packages, controller wrappers or a new framework. Updated imports are validated by TypeScript and the Vite build. UI CSS is byte-for-byte unchanged according to Git.

## 5. Problems discovered and fixes

| Problem | Change and verification boundary |
| --- | --- |
| SQLite example incompatible with PostgreSQL schema/migration | Corrected `.env.example` and docs; configuration rejects SQLite URLs; Prisma validation passes with a PostgreSQL URL. No database conversion performed. |
| Hardcoded proxy port ignored PORT | Vite target follows PORT or API_PROXY_TARGET; default proxy health check returns 200. |
| Uploaded `/uploads/...` media was not proxied by Vite | Added media proxy. Actual Express media serving is covered by an HTTP regression test; live Vite forwarding to API was separately verified with a temporary media fixture. |
| Separate-host API settings affected only admin requests | Shared URL configuration now also controls public enquiries and media URLs. Builds pass; real cross-domain browser/cookie behavior remains untested. |
| Browser cannot read a backend-domain CSRF cookie from a separately hosted frontend | Login and `/auth/me` return the CSRF token to the authenticated client; the client retains it in memory and sends the header. Cookie/header equality is still enforced. Real authenticated cross-host verification needs a database/browser. |
| Logout lacked CSRF and client pretended logout succeeded after failures | Added CSRF guard and keep local authentication on failed logout, surfacing the failure. Auth responses use no-store caching. |
| Lead assignee responses included full User records/password hashes | Explicit Prisma select restricts assignee data to id/name; regression test checks configuration. Real DB response remains untested. |
| Product edit sent specification arrays directly to Prisma relation writes | Transform submitted specifications into atomic nested deleteMany/create; preserve omitted specifications. Nullable stored units are accepted. Payload regression passes; actual CRUD needs PostgreSQL. |
| Partial Zod update schemas inherited creation defaults | Explicitly remove defaults from update fields, preventing omitted status/specifications/menu/access/order values from resetting. Regression checks every resource's empty update payload. |
| Selecting None omitted a relationship instead of clearing it | Form now submits null; backend maps null to disconnect. Relation regression passes. |
| CMS form state could survive switching records/resources | Key form instance by resource and id. Typecheck/build pass; browser interaction not available. |
| Delete UI used write permissions | Give frontend resources explicit delete permissions matching backend. All frontend/API resource role maps are compared by a regression test. |
| Sales users/editors landed on a dashboard their role cannot read | Route those roles to their existing permitted leads/products pages. Other role policies remain unchanged. |
| Admin lead POST used an update schema and could reach invalid Prisma creation | Disable creation on that admin resource; public enquiry endpoint remains the creation path. |
| Malformed JSON, upload limits and database conflicts became generic 500s | Return appropriate 400/413, 404/409 and database-unavailable 503 responses. Malformed JSON behavior verified over HTTP. |
| Media directory async failures could escape Multer callback handling | Route mkdir failure to the upload callback. Choose extensions from allowed MIME types rather than trusting original extensions. |
| Uploaded active documents lacked a serving isolation policy | Sandbox CSP on media responses; HTTP media regression passes. Full file-content validation remains a documented limitation. |
| All deployments trusted one proxy by default | TRUST_PROXY_HOPS defaults to 0; set explicitly for actual infrastructure. |
| Seed hardcoded a shared default password and depended on implicit env loading | Seed loads dotenv explicitly, requires user-supplied SEED_ADMIN_PASSWORD and rejects production execution. No accounts were created. |
| App import started a listener; no automated regression suite | Separate app/listener and add isolated HTTP/config/auth/resource tests. Eleven pass. |
| Fast-refresh/lint warnings and stale hook dependencies | Separate provider/context/hook/root component; fix leads loader dependencies. ESLint passes with zero warnings. |
| Missing non-watch API and migration-deploy commands | Added start:api, db:deploy and test scripts without dependency changes. |

## 6. Files modified, moved or added

Moves/splits:

- `src/admin/AuthContext.tsx` -> `src/admin/auth/AuthProvider.tsx`, `src/admin/auth/context.ts`, `src/admin/hooks/useAuth.ts`. Removed the unused isUnauthorized helper during this split.
- `src/admin/api.ts` -> `src/admin/services/api.ts`.
- Express composition extracted from `server/index.ts` to new `server/app.ts`.
- Admin provider/outlet wrapper extracted from `src/admin/routes.tsx` to new `src/admin/components/AdminRoot.tsx`.

Modified backend/shared/database-tool files:

- `server/index.ts`, `server/errors.ts`, `server/lib/resource.ts`, `server/resources.ts`.
- `server/routes/auth.ts`, `server/routes/media.ts`, `server/routes/public.ts`.
- `shared/config.ts`, `shared/validation.ts`, `prisma/seed.ts`.

Modified frontend files (behavior and/or updated imports):

- `src/admin/components/AdminLayout.tsx`, `ProtectedRoute.tsx`.
- `src/admin/pages/DashboardPage.tsx`, `LeadsPage.tsx`, `LoginPage.tsx`, `MediaLibraryPage.tsx`, `ResourceFormPage.tsx`, `ResourceListPage.tsx`, `UsersPage.tsx`.
- `src/admin/resourceConfig.ts`, `src/admin/routes.tsx`, `src/ui/pages/ContactPage.tsx`.

Other files:

- New `src/services/apiConfig.ts` and four `tests/*.test.ts` files listed above.
- Modified `.env.example`, `package.json`, `tsconfig.json`, `vite.config.ts`, `README.md`, `docs/architecture.md`.
- New `docs/audit-report.md` (this report).

Unchanged: package-lock.json, Prisma schema, migration SQL/lock, both CSS files, existing static content and public layout components. No source asset or business data was deleted.

## 7. Environment variables

| Variable | Requirement/default |
| --- | --- |
| DATABASE_URL | Required real PostgreSQL connection URL; safe placeholder in example; never use the old SQLite URL. |
| JWT_SECRET | Required random value, minimum 24 characters; example replace-* placeholder is rejected. |
| PORT | API port, default 4000; 1–65535. |
| APP_ORIGIN | Exact permitted frontend origin, default http://localhost:5173. |
| ADMIN_SESSION_MINUTES | Session lifetime, default 60. |
| MEDIA_STORAGE_PATH | Upload directory, default ./uploads; provision persistence in production. |
| MEDIA_MAX_FILE_MB | Maximum upload size, default 10. |
| NODE_ENV | development, test or production; default development. |
| TRUST_PROXY_HOPS | Known reverse proxy count; default 0. |
| VITE_API_BASE_URL | Optional frontend build-time admin URL, default /api/admin; public/media base derives from it. This is not a secret. |
| API_PROXY_TARGET | Optional Vite development target override; default localhost at PORT. |
| SEED_ADMIN_PASSWORD | Seed only; user-chosen password of at least 10 characters. No default credentials were invented. |

No `.env` was created or existing secret overwritten. Copy the example only if `.env` is absent, then set the required values locally.

## 8. Exact install and startup commands

From PowerShell:

```powershell
cd E:\arena\Arenagrid\Arenagrid
npm ci
if (-not (Test-Path -LiteralPath .env)) { Copy-Item -LiteralPath .env.example -Destination .env }
# Edit .env locally: set DATABASE_URL and JWT_SECRET; optional SEED_ADMIN_PASSWORD.
npm run db:generate
npx prisma validate
```

The network-restricted installation actually completed with lifecycle scripts deferred:

```powershell
npm ci --ignore-scripts --no-audit --no-fund --prefer-offline --fetch-retries=0 --fetch-timeout=30000 --loglevel=error
npm run db:generate
```

After provisioning PostgreSQL and approving the existing initial migration, these commands initialize and optionally seed it (not executed in this audit):

```powershell
npm run db:deploy
npm run db:seed
```

Terminal 1: `npm run dev:api`. Terminal 2: `npm run dev`.

Non-watch API: `npm run start:api`. Frontend production bundle: `npm run build`. Preview only: `npm run preview` (no full-stack API proxy).

For verification: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npx prisma validate`.

## 9. Final verification evidence

| Check | Observed result |
| --- | --- |
| Locked dependency install | 387 packages installed; normal lifecycle run stalled, deferred lifecycle install completed. |
| npm ls --depth=0 | Completed, no missing/invalid top-level dependencies reported. |
| Prisma Client generation | Passed, generated 6.19.3 client. |
| Prisma schema validation | Passed with a PostgreSQL-shaped environment URL; does not establish a database connection. |
| ESLint | Passed with --max-warnings=0. |
| TypeScript | Passed as part of npm run build; tests/server/shared code included. |
| Production frontend build | Passed: 1711 modules; JS about 354.57 kB, gzip 111.31 kB; CSS 26.24 kB. |
| Automated tests | Eleven passed, zero failed; no real database used. |
| Frontend startup | Vite 7.3.6 ready on port 5173. |
| Backend startup | Express API listening on port 4000. |
| GET /, /contact, /admin/login via Vite | 200 HTML shell. This does not prove browser rendering. |
| GET /src/main.tsx via Vite | 200 transformed JavaScript. |
| GET :4000/api/health | 200 JSON. |
| GET :5173/api/health | 200 JSON, proving the Vite API proxy reaches Express. |
| GET :5173/api/admin/auth/me | 401 JSON as expected for an anonymous request. |
| GET :5173/api/ready and /api/catalog | 503 Database unavailable, because no PostgreSQL connection exists. |
| UI styling / schema / lockfile preservation | Git diff confirms no changes to both CSS files, schema, migrations or package-lock.json. |
| Visual browser QA | Blocked: computer-use inventory has no available browser. No screenshot or interactive browser pass is claimed. |

Development servers were left running for inspection. Their continued availability depends on the active local processes. No production deployment was attempted.

## 10. Remaining issues and next steps

1. Supply a PostgreSQL connection or authorize starting Docker Desktop with an isolated database. Review/approve the existing initial migration before applying it. Database creation, migration status, seed, successful login/session restoration/logout, catalog data, public enquiry persistence, CMS CRUD/relations, upload metadata and audit rows need real database verification.
2. Run browser interaction and responsive/visual checks when a browser surface is available. In particular verify login, record switching, relationship clearing, uploads and cross-origin cookie policies with an actual session.
3. The public website is still largely static: most routes are templates, public search/filter/pagination controls are presentational, CMS edits do not populate public pages dynamically, and several declared modules are future work. Implementing these would add business functionality; they were preserved and documented.
4. The existing Vercel config hosts only the SPA. Full production operation needs an Express host, PostgreSQL, persistent media, HTTPS, proxy topology, real environment values and a frontend/API routing decision. Preview mode is not a production full-stack server.
5. Existing generic CMS lists are unpaginated. Audit writes occur after main mutations rather than in a shared database transaction. Uploads trust MIME declarations rather than inspecting full content, and failed metadata/audit operations can leave partial side effects. These require focused follow-up and database-backed tests before production sign-off.
6. Recovery/MFA, session revocation beyond account state changes, real production storage, backups/observability and dependency advisory scanning were not completed in this local repair. No claim of comprehensive security or production readiness is made.
7. Existing remote Unsplash imagery, WhatsApp recipient links and editorial/demo content require product-owner review before launch. Their design/content was preserved.

The project is buildable and its local frontend/API processes run. Full application verification and production sign-off remain blocked by the database, browser and deployment work above.
