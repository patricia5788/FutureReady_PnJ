# FutureReady

> **Your Skills. Your Future. Your Roadmap.** A deployed career-readiness prototype helping students and early-career individuals understand their skills, explore possible career pathways, and identify practical learning steps in the AI era.

---

## Team Information

| Field | Details |
| --- | --- |
| **Team Name** | PnJ |
| **Team Domain** | Domain 1 — Future-Ready Workforce |
| **SDG Track (1–17)** | **SDG 4 — Quality Education (Primary Focus)**; supporting **SDG 8 — Decent Work and Economic Growth** and **SDG 9 — Industry, Innovation and Infrastructure** |
| **Team Leader** | Jessy Chia Jiek Xin |
| **University** | Multimedia University |
| **Number of Members** | 2 |

## Links

| Resource | Link |
| --- | --- |
| GitHub Repository | https://github.com/patricia5788/FutureReady-AI |
| Replit Project | https://replit.com/@patriciacheng07/FutureReady-AI |
| **Live Demo** | **https://future-ready-pnj.replit.app** |
| Slide Deck | https://www.canva.com/design/DAHY0HTktfI/pwP9jJQ4hNrNyMCeQAuHrw/edit |
| Pitching Video (5–7 minutes, including prototype demo) | **[YouTube link — to add]** |

> **For judges:** The live prototype has been published on Replit. Optional paid AI inference is disabled in the public demo; the core skills, career-matching, learning-roadmap, SDG, and scenario features remain available. Please verify live access before the final submission.

---

## Overview

### Problem

Students and early-career individuals may find it difficult to understand which career pathways align with their existing skills, what competencies they should develop next, and how to interpret changes associated with AI adoption. Career information and learning resources are often fragmented, making it harder to turn uncertainty into a practical learning plan.

### Solution

**FutureReady** is a web-based career exploration and reskilling prototype. Users enter skills and proficiency levels, together with education, experience stage, interests, and career goals. A transparent, rule-based matching engine compares the entered skills with requirements in **five team-curated career pathways** informed by O*NET and ESCO references. It shows explainable alignment scores, identifies skill gaps, and recommends structured learning steps with curated free or low-cost resources.

FutureReady also provides cited workforce research signals, illustrative remote job listings from the Remotive API, and team-defined **Moderate** and **Fast AI Adoption** scenarios. Optional AI-generated career insights were integrated and tested through **RunPod Serverless**, using an endpoint configured in the RunPod console for **Qwen/Qwen3-4B-Instruct-2507**. The public deployment has a server-side opt-in gate (`RUNPOD_AI_ENABLED`); inference is **off by default** to protect sponsored GPU credits. The core guidance works without paid inference.

FutureReady's primary intended alignment is **SDG 4**, particularly employment-relevant skills and lifelong learning. It also explores potential links to **SDG 8** and **SDG 9**. These are team-defined mappings, not official UN endorsement or independently measured social impact.

### Key Features

The application contains six main pages:

1. **Home** — Overview and entry point for career exploration.
2. **My Skills Profile** — Enter skills, proficiency levels, education, experience, interests, and goals; profile data is saved in browser `localStorage`.
3. **Career Matches** — Compare skills with five curated pathways, view explainable match scores, and identify gaps. Scores are **catalogue-alignment measures, not hiring probabilities**.
4. **My Learning Roadmap** — Follow ordered learning steps, explore curated free or low-cost resources, and track progress in browser `localStorage`.
5. **SDG Mapping** — Explore possible connections between learning, career readiness, and SDGs 4, 8, and 9.
6. **AI Trends & Scenarios** — Review dated research cards, illustrative Remotive listings, and two team-defined AI adoption scenarios; optional RunPod-powered insights are disabled in the public demo.

**Important limitations:** The adoption scenarios are illustrations, not predictions. Remotive listings are delayed individual examples, not representative vacancy statistics. FutureReady does not train or fine-tune its own AI model.

### Tech Stack

| Layer | Technology / Purpose |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL with Drizzle ORM — asynchronous AI insight job-tracking records |
| Browser Storage | `localStorage` — user-entered profile and learning-roadmap progress |
| Career Matching | Team-curated skill/role requirements and explainable rule-based matching |
| External Jobs API | Remotive — illustrative remote job listings, cached by the API |
| AI Model / Serving | Qwen/Qwen3-4B-Instruct-2507, configured on RunPod Serverless with vLLM |
| AI Integration | Optional backend-mediated inference jobs and asynchronous status polling; public submissions disabled by default |
| Package Management | pnpm workspace |
| Development & Hosting | Replit |
| Version Control | Git and GitHub |

