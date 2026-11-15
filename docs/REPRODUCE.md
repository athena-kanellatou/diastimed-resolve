# Reproduce the prototype

Use Node.js 22 and npm. Python 3 is used only for source packaging.

```sh
npm ci
npm test
npm run build
npm run benchmark
npm run sensitivity:check
npm run dev
```

Open the local address Vite prints. The app requires no API keys, cloud accounts, database or model endpoint. The browser task measures real elapsed time; no accelerated demo result is inserted.

The benchmark enumerates 16 evidence subsets, four device states and four budgets. It writes all 256 cases to public/benchmark.json and updates docs/EVALUATION.md. Generated timestamps differ on each run. `node scripts/verify-benchmark.mjs` compares all cases and summaries with the committed file when run in a Git checkout. It requires no network.

GitHub Actions runs locked dependency installation, tests, type checking, build, benchmark reproduction and source packaging on pushes and pull requests. The first remote run succeeded: https://github.com/athena-kanellatou/diastimed-resolve/actions/runs/43608783282. Each subsequent commit has its own workflow result.

To create the downloadable source archive:

```sh
python3 scripts/package-source.py
```

The archive excludes .git, .openai, node_modules, build output, credentials and user-entered browser data. SOURCE_MANIFEST.json records each included file's SHA-256. The MIT licence covers project code; third-party notices and research references retain their own terms.

For root hosting, use `npm run build`. For the existing GitHub Pages address use `npm run build -- --base=/diastimed-resolve/` and publish `dist`. Asset/download URLs and service-worker scope use the configured base. Both build targets and service-worker doubles are checked. Real production offline/hardware verification is narrower; consult VERIFICATION.md.

Before source packaging or publishing, run `node scripts/restore-judging-assets.mjs`. It restores nine hash-pinned presentation files from the existing public presentation version 19. Older tracked PDF/PPTX bytes can differ; do not run the historical slide exporter. Keep the manifest/restoration dependency unless intentionally migrating all nine assets. CI performs this step before source packaging and building.

Sensitivity uses a fixed clock and authored fixtures, with no random sampling. Config/inputs are separate from calculated compressed cases. `npm run sensitivity` writes outputs; `npm run sensitivity:check` reproduces every artifact in memory and compares its bytes. Expect several seconds of CPU work. Gate counterfactuals do not replay altered cue schedules. No model/API key is required.

Local checks for this extension used Node 24.22.1. GitHub CI pins Node 22 and runs the optional browser script using locked Playwright plus installed test Chromium. The browser script uses a production preview, a real 180-second task (no accelerated timer), manual export inspection, reload recovery, cached offline workflow and emulated widths. It does not calibrate timing or test physical mobile hardware. Headless browsers can keep background tabs visible; the script records that as unavailable rather than synthesizing a visibility event.

To repeat locally with a supported browser environment: `npx playwright install chromium`, build for the desired base, start `npm exec vite preview -- --host 127.0.0.1 --port 4173`, then run `RESOLVE_URL=http://127.0.0.1:4173/diastimed-resolve/ node scripts/browser-verification.mjs`. For a quick project-path workflow without repeating the real-duration task, set `RESOLVE_BROWSER_QUICK=1`. JSON results and screenshots go to ignored `artifacts/`. Browser preview was blocked in the authoring container; only actual CI results establish browser verification.
