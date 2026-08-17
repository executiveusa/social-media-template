# Social Media Template — Social Drop Factory

Canonical portable home for the Webflow ASC3ND Social Drop experiment.

## Fidelity target

`index.html` + `styles.css` reproduce the extracted Webflow page structure and `asc-test-*` style system for the **ASC3ND Interactive Campaign Test**. The interaction is native HTML `<details>/<summary>`; the Webflow audit found no page- or site-level custom-code dependency.

For the first parity build, the stylesheet intentionally points to the **same three Google Drive image IDs that Webflow currently uses**. That removes one source of visual mismatch. Vendoring those files into the repo is the next sovereignty-hardening step, after visual parity is certified.

## Run locally

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Architecture

- **GitHub** = source of truth
- **Webflow** = visual R&D / client preview
- **static HTML/CSS** = production baseline
- **client/campaign data** = manifests + assets

A new customer should be a new client manifest/assets folder, not a fork of the renderer.

## Parity workflow

1. Extract Webflow page tree.
2. Extract all target-page styles, including breakpoint overrides.
3. Audit page/site custom code and registered scripts.
4. Preserve the exact asset sources used by Webflow for the parity build.
5. Render the GitHub build.
6. Compare desktop/tablet/mobile screenshots against Webflow.
7. Treat any visual or interaction mismatch as a failing parity test.
8. After parity passes, vendor media into GitHub/object storage and verify again.

## Current certification

- Structural parity: **implemented**
- Source/DOM/CSS parity: **implemented from Webflow extraction**
- Visual screenshot parity: **not yet certified**
- Browser behavior parity: **not yet certified**

Run:

```bash
python scripts/verify_parity.py
```
