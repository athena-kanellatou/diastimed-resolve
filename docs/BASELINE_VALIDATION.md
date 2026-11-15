# Validation baseline and issue report

Inspected 15 November 2026. Repository main was `39e4034d1ed40bb9b385c1eee82359c6e2215078`, matching the supplied handoff. Fresh checkout had no local changes and no AGENTS.md. Work began on `validation/policy-sensitivity`. Local runtime: Node 24.22.1; CI remains pinned to Node 22. No live submission or new human evidence was observed.

| Finding | Evidence | Independent action |
|---|---|---|
| Generator contradicts reported usability and hard-codes v0.2 | scripts/benchmark.ts | Correct generator and regenerate; retain every original case/result |
| Root-hosting-only instructions are stale | REPRODUCE.md vs working base-aware URLs and CI | Document root and repository subpath builds |
| Task save checks allow nonfinite duration/counters and inconsistent median | recordCheck's original comparison guards | Shared finite, integer, timestamp and median checks at save and later assessment |
| Caller can supply a modified Check object | eligibility/recordCheck trusted caller fields | Resolve action by ID from the active policy |
| Task parameters implicit in UI and incomplete export snapshot | ReactionTask and packet | Shared typed policy; schema 4 snapshot includes task settings |
| Original oracle omits partial plans and spent allowance | tests/domain.test.ts | Separate permutation reference plus new coverage/cost tests |
| Equal timestamp records select earlier insertion | evidence stable sort | Prefer later append when timestamps tie, retaining older usable fallback |
| Invalid timestamp disrupts valid-record sorting | Reproduced newest/bad/older ordering selected older | Sort invalid dates last; regression test |
| Human aggregates lack individual observations | USABILITY.md | Preserve historical counts; prepare prospective study separately |
| Clinician/human-factors review absent | Owner handoff | Prepare review pack; status stays pending |

Numeric defaults remain 24/6/6/4 hours, 70/35/30/25/180/195 seconds, 180-second task and 20-response minimum. No clinical interpretation was added. v0.4 marks technical validation/export semantics; it does not relabel historical validation. The pinned seven-slide assets and restoration dependency are retained.
