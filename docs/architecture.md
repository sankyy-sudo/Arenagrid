# Arena Grid Infra Architecture

## Phase 1 Audit

The workspace `C:\Users\sanke\OneDrive\Desktop\vinayproject` was empty at the start of Phase 1. Git discovery resolves to `C:\Users\sanke`, which is a parent-level repository containing unrelated desktop files and deleted files from another employee-management project. No reusable application code, package manager configuration, database schema, UI, API, admin panel, or deployment configuration existed inside the current workspace.

Because there was no viable existing stack, Phase 1 establishes a conservative TypeScript foundation rather than migrating from another framework.

## Selected Stack

- Frontend: React 19 with Vite and React Router.
- Backend: Express 5 API written in TypeScript.
- Database: SQLite for local development through Prisma; the Prisma schema can move to Postgres later with minimal model changes.
- ORM: Prisma.
- Validation: Zod shared between server and future forms.
- Styling: Global CSS design tokens for the initial brand foundation.
- Authentication: RBAC roles and protected-route middleware foundation. Full login/session implementation belongs to Phase 3.
- Package manager: npm.
- Build: `npm run build` runs TypeScript checks and Vite production build.

## Public Website Architecture

Routes are created for the required public sitemap:

- `/`
- `/about`
- `/products`
- `/sports`
- `/services`
- `/industries`
- `/projects`
- `/case-studies`
- `/resources`
- `/blog`
- `/gallery`
- `/contact`

The current public UI is intentionally a foundation: shared header, footer, section header, card, homepage, listing template and contact page. Phase 2 should replace or expand these into the full premium UI system.

## API Architecture

Public API:

- `GET /api/health`
- `GET /api/catalog`
- `POST /api/leads`

Admin API foundation:

- `GET /api/admin/dashboard`
- `GET /api/admin/products`
- `POST /api/admin/products`

Admin routes already call RBAC middleware, but no request authentication parser is wired yet. Phase 3 must add login, secure sessions/JWT, server-side permission checks for every admin module, audit logging and session timeout.

## Database Architecture

The Prisma schema models:

- Users and roles
- SEO metadata
- Media assets
- Product categories
- Products
- Dynamic product specifications
- Sports
- Services
- Industries
- Projects
- Case studies
- Blog posts
- Resources
- FAQs
- Pages
- Menus
- Leads
- Activity logs
- Website settings

The core many-to-many relationships are represented for products, sports, services, projects, industries, case studies, blog posts, resources and FAQs. Slugs are unique where needed. Content models include `createdAt`, `updatedAt` and publish states.

Local verification note: `npx prisma validate` succeeds, and Prisma Client generation succeeds. On this machine, `prisma db push` and `prisma migrate dev` both return a blank native `Schema engine error` while targeting SQLite, even when run with elevated permissions and reset flags. This blocks local database creation and seed verification until the Prisma schema-engine environment issue is resolved.

## Security Foundation

Implemented:

- Helmet security headers.
- CORS restricted by `APP_ORIGIN`.
- JSON payload limit.
- Zod input validation.
- Server-side RBAC middleware hooks.
- Password hashing in seed script.
- Safe generic error responses.

Still required:

- Real authentication and session handling.
- CSRF strategy.
- Rate limiting.
- Upload validation.
- Audit logging integration around mutations.
- Admin session timeout.
- 2FA-compatible architecture.

## Performance Foundation

Implemented:

- Vite production build.
- Shared route templates to avoid duplicated page code.
- Lazy-ready CMS route architecture.

Still required:

- Local optimized images.
- Responsive image pipeline.
- Pagination for large CMS lists.
- Server-side caching decisions.
- Bundle analysis.

## Environment Variables

See `.env.example`.

Required for local development:

- `DATABASE_URL`
- `PORT`
- `APP_ORIGIN`
- `JWT_SECRET`
- `ADMIN_SESSION_MINUTES`
- `MEDIA_STORAGE_PATH`

## Remaining Phases

1. Phase 2: Build the full premium Arena Grid Infra UI/UX system.
2. Phase 3: Build CMS/admin, auth, RBAC, migrations, seed data and media library.
3. Phase 4: Build lead pipeline, enquiry workflows, forms, notifications and exports.
4. Phase 5: Build SEO, landing pages and analytics.
5. Phase 6: Build premium product/project detail experiences.
6. Phase 7: Production readiness, security, performance and responsive QA.
7. Phase 8: Final visual polish.
8. Final QA: End-to-end audit and confirmed fixes only.
