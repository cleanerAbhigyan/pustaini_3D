# Pustaini shared context hub

GitHub main is the canonical **versioned** record for both ChatGPT Work chats and VS Code/Codex. This is a checkpoint-based handoff, not live transcript synchronization.

## Read order (both chats)
1. Root `AGENTS.md` and `docs/PROJECT_STATE.md` (implementation authority).
2. This file, `SHARED_CONTEXT.md`, `DECISIONS.md` and `NEXT_ACTIONS.md`.
3. The other chat's latest `HANDOFF.md` and your own `HANDOFF.md`.
4. `assets/ASSET_MANIFEST.md` and only the relevant referenced assets.
5. Latest implementation report linked by `docs/PROJECT_STATE.md`.

## Write protocol
- Planning chat owns `chats/3D-planning/`; implementation chat owns `chats/3D-implementation/`.
- Both can READ all directories. Both may PROPOSE edits to shared docs; reconcile changes before committing. No overwriting the other chat's handoff.
- At the end of a meaningful session, update your own handoff with timestamp (UTC), branch/commit, decisions, deliverables, links, blockers, next action and requests for the other chat.
- When a decision is approved, update `DECISIONS.md`; never silently promote an idea or research inference to a requirement.
- Implementation work still follows root AGENTS.md's two-commit implementation/report workflow.
- Before writing, re-fetch main and check for newer changes; use a branch/PR when parallel edits conflict. Never force push.

## Asset rules
Use descriptive filenames, stable IDs and relative paths. Record origin, owner/license, approval, fidelity, status and usage in the manifest. Screenshots are research evidence, not necessarily approved product imagery. Do not commit credentials, personal customer information or unlicensed third-party media. GitHub is versioned storage with practical size and bandwidth limits, not unlimited storage; use Git LFS or external object storage for large binaries and link their locations in the manifest.
