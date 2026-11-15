# Submission draft · requires team review

## Project title
DiastiMed RESOLVE

## Short project summary

RESOLVE helps assemble a fatigue-and-alertness review when equipment or session time is limited. It retains usable sleep, fatigue and workload observations, identifies missing evidence, and selects a feasible collection pathway. When a workstation becomes unavailable, it can offer a tablet alternative; when neither device is available, vigilance remains explicitly unresolved. A human-review brief and JSON export preserve observations, limitations, decisions and policy settings. NASA research on sleep, brief vigilance observations and exploration medical support informed the design. The working browser prototype includes an experimental three-minute task, local saving, interruption recovery and reproducible software checks. Freshness windows, task-quality rules and action allocations remain engineering assumptions. RESOLVE does not diagnose, determine fitness for duty or automatically transmit records to a clinician.

## Project Details — ready to paste

A crew member begins a fatigue-and-alertness review. The workstation becomes unavailable halfway through. Which observations can still be collected, and what does the next human reviewer need to know?

RESOLVE turns that disruption into a revised collection plan while preserving the evidence already gathered. It helps a crew member identify the next feasible check, work within the remaining session allowance and hand over an explicit account of unresolved requirements.

The working prototype brings together four observations: sleep, self-reported fatigue, measurement context and a three-minute browser-based vigilance task. A deterministic planning engine checks existing records against an explicit collection policy, reuses usable observations and selects a feasible sequence of remaining checks. The dashboard shows the next action, its estimated time allocation and the reasons evidence is accepted or remains unresolved.

Disable the workstation and RESOLVE selects a tablet alternative when the constraints allow it. Disable both devices and the vigilance requirement remains open. Previously collected observations stay available, and the revised pathway shows exactly where collection can no longer proceed.

The human-review handoff includes recorded observations, timestamps, measurement limitations, unresolved requirements, a reviewer question and the decision trail. A downloadable JSON packet preserves the policy and planning inputs needed to reproduce the result. Original observations remain separate from subsequent quality decisions.

The creative contribution is connecting resource-aware planning with evidence traceability. Every change in equipment, evidence quality or available time has a visible consequence. The intended benefit is less repeated collection and a clearer handoff when reviews are interrupted.

We evaluated the equipment-loss scenario through two rounds of usability testing. Initially, 13 of 25 participants completed it (52%). After revisions, 12 of 15 completed it (80%): eight of nine returning participants and four of six new participants. These historical counts were reported by the team; participant-level records were not independently reviewed. The follow-up groups were small, and returning participants' familiarity limits conclusions about the size of the redesign's effect.

NASA resources on sleep and irregular schedules, ISS psychomotor vigilance testing, Standard Measures and exploration medical decision-support architecture informed the problem framing. Design considerations included crew workload, equipment and communication constraints, interruptions and human oversight.

RESOLVE uses TypeScript, React, Vite, HTML/CSS, Lucide icons and a Canvas Earth visualisation with credited NASA imagery. It runs in a standard browser, saves review progress locally and requires no specialised hardware. GitHub provides public source and automated verification; GitHub Pages hosts the application.

Software verification includes 33 automated tests, preservation of the original 256-case benchmark and reproducible sensitivity analysis of 39,750 synthetic planning cases plus 84 separate task-gate fixtures. An independent permutation reference checks achievable coverage and declared cost in the sensitivity grid. Collection thresholds, action costs and task-quality rules remain provisional. Astronaut usability, clinical validity and measured crew-time benefits have not been established; collection completeness does not represent medical clearance.

ChatGPT and Codex assisted code, documentation, testing and synthetic demonstration content, with disclosures included in the project. No language model runs inside RESOLVE. In-app demonstration scenarios are synthetic; the usability aggregates above were reported by our team from participant testing.

## NASA resources and use
NASA HRP sleep-risk material motivates the sleep/context inputs. The Reaction Self Test record motivates a brief objective observation with low burden. ExMC motivates resource constraints and human-review handoff. Standard Measures motivates considering contextual and objective observations together. The primary PVT-B study motivates the three-minute paradigm but does not validate this browser implementation. Full mapping: EVIDENCE.md.

## Results and limits
256 synthetic cases: RESOLVE 169 feasible complete plans, greedy 169, fixed 167. RESOLVE and greedy tie on all 169 paired-complete costs. Against fixed order: 15 lower-cost, 152 ties, zero higher-cost paired cases. Median assumed saving zero seconds. These are software checks under an illustrative cost model, not patients or measured crew time. No astronaut co-design or clinical validation. A scoped occupational-health review of workflow presentation and human handoff is reported by the owner; its limits are in DOMAIN_REVIEW.md. Team-reported formative usability results: 13/25 initial completions and 12/15 revised completions, including 8/9 returning and 4/6 new participants. Counts, provenance and interpretation limits are in USABILITY.md.

## Current release evidence

Policy v0.4 / export schema 4. The team reports additional participation by 30 volunteers (18 first-time, 12 returning), but the available records do not establish completion or assistance outcomes for that additional round. No additional human completion rate is claimed. A scoped occupational-health review was relayed and confirmed by the owner. Numerical policy validation and documented prospective V2 evaluation remain pending. See AVAILABLE_EVIDENCE.md. The seven-slide PDF/PPTX/images remain a labelled baseline snapshot; the app and current documentation contain the expanded technical verification and sensitivity analysis.

## AI use
ChatGPT/Codex assisted research, concept development, implementation, synthetic scenarios, design, documentation, test design and judging materials. No model operates in the application. Clinical review demonstrations use synthetic observations; the usability panel displays team-reported human-participant aggregates. No NASA endorsement or clinical approval is implied. Full disclosure: AI_USE.md.

## Team contributions (fill with actual confirmed names)
- [Name]: [work personally performed and verified]
- [Name, if applicable]: [work personally performed and verified]
Do not attribute AI-generated work or invented teammate roles as independent human work.

## Links
App: https://athena-kanellatou.github.io/diastimed-resolve/
Source: https://github.com/athena-kanellatou/diastimed-resolve
Judging slides: https://athena-kanellatou.github.io/diastimed-resolve/judging.html
Seven-page PDF: https://athena-kanellatou.github.io/diastimed-resolve/DiastiMed_RESOLVE_judging.pdf

## Final owner checklist
Confirm team membership and Athens-specific requirements. Check the live form's current demo format, NASA resource eligibility and disclosure fields. Open app/source/demo/download links signed out. Read every claim against final VERIFICATION.md. Replace team placeholders with facts. Submit for judging, verify the final success state and retain the version. This draft has not been submitted.

## Questions judges may ask
Why space? NASA describes limited crew time, equipment and delayed Earth support. We demonstrate collection under those constraints; we do not claim an operational spacecraft integration.
What is distinctive? Inspectable evidence acceptance, execution guards, constraint changes, interruption recovery and reproducible handoff in one narrow workflow. No global-first claim.
Why no LLM? The current rules are small and explicit. Deterministic execution is sufficient and inspectable.
Does it beat greedy? No cost advantage appears in the current benchmark. Reliability and explanation are the contribution being demonstrated.
What happens after four observations? Human review of facts and limitations, with manual export. Collection completeness is not clearance.
What needs validation? Medical policy, browser measurement timing and quality rules, representative user workflows and operational integration. Formative usability aggregates are reported separately from clinical and operational validation.
