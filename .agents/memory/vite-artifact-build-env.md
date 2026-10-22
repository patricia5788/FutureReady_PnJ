---
name: Vite artifact build environment
description: Local build requirements for the FutureReady AI Vite artifact.
---

Set both `PORT` and `BASE_PATH` when running the Vite build directly from a shell. The artifact preview workflow supplies them from its artifact configuration, but a bare `pnpm ... build` may fail before Vite starts.

**Why:** The local build config explicitly requires these values, so a missing `PORT` or `BASE_PATH` looks like a build failure even though the application code is valid.

**How to apply:** Use the values from the FutureReady AI artifact configuration for standalone build checks; do not add them to application source code.
