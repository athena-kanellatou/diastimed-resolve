# Current release — policy v0.4 / schema 4

The working prototype includes shared policy configuration, canonical collection guards, consistent task metadata/median checks, reliable newest-valid evidence selection and complete policy exports. Numeric policy defaults and every original benchmark case/result remain unchanged.

33 automated test functions and the reproducible analysis of 39,750 planning cases plus 84 separate gate fixtures passed in [run 43745298382](https://github.com/athena-kanellatou/diastimed-resolve/actions/runs/43745298382) for code revision 3c03eba. The actual 180-second scripted task, schema-4 export, real reload recovery, cached offline workflow and root/project-path browser checks passed. See VERIFICATION.md for exact scope and limits. Subsequent release commits have their own GitHub checks.

AVAILABLE_EVIDENCE.md records the complete available evidence for this release. Historical team-reported usability aggregates are retained with their limitations. An additional 30-person round is reported by the owner (18 first-time, 12 returning); its completion/assistance outcomes are not established by traceable session records. No rate or participant-driven change is claimed for that round. A scoped occupational-health review (OH-01) has been relayed and explicitly confirmed by the owner; exact review date/build and public attribution permission are not supplied. Numerical policy validation and documented prospective V2 evaluation remain pending.

The source package includes the policy register, primary-source mapping, sensitivity inputs/results, expert-review pack and blank prospective forms. Fictional software records and illustrative participant scenarios are excluded from human findings. Physical-device timing, full accessibility and genuine hidden-tab interruption remain unverified.

The text below records historical v0.3 delivery and verification, not the complete current status.

---

# Prototype status · 15 November 2026 · policy v0.3

## Current delivery

A redesigned crew evidence workspace replaces the decorative dashboard. The main view puts evidence acceptance, a single next action, remaining checks and equipment constraints together. Equipment changes show the previous and revised plans and their consequences. Research and development credits remain accessible without interrupting the collection workflow.

Execution now enforces the same prerequisites, device availability, urgent state and remaining allowance at direct entry and at save. Completed checks allocate their declared estimated cost against the session total; interrupted tasks allocate elapsed time. This is allocation accounting, not measured crew workload or proven time savings.

Quality amendments append separate decisions; original observations are retained. Events are no longer truncated at 50. Browser storage is editable and is not an authenticated or tamper-proof audit system. Export schema 3 includes all planner inputs, policy/catalogue snapshots, original observations, quality decisions and raw successful-task response times. The task uses a monotonic timer, ignores held-key repeats, and records early responses and missed cues. Modal keyboard focus is contained and restored; reduced-motion and print styles are included.

## Verification in this revision

23 automated tests pass. Coverage includes all 256 evidence/device/budget combinations, direct-execution guards, cumulative session allowance, original-record preservation, task input validity, and replaying exported planner inputs. TypeScript checking and production build pass.

Production desktop rendering, context capture, device fallback, both-device failure, task closure and a complete 180-second scripted task with downloaded JSON were verified in the public production app. See docs/VERIFICATION.md for exact observations and limits. Offline reload, tab-hidden interruption, mobile hardware and full accessibility checks remain unverified.

## Evaluation boundaries

256 synthetic planning cases: 169 complete RESOLVE plans, 167 fixed order, 169 greedy. RESOLVE and greedy tie on all 169 comparable complete-case costs. Against fixed order: 15 lower declared costs, 152 ties, no higher costs among paired complete cases. Median saving is zero seconds. No patient/astronaut evaluation, measured crew-time benefit or medical approval. Team-reported formative usability results are recorded in USABILITY.md and summarised below.

## Current v0.3 additions

A shared factual review summary now separates accepted observations, measurement limits, missing evidence and the next human-review step. The same summary and optional reviewer question appear in schema 3 exports. It explicitly displays missed/early task responses without declaring performance normal.

Saved-state parsing rejects malformed structures and keeps unreadable stored contents unchanged. Save failures produce a persistent memory-only warning. A task-start checkpoint enables interruption recovery after reload, with capped elapsed allocation and no result. Service-worker caching is restricted to public shell/assets. Seven-slide judging materials, a submission draft, source mapping and independent-review protocols accompany the source.

New checks cover storage failures, malformed saved state, one-time reload recovery, truthful review summaries and service-worker offline fallback with network/cache doubles. That offline test is not a production-browser offline test.

## Submission work remaining

Domain feedback; participant-level usability notes and an itemised revision log; final judging-material review; confirmed challenge fit, local requirements, actual team contributions and submission. Public GitHub Pages links and the seven-page PDF were verified without authentication. Site audience is public; signed-out browser access was verified. This prototype is not NASA-developed, NASA-endorsed, clinically validated or submitted to the competition.

## Dashboard presentation revision · 14 November 2026

A dedicated dashboard now presents the same policy through an evidence overview, proportional session-allocation bar, ordered collection pathway, next action, equipment constraints and recent decision events. Desktop navigation uses a fixed rail and mobile uses labelled tabs. Plan comparisons remain above the pathway. Every displayed number comes from current observations, requirements, events or estimated action allocations; no simulated telemetry, medical risk score or invented trend was added. Review/storage/recovery behaviour and policy v0.3 are preserved.

The 22 existing automated checks pass. A production desktop walkthrough verified dashboard actions, context capture, equipment fallback, blocked evidence, ledger navigation, the review brief and schema 3 export. See docs/VERIFICATION.md for the observations and limits. Prior medical, offline, mobile hardware and independent-review limits still apply.


## Reference-led dark presentation · 14 November 2026

The dashboard now uses charcoal surfaces, locally served Space Grotesk typography, restrained gold accents and a credited NASA Earth-horizon photograph. The next action sits in the first dashboard row beside the review heading. Evidence, review brief, research views and dialogs share the dark presentation. Policy v0.3 and schema 3 remain unchanged. All 22 automated checks and benchmark verification pass. A production desktop walkthrough verified the image loading, context capture, immediate plan revision and incomplete review handoff; details are in VERIFICATION.md. Physical mobile and assistive-technology checks remain outstanding.


## Globe-led mission opening · 14 November 2026

The default page now opens with a full-screen starfield, a centred serif RESOLVE title and a rotating decorative Earth projected from the locally served NASA texture. Three user-controlled chapters explain evidence collection, adaptation and human review. Scrolling moves the globe into a side-by-side composition; workspace entry uses a brief zoom transition. The opening includes a pause control, system reduced-motion support and a static fallback. The canvas renderer is unmounted when the review workspace opens, keeping its animation separate from task timing.

The original review is reachable directly at `/#workspace`; Mission overview returns without clearing observations. Dashboard accents now share the opening's midnight-blue and ice palette. All 22 existing tests pass. Production desktop checks verified the textured globe, chapter navigation, pause toggle, scroll composition and chapter-specific entry into the review brief. See VERIFICATION.md for limits. No new medical capability, validation or measured usability benefit is claimed.


## Formative usability results · reported 15 November 2026

The team reports 13/25 scenario completions before improvements (52%) and 12/15 after revisions (80%). Follow-up participants comprise nine returning testers (8 completions) and six new testers (4 completions). These are team-supplied aggregates, not independently reviewed participant records. Small groups and prior exposure limit inference; no causal redesign effect is established. The proposed protocol, assistance criteria and exact error/change logs were not confirmed. See USABILITY.md. The live research view now separates these results from engineering verification and synthetic review data.
