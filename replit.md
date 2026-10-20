# FutureReady AI

FutureReady AI is a beginner-friendly career exploration dashboard with a locally saved skills profile and clearly labeled synthetic examples.

## Run & Operate

- `pnpm --filter @workspace/future-ready-ai run dev` — run the FutureReady AI web app
- `pnpm --filter @workspace/future-ready-ai run typecheck` — check the web app's TypeScript
- `pnpm --filter @workspace/future-ready-ai run build` — create a production build
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/future-ready-ai/src/App.tsx` — app routes, shared navigation, six page views, and synthetic sample content
- `artifacts/future-ready-ai/src/index.css` — shared theme, layout, and responsive styles
- `artifacts/future-ready-ai/package.json` — app commands and dependencies

## Architecture decisions

- The first version is frontend-only. The skills profile is saved in the browser with localStorage; no login, database, API key, or external service is needed.
- Career scores, skill trends, recommendations, learning estimates, and AI-adoption comparisons are synthetic examples, not verified forecasts or labor-market statistics.

## Product

The app helps users explore a skills profile, illustrative future skill trends, career matches, an example learning roadmap, and moderate versus fast AI-adoption scenarios.

## User preferences

- Keep the first version simple enough for programming beginners to understand and maintain.
- Use clearly labeled synthetic sample data; do not present sample trends, job statistics, or recommendations as verified facts.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
