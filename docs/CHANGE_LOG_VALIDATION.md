# Validation finding → decision → change → follow-up

All entries below are engineering/source-inspection findings, not external reviewer or participant findings.

| ID | Observation and evidence | Decision / change | Follow-up |
|---|---|---|---|
| ENG01 | Generator says no usability study and v0.2 despite reported aggregates | Correct generator provenance; regenerate unchanged 256-case results | Original cases and summaries compared with baseline |
| ENG02 | Validation values split across domain and UI | Shared policy configuration; schema 4 exact snapshot; no numeric default change | Policy replay, fixed-clock sensitivity and boundary checks |
| ENG03 | NaN duration/counters and mismatched median not consistently rejected | Shared technical gate at save and assessment; canonical actions resolved by ID | Malformed/legacy task tests and actual-duration scripted browser retest |
| ENG04 | Same-time observations can retain earlier appended record | Prefer later append on exact timestamp ties, retain older usable fallback | Explicit tie and invalid-newer tests |
| ENG05 | Complete-only oracle, zero spent comparator | Independent ordered-permutation coverage/cost reference; shared fair comparators | Partial coverage, nonzero spent and monotonicity checks |
| ENG06 | Root-only reproduction claim stale | Correct commands and describe exact remaining hardware/accessibility limits | Root and project-base production builds |

External review findings: **pending**. Fresh-participant findings: **pending**. No code change is attributed to an expert or volunteer without actual feedback. Resulting engineering commit is recorded in git history; add real reviewer/participant finding IDs and exact change SHAs when available.
