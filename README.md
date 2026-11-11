# Pustaini — Phase 1

A frontend-only, scroll-driven handbag experience built with Vite, React, TypeScript, Three.js and React Three Fiber. Read [project state](docs/PROJECT_STATE.md) and its latest implementation report before changing the project. Standing workflow: [AGENTS.md](AGENTS.md).

## Run locally

Use **Node 22.22.0** (`nvm use`) and npm. Supported Node ranges are declared in `package.json`; Node 22.20+ or 24+ is required for the project skills installer.

```sh
npm ci
npm run dev
```

Open the printed local URL. No environment variables, backend, accounts, or external asset services are required.

| Command                                       | Purpose                                                                |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                                 | Development server                                                     |
| `npm run lint`                                | ESLint for app and verification scripts                                |
| `npm run typecheck`                           | Strict TypeScript check                                                |
| `npm run build`                               | Typecheck and production build in `dist/`                              |
| `npm run preview -- --port 4173 --strictPort` | Serve the production build                                             |
| `npm run measure:bundles`                     | Measure entry and lazy JS separately, raw/gzip/Brotli                  |
| `npm run verify:browser`                      | Production-preview desktop, emulated mobile, fallback and trace checks |

For browser verification, run `npx playwright install chromium` once, then build and start the production preview in one terminal and run `npm run verify:browser` in another. Set `PREVIEW_URL` if the preview uses a different address. Screenshots, axe results, browser results, bundle measurements, and a Chromium trace land in ignored `artifacts/`. Open `artifacts/runway-trace.json` in Chrome DevTools Performance. The trace scrolls 0→1→0 in 82 steps, with 120ms between steps. It is a repeatable lab diagnostic, not a real-device FPS or Core Web Vitals score.

## Architecture

- `src/app/`: composition and global styles.
- `src/chapters/`: semantic Opening, HouseFilm, Runway, Collection and Footer.
- `src/experience/scroll.ts`: native section-bound progress, chapter navigation, reversible blink and catalogue transition. One scheduled read/write pass after scroll/resize; no per-frame React state.
- `src/experience/LazyRunway.tsx`: proximity-based import, reduced motion, WebGL detection and load/error fallback.
- `src/experience/RunwayScene.tsx`: fixed front-row camera, deterministic approach/turn/hold, demand rendering and DPR ≤1.5.
- `src/content/chapters.ts`: chapter order and confirmed collection metadata.
- `public/assets/`: only used, web-ready assets. Current SVGs are authored stand-ins, not approved brand assets.
- `.agents/skills/`: five selected project Codex skills, excluded from the browser bundle. Sources/hashes are in `skills-lock.json`; MIT notices are in `docs/licenses/`.

The opening has real HTML in `index.html` before any JS loads. The 3D bundle is requested within 75% of a viewport of the runway. Reduced-motion and WebGL-unavailable sessions never import it. Rendering is requested only for changed visible runway progress; the final pose is held from 88% onward. Scroll, touch, keys and anchors remain browser-native. Blinks are visual only, ignore pointer events, and release after 180ms at rest.

## Add a chapter

Create a semantic section component under `src/chapters/`, with a unique `id`, a labelled heading and `tabIndex={-1}` for anchor focus. Add its order/label to `src/content/chapters.ts`, then compose it in `App.tsx`. Update the explicit runway/film/collection references in `scroll.ts` if inserting before those chapters. Verify direct links, reverse scrolling, resize and reduced motion. Do not add scroll hijacking.

## Add an approved asset

Place approved, licensed web-ready files under `public/assets/`, use root-relative paths, and record source, approval and license in the implementation report. Supply width/height and meaningful alt text; lazy-load below-fold images. Never commit raw production masters, unknown product details or speculative prices.

For the house film, replace the styled frame in `HouseFilm.tsx` with responsive `<video controls playsInline preload="none" poster="…">`, approved sources and captions/transcript. Keep its advance link; audio must require a user gesture. Do not fabricate loading percentages.

For an animated GLB, replace `RunwayFigure` contents while retaining its root transform and fixed camera. Scrub an animation mixer from chapter progress, support reverse scrubbing, keep the bag attached to the carrying hand, dispose loaded resources and test the final framing at mobile widths. Do not import model loaders into the entry bundle. Update the fallback SVG only with an approved still.

## Project skills

Installed with the project-scoped installer (`skills@1.8.1`, Codex only):

```sh
npx skills@1.8.1 add CloudAI-X/threejs-skills --agent codex --skill threejs-react-three-fiber threejs-animation threejs-performance --yes
npx skills@1.8.1 add addyosmani/web-quality-skills --agent codex --skill performance accessibility --yes
npx skills@1.8.1 list --agent codex
```

Only these five skills are selected. They are available to Codex on its next turn. Inspect upstream changes and licenses before reinstalling; the committed copies and lockfile record this implementation's versions.
