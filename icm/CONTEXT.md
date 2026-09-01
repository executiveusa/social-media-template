# Social Distribution ICM

## Purpose
Turn one source of truth into platform-correct social distribution with explicit approval, provider receipts, analytics, and learning. This repo executes distribution; it does not replace the blog/CMS, the orchestrator, or human authority.

## Repeating unit
One campaign run.

## Pipeline
`01_intake → 02_strategy → 03_create → 04_adapt → 05_review → 06_schedule → 07_publish → 08_measure`

## Factory vs product
Stable schemas, provider rules, agent contracts, and templates live in `icm/_system/` and `icm/_templates/`. Campaign-specific sources, drafts, approvals, receipts, and analytics live under `icm/campaigns/<campaign>/`.

## System boundaries
- Editorial source: Pauli Press/Sanity/another approved source.
- Planning/validation: this repo.
- Social provider: Postiz through server-side REST.
- Browser: preview/copy surface only.
- Human gate: stage `05_review` before any schedule/publish mutation.

## State
State is derived from campaign artifacts. A stage is complete only when its expected output exists and validates. Dashboards and agent memory cannot override missing evidence.

## Success evidence
Validated drop + platform plan + exact approval receipt + provider receipt + post/channel analytics + learning receipt.
