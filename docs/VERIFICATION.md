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
