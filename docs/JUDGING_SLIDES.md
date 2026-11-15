# Published judging presentation

The seven-slide presentation uses actual prototype screenshots and the team-reported usability aggregates in USABILITY.md. Workstation loss selects the tablet. Loss of both devices leaves vigilance unresolved. Initial completion was 13/25 (52%); revised completion was 12/15 (80%), including 8/9 returning and 4/6 new participants. Prior exposure and missing participant-level documentation limit interpretation. No causal redesign effect or clinical validation is claimed.

The browser viewer includes slide transcripts and primary-source links. PowerPoint contains editable text and native results tables. PDF contains seven searchable pages. Development assistance remains disclosed.

Public judging link: https://athena-kanellatou.github.io/diastimed-resolve/judging.html
PDF: https://athena-kanellatou.github.io/diastimed-resolve/DiastiMed_RESOLVE_judging.pdf
PowerPoint: https://athena-kanellatou.github.io/diastimed-resolve/DiastiMed_RESOLVE_judging.pptx

## Asset reproduction

Before source packaging and builds, run `node scripts/restore-judging-assets.mjs`. The script restores the authored screenshots, PDF and editable deck from the public version-19 artifact snapshot, verifying the exact SHA-256 of every file against judging-assets.json before writing. The repository tracks the semantic browser viewer and integrity manifest. GitHub Actions performs the restore step. A changed or unavailable remote artifact fails the build instead of silently replacing the presentation. The generated source archive includes the restored files.

No registration or password is needed to view the GitHub Pages project or presentation.
