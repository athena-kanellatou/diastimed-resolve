# Prospective formative usability protocol V2

**Status: candidate prepared for pilot; not yet frozen or run.** Historical aggregates in USABILITY.md were not collected under this protocol. No participant-level V2 data exist.

## Freeze record — complete before the main round

Protocol version: RESOLVE-usability-v2-candidate-1. Main software SHA: **pending**. Policy: resolve-evidence-v0.4 unless changed after pilot. Freeze date/time (with zone): **pending**. Moderator: **pending**. Pilot changes: **pending**. Main-round start: **pending**. Record the final commit and unchanged script in the session form. Do not call this frozen until an actual prospective freeze is recorded.

## People and scope

Target 6–8 fresh adult convenience volunteers, following a separately labelled 1–2 person pilot. This is a practical formative target, not a powered sample-size calculation. Ask about prior exposure before enrolment; returning users belong in a separate follow-up cohort. This tests the review workflow and comprehension. No real three-minute vigilance task is required; task interaction is a separate optional exercise, not pooled with workflow completion.

Only synthetic records and supplied context are used. No health information, induced sleep loss, health interpretation or compensation promise. Participation is voluntary and may stop at any time. Obtain permission for anonymized notes. Audio/video recording and exact quotations each require separate permission. Recruitment identity/contact records remain separate from findings. Do not recruit/contact anyone without authorization.

## Standard setup

Use the frozen build, cleared/reset demonstration data and the **Fatigue review** scenario, with both devices initially available and 360-second allowance. Confirm 2/4 observations initially. Record OS, browser/version, viewport, input, device, SHA, policy, actual date/time and moderator. Reset between people. Do not use a genuinely interrupted or stale participant's saved state.

Read: “We are testing the software, not you. This demonstration uses fictional health observations and does not assess your health. Please think aloud as you work. I will mostly observe. You may stop at any time.”

Participant prompt: “You are preparing a fictional fatigue review at the end of a routine shift. Follow the collection pathway, handle loss of equipment, inspect the brief, and export a handoff. The supplied context is: End of a routine shift; task devices initially available; no interruptions reported.”

Read each task verbatim in sequence. Do not explain controls or desired answers beforehand. Keep moderator success criteria hidden from participants.

| Task | Exact prompt | Observable success criterion |
|---|---|---|
| T1 | Identify the next check and explain what evidence is missing. | Identifies context next; context and vigilance missing |
| T2 | Enter the supplied context, save, and explain what changed. | Context saved; vigilance still missing |
| T3 | Disable the workstation, identify the alternative, then disable the tablet and explain the result. | Tablet fallback recognized; vigilance cannot be collected with neither device |
| T4 | Open the review brief. Identify unresolved evidence, one limitation, and the next human-review step. | Identifies vigilance gap, a relevant limitation and human review; no clearance inference |
| T5 | Export JSON. Explain whether it was automatically sent to a clinician. | Export triggered; understands manual handoff and no automatic sending |

## Outcomes and assistance

Primary endpoint: all five tasks successful independently with A0, plus no critical clearance/manual-handoff misunderstanding. Also report click/task success, independent task success and each critical comprehension measure separately, so misunderstanding cannot be hidden by successful clicks.

A0 = no help. A1 = prompt repeated verbatim, no directional content. A2 = directional hint/explanation. A3 = moderator performs task or supplies answer. Independent means **A0 only**, frozen before main round. An A1 success may be reported separately; it does not enter the primary independent count. Record every assistance event, including repeated codes, in notes; task-level code is the highest used.

Record outcomes as success / partial / failure / not_attempted. Record exact elapsed seconds if observed; otherwise leave blank and document why. Missing time is not zero. Never fabricate an exact quote; use paraphrase in moderator notes unless quote permission and wording are available.

Candidate stop rules: two minutes without progress on a task; explicit abandonment; request to stop; critical misunderstanding requiring correction; roughly 15-minute workflow cap excluding debrief. Pilot these, then freeze the rules. A correction is made after the response is recorded and counts as assistance. A3 setup for a later task is allowed to learn about that task, but its dependency is documented and overall independent completion has already failed.

## Final teach-back and debrief

Ask: “What does this brief tell you, and what does it not establish?” Record clearance understanding and manual-handoff understanding as correct / incorrect / not_assessed, separately from clicks. Correct misunderstandings after recording. Ask what was hardest, what they expected after equipment disappeared, which label/action was unclear, and what to change first.

## Records and reporting

Use `validation/usability-sessions.csv` for every enrolled session, including withdrawals/technical problems, and `validation/usability-tasks.csv` for one row per task (five rows even when not attempted). Session status: completed / noncompleted / withdrawn / technical_issue. No post-hoc exclusion of failures. Main denominator includes all enrolled main sessions; also report evaluable-session counts with explicit reasons, without replacing the enrolled count.

Report raw counts first. Show success by task, assistance, comprehension errors, failure location, stopped/withdrawn sessions and missing data. Summarize successful-task elapsed times separately; do not treat failures or missing times as fast completions. Keep pilot, different SHAs and returning retests separate. Do not infer population effectiveness or causality from convenience samples.

For every real issue, link observation → finding → decision → change SHA → follow-up. New people should retest major fixes where practical. Publish anonymized aggregates only after permission and review; store working identities and actual task records outside this public repository.
