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
| GitHub Repository | https://github.com/patricia5788/FutureReady_PnJ — public access not verified |
| Replit Project | https://replit.com/@patriciacheng07/FutureReady-AI |
| **Live Demo** | **https://future-ready-pnj.replit.app** — returned HTTP 200 on 24 October 2026; this does not verify every feature or the production database |
| Canva Slide Deck | [Existing editor link](https://www.canva.com/design/DAHY0HTktfI/pwP9jJQ4hNrNyMCeQAuHrw/edit) — judge-view link and access are not verified |
| Pitching Video (5–7 minutes, including prototype demo) | **YouTube link outstanding** |

> **For judges:** The prototype is published on Replit and its live URL returned HTTP 200 on 24 October 2026. Optional paid AI inference is disabled in the public demo; the core skills, career-matching, learning-roadmap, SDG, and scenario features remain available. This check does not replace a full browser or production-data test.

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
2. **My Skills Profile** — Enter skills, proficiency levels, experience, interests, and goals; profile data is saved in browser `localStorage`.
3. **Future Skills Radar** — Compare saved profile skills with clearly labelled synthetic skill scores.
4. **Career Matches** — Compare skills with curated pathways, view explainable match scores, and identify gaps. Scores are **catalogue-alignment measures, not hiring probabilities**.
5. **My Learning Roadmap** — Follow ordered learning steps, explore curated free or low-cost resources, and track progress in browser `localStorage`.
6. **AI Trends & Scenarios** — Review dated research cards, illustrative Remotive listings, and two team-defined AI adoption scenarios; optional RunPod-powered insights are disabled in the public demo.

SDG Mapping is available as a supporting page linked from relevant career and learning views.

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

## Data Sources and Third-Party Attribution

- **O*NET:** The five pathways are team-curated using linked [O*NET OnLine references](https://www.onetonline.org/): [Software Developers](https://www.onetonline.org/link/summary/15-1252.00), [Data Scientists](https://www.onetonline.org/link/summary/15-2051.00), [Information Security Analysts](https://www.onetonline.org/link/summary/15-1212.00), and the [O*NET Career Finder](https://www.onetonline.org/find/career?c=060100). Some skill descriptions are summarized or adapted from those references; pathway levels and rationales are team-defined. Review of the local career-skills CSV and runtime catalog did not establish that a versioned O*NET Database was downloaded or copied, and did not establish the provenance of every phrase. No O*NET database version is claimed. O*NET OnLine content is generally available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), subject to its [license exceptions](https://www.onetonline.org/help/license); attribution must credit O*NET OnLine and the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA), link the license, and identify changes. O*NET® is a trademark of USDOL/ETA, which has not approved or endorsed FutureReady.
- **ESCO:** The cloud-computing skill references the European Commission’s [ESCO classification](https://ec.europa.eu/esco). This service uses the ESCO classification of the European Commission. FutureReady’s cloud/network pathway is team-curated and adapted; it is not an official ESCO occupation. See the [ESCO reuse conditions](https://esco.ec.europa.eu/en/about-esco/faq), which require this acknowledgement for services using ESCO and require adaptations to be identified.
- **Remotive:** Illustrative listings come from the [Remotive Remote Jobs Public API](https://remotive.com/remote-jobs/api). The UI credits Remotive and links each listing to its original Remotive URL, as required by the [API terms](https://remotive.com/remote-jobs/api). Remotive says listings are delayed by about 24 hours.
- **Qwen:** Optional hosted inference uses [Qwen/Qwen3-4B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507), whose model card identifies its license as [Apache-2.0](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507/blob/main/LICENSE). The model is served through RunPod; the model weights are not included in this repository.
- **Google Fonts:** The frontend loads [DM Sans](https://fonts.google.com/specimen/DM+Sans) and [Fraunces](https://fonts.google.com/specimen/Fraunces) from Google Fonts. This is an external browser resource. Both font families are distributed under the [SIL Open Font License 1.1](https://openfontlicense.org/); see the [DM Sans](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt) and [Fraunces](https://github.com/google/fonts/blob/main/ofl/fraunces/OFL.txt) notices.
- **Dependency license inventory:** See [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md) for a preliminary package license metadata inventory, not a complete legal clearance. It includes two nested test-fixture manifests (`benchmarks` and `transport`) that are not lockfile dependencies.

---

## Project Structure

This is a **TypeScript/pnpm monorepo**. The application source remains in its existing directories; it has **not** been moved into a new top-level `src/` folder merely to match the generic hackathon template.

```text
FutureReady_PnJ/
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
├── THIRD_PARTY_LICENSES.md    # Preliminary dependency license metadata inventory
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

1. Open the [Replit project](https://replit.com/@patriciacheng07/FutureReady-AI) or import the [GitHub repository](https://github.com/patricia5788/FutureReady_PnJ) into Replit.
2. Use the project's **pnpm** workspace configuration to install dependencies.
3. Configure the required environment variables, including `DATABASE_URL`, through Replit Secrets. Provision and initialise PostgreSQL for the AI job-tracking schema.
4. Run the configured Replit project workflow and open the app preview.
5. For optional AI integration, configure `RUNPOD_API_KEY` and `RUNPOD_ENDPOINT_ID` as **server-side secrets**. Keep `RUNPOD_AI_ENABLED` unset or false unless reliable public usage controls are in place. Do not commit secrets.

The publicly deployed prototype is available at **https://future-ready-pnj.replit.app**. A successful health check alone does not verify the production database; production behaviour should be tested separately.

### Option 2 — Local Development

Prerequisites: compatible Node.js, pnpm, and a configured PostgreSQL database. The reviewed development runtime used Node.js 24.13.0 and pnpm 10.26.1.

```bash
git clone https://github.com/patricia5788/FutureReady_PnJ.git
cd FutureReady_PnJ
pnpm install

# Configure DATABASE_URL locally; never commit real secret values.
# Optional AI: RUNPOD_API_KEY, RUNPOD_ENDPOINT_ID.
# Leave RUNPOD_AI_ENABLED unset for a safe, no-inference demo.

# Run in separate terminals, with the environment/ports required by each artifact:
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/future-ready-ai run dev
```

> **Verification note:** The workspace TypeScript checks and the FutureReady frontend and API production builds passed during an earlier project-preparation run. They were not rerun for this documentation-only update and do not replace a browser end-to-end test, production database verification, or external-service checks.

### Type Checks and Builds

```bash
pnpm run typecheck
pnpm --filter @workspace/future-ready-ai run build
pnpm --filter @workspace/api-server run build
```

These checks passed during an earlier project-preparation run; they were not rerun for this documentation-only update. They are not a substitute for browser-based end-to-end tests, production database verification, or external-service checks.

---

## How We Use Replit *(Required)*

- **Development:** Main browser-based workspace for the FutureReady frontend, Express API, and integrated prototype.
- **Replit Agent:** Assisted implementation, iteration, debugging, and presentation preparation; the team reviewed and directed the work.
- **Hosting:** The public prototype is deployed at [future-ready-pnj.replit.app](https://future-ready-pnj.replit.app).
- **Secrets:** RunPod credentials and database connection settings are managed server-side rather than embedded in the public frontend.
- **Sponsor resources:** Official sponsor-provided Replit credits were used for this project.

**Proof of use:** Local files `Submission/SDC2026_PnJ_Replit_POU.pdf` and `Submission/SDC2026_PnJ_Runpod_POU.pdf` are present. Verify their contents and confirm whether they have been uploaded to the final submission portal; external upload status is not verified.

## How We Use RunPod *(Required)*

- **Purpose:** Optional AI-generated career insights complement the explainable, rule-based career guidance.
- **Endpoint:** RunPod Serverless with vLLM, configured in the provider console for **Qwen/Qwen3-4B-Instruct-2507**.
- **Integration:** The Express backend sends authenticated inference jobs and polls for results; PostgreSQL records job-tracking status and outputs.
- **Validation:** An end-to-end inference test was completed during development; the provider's current availability is not guaranteed by that test.
- **Public safety:** The server-side `RUNPOD_AI_ENABLED` flag defaults to off, so public users cannot trigger new GPU inference jobs while the feature remains disabled.
- **Sponsor resources:** Official sponsor-provided RunPod credits were used for integration and inference testing.

**Proof of use:** The local RunPod proof-of-use PDF is `Submission/SDC2026_PnJ_Runpod_POU.pdf`. Verify its contents and confirm whether it has been uploaded to the final submission portal; external upload status is not verified. Do not expose API keys, payment information, or private request content.

---

## Challenges & Learnings

- **Explainability:** Kept rule-based career matching separate from optional generative text, so users can inspect the basis of scores.
- **GPU cost control:** Added a server-side opt-in flag to prevent uncontrolled public RunPod submissions.
- **Asynchronous inference:** Implemented job tracking and polling rather than assuming every GPU request finishes immediately.
- **Responsible interpretation:** Clearly labelled career-match scores, job samples, SDG mappings, and AI-adoption scenarios with their limitations.
- **Dependency security:** The latest preparation audit reports one high advisory in Zod (the current v3 validation dependency; the patched release is v4.6.6 or later, so upgrading requires a major-version compatibility review) and one moderate advisory in `postcss-selector-parser` (frontend build tooling pinned by the current typography package). Compatible updates were applied to `body-parser`, `fast-uri`, and `prosemirror-view`. Re-run the audit before release; a successful build does not prove the dependency tree is vulnerability-free.

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
- [ ] Canva judge-view link obtained and access verified; the README currently has an editor link only
- [ ] Pitching video (5–7 minutes, including prototype demo) uploaded to YouTube and linked above
- [ ] Verify the local `Submission/SDC2026_PnJ_Replit_POU.pdf` and `Submission/SDC2026_PnJ_Runpod_POU.pdf`, then confirm upload to the final submission portal
- [ ] Confirm the existing `Submission/SDC2026_PnJ_Preliminary.docx` and `Submission/SDC2026_PnJ_TechDeclaration.docx` are uploaded to the final submission portal
- [ ] All submission filenames and document links verified
- [ ] Local run instructions verified in the final submission environment
- [ ] Latest published application code synced to GitHub and final secret scan completed
- [ ] Public GitHub repository access verified for judges; unauthenticated access was not confirmed
- [x] Live demo URL returned HTTP 200 on 24 October 2026 (full feature and production database checks remain outstanding)

> Check an item only after it has been verified. This README does not establish that the final submission has been made.

## License

This repository is licensed under the [Apache License 2.0](LICENSE).
