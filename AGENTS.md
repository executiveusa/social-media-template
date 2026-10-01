# Social Drops — Agent Entry

This repository is the governed campaign and social distribution plane for authorized agents.

Filesystem evidence is authoritative. Conversation memory is not.

## Cold start

1. Read this file.
2. Read `icm/CONTEXT.md`.
3. Read `clients/<client>/manifest.json`.
4. Read the campaign `CONTEXT.md`.
5. Determine the current ICM stage.
6. Perform only the next legal action.

## Shared campaign logic

The default editorial framework is:

`Learn → See → Experience`

- Monday: Learn
- Wednesday: See
- Friday: Experience

A client may use its own labels while mapping to these system roles. Preserve the client's own brand world.

## Paths

- Build a four-week campaign strategy: `POST /api/v1/strategy`
- Blog/article → social distribution plan: `POST /api/v1/plan`
- Validate: `POST /api/v1/validate`
- Adapt: `POST /api/v1/adapt`
- Discover channels: `GET /api/v1/integrations`
- Schedule exact approved content: `POST /api/v1/schedule`
- Read analytics: `GET /api/v1/analytics`
- MCP: `POST /api/mcp`
- Runtime readiness: `GET /api/v1/doctor`

## Hard rules

- Browser UI previews only; it never owns publishing authority.
- Never put provider or API keys in browser code or repository files.
- Never publish from a generated draft alone.
- Scheduling requires `approved=true`, `approvedBy`, and `approvedAt`.
- If multiple accounts match a platform, choose an explicit integration ID.
- Treatment or regulated claims must come from an approved claim ledger.
- Provider failure stays failure.
- A public deploy is not verified until its deployed SHA passes a runtime smoke test.
- Never mix client brand assets, copy, claims, or visual systems.

## Walk test

A cold agent must be able to identify the job, current state, next legal action, required inputs, expected output, human gate, evidence, and rollback within this file plus at most two additional reads.
