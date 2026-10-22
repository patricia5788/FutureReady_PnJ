# PivotPath

> **An AI career-pivot and reskilling guide for the AI era, helping IT graduates identify transferable skills, explore suitable careers, and plan their next learning steps.**

---

## Team Information

| Field | Details |
| --- | --- |
| **Team Name** | PnJ |
| **Team Domain** | Domain 1 — Future-Ready Workforce |
| **SDG Track (1–17)** | **SDG 4 — Quality Education (Main)**; supporting **SDG 8 — Decent Work and Economic Growth** and **SDG 9 — Industry, Innovation and Infrastructure** |
| **Team Leader** | Jessy Chia Jiek Xin |
| **University** | Multimedia University |
| **Number of Members** | 2 |

## Links

| Resource | Link |
| --- | --- |
| GitHub Repository | https://github.com/patricia5788/FutureReady-AI |
| Replit Project | https://replit.com/@patriciacheng07/FutureReady-AI |
| Live Demo | [Add deployed public URL after publishing] |
| RunPod Endpoint | `https://api.runpod.ai/v2/glhbbue9orpxzb` (API endpoint; requires authentication) |
| Slide Deck | [Add slide deck link] |
| Demo Video | [Add video link] |

---

## Overview

### Problem

Artificial intelligence is changing workforce skill requirements faster than many graduates can adapt. **IT graduates seeking to pivot into AI-related careers**, including data analytics and cybersecurity, often struggle to understand how their existing skills transfer, which roles are realistic, and which competencies to develop first. Career advice and learning resources can be fragmented or generic, while rapidly changing technology trends add uncertainty. Without clear and explainable guidance, graduates risk spending time on training that does not align with their career goals.

### Solution

**PivotPath** is a web-based career exploration and reskilling guide that connects an IT graduate's self-reported skills with career pathways and actionable learning priorities. The application uses a **transparent, rule-based matching approach** to compare skills against curated career requirements, explain match scores, identify skill gaps, and recommend an ordered learning roadmap.

To complement the structured recommendations, PivotPath integrates **Qwen3-4B-Instruct on RunPod Serverless** for optional, contextual **AI Career Insights**. The application submits inference jobs through its backend, checks their status asynchronously, and displays generated guidance alongside the explainable core recommendations. Users can also compare **Moderate** and **Fast AI Adoption** planning scenarios to reflect on how different assumptions might affect future skill priorities. These scenarios are illustrative, **not forecasts or guarantees of employment**.

PivotPath's primary contribution is to **SDG 4, particularly Target 4.4**, by supporting access to employment-relevant skills and clearer learning pathways. It also aligns with **SDG 8** through career-readiness support and **SDG 9** through practical use of AI-enabled digital infrastructure.

### Key Features

- **My Skills Profile** — A guided profile for recording skills and proficiency levels as the starting point for career exploration.
- **Explainable Career Matches** — Rule-based career alignment scores that help users understand why a role may fit their current capabilities.
- **Skill Gap Analysis** — Highlights missing or underdeveloped competencies for a selected career path.
- **My Learning Roadmap** — Prioritises recommended learning steps to help users move from their current skills toward a target role.
- **AI Career Insights** — Optional personalised explanations generated using a Qwen model hosted on RunPod Serverless; the core career-matching features do not depend on the model being available.
- **AI Trends & Scenarios** — Compares Moderate and Fast AI Adoption scenarios with clear limitations; these are planning tools rather than employment predictions.
- **SDG Mapping** — Explains how the platform and relevant skill development connect to SDG 4, SDG 8 and SDG 9.

### Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Career Matching | Curated skill/role records and explainable rule-based matching |
| AI Model | Qwen/Qwen3-4B-Instruct-2507 |
| AI / Compute | RunPod Serverless GPU inference, vLLM |
| AI Integration | Backend-mediated asynchronous job submission and status polling |
| Package Management | pnpm workspace |
| Hosting / Dev | Replit (development; public deployment link pending) |
| Version Control | Git and GitHub |

---

## Project Structure

