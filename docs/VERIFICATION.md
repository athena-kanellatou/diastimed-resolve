# Verification record · 14 November 2026

## Local engine/build checks

15 tests pass, including an independent exhaustive comparison across 256 evidence/device/budget combinations. Checks include direct-entry prerequisites, device availability, urgent routing, cumulative time allocation, preservation of original observations, successful-task response requirements and exported-input replay. TypeScript checking and production build pass. Benchmark reproduction matches every committed case and summary; timestamps are excluded from comparison.

## Observed production browser walkthrough

The public demo loaded in a browser without ChatGPT sign-in after access was changed to public. The rendered desktop workspace was inspected. Urgent routing paused collection even with a complete evidence set. A keyboard check confirmed reverse-Tab stayed inside the scenario dialog and Escape restored focus to its trigger; this is not a full accessibility audit.

- Direct vigilance entry was disabled while context was missing.
- Saving synthetic context changed usable evidence from 2/4 to 3/4 and reduced the session allowance from 6:00 to 5:35.
- Workstation loss substituted the 3:15 tablet task for the 3:00 workstation task and displayed the 15-second estimated difference and device-comparison limitation.
- Loss of both devices left vigilance unresolved and the review incomplete.
- Closing an active task saved no vigilance result and recorded 94 elapsed seconds against the allowance.
- A separate full task ran for 180 real seconds. Browser automation supplied 23 responses; 16 cues were missed and zero early responses were recorded. The task completed, allocated 180 seconds and changed the review to 4/4 observations.
- The downloaded JSON was inspected: schema 2, complete plan, 180-second duration, all 23 response times, five original observations (including the expired synthetic task record), 180 seconds allocated and 180 seconds remaining.

These are scripted UI checks on synthetic scenarios. The response times are not a human performance result, device calibration, usability study or clinical validation. Opening another cloud-browser tab did not reliably simulate tab hiding, so the visibility-interruption path was not verified by that attempt; task closure was verified separately.

## Remaining checks

Production offline reload and a complete offline workflow; actual tab-hidden interruption; keyboard-only and assistive-technology assessment; real mobile hardware and timing; an independent usability exercise; domain review of policy assumptions. A clean extraction of the source archive installed from the lockfile and passed all 15 tests and the production build. Source is published at https://github.com/athena-kanellatou/diastimed-resolve. GitHub Actions run 43608783282 succeeded for source commit 57c0c604f890b8a8efce330e77e58d31eab0b470, including all 15 tests, benchmark reproduction, source packaging and production build. Later changes must be judged by their own workflow results.

## v0.3 verification additions

22 automated tests pass, including new saved-state validation, quota/read failures, capped one-time reload recovery, summary limitations and shipped service-worker cache/fallback behaviour using test doubles. The independent planner benchmark still agrees with every saved case.

The preview browser verified the new factual summary and source links, context input, reduced allowance and task start. A direct reload attempt was blocked by the browser URL policy. No workaround was attempted. Therefore the new reload interaction is verified at the domain/storage level, not by that browser attempt. Production offline reload, genuine tab-hidden interruption, physical mobile timing and screen-reader use remain unverified.

Prior v0.2 full-task and production observations above remain historical evidence. They are not relabelled as a fresh full-task test of v0.3.


## Dashboard presentation verification · 14 November 2026

The published desktop dashboard was inspected at a 1348-pixel viewport. The page had no horizontal overflow (document scroll width and client width both 1348). This is a desktop browser observation, not a mobile or accessibility audit.

- Loading the synthetic fatigue scenario showed 2/4 accepted observations, a 3:25 planned collection and a 6:00 allowance.
- The next-action button opened the context form. Saving synthetic context updated readiness to 3/4, planned collection to 3:00 and remaining allowance to 5:35. The allocation bar exposed 25 allocated, 180 planned and 155 unallocated seconds.
- Workstation loss revised the next action to the 3:15 tablet alternative, with the previous/revised comparison and +15-second estimated consequence visible above the pathway.
- Disabling both devices left vigilance unresolved, displayed no eligible check and kept three accepted observations. The prominent next action opened the incomplete human-review brief.
- An evidence overview card opened the ledger, where vigilance entry remained disabled while its device was unavailable.
- The downloaded JSON used schema 3 and included the entered synthetic reviewer question, factual review summary, evidence, plan, resources, events and session accounting.

All 22 automated checks, TypeScript checking, production build and benchmark snapshot reproduction passed for the dashboard source. No policy or task-timing change was introduced, and the historical full-task walkthrough above was not repeated for this presentation revision. Physical mobile use, assistive technology, production offline reload and genuine tab-hidden interruption remain unverified. Independent usability and domain review remain necessary.
