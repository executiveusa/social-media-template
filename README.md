# Social Drop Factory

Reusable, ICM-native social campaign engine for scheduled posts, reels, stories, carousels, sales pitches, event pushes, fundraisers, testimonials and calls to action.

## Architecture

- **GitHub** is source of truth.
- **ICM folders** carry campaign state and routing.
- **Cold-agent Walk Test** is the agent admission gate.
- **Canonical Social Drop** is adapted per platform rather than authored separately for every network.
- **Human approval** is mandatory before public scheduling/publishing.
- **Postiz** is the publishing adapter.
- **Vercel** hosts the operations UI, REST API and MCP endpoint.
- **CLI** gives local agents and operators a scriptable connection to the same API.

Supported platform contracts: Instagram, Facebook, LinkedIn, TikTok, YouTube and X.

## ICM pipeline

`01_intake → 02_strategy → 03_create → 04_adapt → 05_review → 06_schedule → 07_publish → 08_measure`

Campaign truth lives in files under `icm/campaigns/`. Agents do not own hidden state.

## Connections

### REST API

Base: `https://social-drop-factory.vercel.app`

- `GET /api/v1/metadata`
- `POST /api/v1/validate`
- `POST /api/v1/adapt`
- `POST /api/v1/schedule`

Protected endpoints require `Authorization: Bearer <SOCIAL_DROP_API_KEY>` (or `x-api-key`).

### MCP

Remote JSON-RPC endpoint: `POST /api/mcp`

Tools:

- `social_drop_metadata`
- `validate_social_drop`
- `adapt_social_drop`
- `schedule_social_drop`

The MCP endpoint uses the same API key and preserves the human approval requirement for scheduling.

### CLI

```bash
npm run cli -- metadata
npm run cli -- validate --file drop.json
npm run cli -- adapt --file drop.json
npm run cli -- schedule --file drop.json --approval approval.json
npm run cli -- mcp-info
```

Environment:

```text
SOCIAL_DROP_API_URL=https://social-drop-factory.vercel.app
SOCIAL_DROP_API_KEY=<secret>
POSTIZ_API_URL=https://api.postiz.com
POSTIZ_API_KEY=<secret>
```

## Verify

```bash
npm run verify
```

This runs the Walk Test plus API/MCP/CLI production wiring checks. CI runs the same gate on pull requests and pushes to `main`.

## Production

Production UI: `https://social-drop-factory.vercel.app`

Health endpoint: `/api/health`

## Current tenant campaign

ASC3ND final event week campaign is stored at:

`icm/campaigns/asc3nd-final-event-week/`

**The First 12 belongs to New World Kids, not ASC3ND.** It must be represented as a separate New World Kids campaign/tenant when added to this engine.

The reusable engine remains tenant-neutral; new customers should add campaign/tenant manifests and assets rather than fork the renderer.
