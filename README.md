# Social Drop Factory

A governed social distribution API, CLI, MCP surface, and ICM workspace for agents. It turns one source of truth—especially Pauli Press/blog articles—into platform-specific social plans, requires exact human approval, executes through Postiz, preserves receipts, and reads analytics.

## What this repo is
- **API** for planning, validation, channel discovery, scheduling, and analytics.
- **CLI** that agents can call with structured JSON.
- **MCP** surface for tool-calling agents.
- **ICM** filesystem contract that a cold agent can walk without relying on memory.
- **Preview UI** for humans. It does not possess publishing authority.

## What this repo is not
It is not the CMS, not another orchestrator, not a browser shell executor, and not a replacement for human approval.

## Verify
```bash
npm run verify
```

## CLI
```bash
export SOCIAL_DROP_API_URL=https://your-deploy.example
export SOCIAL_DROP_API_KEY=...
node bin/social-drop.mjs doctor
node bin/social-drop.mjs integrations
node bin/social-drop.mjs plan --file editorial.json
node bin/social-drop.mjs schedule --file drop.json --approval approval.json
```

## Server environment
- `SOCIAL_DROP_API_KEY` — protects agent/control API.
- `POSTIZ_API_KEY` — server-side Postiz key only.
- `POSTIZ_API_URL` — default `https://api.postiz.com`.
- `SOCIAL_DROP_API_URL` — CLI target.

See `docs/API.md`, `docs/PAULI_PRESS_INTEGRATION.md`, `AGENTS.md`, and `icm/CONTEXT.md`.
