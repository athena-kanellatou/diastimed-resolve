# Primary source review and provenance

Inspected 15 November 2026. Sources motivate design; none validates the app. No research PDF or full paper is relicensed or bundled. The following are bounded paraphrases, not quotations.

| Source and inspected scope | Supported design use | Unsupported inference |
|---|---|---|
| [NASA sleep risk](https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/), programme description | Sleep/schedule context motivates the topic | Exact freshness hours or a medical decision rule |
| [NASA Standard Measures](https://www.nasa.gov/reference/standard-measures/), description | Diverse observations motivate a combined view | Our four-field completeness policy |
| [NTRS 20090029851](https://ntrs.nasa.gov/citations/20090029851), public abstract only | Brief objective observation with low burden is a research need | Equivalence to an ISS instrument |
| [NTRS 20220017869](https://ntrs.nasa.gov/citations/20220017869), public abstract only | Resource-aware exploration support motivates constraints | Our planner's medical optimality or architecture compliance |

[Basner, Mollicone & Dinges 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3197786/), full primary article, especially methods §§2.2–2.3 and discussion: the laboratory brief task used dedicated hardware, 1–4s intervals including feedback, a 30s nonresponse signal, response/false-start criteria and multiple outcome measures. RESOLVE uses browser polling, a 4s cue timeout, accepts positive captured times and summarizes their rounded median. It is therefore an unvalidated inspired interaction, not a replicated PVT-B instrument. Matching three-minute duration cannot transfer the paper's validation. This comparison does not select medical cutoffs.

The numeric windows, allocations, twenty-response collection gate, context prerequisite and four-field requirement have no documented direct validation source. Their historical numeric selection rationale is **not documented**. Engineering purposes are stated in POLICY_REGISTER.md without inventing retrospective scientific justification.
