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
