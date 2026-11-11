# Project state

**Updated:** 2026-11-11 (America/Los_Angeles)

- **Current phase:** Phase 1 foundation implemented and verified against the production preview.
- **Latest implementation report:** [001 — Phase 1 foundation](reports/001-phase-1-foundation.md).
- **Implementation commit:** `a2e28065eb4ecda8c1785edf1508f2cba998f96b` on `main`; report/state/evidence follow in a separate commit.
- **Stack:** Vite, React, strict TypeScript, Three.js, React Three Fiber; npm lockfile; Node 22.22.0.
- **Working:** opening → film frame → scroll-driven fixed-camera runway → HTML catalogue → footer; native anchors/keys/touch/reverse scrolling; reversible nonblocking blinks; reduced-motion and unavailable-WebGL fallbacks; 3D lazy loading, DPR cap, idle/offscreen demand rendering.
- **Verification:** lint, typecheck and production build pass; 24 browser checks pass in Chromium desktop/emulated-mobile and static-fallback profiles; zero tested browser errors/overflow and zero axe violations. Detailed conditions, trace, measurements and untested checks are in the report.
- **Initial JS baseline:** 72.903kB gzip; additional lazy runway 250.029kB gzip. These are computed output sizes, not real-device or field performance results.
- **Confirmed product:** The Sovereign, black with a gold peacock motif. The catalogue intentionally contains only this confirmed name.
- **Outstanding decisions/assets:** approved seal/wordmark treatment, house film plus captions/transcript, approved product stills, optimized animated figure/bag GLB and clip/hand attachment conventions, additional genuine collection metadata.
- **Remaining limitations:** labelled visual stand-ins, no film playback yet, simple CSS catalogue transition prototype, lazy bundle above the initial combined 300kB gzip target, upstream Clock warning and moderate development-tool audit findings. Physical-device, cross-browser, screen-reader and field performance checks remain open.
- **Recommended next phase:** approve and integrate production assets, optimize/measure the real animated runway on physical mobile hardware, and broaden accessibility/browser validation. Product detail pages and checkout remain deferred.

Read this file and the latest report before editing. Follow [AGENTS.md](../AGENTS.md), preserve unrelated work, commit implementation before its report, push both commits and verify the remote tip. Never force-push.
