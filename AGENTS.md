# Social Drop Factory — Agent Contract

This repository is ICM-native. Filesystem state is authoritative; agent memory is not.

## Walk Test
A cold agent starting at repo root must answer within three reads: where it is, its job, current campaign state, next legal action, exact inputs/outputs, required human approval, success evidence, and rollback location.

## Routing
1. Read this file.
2. Read `icm/CONTEXT.md`.
3. Read the target campaign `CONTEXT.md`.

Never publish without an approval receipt in `05_review/output/approval.json` with `approved: true`.
Never store secrets in the repository. Publishing credentials come from runtime environment variables only.
