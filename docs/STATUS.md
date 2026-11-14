# Prototype status · 14 November 2026 · policy v0.2

## Current delivery

A redesigned crew evidence workspace replaces the decorative dashboard. The main view puts evidence acceptance, a single next action, remaining checks and equipment constraints together. Equipment changes show the previous and revised plans and their consequences. Research and development credits remain accessible without interrupting the collection workflow.

Execution now enforces the same prerequisites, device availability, urgent state and remaining allowance at direct entry and at save. Completed checks allocate their declared estimated cost against the session total; interrupted tasks allocate elapsed time. This is allocation accounting, not measured crew workload or proven time savings.

Quality amendments append separate decisions; original observations are retained. Events are no longer truncated at 50. Browser storage is editable and is not an authenticated or tamper-proof audit system. Export schema 2 includes all planner inputs, policy/catalogue snapshots, original observations, quality decisions and raw successful-task response times. The task uses a monotonic timer, ignores held-key repeats, and records early responses and missed cues. Modal keyboard focus is contained and restored; reduced-motion and print styles are included.

## Verification in this revision

15 engine tests pass. Coverage includes all 256 evidence/device/budget combinations, direct-execution guards, cumulative session allowance, original-record preservation, task input validity, and replaying exported planner inputs. TypeScript checking and production build pass.

Production desktop rendering, context capture, device fallback, both-device failure, task closure and a complete 180-second scripted task with downloaded JSON were verified in the public production app. See docs/VERIFICATION.md for exact observations and limits. Offline reload, tab-hidden interruption, mobile hardware and full accessibility checks remain unverified.

## Evaluation boundaries

256 synthetic planning cases: 169 complete RESOLVE plans, 167 fixed order, 169 greedy. RESOLVE and greedy tie on all 169 comparable complete-case costs. Against fixed order: 15 lower declared costs, 152 ties, no higher costs among paired complete cases. Median saving is zero seconds. No patient/astronaut evaluation, measured crew-time benefit, medical approval or human usability study.

## Submission work remaining

Independent task rehearsal and domain feedback; final demo recording; source/licence/dependency/credits review; accessible judge links; confirmed challenge fit, local requirements and submission. Site audience is public; signed-out browser access was verified. This prototype is not NASA-developed, NASA-endorsed, clinically validated or submitted to the competition.
