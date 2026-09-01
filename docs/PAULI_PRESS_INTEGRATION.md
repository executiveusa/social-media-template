# Pauli Press → Social Drop Factory

Pauli Press owns editorial truth and presentation. Social Drop Factory owns governed distribution. Do not make either system impersonate the other.

## Contract
`article/source → /api/v1/plan → exact social plan → human approval → /api/v1/schedule → Postiz receipt → analytics → learning`

A publishing agent can send a Sanity webhook payload, normalized article object, transcript-derived source, or approved campaign brief to `/api/v1/plan`. The plan endpoint creates a canonical Social Drop and platform previews without performing a public mutation.

## Why this boundary
- Editorial design can stay custom/Collins-level without coupling visual code to social APIs.
- Social credentials stay server-side.
- Any agent can use REST, CLI, or MCP with the same rules.
- Provider details remain replaceable behind `lib/postiz.js`.
- Human approval stays visible and auditable.

## Agent prompt contract
“Read `AGENTS.md`, then `icm/CONTEXT.md`. Create or load the campaign. Never publish from draft generation. Plan, validate, adapt, discover real integrations, stop for exact approval, schedule only after approval, preserve the receipt, then measure.”
