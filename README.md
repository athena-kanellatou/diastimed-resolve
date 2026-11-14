# DiastiMed RESOLVE

Research prototype for NASA Space Apps 2026, Create Health Monitoring Software for Astronauts on Space Missions. Team: DiastiMed; Athens.

An explainable evidence-collection planner: retain usable observations, find missing evidence, guide a check, replan when resources change, and export a traceable review. Evidence completeness is not medical clearance.

## Run

`npm install` · `npm run dev` · `npm run build` · `npm test` · `npm run benchmark`

## What is real

The deterministic planner, quality gates, form inputs, three-minute browser task, persistence and exports are implemented software. Mission scenarios are synthetic. The task is PVT-inspired and unvalidated. Action durations and freshness windows are engineering assumptions. NASA research sources motivate the design; they do not validate the app. No AI model operates at runtime.

## Research

See docs/EVIDENCE.md, docs/SCOPE.md, docs/STATUS.md and docs/EVALUATION_PLAN.md. The demonstration sequence is in docs/DEMO_RUNBOOK.md. Source links and boundaries also appear in the interface. Core data stay on the device; there is no analytics or automated transmission. Avoid entering personal medical data into this prototype.

## AI assistance

OpenAI ChatGPT/Codex assisted with research, concept development, code, styling and software verification. Synthetic mission records and explanatory text were AI-assisted. No NASA affiliation or endorsement is implied. No clinical validation or external reviewer approval is claimed.

## Session accounting and exports

Completed checks allocate their declared estimated duration; interrupted tasks allocate elapsed seconds. The planner uses the remaining session allowance. Export schema 2 records all planner inputs, catalogue/policy settings, quality amendments and successful-task response times. Original records are retained but browser-local data are not authenticated or tamper-proof. Existing v1 reviews can be read into v2; historical allocation is unknown and starts at zero.

## Demo and independent reproduction

Live demonstration: https://diastimed-resolve.appealingholly1.chatgpt.site/

Use Node.js 22 and `npm ci` for locked dependencies. See [reproduction instructions](docs/REPRODUCE.md), [current verification status](docs/STATUS.md) and [demo runbook](docs/DEMO_RUNBOOK.md). GitHub Actions configuration is included in `.github/workflows/verify.yml`; remote CI execution remains pending until the package is pushed to GitHub.

Project code is MIT licensed. See [LICENSE](LICENSE), [third-party notices](THIRD_PARTY_NOTICES.md) and [development disclosure](AI_USE.md). Research materials are linked and are not relicensed by the project.
