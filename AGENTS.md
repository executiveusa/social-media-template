# Social Drop Factory — Agent Entry

This repo is the governed social execution plane for Pauli Press and any authorized agent.
Filesystem contracts are authoritative; agent memory is not.

## Cold start
1. Read this file.
2. Read `icm/CONTEXT.md`.
3. For a campaign, read its `CONTEXT.md`; for a new campaign copy `icm/_templates/campaign/`.

## Choose the path
- Blog/article → social plan: `POST /api/v1/plan` or `social-drop plan --file ...`
- Check a drop: `/api/v1/validate` then `/api/v1/adapt`
- Discover real channels: `GET /api/v1/integrations`
- Schedule approved content: `POST /api/v1/schedule`
- Learn from results: `GET /api/v1/analytics`
- MCP agents: `POST /api/mcp`
- Runtime readiness: `GET /api/v1/doctor`

## Hard rules
- Browser UI previews only; it never owns publishing authority.
- Never put API/provider keys in browser code or repository files.
- Never publish from a generated draft alone.
- Scheduling requires `approved=true`, `approvedBy`, and `approvedAt` for the exact artifact.
- If multiple accounts match one platform, select an explicit integration ID; never guess.
- No fake success: provider failure stays failure.
- A public deploy is not production-verified until the tested SHA passes a runtime smoke test.

## Proof
Run `npm run verify`.
Walk test: a cold agent must find job, state, next legal action, inputs/outputs, human gate, evidence, and rollback within this file plus at most two reads.
Rollback is the previous verified Git SHA or PR revert.