The repository is a **TypeScript/pnpm monorepo**, rather than the Python example shown in the submission template. The following shows its principal application directories; submission evidence folders can be added as they are prepared.

```text
.
├── artifacts/
│   ├── future-ready-ai/        # React/Vite frontend (working directory name)
│   ├── api-server/             # Express backend and API routes
│   └── mockup-sandbox/         # Development mockup workspace
├── lib/
│   ├── api-client-react/       # Shared frontend API client
│   ├── api-spec/               # Shared API definitions
│   ├── api-zod/                # API validation and schemas
│   └── db/                     # PostgreSQL / Drizzle data layer
├── scripts/                   # Project scripts and checks
├── .gitignore                 # Excludes sensitive local files
├── .replit                    # Replit project configuration
├── pnpm-workspace.yaml        # Workspace configuration
├── pnpm-lock.yaml             # Locked dependencies
├── package.json               # Root scripts
├── LICENSE                    # Apache License 2.0
└── README.md                  # This file

# To add before final submission (not claimed to exist yet):
# submission/SDC2026_PnJ_Preliminary.pdf
# submission/SDC2026_PnJ_TechDeclaration.pdf
# submission/SDC2026_PnJ_Replit_POU.pdf
# submission/SDC2026_PnJ_Runpod_POU.pdf
```

### Architecture

```text
IT Graduate / User
       |
       v
React + TypeScript Frontend (Replit)
       |
       v
Express / TypeScript API
       |------------------------------|
       v                              v
Career matching, skill gaps      PostgreSQL
and learning roadmap             (application data,
       |                          AI job tracking)
       |
       +---- Optional AI Career Insights ---->
                  RunPod Serverless
                  Qwen3-4B-Instruct
                         |
                         v
                  Async job status polling
                         |
                         v
                  AI insight displayed to user
```

The core matching and learning-roadmap experience uses structured logic. RunPod provides optional generative explanations, not the underlying career-match score.

---

## How to Run

### Option 1 — Run on Replit (Recommended)

