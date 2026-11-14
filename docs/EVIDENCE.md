# Evidence ledger — prototype v0.2

NASA HRP sleep-risk material supports recording sleep and work context. NASA Standard Measures supports viewing subjective and objective observations together. NASA Reaction Self Test research motivates a short vigilance observation. Basner et al. 2011 studied a three-minute PVT-B. None validates this app, its browser timing or its planning policy.

| Policy | Classification | Boundary |
|---|---|---|
| Sleep record within 24 hours | Engineering assumption | Not a flight-medicine limit |
| Fatigue/context within 6 hours | Engineering assumption | Custom descriptive self-report |
| Vigilance within 4 hours | Engineering assumption | No fitness-for-duty claim |
| Check durations | Illustrative cost model | Not measured crew performance |
| All four observations collected | Software completeness | Not healthy, safe or cleared |
| PVT-inspired three-minute task | Experimental browser interaction | Not a validated PVT-B implementation |
| Device alternative | Collection capability | Device results are not necessarily comparable |

Primary URLs, supported uses and limitations are maintained in `src/domain.ts` and exposed in the app and export. Synthetic mission observations are labelled synthetic. User-entered observations stay in browser storage; exports are manual.

No clinical reviewer has approved this policy. No real astronaut dataset or medical prediction is claimed. Urgent routing only instructs the user to contact the crew medical officer and follow the mission-approved procedure; it does not supply treatment instructions.

Browser-task quality rule: require at least 20 captured responses over the full three-minute session; a cue times out at four seconds. These are engineering heuristics, not validated PVT-B criteria. Interrupting tab visibility cancels the session.

Design rationale checked against NASA HRP sleep-risk material and NTRS records 20090029851 and 20220017869 on 14 November 2026. NASA identifies minimal measurement burden and limited crew time/communication as needs; the implemented collection pathway is our own provisional design. No astronaut co-design has been performed.

Session budget now accounts for declared completed-check allocations and elapsed interrupted-task time. This accounting is an engineering policy. Quality amendments preserve original observations, and export schema 2 includes a policy snapshot and successful-task response arrays.

## Claim to source to implementation mapping · v0.3

All rows below are provisional design mapping unless marked published finding or verified software. Source sections refer to the linked public page/record, not an uninspected full protocol. A source motivating a need does not validate our derived rule.

| ID | Claim or rule | Primary source / section / context | Supported use and boundary | Implementation | Status |
|---|---|---|---|---|---|
| E01 | Sleep disruption and workload matter in spaceflight | NASA sleep-risk page, formal risk description, astronauts | Motivates sleep/fatigue inputs; supplies no app thresholds | domain.ts requirements sleep/fatigue | Published finding, design use provisional |
| E02 | Brief objective observations with minimal burden are a NASA research need | NTRS 20090029851 abstract, BHP risk gaps, ISS research | Motivates a short vigilance observation; does not validate browser task | checks workstation-task/tablet-task | Published need |
| E03 | Exploration medical support faces crew-time and communication constraints | NTRS 20220017869 abstract, ExMC architecture | Motivates resources and human handoff; does not make our plan medically optimal | plan, eligibility, reviewSummary | Published context |
| E04 | A three-minute PVT-B was studied under controlled sleep deprivation | PMID 22025811 abstract, 74 healthy terrestrial subjects | Supports paradigm motivation only; browser timing, stimuli, minimum count and missed-cue treatment differ | ReactionTask | Published study, implementation unvalidated |
| E05 | Subjective/contextual and objective evidence can be viewed together | NASA Standard Measures programme description | Motivates displayed observations; does not prescribe these four requirements | requirements, reviewSummary facts | Design interpretation |
| A01 | Sleep 24h, fatigue/context 6h, vigilance 4h acceptance windows | No validation source | Configured engineering windows, not flight-medicine limits | requirements.maxAgeHours, assess | Assumption, no domain approval |
| A02 | Declared check allocations and a finite session allowance | ExMC motivates constraint, not numbers | Illustrative allocations; no observed crew-time benefit | checks.seconds, remainingBudget | Assumption |
| A03 | Minimum 180s and 20 responses with 4s cue timeout | No validation source for this combination | Collection rule only; review summary displays misses/early taps rather than declaring performance normal | ReactionTask, recordCheck, reviewSummary | Unvalidated heuristic |
| A04 | Four accepted fields satisfy collection requirements | Authored demonstration policy | Evidence completeness, never health clearance | plan.status complete, brief | Assumption |
| S01 | Execution blocks unavailable devices, missing prerequisites and exhausted allowance | Domain test cases, current source | Software behaviour within finite policy, not clinical validation | eligibility, recordCheck | Automated checks |
| S02 | Reload interruption retains no result and accounts for elapsed seconds once | recovery.test.ts and browser walkthrough record | Software recovery with capped wall-clock allocation; clock/device limits remain | recoverInterrupted, storage.ts | Automated checks; see VERIFICATION.md for UI status |
| S03 | Handoff separates observations, limits and next review step | Authored text, source roles E01–E04 | Factual review aid with no normal ranges, diagnosis or treatment | reviewSummary, packet schema 3, review UI | Automated checks |
| S04 | Greedy ties RESOLVE on all 169 comparable complete cases | public/benchmark.json, scripts/benchmark.ts | Finite synthetic model only | EVALUATION.md | Reproducible software result |

Review status: no independent domain approval for A01–A04 or the handoff wording. No personal baseline, clinically validated fatigue scale, astronaut data or operational health inference is present. Browser storage is editable.
