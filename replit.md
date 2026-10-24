# FutureReady

FutureReady is a career-exploration prototype for students, graduates, and working adults. Career guidance and sample trends are clearly identified as illustrative, not validated predictions.

## Architecture

- **Frontend:** React, TypeScript, Vite, and Tailwind CSS in `artifacts/future-ready-ai`.
- **API:** Node.js and Express in `artifacts/api-server`.
- **Database:** PostgreSQL with Drizzle ORM stores asynchronous AI insight job-tracking data; it does not store the full skills profile.
- **Profile and roadmap progress:** Saved in browser `localStorage`.
- **Career guidance:** Explainable, rule-based career matching and skill-gap analysis.
- **Market examples:** Remotive API job-listing examples are fetched and cached by the backend; they are not vacancy totals or verified demand statistics.
- **Optional AI:** Backend-mediated RunPod Serverless inference using Qwen/Qwen3-4B-Instruct-2507. `RUNPOD_AI_ENABLED` must be explicitly set to `true`; otherwise inference is disabled. Keep RunPod credentials server-side.

## Run and check

- `pnpm --filter @workspace/future-ready-ai run dev` — run the web app.
- `pnpm --filter @workspace/api-server run dev` — run the API server.
- `pnpm --filter @workspace/future-ready-ai run typecheck` — check frontend TypeScript.
- `pnpm --filter @workspace/api-server run typecheck` — check API TypeScript.
- `pnpm run typecheck` — check all workspace projects.
- `PORT=21019 BASE_PATH=/ pnpm --filter @workspace/future-ready-ai run build` — build the frontend.
- `pnpm --filter @workspace/api-server run build` — build the API.
- `pnpm --filter @workspace/db run push` — development database schema push only; review database changes before running.

Configure `DATABASE_URL` through Replit Secrets for the API. Do not put credentials in source files or browser code.

## Pages and data limits

The six main pages are Home, My Skills Profile, Future Skills Radar, Career Matches, My Learning Roadmap, and AI Trends & Scenarios. SDG Mapping is also available as a supporting page.

Profile-to-skill and career comparisons use the saved browser profile and explicit rules. Radar scores, career catalogues, learning-time estimates, and moderate/fast AI adoption scenarios are synthetic or team-defined examples, not verified labor-market facts or predictions.

## Project conventions

- Use `pnpm` for workspace package management.
- Keep application routes, profile storage keys, and artifact paths stable unless explicitly asked to change them.
- The user-facing application name is **FutureReady**.
