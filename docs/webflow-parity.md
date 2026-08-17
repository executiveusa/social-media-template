# Webflow parity baseline

Source Webflow site: `Copy of Social Template`

Source page: `ASC3ND Interactive Campaign Test`

Webflow site id: `6a818f5a23f5ab73da7ba833`

Webflow page id: `6a825345feff1ba86497e1db`

## Extraction result

The Webflow page tree and all `asc-test-*` classes were extracted on 2026-08-16. Page-level and site-level freeform custom-code blocks were empty. No registered page/site script was found for this prototype. The three visual assets are referenced by Webflow CSS using Google Drive thumbnail URLs.

## What "same" means

The portable build is required to preserve:

- content hierarchy and copy
- desktop hero split
- phone treatment
- Friday / Wednesday / Monday grid order
- Belief / Story / Action `<details>` interaction
- Personalized Sales and Recruiting sections
- extracted colors, spacing, typography sizing, borders, and responsive breakpoints
- the same three source images

## Certification levels

1. **Structural parity** — CI passes `scripts/verify_parity.py`.
2. **Source parity** — DOM/CSS inventory matches the Webflow extraction.
3. **Visual parity** — desktop/tablet/mobile screenshots are compared against Webflow.
4. **Behavior parity** — links, details/summary interaction, keyboard use, and responsive layout are tested in-browser.

Levels 1 and 2 are represented in this repository. Level 3 still requires a working Webflow Designer snapshot or browser screenshot harness; it must not be claimed until compared.
