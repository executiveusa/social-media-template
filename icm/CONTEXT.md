# Social Drops ICM

## Purpose

Turn client goals and source truth into governed social campaigns with strategy, production requirements, exact approval, provider receipts, analytics, and learning.

## Repeating unit

One campaign cycle.

## Pipeline

`01_intake → 02_strategy → 03_create → 04_adapt → 05_review → 06_schedule → 07_publish → 08_measure`

## Editorial system

Default system roles:

`Learn → See → Experience`

Clients may map their own labels to these roles.

## Factory vs client

Stable schemas, provider rules, strategy logic, templates, and agent contracts belong in `icm/_system/`, `icm/_templates/`, `lib/`, and `api/`.

Client identity belongs in `clients/<client>/`.

Campaign-specific facts, strategy, drafts, approvals, receipts, analytics, and learning belong in `icm/campaigns/<campaign>/`.

## Boundaries

- Source truth: client materials, approved editorial sources, or campaign brief.
- Strategy and validation: this repo.
- Asset production: approved external production tools or real shoots.
- Client preview: browser/Hyperframe-style explanation only.
- Social provider: Postiz through server-side REST.
- Human gate: stage `05_review` before schedule/publish mutation.

## State

State is derived from campaign artifacts. A stage is complete only when its expected outputs exist and validate.

## Success evidence

Campaign strategy + production plan + platform plan + exact approval receipt + provider receipt + analytics + learning artifact.
