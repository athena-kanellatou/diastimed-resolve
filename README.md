# DiastiMed RESOLVE

[![Verify RESOLVE](https://github.com/athena-kanellatou/diastimed-resolve/actions/workflows/verify.yml/badge.svg)](https://github.com/athena-kanellatou/diastimed-resolve/actions/workflows/verify.yml)

[Live demo](https://diastimed-resolve.appealingholly1.chatgpt.site/) · [Verification record](docs/VERIFICATION.md) · [Reproduce locally](docs/REPRODUCE.md)

Research prototype for NASA Space Apps 2026, Create Health Monitoring Software for Astronauts on Space Missions. Team: DiastiMed; Athens.

An explainable evidence-collection planner: retain usable observations, find missing evidence, guide a check, replan when resources change, and export a traceable review. Evidence completeness is not medical clearance.

## Run

`npm ci` · `npm run dev` · `npm run build` · `npm test` · `npm run benchmark`

## What is real

The deterministic planner, quality gates, form inputs, three-minute browser task, persistence and exports are implemented software. Mission scenarios are synthetic. The task is PVT-inspired and unvalidated. Action durations and freshness windows are engineering assumptions. NASA research sources motivate the design; they do not validate the app. No AI model operates at runtime.

## Research

See docs/EVIDENCE.md, docs/SCOPE.md, docs/STATUS.md and docs/EVALUATION_PLAN.md. The demonstration sequence is in docs/DEMO_RUNBOOK.md. Source links and boundaries also appear in the interface. Core data stay on the device; there is no analytics or automated transmission. Avoid entering personal medical data into this prototype.

## AI assistance

OpenAI ChatGPT/Codex assisted with research, concept development, code, styling and software verification. Synthetic mission records and explanatory text were AI-assisted. No NASA affiliation or endorsement is implied. No clinical validation or external reviewer approval is claimed.

## Session accounting and exports

Completed checks allocate their declared estimated duration; interrupted tasks allocate elapsed seconds. The planner uses the remaining session allowance. Export schema 3 records all planner inputs, catalogue/policy settings, quality amendments and successful-task response times, factual review summary and reviewer question. Original records are retained but browser-local data are not authenticated or tamper-proof. Existing reviews with compatible structure can be read; historical allocation is unknown and starts at zero.

## Demo and independent reproduction

Live demonstration: https://diastimed-resolve.appealingholly1.chatgpt.site/

Use Node.js 22 and `npm ci` for locked dependencies. See [reproduction instructions](docs/REPRODUCE.md), [current verification status](docs/STATUS.md) and [demo runbook](docs/DEMO_RUNBOOK.md). GitHub Actions configuration is included in `.github/workflows/verify.yml`; the first remote verification run passed installation, all tests, benchmark reproduction, source packaging and the production build. See [the verified run](https://github.com/athena-kanellatou/diastimed-resolve/actions/runs/43608783282).

Project code is MIT licensed. See [LICENSE](LICENSE), [third-party notices](THIRD_PARTY_NOTICES.md) and [development disclosure](AI_USE.md). Research materials are linked and are not relicensed by the project.

## Judging and review

[Seven-slide judging deck](https://diastimed-resolve.appealingholly1.chatgpt.site/judging.html) · [Submission draft](docs/SUBMISSION_DRAFT.md) · [Challenge fit](docs/CHALLENGE_FIT.md) · [Independent review protocols](docs/REVIEW_PROTOCOL.md).

The v0.3 brief separates facts, limits and next steps. Storage failure remains visible. Reload recovery saves no task result. Neither the brief nor the browser task makes a clinical assessment. Full current verification and unresolved checks are in docs/VERIFICATION.md.

## Dashboard

The review workspace shows data-bound evidence values, collection readiness, estimated session allocations, an ordered pathway, the next eligible check and recent activity. Equipment changes surface the previous and revised plans. No health score or invented physiological trend is shown.


The dark dashboard uses locally served Space Grotesk type and a credited NASA Earth-horizon photograph. The next action sits beside the main workspace heading; all evidence and estimated-time displays remain bound to the current review. Asset sources and licences are in THIRD_PARTY_NOTICES.md.