1. Open the [Replit Project](https://replit.com/@patriciacheng07/FutureReady-AI), or import the [GitHub repository](https://github.com/patricia5788/FutureReady-AI) into Replit.
2. Install workspace dependencies using **pnpm**, as configured by the repository.
3. Configure the required **Replit Secrets**, including `DATABASE_URL`, `RUNPOD_API_KEY` and `RUNPOD_ENDPOINT_ID`, according to the application's actual environment configuration. **Never commit real values.**
4. Provision and initialise the PostgreSQL database as required by the application's schema.
5. Start the configured **Project** workflow in Replit. The `.replit` configuration uses a project workflow, not the Python `src/main.py` command shown in the generic template.
6. Open the app preview. The core career features should remain available even when optional RunPod inference is not running.

> **Deployment status:** A public live demo URL has not yet been supplied. Running the development preview does not automatically mean the app is publicly deployed.

### Option 2 — Run Locally

Prerequisites: Node.js compatible with the project, pnpm, and access to a configured PostgreSQL database.

```bash
# 1. Clone the repository
git clone https://github.com/patricia5788/FutureReady-AI.git
cd FutureReady-AI

# 2. Install dependencies
pnpm install

# 3. Configure environment variables locally (never commit secrets)
# Set DATABASE_URL, RUNPOD_API_KEY and RUNPOD_ENDPOINT_ID
# as required by the backend configuration.

# 4. Build/type-check the workspace
pnpm run build

# 5. Start the API (from its workspace package)
pnpm --filter @workspace/api-server run dev

# 6. In a separate terminal, start the frontend
pnpm --filter @workspace/future-ready-ai run dev
```

> Local startup steps are based on the checked-in package scripts; the full local environment and database setup should be tested before marking them as verified.

### Run Tests

```bash
# Type-check and build
pnpm run typecheck
pnpm run build
```

Additional integration and scenario tests should be run using the project's maintained test scripts. Do not treat a successful build as proof that all external integrations or production deployment have been tested.

---

## How We Use Replit *(Required)*

- **Development:** Replit was used as the main browser-based development workspace for the React/TypeScript frontend, Express API and integrated prototype.
- **Replit Agent:** Assisted with implementation, iterative debugging, API integration and improvements to the optional AI-insights workflow.
- **Database:** The application uses PostgreSQL for application persistence and AI inference job tracking.
- **Secrets:** Sensitive API credentials and database connection details are managed through Replit Secrets rather than being hard-coded in the public source.
- **Version Control:** Git commits created during development were pushed from Replit to GitHub, preserving the development history.
- **Hosting:** Public deployment is pending; add the verified live URL once the application is published and tested.

📄 Proof of use: `submission/SDC2026_PnJ_Replit_POU.pdf` **[To add]**

## How We Use RunPod *(Required)*

- **Workload:** Optional personalised career-guidance text generation using **Qwen/Qwen3-4B-Instruct-2507**.
- **Setup:** The model was configured for GPU inference with **vLLM** on **RunPod Serverless**.
- **Integration:** The Replit Express backend sends authenticated inference requests to RunPod; the API key is stored as a secret and is not exposed to the browser.
- **Asynchronous execution:** The backend submits a job, stores its tracking state, and polls the RunPod status endpoint. The frontend displays the result when it becomes available.
- **Graceful fallback:** If the model is unavailable, the structured career matches and roadmap remain useful without AI-generated insights.
- **Validation:** A real end-to-end AI insight generation test was completed during development; this is not a claim that the service is continuously available in production.

Example request shape (illustrative; replace the prompt with a suitable application input):

```bash
curl -X POST "https://api.runpod.ai/v2/$RUNPOD_ENDPOINT_ID/run" \
  -H "Authorization: Bearer $RUNPOD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":{"prompt":"Give concise reskilling advice for an IT graduate interested in data analytics."}}'
```

**Never put a real RunPod API key in this repository or screenshots.**

📄 Proof of use: `submission/SDC2026_PnJ_Runpod_POU.pdf` **[To add]**

---

## Challenges & Learnings

- **Balancing explainability with generative AI:** We separated transparent career-match scoring from optional model-generated explanations, so users can understand the basis of recommendations.
- **Handling GPU cold starts and asynchronous jobs:** We implemented background job tracking and status polling instead of relying on a single long-running request.
- **Maintaining useful behaviour during inference outages:** The application keeps rule-based career guidance available when the RunPod model is not ready.
- **Protecting credentials and development history:** We added sensitive-file exclusions and secret scanning, then preserved both the main and agent development branches in GitHub.
- **Interpreting uncertain trends responsibly:** AI adoption scenarios are presented as illustrative assumptions, not validated forecasts of hiring demand.

## Future Improvements

- [ ] Complete public deployment, production database setup and end-to-end verification.
- [ ] Address dependency audit findings before a public release.
- [ ] Expand and periodically verify career, skill and learning-resource references.
- [ ] Conduct pilot usability tests against the proposal's **Phase 2 target**: at least 80% of users receiving a career list and learning pathway within 10 minutes. This is a **target, not a measured outcome**.
- [ ] Improve source coverage, accessibility and transparency around scenario assumptions.

## Team

| Name | Role | GitHub |
| --- | --- | --- |
| [Member 1 — to fill in] | [Role — to fill in] | [GitHub — to fill in] |
| [Member 2 — to fill in] | [Role — to fill in] | [GitHub — to fill in] |

---

## Submission Checklist

- [x] Team name, domain and primary SDG track filled in
- [ ] Slide deck link added
- [ ] Demo video link added
- [ ] Replit used, with proof of use in `submission/`
- [ ] RunPod used, with proof of use in `submission/`
- [ ] Preliminary submission completed (`SDC2026_PnJ_Preliminary.pdf`)
- [ ] Technology declaration completed (`SDC2026_PnJ_TechDeclaration.pdf`)
- [ ] Submission files renamed with team name **PnJ**
- [ ] "How to Run" steps verified on the final submission environment
- [ ] Final secret scan confirmed before switching the repository to Public
- [ ] Public demo and GitHub access verified for judges

## License

This project is licensed under the [Apache License 2.0](LICENSE).
