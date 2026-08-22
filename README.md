# Arena Grid Infra

Premium B2B sports infrastructure website and CMS foundation.

## Phase 1 Status

This repository now contains the initial architecture foundation:

- React/Vite public website shell
- Express API shell
- Prisma data model
- Shared Zod validation
- RBAC middleware foundation
- Lead persistence endpoint
- Architecture documentation

## Setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Run the API in a second terminal:

```bash
npm run dev:api
```

Demo admin seed user:

- Email: `admin@arenagridinfra.local`
- Password: `ChangeMe123!`

Change this password before any non-local use.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

Current Phase 1 verification:

- `npm run typecheck`: passing
- `npm run lint`: passing
- `npm run build`: passing
- `npx prisma validate`: passing
- `npm run db:push`: blocked locally by Prisma native schema engine error

## Documentation

Architecture notes are in `docs/architecture.md`.
