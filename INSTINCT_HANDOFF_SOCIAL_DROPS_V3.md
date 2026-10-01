# INSTINCT HANDOFF — Social Drops v3

## Mission

Take over **Social Drops v3** from this point forward and carry it to a verified working deployment.

You are the execution agent. You have server access, can run experiments, install dependencies where appropriate, inspect hosting/account state, execute tests, and verify the real deployed result.

Do not wait on Bambu for routine engineering choices. Escalate only when a decision is irreversible, brand-defining, security-sensitive, involves money, or changes the approved product direction.

---

## Repository

`executiveusa/social-media-template`

Primary branch: `main`

Current production code after merge:
- Social Drops v3 core merge: `f22e52ce8d2ceee39e8b6dba93221cec4a95acc0`
- Pages deployment workflow merge: `99e673d4ebf40d35adb6b3f09fd8b3151aa2ff76`

Open the repo first and read:
1. `AGENTS.md`
2. `icm/CONTEXT.md`
3. `README.md`

Then inspect the live filesystem and current deployment state before changing anything.

---

## Product Definition

Social Drops is a governed social campaign operating system.

Core loop:

`01_intake → 02_strategy → 03_create → 04_adapt → 05_review → 06_schedule → 07_publish → 08_measure`

Default editorial framework:

`Learn → See → Experience`

Cadence:
- Monday = Learn
- Wednesday = See
- Friday = Experience

Instagram publishing order:
`Monday → Wednesday → Friday`

Completed row display order:
`Friday | Wednesday | Monday`

Important: this is **not** a puzzle-grid system. Every post must work independently while contributing to the full monthly story.

---

## What Is Already Built

### Multi-client architecture
- `clients/asc3nd`
- `clients/crown-and-core`

Shared logic is reusable.
Client brand, copy, imagery, claims, typography, CTA, and campaign topics remain isolated.

### Crown & Core proof client
Files include:
- `clients/crown-and-core/manifest.json`
- `clients/crown-and-core/brand.json`
- `clients/crown-and-core/editorial-system.json`
- `clients/crown-and-core/claims.json`
- `clients/crown-and-core/measurement.json`

Campaign:
- `icm/campaigns/crown-core-tshape-month-01/`

Includes:
- campaign context
- 4-week strategy
- 12-post architecture
- shoot plan
- approval artifact example

### Strategy engine
- `lib/strategy.js`
- `api/v1/strategy.js`

### MCP
- `api/mcp.js`

Includes:
- metadata
- campaign strategy generation
- editorial planning
- validation
- adaptation
- media import
- integration discovery
- scheduling
- analytics

### Browser UI
The root app was rebuilt as a mobile-first campaign control/explanation surface.

Views:
- Workflow
- 30-day plan
- Grid
- Production
- Approval
- Distribution

Browser is **not** allowed to own privileged publishing authority.

### Governed publishing path
Execution remains behind:
- API
- CLI
- MCP
- Postiz

Human approval is required before schedule/publish mutation.

### Schemas
Added:
- client schema
- strategy schema
- campaign schema
- asset schema

### Verification
On the v3 merge commit:
- `verify` GitHub Action passed
- `parity` GitHub Action passed

On the Pages PR:
- `verify` passed
- `parity` passed

---

## Current Hosting Blocker

A GitHub Pages deployment workflow was added at:

`.github/workflows/pages.yml`

The workflow ran but failed at **Configure Pages**.

Exact error:

`Create Pages site failed. Error: Resource not accessible by integration`

This is a GitHub permission/integration limitation, not an app failure.

The goal is **not** to spend more time forcing GitHub Pages unless you can fix it immediately with existing access.

Preferred path:
1. Inspect what hosting accounts / CLI credentials are already available on the server.
2. Deploy the repo through the fastest reliable route.
3. Netlify or Vercel are both acceptable.
4. Use an existing account/session when available.
5. Do not expose secrets.
6. Do not modify the Crown & Core production website to host this control app.
7. Create a distinct Social Drops deployment.

---

## Your Immediate Tasks

### 1. Clone / update and verify locally
On the server:

```bash
git clone https://github.com/executiveusa/social-media-template.git
cd social-media-template
git checkout main
git pull
npm run verify
```

If the repo already exists, inspect it first and update safely instead of recloning blindly.

Confirm:
- verify passes
- strategy test passes
- browser files exist
- Crown & Core campaign loads
- ASC3ND client loads
- no secret exists in browser code

### 2. Run the application
Use the appropriate local static/server setup.

Verify manually in a browser:
- desktop
- mobile viewport
- client selector
- Crown & Core loads by default
- ASC3ND switch works
- tab switching works
- 4-week plan renders
- 12-post grid renders
- Friday | Wednesday | Monday visual ordering is correct
- production plan renders
- approval template copy works
- campaign JSON copy works

### 3. Deploy
Create a clean public deployment named approximately:

`social-drops`

Preferred:
- Vercel if authenticated and clean
- Netlify if faster
- existing server + reverse proxy is acceptable if it produces a stable HTTPS URL

Do not deploy over another existing project.

### 4. Smoke test the live URL
After deployment, verify the **actual public URL**, not just build logs.

Check:
- HTTP 200
- title = Social Drops
- mobile responsive layout
- no broken JSON fetches
- no console-breaking errors
- both clients render
- tabs work
- buttons work
- static campaign data loads
- refresh works on root
- HTTPS works

If deployed to Vercel and serverless APIs are enabled, also test:
- `/api/health`
- `/api/v1/doctor`

Do not claim the API is production-ready unless environment variables and authenticated server behavior are actually tested.

### 5. Do not publish social content
Do not connect live posting or schedule any content unless there is an exact human approval artifact.

The publishing gate is a feature, not a blocker.

### 6. Report back
Return a concise execution report with:

- WORKING URL
- hosting provider
- deployed commit SHA
- verify result
- mobile test result
- desktop test result
- API smoke test result
- any remaining blockers
- exact next action if anything remains

---

## Definition of Done

This handoff is complete only when all of the following are true:

1. The latest `main` branch is deployed.
2. There is a stable HTTPS URL Bambu can open.
3. The URL is tested in a real browser.
4. Crown & Core renders correctly.
5. ASC3ND renders correctly.
6. Mobile layout is verified.
7. The 30-day strategy and grid are visible.
8. The repo test suite is green.
9. No secrets are exposed client-side.
10. You return the working URL and verification evidence.

---

## Operating Principle

You are expected to be proactive.

Inspect → test → fix → redeploy → verify.

Do not stop at “deployment succeeded.”
Stop when the product is visibly working and you have verified it.

If one hosting path fails, try the next sensible path before escalating.

Bambu should not be the bottleneck.
