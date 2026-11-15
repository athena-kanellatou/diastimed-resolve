# Validation finding → decision → change → follow-up

ENG entries are engineering/source-inspection findings. The separately identified OH-01 entry records an owner-confirmed professional review; no entry represents newly recorded participant outcomes.

| ID | Observation and evidence | Decision / change | Follow-up |
|---|---|---|---|
| ENG01 | Generator says no usability study and v0.2 despite reported aggregates | Correct generator provenance; regenerate unchanged 256-case results | Original cases and summaries compared with baseline |
| ENG02 | Validation values split across domain and UI | Shared policy configuration; schema 4 exact snapshot; no numeric default change | Policy replay, fixed-clock sensitivity and boundary checks |
| ENG03 | NaN duration/counters and mismatched median not consistently rejected | Shared technical gate at save and assessment; canonical actions resolved by ID | Malformed/legacy task tests and actual-duration scripted browser retest |
| ENG04 | Same-time observations can retain earlier appended record | Prefer later append on exact timestamp ties, retain older usable fallback | Explicit tie and invalid-newer tests |
| ENG05 | Complete-only oracle, zero spent comparator | Independent ordered-permutation coverage/cost reference; shared fair comparators | Partial coverage, nonzero spent and monotonicity checks |
| ENG07 | Invalid timestamp can disrupt ordering of valid evidence (reproduced newest/bad/older ordering) | Sort invalid dates last; choose newest accepted valid record | Invalid-date selection regression |
| ENG06 | Root-only reproduction claim stale | Correct commands and describe exact remaining hardware/accessibility limits | Root and project-base production builds |

Scoped occupational-health review OH-01: **received, relayed and confirmed by the owner**. See DOMAIN_REVIEW.md. Numerical policy endorsement and clinical validation remain unestablished. Fresh-participant findings: **pending**. No code change is attributed to an expert or volunteer without actual feedback. Resulting engineering commit is recorded in git history; add real reviewer/participant finding IDs and exact change SHAs when available.

## Scoped review → team decision → change → follow-up

| Review reference | Team decision | Resulting change | Follow-up |
|---|---|---|---|
| OH-01-A/B/C | Retain separation of reports/context/task, explicit gaps and human interpretation | No medical-policy change; preserve existing evidence/brief behaviour | Further numerical/measurement review remains open |
| OH-01-D | Reinforce the manual-download boundary; do not infer measured comprehension from the reviewer statement | Export notification states that a download was requested and nothing was sent; persistent explanation beside review export | Professional re-review and actual user comprehension testing not performed yet |

The new export wording is a team decision following the review themes, not a documented request to fix a particular observed participant failure. No effectiveness claim is made.
