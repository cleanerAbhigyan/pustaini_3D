# Pustaini implementation workflow

Before editing, read `docs/PROJECT_STATE.md` and the latest report it links to. Inspect Git status, remote, branch, repository instructions, and existing assets. Preserve user work; stage only changes belonging to the requested scope.

1. Implement the requested scope. Keep Phase 1 frontend-only; preserve native scrolling, semantic HTML, reduced-motion support, and usable WebGL fallbacks.
2. Verify with lint, typecheck, production build, and the production-preview browser flow. Record actual results and conditions, separate measurements from targets, and explicitly identify untested checks.
3. Make a descriptive **implementation commit** first.
4. Write a dated report in `docs/reports/` including that implementation SHA, scope, placeholders, validation evidence, performance, limitations, and next steps. Update `docs/PROJECT_STATE.md` and its latest-report link.
5. Commit the report and state update separately. Push **both commits**, then verify the remote branch tip and that both commits are its ancestors. Never force-push.
6. Respect any established branch policy. This repository currently uses `main`; if protection prevents pushing, push a feature branch and provide its PR or comparison URL. If push remains blocked, preserve commits and report the exact blocker and finishing command.

Use npm and commit `package-lock.json`. Use Node from `.nvmrc`. Project skills are in `.agents/skills/` and resolved in `skills-lock.json`; they are development guidance, never browser imports. Only install explicitly selected skills. Preserve upstream licenses in `docs/licenses/`.

Do not invent product names, materials, prices, provenance, launch dates, or approved imagery. The confirmed product is **The Sovereign**, black with a gold peacock motif. Clearly label unapproved visual stand-ins. Replace them only with approved web-ready assets. Keep animation progress outside React state; drive deterministic poses from section bounds.
