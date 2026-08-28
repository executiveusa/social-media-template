# Social Drop Factory

Reusable, ICM-native social campaign engine for scheduled posts, reels, stories, carousels, sales pitches, event pushes, fundraisers, testimonials and calls to action.

## Current architecture

- **GitHub** is source of truth.
- **ICM folders** carry campaign state and routing.
- **Cold-agent Walk Test** is the agent admission gate.
- **Canonical Social Drop** is adapted per platform rather than authored separately for every network.
- **Human approval** is mandatory before public scheduling/publishing.
- **Postiz** is the publishing adapter.
- **Vercel** hosts the operations UI and serverless adapter.

Supported platform contracts: Instagram, Facebook, LinkedIn, TikTok, YouTube and X.

## ICM pipeline

`01_intake → 02_strategy → 03_create → 04_adapt → 05_review → 06_schedule → 07_publish → 08_measure`

Campaign truth lives in files under `icm/campaigns/`. Agents do not own hidden state.

## Verify

```bash
npm run verify
```

This runs the Walk Test and production wiring checks. CI runs the same gate on pull requests and pushes to `main`.

## Runtime configuration

Set these only in the deployment environment; never commit credentials:

```text
POSTIZ_API_URL=https://api.postiz.com
POSTIZ_API_KEY=<secret>
```

If `POSTIZ_API_KEY` is absent, the publish endpoint refuses to claim a live publish and returns a dry-run receipt.

## Production

Production UI: `https://social-drop-factory.vercel.app`

Health endpoint: `/api/health`

## First tenant

ASC3ND First 12 event campaign is stored at:

`icm/campaigns/asc3nd-first-12-event/`

The reusable engine remains tenant-neutral; new customers should add campaign/tenant manifests and assets rather than fork the renderer.
