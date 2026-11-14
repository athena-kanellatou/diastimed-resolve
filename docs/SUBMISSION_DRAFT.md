# Submission draft · requires team review

## Project title
DiastiMed RESOLVE

## Summary
DiastiMed RESOLVE helps a crew member assemble a fatigue-and-alertness review when observations, equipment and routine time are constrained. It checks the provenance and usability of existing evidence, proposes the remaining collection steps, and revises the plan when a device becomes unavailable. Missing evidence remains explicit. A human-review brief separates recorded facts, measurement limitations and the next review step, with a reproducible export. NASA research on sleep, brief alertness observations and exploration medical autonomy informs the design. The browser prototype uses synthetic scenarios and an experimental reaction task. Verification covers 256 planning combinations. No clinical validation, measured crew-time saving or optimisation advantage over greedy is claimed.

## Approach
React and TypeScript share one deterministic domain engine across the interface, verification and benchmark. The small catalogue uses explicit evidence requirements, prerequisites, equipment and remaining allocation. Execution checks apply at entry and save. Separate quality amendments retain originals. Reload checkpoints reject interrupted tasks and allocate elapsed time. Local persistence and a service worker support resilience; browser/offline observations and limits are recorded in VERIFICATION.md. Review summaries are factual, with no diagnostic thresholds or treatment generation.

## NASA resources and use
NASA HRP sleep-risk material motivates the sleep/context inputs. The Reaction Self Test record motivates a brief objective observation with low burden. ExMC motivates resource constraints and human-review handoff. Standard Measures motivates considering contextual and objective observations together. The primary PVT-B study motivates the three-minute paradigm but does not validate this browser implementation. Full mapping: EVIDENCE.md.

## Results and limits
256 synthetic cases: RESOLVE 169 feasible complete plans, greedy 169, fixed 167. RESOLVE and greedy tie on all 169 paired-complete costs. Against fixed order: 15 lower-cost, 152 ties, zero higher-cost paired cases. Median assumed saving zero seconds. These are software checks under an illustrative cost model, not patients or measured crew time. No astronaut co-design, independent usability study or clinical review.

## AI use
ChatGPT/Codex assisted research, concept development, implementation, synthetic scenarios, design, documentation, test design and judging materials. No model operates in the application. Actual application screenshots show synthetic software states. No NASA endorsement or clinical approval is implied. Full disclosure: AI_USE.md.

## Team contributions (fill with actual confirmed names)
- [Name]: [work personally performed and verified]
- [Name, if applicable]: [work personally performed and verified]
Do not attribute AI-generated work or invented teammate roles as independent human work.

## Links
App: https://diastimed-resolve.appealingholly1.chatgpt.site/
Source: https://github.com/athena-kanellatou/diastimed-resolve
Judging slides: /judging.html on the app origin (verify after publication).

## Final owner checklist
Confirm team membership and Athens-specific requirements. Check the live form's current demo format, NASA resource eligibility and disclosure fields. Open app/source/demo/download links signed out. Read every claim against final VERIFICATION.md. Replace team placeholders with facts. Submit for judging, verify the final success state and retain the version. This draft has not been submitted.

## Questions judges may ask
Why space? NASA describes limited crew time, equipment and delayed Earth support. We demonstrate collection under those constraints; we do not claim an operational spacecraft integration.
What is distinctive? Inspectable evidence acceptance, execution guards, constraint changes, interruption recovery and reproducible handoff in one narrow workflow. No global-first claim.
Why no LLM? The current rules are small and explicit. Deterministic execution is sufficient and inspectable.
Does it beat greedy? No cost advantage appears in the current benchmark. Reliability and explanation are the contribution being demonstrated.
What happens after four observations? Human review of facts and limitations, with manual export. Collection completeness is not clearance.
What needs validation? Medical policy, browser measurement timing and quality rules, real-world usability and operational integration.
