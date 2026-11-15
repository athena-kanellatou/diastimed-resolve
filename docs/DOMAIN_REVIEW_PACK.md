# RESOLVE — focused expert review pack

**Requested review, not approval. Status: pending.** Prepared 15 November 2026. Allow roughly 20–30 minutes, or record the actual method/duration. Build under review must be the exact SHA recorded in the reviewer form; the public main may differ from a proposed branch.

## Purpose and limits

RESOLVE retains accepted observations, identifies missing fields, chooses feasible collection steps under equipment and declared-time constraints, and exports a factual brief for human review. The scope is a narrow fictional fatigue/alertness review. Four collected fields are software completeness, not health, normal alertness or fitness for duty. No diagnosis, treatment, runtime model, live astronaut records, baseline calibration or automated clinician transmission exists.

Live baseline: https://athena-kanellatou.github.io/diastimed-resolve/#workspace
Source: https://github.com/athena-kanellatou/diastimed-resolve
Run the reviewed branch locally when reviewing proposed changes. Follow REPRODUCE.md. Do not assume main contains this branch until merged/deployed.

## Walkthrough (about five minutes)

1. Load **Fatigue review**. Identify the sleep/fatigue observations and missing context/vigilance.
2. Record the synthetic context: “End of a routine shift; task devices initially available; no interruptions reported.”
3. Disable workstation. Inspect tablet fallback and 15 extra assumed seconds.
4. Disable tablet. Identify the unresolved vigilance observation.
5. Open the review brief; identify facts, limits and next human action. Export JSON. Nothing is sent to a clinician.
6. Inspect the synthetic packets in `validation/examples/`: complete collection, equipment-loss gap and a 23-response/16-miss task. They are authored examples, not reviewers, volunteers or measured human results.

## Current provisional evidence rules

| Field | Maximum age | Method / units | Permitted value |
|---|---:|---|---|
| Sleep | 24h | self-report-v1 / hours | Finite 0–24 |
| Fatigue | 6h | self-report-v1 / /10 | Finite 0–10, custom descriptive question |
| Context | 6h | self-report-v1 / note | Nonempty text |
| Vigilance | 4h | pvt-inspired-v1 / ms | Positive response median; user task metadata required |

Timestamps must be valid and not future; quality must be usable; method and units must match. Exact age cutoffs are accepted. A newer rejected record does not erase older accepted evidence; amendments preserve originals. Task recording now requires finite full duration, minimum response count, integer nonnegative miss/early counts, valid completion time and agreement between stored median and response array. Browser data remain editable and unauthenticated.

| Collection action | Declared seconds | Device / prerequisite |
|---|---:|---|
| Check-in bundle | 70 | None; sleep + fatigue + context |
| Sleep report | 35 | None |
| Fatigue report | 30 | None |
| Context report | 25 | None |
| Workstation task | 180 | Workstation and accepted context |
| Tablet task | 195 | Tablet and accepted context |

Default allowance 360 seconds. Completed actions consume declared allocations; interruptions consume capped elapsed seconds. Tablet duration remains 180 seconds; 15 seconds is assumed overhead. No measured workload benefit is claimed.

## Why these sources are here

| Primary source | Bounded support | Does not establish |
|---|---|---|
| NASA sleep-risk page | Motivation to attend to sleep/schedules | 24/6/4h windows or our scale |
| NASA Standard Measures | Examples of diverse measurements | These four fields or completeness |
| NTRS 20090029851, abstract | Need for brief objective observations | This browser task's validity |
| NTRS 20220017869, abstract | Exploration support architecture | Our plan's medical optimality |
| Basner et al. 2011, methods §§2.2–2.3 | Published laboratory PVT-B protocol | Equivalence of our stimuli, counters, summary or hardware |

See POLICY_REGISTER.md and PRIMARY_SOURCE_REVIEW.md for links and exact limits. The full-paper methods were inspected to identify differences, not to transfer clinical validation.

## Questions needing your judgement

1. Is the stated narrow workflow understandable and potentially useful? Which context is missing?
2. Do “usable”, “accepted”, “complete”, icons or colours imply clearance? Identify exact screens/wording.
3. What evidence could justify freshness windows, and which settings should remain explicitly provisional?
4. Should age, original records or uncertainty be more prominent in the brief?
5. How should capture completeness, technical validity, poor performance and interpretation limits be distinguished?
6. Is a 23-response/16-miss session clearly limited? Could excluding poor performance bias the record? How should misses, early taps and device latency be conveyed?
7. Is context before the task appropriate? Which decisions must remain human and mission-specific?
8. Could unresolved/rejected evidence be overlooked in the handoff? Is urgent-help routing appropriately scoped?
9. What single change should block another usability round? What validation study would be necessary before operational use?

Do not supply favourable answers on the reviewer's behalf. Record uncertainty and disagreement.

## Feedback and permission form

Use the blank CSVs or this structure. Review ID ___; actual date ___; prototype SHA ___; policy version ___; role ___; relevant experience ___; scope ___; inspected materials ___; method and actual duration ___.

For each finding: exact problem and location ___; category (blocking misunderstanding / major workflow / scientific uncertainty / minor wording / future validation) ___; rationale or source ___; recommended change ___; severity ___; unresolved question ___.

Permission choices: anonymous role description only / named attribution allowed / no public attribution. Quotation permission: yes for specified quotation(s) / no. These choices must be made by the real reviewer, separately from participation. Record follow-up and whether revised wording/workflow was actually revisited.

## Draft outreach (not sent)

Hello [name], I am developing RESOLVE, a small research prototype for the NASA Space Apps health-monitoring challenge. It helps assemble observations for human review when equipment or session time is limited. It does not diagnose or assess fitness for duty. Would you be willing to review a five-minute demonstration and comment on the wording, missing context and handling of uncertain task evidence? A 20–30 minute review would be helpful. I would document the scope accurately and ask separately before using your name or quoting feedback. The review materials use synthetic observations only.
