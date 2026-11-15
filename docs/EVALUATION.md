# Engineering evaluation

Generated 2026-11-15T17:41:37.242Z

Enumerated engineering scenarios, not patients. Durations and evidence policy are illustrative assumptions.

Of 256 enumerated cases, complete plans: RESOLVE 169, fixed 167, greedy 169.

Among 167 paired-complete RESOLVE/fixed cases: 15 lower-cost, 152 ties, 0 higher-cost. Median declared seconds saved: 0.

Greedy and fixed use the same accepted evidence, action catalogue, capability checks, prerequisites and stopping conditions. The fixed comparator has a predetermined single-field-first ordering; greedy uses newly covered requirements per declared second. These are limited comparator policies, not representative of every clinical checklist.

The cost advantage reflects the assumed bundle and device setup costs. It is not measured crew time, diagnostic performance or a health outcome. Correctness is independently checked against an exhaustive reference on small states in tests/domain.test.ts. Quality/urgent tests are separate. Team-reported formative usability aggregates are documented separately in docs/USABILITY.md; participant-level records are unavailable. No clinical review has been received.

Reproduce: npm test && npm run benchmark
Raw cases: public/benchmark.json. Policy version: resolve-evidence-v0.4.
