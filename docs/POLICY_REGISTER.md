# Provisional policy register

Policy **resolve-evidence-v0.4**, export schema **4**. Numerical defaults are unchanged from v0.3. Version change records shared configuration, stricter technical capture checks, canonical actions and deterministic timestamp ties. Historical benchmark and human results are not reclassified as fresh validation.

The complete machine-readable register is `validation/policy-register.csv`. Each entry includes source scope, unsupported inference, actual selection rationale (or **not documented**), failure mode, alternatives, tests, pending reviewer input and status. All numeric windows and allocations remain assumptions; **no reviewer approval** has been received. Analyst alternatives are stress-test values, never medical recommendations.

| ID | Rule | Current value | Alternative / analysis | Scientific status |
|---|---|---|---|---|
| F01 | Sleep freshness | 24h | 12/24/36h | Unvalidated; review pending |
| F02 | Fatigue freshness | 6h | 3/6/12h | Unvalidated; review pending |
| F03 | Context freshness | 6h | 3/6/12h | Unvalidated; review pending |
| F04 | Vigilance freshness | 4h | 2/4/8h | Unvalidated; review pending |
| Q01 | Fatigue question | Custom 0–10 | Reviewer to suggest appropriate instrument | Unvalidated; review pending |
| C01 | Collection completeness | Four accepted fields | Reviewer-scoped alternative workflow | Unvalidated; review pending |
| C02 | Context prerequisite | Before either task | Removing dependency reserved for scoped review | Unvalidated; review pending |
| A01 | Six allocations | 70/35/30/25/180/195s | Self-reports ±20%; cost boundaries | Unvalidated; review pending |
| A02 | Bundle discount | 70 vs 90s individual sum | No discount:90s | Unvalidated; review pending |
| A03 | Tablet overhead | 15s above 180s task | 0/15/30/60s | Unvalidated; review pending |
| T01 | Task duration | 180s | Held fixed here; new timing experiment required | Unvalidated; review pending |
| T02 | Capture minimum | 20 positive responses | 10/20/30 responses | Unvalidated; review pending |
| T03 | Cue timeout | 4000ms | Separate prospective timing experiment | Unvalidated; review pending |
| T04 | Cue delays and polling | 1000–4000ms;25ms polling | Physical hardware/timing calibration | Unvalidated; review pending |
| T05 | Misses and early responses | Record nonnegative integer counts | Reviewer-informed display flags | Unvalidated; review pending |
| T06 | Technical interruption | Hidden/closed/reload: no result | Physical-browser recovery studies | Unvalidated; review pending |
| T07 | Summary | Rounded median of captured times | Reviewer-informed summary; retain raw array | Unvalidated; review pending |
| P01 | Partial-plan objective | Max fields, then min declared seconds | New objective requires separate review | Unvalidated; review pending |
| U01 | Urgent route | Pause routine collection; human procedure | Mission-specific review required | Unvalidated; review pending |
| R01 | Record reuse | Newest accepted; later append wins timestamp tie | Age display and reviewer guidance | Unvalidated; review pending |
| R02 | Quality amendments | Latest appended decision overrides original | Authenticated workflow out of scope | Unvalidated; review pending |

## Technical and interpretive boundaries

The shared task gate separates incomplete/malformed capture from the content of performance. Nonfinite duration, invalid counters/timestamps and mismatched response summary are rejected consistently. High miss counts and early responses remain visible and do not automatically erase poor performance. Meeting the gate is never called normal alertness. No percentage of misses has been chosen as a clinical cutoff.

Assessment, evidence selection, planning, direct-entry/save guards, summaries and exports accept the same explicit `Policy` argument. The normal interface uses DEFAULT_POLICY; analyst configurations are not presented as recommended settings. Export schema 4 retains original observations and exact policy settings including task duration/count/timing/summary/visibility semantics. Storage retains structurally compatible reviews; v0.4 re-assesses user task metadata and may exclude malformed historical observations while retaining them in the export. Older schema-2/3 files remain historical; no automatic JSON import or relabelling is claimed.

Synthetic demonstration vigilance can lack a real task and is labelled as such in the brief. User-entered vigilance requires metadata. This provenance distinction is editable local data, not authentication.

Freshness windows and remaining allowance are recomputed at the fixed analysis clock. A complete plan minimizes declared cost with lexical action-ID tie breaking. Partial plans maximize covered requirements then minimize declared cost; no medical priority weighting exists. Completed-check allocations and actual task duration remain distinct.

See PRIMARY_SOURCE_REVIEW.md for links and inspected scope; SENSITIVITY.md for measured synthetic dependence; DOMAIN_REVIEW_PACK.md for questions that require real expertise.
