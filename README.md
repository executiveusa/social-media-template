# Social Drops

A governed social campaign operating system.

Social Drops turns client goals, source material, real-world assets, and prior results into an approved campaign, explains the plan visually, adapts it by platform, publishes through Postiz after explicit human approval, preserves receipts, and feeds analytics into the next cycle.

## Core editorial system

`Learn → See → Experience`

- Monday — **Learn**: answer one useful question.
- Wednesday — **See**: show the real person, place, product, treatment, event, or process.
- Friday — **Experience**: show what engaging actually involves and what happens next.

Publishing order: `Monday → Wednesday → Friday`  
Instagram row after Friday: `Friday | Wednesday | Monday`

## Campaign loop

`01_intake → 02_strategy → 03_create → 04_adapt → 05_review → 06_schedule → 07_publish → 08_measure`

The browser is a preview and approval surface. It never owns publishing authority.

## Clients

- `clients/asc3nd` — existing ASC3ND implementation.
- `clients/crown-and-core` — second isolated client proof using T-Shape 2 Month 1.

Shared system logic does not imply shared brand language, typography, imagery, claims, or calls to action.

## Interfaces

- REST API
- CLI
- MCP
- ICM filesystem contract
- Human preview UI

## Human gate

No generated draft publishes by itself. Scheduling requires exact approval metadata for the artifact being scheduled.

## Verify

```bash
npm run verify
```

## Server environment

- `SOCIAL_DROP_API_KEY`
- `POSTIZ_API_KEY`
- `POSTIZ_API_URL` (defaults to `https://api.postiz.com`)
- `SOCIAL_DROP_API_URL`

Start with `AGENTS.md` and `icm/CONTEXT.md`.
