# Reproduce the prototype

Use Node.js 22 and npm. Python 3 is used only for source packaging.

```sh
npm ci
npm test
npm run build
npm run benchmark
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

For a static host, publish dist at the origin root. Paths currently assume root hosting; a GitHub Pages repository subpath needs an explicit base-path adjustment for assets, service worker and downloads. Do not claim subpath deployment has been tested.