---

## Project Structure

This is a **TypeScript/pnpm monorepo**. The application source remains in its existing directories; it has **not** been moved into a new top-level `src/` folder merely to match the generic hackathon template.

```text
FutureReady-AI/
├── artifacts/
│   ├── future-ready-ai/       # React/Vite web app
│   ├── api-server/            # Express API, Remotive and RunPod integrations
│   └── mockup-sandbox/        # Separate development/mockup tooling
├── lib/
│   ├── api-client-react/      # Shared React API client
│   ├── api-spec/              # API definitions
│   ├── api-zod/               # Validation and schemas
│   └── db/                    # PostgreSQL / Drizzle data layer
├── scripts/                  # Development and security-check scripts
├── Submission/               # Competition documents and proof of use
├── README.md                 # This document, at repository root
├── LICENSE                   # Apache License 2.0
├── SECURITY.md               # Security guidance
├── .gitignore
├── .replit
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

> **Folder naming:** `Submission/` reflects the GitHub screenshot supplied for this review. If the folder is renamed to lowercase `submission/`, update all paths in this README to match; GitHub paths are case-sensitive.

### Architecture

```text
User / Browser
   ├── Skills profile + roadmap progress → browser localStorage
   └── React / TypeScript / Vite frontend
         ├── Rule-based career matching + skill gaps
         ├── Curated learning resources + SDG mappings
         ├── Team-defined AI adoption scenarios
         └── Express API
               ├── Remotive API → illustrative job listings (server cache)
               └── Optional AI insight workflow (disabled publicly)
                     ├── PostgreSQL / Drizzle → job tracking
                     └── RunPod Serverless → Qwen model inference
```

The career-match score comes from structured rules, **not** the generative model. PostgreSQL is used for AI job tracking; the inspected application does **not** store the user's full profile in PostgreSQL.

---

## How to Run

### Option 1 — Replit (Recommended)

1. Open the [Replit project](https://replit.com/@patriciacheng07/FutureReady-AI) or import the [GitHub repository](https://github.com/patricia5788/FutureReady-AI) into Replit.
2. Use the project's **pnpm** workspace configuration to install dependencies.
3. Configure the required environment variables, including `DATABASE_URL`, through Replit Secrets. Provision and initialise PostgreSQL for the AI job-tracking schema.
4. Run the configured Replit project workflow and open the app preview.
5. For optional AI integration, configure `RUNPOD_API_KEY` and `RUNPOD_ENDPOINT_ID` as **server-side secrets**. Keep `RUNPOD_AI_ENABLED` unset or false unless reliable public usage controls are in place. Do not commit secrets.

The publicly deployed prototype is available at **https://future-ready-pnj.replit.app**. A successful health check alone does not verify the production database; production behaviour should be tested separately.

### Option 2 — Local Development

Prerequisites: compatible Node.js, pnpm, and a configured PostgreSQL database. The reviewed development runtime used Node.js 24.13.0 and pnpm 10.26.1.

```bash
git clone https://github.com/patricia5788/FutureReady-AI.git
cd FutureReady-AI
pnpm install

# Configure DATABASE_URL locally; never commit real secret values.
# Optional AI: RUNPOD_API_KEY, RUNPOD_ENDPOINT_ID.
# Leave RUNPOD_AI_ENABLED unset for a safe, no-inference demo.

