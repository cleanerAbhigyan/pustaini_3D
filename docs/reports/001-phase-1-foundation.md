# 001 — Phase 1 foundation

**Date:** 2026-11-11 (America/Los_Angeles)  
**Repository:** [cleanerAbhigyan/pustaini_3D](https://github.com/cleanerAbhigyan/pustaini_3D)  
**Branch:** `main`  
**Implementation commit:** [`a2e28065eb4ecda8c1785edf1508f2cba998f96b`](https://github.com/cleanerAbhigyan/pustaini_3D/commit/a2e28065eb4ecda8c1785edf1508f2cba998f96b)

## Delivered

A working frontend-only scroll-through with Vite 7.3.8, React 19.3.1, TypeScript 5.9.3, Three.js r186.1 and React Three Fiber 9.8.2. npm dependencies are locked. Node 22.22.0 is pinned in `.nvmrc`; the final verification ran under that version with npm 9.2.0.

The repository initially contained only `README.md` and commit `284dab4de987b6b8560d08a3ae9f1fefa9d7dcb6`. Its working tree was clean, `main` tracked `origin/main`, and origin was `https://github.com/cleanerAbhigyan/pustaini_3D.git`. No applicable AGENTS.md, branch policy, prior project state/report, or local approved assets were present. Existing history was preserved. New root AGENTS.md establishes the required read → implement → verify → code commit → report/state commit → push → remote verification workflow. No unrelated changes or force-pushes are included.

### Experience

- **Opening:** immediately available HTML before JS or 3D loads, burgundy/antique-gold/ivory styling, decorative provisional P monogram and native entrance link. No simulated loading percentage.
- **HouseFilm:** responsive, styled curtain placeholder with a direct runway advance link. No unavailable footage or fake playback controls; no audio is loaded or played.
- **Blink boundaries:** opening→film and film→runway use narrow section-bound eyelid transitions. They reverse with scroll, ignore pointer events and release after 180ms at rest. Reduced motion disables them. Scrolling and focus are never locked.
- **Runway:** one lightweight scene, a fixed perspective camera at `[0, 1.9, 7]`, a perspective-narrowing stage, simple walking figure, black bag and provisional gold fan/peacock motif. Progress moves the figure from z=-15 to z=0, then turns it -0.28 radians; the final pose is held from 88% onward with the bag visible. Reverse scrolling restores previous poses. `RunwayFigure` is the replacement seam for a later animated GLB.
- **Collection:** a decorative curved panel flattens/fades into a real HTML catalogue. The single confirmed product is **The Sovereign**. Its image link moves focus to inline catalogue details. Unknown names, prices, materials and product claims have not been invented. Product pages and checkout remain deferred.
- **Footer:** PUSTAINI wordmark, working collection revisit and experience replay links.

Native document scrolling supports keys, touch, reverse movement, resizing and anchors. Initial fragment navigation is restored after React inserts the sections. Active chapter and local progress derive from section bounds in one scheduled read/write pass. Progress lives outside React state. The scene imports within 75% of a viewport of its chapter, uses demand rendering and DPR ≤1.5, and requests no further frames while idle or offscreen. Reduced-motion and WebGL-unavailable sessions retain readable HTML/static imagery and navigation without importing 3D. A scene error boundary and context-loss handler also select the static fallback.

The implementation follows the installed project skills and the official [R3F on-demand rendering guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance). The opening uses system serif/sans fonts and local assets; there are no external runtime content services.

## Placeholders and asset status

No approved seal, film, product photography or animated model was found in this repository. The P monogram/favicon and `sovereign-study.svg` are authored provisional illustrations, not approved identity/product assets. The catalogue and runway explicitly label the bag/figure as stand-ins. Only the supplied identity—The Sovereign, black with a gold peacock motif—is treated as confirmed. The film placeholder is labelled and has no playback wait.

## Project skills and licensing

Installed project-only for Codex using `skills@1.8.1` under Node 22.22.0. Exactly five skills resolve inside `.agents/skills/`; `skills list --agent codex --json` reported project scope and tracked status for all five. Installed files were compared against the resolved source checkouts with no differences. The installer generated `skills-lock.json` with source paths and content hashes; it is committed. These files are never imported by the app.

| Source                                                                            | Selected skills                                                         | Resolved source commit                     | License                         |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------ | ------------------------------- |
| [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills)           | `threejs-react-three-fiber`, `threejs-animation`, `threejs-performance` | `0e181866f095b5f06d005133876e926515390d95` | MIT, copyright 2026 CloudAI-X   |
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | `performance`, `accessibility` (metadata version 2.0)                   | `afa8da942115f2961fdbfa80807ea0b232ff6c00` | MIT, copyright 2026 Addy Osmani |

All selected SKILL.md files, the performance measurement reference, and applicable upstream license notices were inspected. Full MIT notices are preserved in [docs/licenses](../licenses). Installer commands are in README; newly installed project skills are available to Codex on its next turn.

## Key files

| Path                                    | Responsibility                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| `AGENTS.md`, `README.md`                | Standing workflow, setup, commands and chapter/asset replacement instructions |
| `src/app/App.tsx`, `src/app/styles.css` | Page composition, layout, theme, responsive and motion styles                 |
| `src/chapters/`                         | Five semantic chapter/footer components                                       |
| `src/content/chapters.ts`               | Chapter order and confirmed collection metadata                               |
| `src/experience/scroll.ts`              | Bounds-derived progress, active navigation, blink and collection unfolding    |
| `src/experience/LazyRunway.tsx`         | Lazy loading, motion preferences, WebGL probe and fallbacks                   |
| `src/experience/RunwayScene.tsx`        | Fixed camera and deterministic figure/bag pose                                |
| `public/assets/`                        | Used SVG stand-ins only                                                       |
| `scripts/verify-browser.mjs`            | Repeatable production-preview browser verification and trace capture          |
| `scripts/measure-bundles.mjs`           | Separate entry/lazy raw, gzip and Brotli measurements                         |

## Verification

Start locally with `nvm use && npm ci && npm run dev`. To repeat the production checks:

```sh
npm run lint
npm run typecheck
npm run build
npm run measure:bundles
npx playwright install chromium
npm run preview -- --port 4173 --strictPort
# In another terminal:
npm run verify:browser
```

Lint, strict typecheck and production build passed. The build emits an expected >500kB raw chunk advisory for the lazy Three/R3F scene; the warning was retained. `git diff --check` passed. Production dependency audit (`npm audit --omit=dev`) reported zero vulnerabilities. The full audit reported seven moderate development-only findings through typescript-eslint's minimatch dependency; no forced dependency downgrades/overrides were applied.

**Browser:** Playwright 1.65.0, headless Chromium **158.0.8127.18**, Linux, local production preview on port 4173, SwiftShader software WebGL, no CPU/network throttling, fresh contexts. Desktop: **1440×1000, DPR 1**. **Emulated mobile:** **390×844, device DPR 3**, touch/mobile flags; canvas DPR measured **1.5**. Additional resize/layout checks: **320×740** and **720×500** (200%-zoom-equivalent CSS viewport, not a browser zoom test). Static fallback profiles: 390×844 with reduced motion or WebGL contexts explicitly unavailable.

All **24 named browser checks passed**. [Complete results](evidence/001/browser-results.json) and [desktop](evidence/001/desktop-axe.json)/[mobile](evidence/001/mobile-emulated-axe.json) axe reports are committed.

| Check                                                                                  | Result                                                                    |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Opening HTML before JS; 3D absent from initial script requests                         | Pass, desktop and emulated mobile                                         |
| Both blink boundaries forward/reverse, release at rest, no pointer interception        | Pass, both profiles                                                       |
| Approach, slight turn, held pose, reverse pose determinism, fixed camera               | Pass, both profiles                                                       |
| Idle and offscreen frame counts remain unchanged                                       | Pass, both profiles                                                       |
| Native PageDown/PageUp; keyboard skip link; anchor focus                               | Pass; page keys on desktop, skip/focus on both                            |
| Native touch-event swipe                                                               | Pass, emulated mobile                                                     |
| Catalogue link, revisit link, replay and fresh `#runway` load                          | Pass, both profiles                                                       |
| Reduced motion and WebGL unavailable: static fallback, no 3D import, navigation/replay | Pass                                                                      |
| Horizontal overflow across chapters and resize profiles                                | None found                                                                |
| Console/page errors in standard desktop/mobile flows                                   | Zero                                                                      |
| Axe WCAG 2 A/AA + 2.1 AA rules                                                         | Zero violations in both scans; not a full conformance claim               |
| Screenshot review                                                                      | Opening, final pose, catalogue and fallback reviewed; bag remains visible |

Browser verification found and resolved a mobile caption contrast issue over the ivory stage and initial fragment navigation before section insertion. The blink assertion was synchronized to animation frames, and native touch events replaced the synthetic scroll-gesture helper for this headless browser.

Screenshots: [desktop opening](evidence/001/desktop-opening.png), [desktop final pose](evidence/001/desktop-runway-final.png), [mobile opening](evidence/001/mobile-emulated-opening.png), [mobile final pose](evidence/001/mobile-emulated-runway-final.png), [mobile collection](evidence/001/mobile-emulated-collection.png), [reduced motion](evidence/001/reduced-motion.png), [no WebGL](evidence/001/no-webgl.png).

## Measured performance baseline

Sizes use decimal kB (1kB=1000 bytes). gzip/Brotli are computed from production output files, not measured compressed HTTP transfers. [Raw measurement JSON](evidence/001/bundle-sizes.json).

| JavaScript              |         Raw |           gzip |     Brotli |
| ----------------------- | ----------: | -------------: | ---------: |
| Initial entry           |  233.486 kB |  **72.903 kB** |  62.688 kB |
| Lazy runway, additional |  929.050 kB | **250.029 kB** | 205.988 kB |
| Combined after 3D load  | 1162.536 kB |     322.932 kB | 268.676 kB |

CSS is 11.06kB raw / approximately 3.20kB gzip per the build output. Actual initial requests excluded the runway chunk; reduced-motion and unavailable-WebGL profiles never requested it. Observed scene statistics at the held pose: desktop **38 draw calls / 2,374 triangles**, emulated mobile **34 / 2,326** (frustum culling differs). Counters are sampled from the previous completed render. Idle/offscreen counters did not advance during the test waits.

A repeatable [Chromium scroll trace](evidence/001/runway-trace.json.gz) is committed compressed. Decompress and open its JSON in Chrome DevTools Performance. The script traverses runway progress 0→1→0 over **82 steps**, waiting **120ms per step**; the trace starts after the scene is loaded and warmed. This single desktop lab sample contained **1,505 renderer-main-thread tasks**, **zero tasks >50ms**, and a **6.055ms** maximum measured task. It is a scripted scroll diagnostic, not a continuous wheel FPS measurement; it excludes cold shader compilation and is not evidence of physical-device GPU performance. [Evidence SHA-256 checksums](evidence/001/checksums.json) preserve the captured baseline.

**Targets, not measured outcomes:** initial gzip JS <100kB (met); combined post-3D gzip JS <300kB (currently exceeded by 22.932kB); aim for responsive scrolling on representative hardware and field p75 LCP≤2.5s, INP≤200ms, CLS≤0.1 after deployment. No real-user data, deployed Core Web Vitals, throttled-mobile performance, or Lighthouse performance score was collected. No pre-existing runnable page existed for a before/after comparison.

## Limitations and next phase

The figure, bag geometry, motif, monogram and SVG study need approved replacements. The collection contains one confirmed item and the curved panel is an HTML/CSS transition prototype. Film playback, sound and captions remain untested because no film exists. GLB loading/animation, runtime context-loss recovery and lazy-import failure are implemented seams/fallbacks but were not separately fault-injected; the unavailable-WebGL fallback was tested at startup.

Chromium logs one upstream **THREE.Clock deprecation warning** from R3F; there were no console errors in the tested standard flows. The >500kB lazy chunk and development audit findings remain visible limitations. Safari, Firefox, real iOS/Android hardware, screen readers, forced-colors/high-contrast mode, actual 200% browser zoom and slow-network/CPU conditions are untested. Software WebGL traces must not be presented as device benchmarks. The original minimal opening is available without JS; the complete scroll-through requires JS.

Recommended Phase 2: obtain approved identity/film assets and an optimized animated figure plus Sovereign GLB, confirm animation clip/hand attachment conventions and additional collection names/images, then replace stand-ins through the documented seams. Reassess lazy bundle weight and shader/model warm-up using cold and warm traces on physical mobile hardware, complete cross-browser/assistive-technology checks, and set up field measurement when hosted. Continue to defer product detail pages and checkout until explicitly scoped.

## Git handoff

The implementation was committed first. This report, evidence and project state are the following, separate documentation commit on `main`. Both commits are pushed together; the final task response records their exact SHAs and remote-tip verification. To inspect the handoff after publishing:

```sh
git fetch origin
git log -2 --oneline origin/main
git merge-base --is-ancestor a2e28065eb4ecda8c1785edf1508f2cba998f96b origin/main
git ls-remote origin refs/heads/main
```
