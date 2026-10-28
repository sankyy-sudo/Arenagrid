# Arena Grid Infra

React public website and administration CMS with an Express API and PostgreSQL/Prisma persistence.

## Local setup (PowerShell)

The application root in this workspace is `E:\arena\Arenagrid\Arenagrid`, with its own Git repository. Run commands there, not in the parent workspace.

```powershell
cd E:\arena\Arenagrid\Arenagrid
node --version
npm --version
npm ci
if (-not (Test-Path -LiteralPath .env)) { Copy-Item -LiteralPath .env.example -Destination .env }
```

Tested with Node.js 24.4.1 and npm 11.5.2. Keep the existing package-lock.json. No dependency versions were changed during this audit.

Edit `.env` locally:

- Set `DATABASE_URL` to a real PostgreSQL connection URL for your local database. SQLite is not supported by the existing schema or migration.
- Replace `JWT_SECRET` with a securely generated random secret of at least 24 characters. The example placeholder is deliberately rejected.
- Set `SEED_ADMIN_PASSWORD` yourself (at least 10 characters) only if you want the optional demo dataset. The seed creates seven demo accounts, one per role, using this password; existing accounts are not overwritten. It refuses to run with NODE_ENV=production.
- Keep `PORT=4000` and `APP_ORIGIN=http://localhost:5173` for default local development.

Then generate Prisma Client:

```powershell
npm run db:generate
npx prisma validate
```

Database initialization is a separate, explicit step. Review the migrations and target database first. They include a Resources-removal migration that deletes existing Resource records and their join rows while preserving shared records. Once approved, apply the checked-in PostgreSQL migrations and optionally seed demo content:

```powershell
npm run db:deploy
npm run db:seed
```

No migrations or seeds were executed during the audit or Resources removal. `db:migrate` is for authoring future schema migrations; `db:push` bypasses migration history and is not required for normal setup. Do not reset an existing database.

Run in separate terminals from the application root:

```powershell
npm run dev:api
```

```powershell
npm run dev
```

- Public site: http://localhost:5173
- Admin login: http://localhost:5173/admin/login
- API health: http://localhost:4000/api/health
- Database readiness: http://localhost:4000/api/ready
- Optional seeded admin email: admin@arenagridinfra.local (password is the value you supplied for SEED_ADMIN_PASSWORD).

The development proxy forwards both `/api` and `/uploads`. Its target follows PORT; API_PROXY_TARGET can override it. Vite uses a strict port so APP_ORIGIN cannot silently drift when 5173 is occupied.

### Dependency download troubleshooting

This managed environment restricted downloads and child-process execution. The verified installation sequence was:

```powershell
npm ci --ignore-scripts --no-audit --no-fund --prefer-offline --fetch-retries=0 --fetch-timeout=30000 --loglevel=error
npm run db:generate
```

The second command needs access to Prisma's official native-engine download host. These commands completed; production build and tests then passed. On ordinary development machines, begin with standard `npm ci`. Do not disable TLS verification or change dependency versions to address a network restriction.

## Verification

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npx prisma validate
```

Prisma validation requires DATABASE_URL in `.env` or the process environment. Regression tests supply test-only configuration, open an ephemeral local HTTP listener, and do not connect to or mutate a real database.

`npm run build` typechecks frontend, backend, shared code, seeds and tests, then writes the frontend bundle to `dist/`. `npm run preview` previews that static bundle; it is not a full-stack production server and has no API proxy.

`npm run start:api` runs the API without watch mode using tsx. This deployment path requires the installed development tools (`npm ci`, not `npm ci --omit=dev`). For production, serve `dist/` with a static host/reverse proxy, route `/api` and `/uploads` to the API, provision PostgreSQL and persistent media storage, and configure HTTPS. No deployment was performed.

For separate frontend/API hosting, set VITE_API_BASE_URL to the full admin endpoint (for example `https://YOUR_API_HOST/api/admin`) at frontend build time, and APP_ORIGIN to the exact frontend origin. Public enquiries and media URLs derive from the same backend. The API returns the CSRF token to the authenticated client so mutations do not depend on reading cookies belonging to another origin. Cross-site cookies still depend on browser policies; same-origin proxy hosting is recommended. Set TRUST_PROXY_HOPS only to the known reverse proxy count.

The existing `vercel.json` config serves the frontend SPA only. It does not deploy Express, configure PostgreSQL, persist uploads, or forward API traffic to a backend. Configure an actual API deployment and routing before using it for the complete application.

See `docs/architecture.md` and `docs/audit-report.md` for architecture, changes, verification evidence and remaining gaps.