# Run in separate terminals, with the environment/ports required by each artifact:
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/future-ready-ai run dev
```

> **Verification note:** These commands reflect the package scripts, but a complete local end-to-end startup has not been independently verified. The separate `mockup-sandbox` artifact requires its own environment settings, so the root `pnpm run build` should not be presented as a universally verified one-command build.

### Type Checks and Builds

```bash
pnpm run typecheck
pnpm --filter @workspace/future-ready-ai run build
pnpm --filter @workspace/api-server run build
```

These checks passed in the reported pre-publish review. They are not a substitute for browser-based end-to-end tests, production database verification, or external-service checks.

---

## How We Use Replit *(Required)*

- **Development:** Main browser-based workspace for the FutureReady frontend, Express API, and integrated prototype.
- **Replit Agent:** Assisted implementation, iteration, debugging, and presentation preparation; the team reviewed and directed the work.
- **Hosting:** The public prototype is deployed at [future-ready-pnj.replit.app](https://future-ready-pnj.replit.app).
- **Secrets:** RunPod credentials and database connection settings are managed server-side rather than embedded in the public frontend.
- **Sponsor resources:** Official sponsor-provided Replit credits were used for the hackathon project, as declared by the team.

**Proof of use:** Place the Replit workspace and usage screenshots in `Submission/` and link their final filenames here once uploaded.

## How We Use RunPod *(Required)*

- **Purpose:** Optional AI-generated career insights complement the explainable, rule-based career guidance.
- **Endpoint:** RunPod Serverless with vLLM, configured in the provider console for **Qwen/Qwen3-4B-Instruct-2507**.
- **Integration:** The Express backend sends authenticated inference jobs and polls for results; PostgreSQL records job-tracking status and outputs.
- **Validation:** An end-to-end inference test was completed during development; the provider's current availability is not guaranteed by that test.
- **Public safety:** The server-side `RUNPOD_AI_ENABLED` flag defaults to off, so public users cannot trigger new GPU inference jobs while the feature remains disabled.
- **Sponsor resources:** Official sponsor-provided RunPod credits were used for integration and inference testing, as declared by the team.

**Proof of use:** Place the RunPod endpoint overview and Serverless billing/usage screenshots in `Submission/` and link their final filenames here once uploaded. Do not expose API keys, payment information, or private request content.

---

## Challenges & Learnings

- **Explainability:** Kept rule-based career matching separate from optional generative text, so users can inspect the basis of scores.
- **GPU cost control:** Added a server-side opt-in flag to prevent uncontrolled public RunPod submissions.
- **Asynchronous inference:** Implemented job tracking and polling rather than assuming every GPU request finishes immediately.
- **Responsible interpretation:** Clearly labelled career-match scores, job samples, SDG mappings, and AI-adoption scenarios with their limitations.
- **Dependency security:** Updated vulnerable dependencies before publishing. The last reported audit had **0 critical, 1 high, and 1 moderate** advisory; the remaining high finding was in separate mockup development tooling, and the moderate finding was in build-time CSS tooling. This is not a claim that the dependency tree is vulnerability-free.

## Future Improvements

- [ ] Verify all six pages and the production database through an end-to-end public demo test.
- [ ] Add durable request quotas or authentication before enabling public RunPod inference.
- [ ] Continue monitoring and addressing remaining dependency advisories.
- [ ] Expand and independently validate career pathways, skill requirements, and learning resources.
- [ ] Conduct usability testing with students and early-career individuals; measure outcomes rather than assuming impact.
- [ ] Improve accessibility and clarify the assumptions behind workforce scenarios.

---

## Team

| Name | Role | GitHub |
| --- | --- | --- |
| Jessy Chia Jiek Xin | Team Lead | [GitHub profile — to add] |
| Patricia Cheng Jing Xuan | Technical Lead / AI Integration / Documentation | [@patricia5788](https://github.com/patricia5788) |

---

## Submission Checklist

- [x] Team name, domain, and primary SDG track filled in
- [x] Slide deck link included (verify judge viewing permissions)
- [ ] Pitching video (5–7 minutes, including prototype demo) uploaded to YouTube and linked above
- [ ] Replit proof-of-use files uploaded to `Submission/` and linked above
- [ ] RunPod proof-of-use files uploaded to `Submission/` and linked above
- [ ] Preliminary proposal uploaded with team name `PnJ` in its filename
- [ ] Technical & Tools Declaration uploaded with team name `PnJ` in its filename
- [ ] All submission filenames and document links verified
- [ ] Local run instructions verified in the final submission environment
- [ ] Latest published application code synced to GitHub and final secret scan completed
- [ ] Public GitHub repository and live demo access verified for judges

> Check an item only after it has been verified. This README does not establish that the final submission has been made.

## License

This repository includes an [Apache License 2.0](LICENSE) file. The root package metadata previously declared MIT; reconcile that metadata with the intended project license before making a final repository-wide license claim.
