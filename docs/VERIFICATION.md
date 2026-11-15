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


## Reference-led dark presentation verification · 14 November 2026

The production desktop browser loaded the locally served NASA photograph (natural width 1041 pixels) and dark dashboard with the next action in its first row. Document scroll width and client width both measured 1348 pixels. The scenario dialog and incomplete human-review brief were visually inspected in the dark theme.

The moved Start check button opened the context form. Saving synthetic context changed accepted observations from 2/4 to 3/4, allocated 25 estimated seconds and left 5:35. Workstation loss selected the 3:15 tablet alternative and displayed the +15-second comparison above the collection pathway. Loss of both task devices preserved the vigilance gap; the review brief remained incomplete and displayed recorded observations, limits and the next human-review step.

The change preserves the planner, storage and task engine. All 22 automated tests, benchmark verification, TypeScript checking and production build pass. Asset provenance and font licensing are in THIRD_PARTY_NOTICES.md. These observations do not establish mobile hardware, screen-reader, clinical or production-offline performance. The previous schema 3 download and historical full-task checks remain identified under their own revisions above.


## Globe-led opening verification · 14 November 2026

The supplied Pinterest video was inspected as a composition and motion reference. The published RESOLVE opening was visually checked at a 1348-pixel desktop viewport. The rotating textured globe, central title, adjacent chapter controls and side-by-side scroll section rendered. Scroll width and client width both measured 1348 pixels. The canvas had no fallback class during the successful check.

- The next-chapter control changed RESOLVE to REVIEW, with the corresponding copy and review destination.
- The pause control changed to Resume motion and exposed its pressed state.
- The down control scrolled to the approach section and repositioned the globe beside the text.
- Starting from the REVIEW chapter opened the existing incomplete review brief at `/#workspace`, preserving the synthetic sleep/fatigue observations, missing context/vigilance, full allowance and prior event.

All 22 existing automated engine/storage/offline-double checks passed. TypeScript checking and production builds passed. These checks do not establish motion performance on physical mobile hardware, keyboard/screen-reader accessibility, actual reduced-motion media-query behaviour, static fallback behaviour or production-offline operation. No full task-timing test was repeated; the task engine is unchanged and the decorative renderer is removed when entering the workspace. Earlier production interaction and schema-3 checks above retain their own scope.


## Submission disclosure metadata · 15 November 2026

Machine-readable SI credits were added to package.json, public/development-credits.json, the HTML head and exported review packets. The source archive includes the credits file. They distinguish SI-assisted code and authored synthetic scenarios from user-entered observations and deterministically computed benchmark results. No generative image/video model or generated audio was used. The judging PDF was checked with a PDF parser: seven pages; Author metadata acknowledges AI-assisted development. An anonymous request to the raw public GitHub PDF returned HTTP 200. Collection policy and benchmark cases are unchanged.

## Project-path hosting — 15 November 2026

Public file links, globe texture loading and service-worker registration now use Vite's build base. The judging page returns to its own directory. GitHub Actions builds the application for `/diastimed-resolve/` and deploys it through GitHub Pages only after verification succeeds; root hosting remains supported.

Local verification: 23 tests passed, including offline cache/navigation doubles for both `/` and `/diastimed-resolve/`, with navigation outside the project scope ignored. TypeScript and the project-path production build passed. Built HTML/CSS asset references and the judging return link were checked against actual output files. These doubles do not establish production-browser offline operation.


## Team-reported formative usability results · 15 November 2026

The team supplied aggregate equipment-loss scenario results: initial 13/25 completions (52%); revised 12/15 (80%), comprising 8/9 returning and 4/6 new participants. These reports are distinct from scripted browser checks and the synthetic planner benchmark. Counts and percentages were checked arithmetically; participant-level records, assistance criteria, exact errors and revision details were not provided for review. The live research view, current status, review-protocol status, README and submission draft now reflect the report. Historical verification sections above retain their original scope. No clinical, astronaut or causal redesign validation is added. See USABILITY.md.

## Policy v0.4 extension — local checks, 15 November 2026

Work branch: validation/policy-sensitivity, based on main 39e4034. Local Node 24.22.1. 33 automated test functions pass, including 1,280 additional permutation-reference combinations in the policy test, technical task checks, timestamp ties and legacy loading. Root and /diastimed-resolve/ TypeScript/production builds pass. The original benchmark reproduces every saved case/result (169 RESOLVE, 169 greedy, 167 fixed). Sensitivity reproduces all saved artifact bytes: 39,750 planning cases plus 84 separate counterfactual task-gate fixtures; details/assertion totals are in SENSITIVITY.md.

Nine presentation assets were restored and their pinned SHA-256 checks passed. No deck exporter or presentation redesign was performed. The released seven-slide deck remains the previously verified baseline; it does not claim new expert/V2 results.

A local Chromium launch failed before opening the app because the environment disallowed its socket operation. The supported cloud browser then could not reach the local preview (connection refused). Neither is a passed browser check. A real-duration workflow script and a Node-22 GitHub CI browser step are prepared; actual remote results must be recorded separately. No physical hardware, full keyboard/screen-reader, real crew workload or clinical validation is claimed.

Expert review: pending. Prospective V2 pilot/freeze/main sessions: pending. Synthetic examples and parameter grids are excluded from human findings.

### First remote extension run

[Run 43744653051](https://github.com/athena-kanellatou/diastimed-resolve/actions/runs/43744653051), commit ec026d8, Node 22.23.4 / Chromium headless shell 151: unit tests, original benchmark comparison, sensitivity reproduction, pinned presentation restoration, source packaging and build passed. The **root-hosted** browser workflow passed context/allocation, tablet overhead, both-device gap, schema-4 manual export, sensitivity UI, limited modal focus/Escape, genuine reload recovery, an actual 180-second scripted task, task limitations, cached offline reload/workflow, and no document overflow at 390/768/1440 CSS pixels. No uncaught browser errors were observed. This is software verification using synthetic observations, not human testing.

Hidden-document interruption was unavailable: headless Chromium reported the original document still visible after opening another tab. The script did not synthesize a visibility event or claim a pass. The first project-path run failed before loading the workspace; the runner was reusing its root-configured preview process after rebuilding. The revised runner starts a dedicated preview with the project base on a separate port and retains artifacts even on failure. A final successful run is required before claiming that project-path browser workflow passed.

### Successful corrected remote run

[Run 43745298382](https://github.com/athena-kanellatou/diastimed-resolve/actions/runs/43745298382), code commit `3c03eba0525914426c6ce7fbbff2435b3203dc9d`, completed successfully on Node 22.23.4 with Chromium 151.0.7922.34. All 33 tests, benchmark comparison, sensitivity byte reproduction, restoration, source packaging and both builds passed. The root browser task used 180.03 wall-clock seconds and recorded 70 scripted responses, zero misses, zero early responses and a 130ms median. Those values describe automation, not human performance or timing calibration. Root and dedicated project-base previews passed workflow/export, cached offline reload/context/device changes and 390/768/1440 CSS-pixel overflow checks with no uncaught browser errors. The real-duration task ran on the root preview; the quick project-path run did not repeat it. Genuine hidden-tab interruption was unavailable and remains unverified.

The final available human evidence and release limits are recorded in AVAILABLE_EVIDENCE.md. Current release commits and deployments have their own checks; no participant results or domain review were created by software verification.
