# Policy sensitivity — reproducible synthetic analysis

Baseline: **resolve-evidence-v0.4**. Fixed clock: 2026-11-15T12:00:00.000Z. Fixture set: resolve-sensitivity-fixtures-v1. No participants or clinical outcomes.

| Analysis | Cases |
|---|---:|
| freshness | 15552 |
| cost | 24192 |
| urgent | 6 |
| Counterfactual task gates (separate) | 84 |

Across **39750 planning cases**, relative to the unchanged default numeric policy on the same inputs: **12960 field acceptance flips**, **6704 next-action changes**, **2405 complete/incomplete feasibility transitions**, and **11854 declared-cost changes**. These deliberately selected grid frequencies do not estimate real-world risk or benefit. Cost differences may compare different coverage and must not be called time savings.

The 81 freshness configurations use sleep 12/24/36h, fatigue and context 3/6/12h, and vigilance 2/4/8h. Eight observation-age profiles include exact cutoffs and one-second-above-default ages. Each is crossed with four device states, three budgets and zero/25 spent seconds. Cost analysis crosses seven catalogues, 16 evidence masks, four device states, 18 near-boundary allowances and zero/25/70 spent seconds. Task duration stays 180s; tablet overhead alone varies to 0/30/60s, alongside the default 15s. Self-report allocations vary ±20%; the no-discount bundle uses 90s.

All 39750 planning cases agree with a separate ordered-permutation reference on maximum achievable coverage and minimum declared cost, including incomplete plans. 6804 assertions check exact cutoffs (±1ms), timestamps, methods, units and quality. 48754 assertions check tightening freshness, increasing remaining allowance and restoring equipment. 88 exported policy/input packets replay evidence, plan and brief. These are assertions and enumerated cases, not separate human trials or individual test functions.

Task gates: 84 counterfactual authored records cross minimum 10/20/30 with 9/10/19/20/23/29/30 responses, zero/16 misses and zero/five early responses. Misses and early responses remain visible; they do not determine capture validity. The accepted 23-response/16-miss fixture demonstrates why capture acceptance cannot be called normal alertness. No alternative cue timing was reconstructed.

## Reproduce and inspect

Run `npm run sensitivity`, or `npm run sensitivity:check` to regenerate in memory and compare every saved byte. No timestamp noise or random seed is used. `public/sensitivity/config.json` contains the exact baseline policy, explicit per-configuration overrides, profiles, bounds and fixed clock. `inputs.json.gz` holds compressed authored input states, separate from calculated output. `cases.ndjson.gz` holds one JSON record per planning case and joins input_id to inputs and policy_id to config. `task-gates.json` holds the separate gate cases. `summary.json` includes per-policy counts and the uncompressed case SHA-256. Use Python gzip or Node zlib to read the cases. Original 256-case benchmark is preserved separately.

## Boundaries

The model is sensitive to deliberately varied assumptions; this analysis identifies that dependence, not medically correct values. No domain reviewer has endorsed the windows or capture rules. The reference shares the evidence assessor and action catalogue, so agreement cannot validate their scientific appropriateness. Device/input latency, physical hardware and real workload remain unvalidated. Read POLICY_REGISTER.md for source scope and DOMAIN_REVIEW_PACK.md for unresolved questions.
