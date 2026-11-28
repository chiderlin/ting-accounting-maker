# Task 005 ? implementation and visual review

Date: 2026-11-27. Branch: `task5-maker-console-editions`.
Status: implemented, awaiting owner visual approval. Task 006 has not started. No merge or deployment configuration changes.

## Implementation

- Typed edition registry and reusable labelled, keyboard-accessible selector on the hero and playground. Only Maker Console has edition controls; selection survives navigation to other objects and back.
- Frosted polycarbonate: physical transmission, IOR 1.58, thickness 0.19 model units, warm ivory tint and fine surface bump. Brushed aluminium: directional procedural bump and physical anisotropy 0.75, tighter CNC-style corner radii, contrasting keycaps. Graphite: fine isotropic grain, anodised metal response, lighter keys and contrasting seam.
- Retained six keys and nine named assemblies. Added shell mounting bosses, differentiated shell radii and seams; rounded PCB corners clear mounting bosses. PCB traces sit above the board surface. Clamped small-part bevel radii to avoid impossible glass thickness and obscured LCD text.
- Maker-specific studio reflection fill; bounded DPR and demand rendering. Edition changes replace geometry/material resources in existing meshes, preserving animated groups, so no motion-registry rebind is required. Replaced geometries/materials and generated textures are disposed.
- Preserved archive capture of the default edition and other three objects. Model drag does not trigger object swipe. Hero orbit inertia is disabled so stopping a drag leaves a stable inspection angle.
- Corrected first-viewport selector clipping and added a rendering error boundary: WebGL initialization failure retains the surrounding HTML site.

## Validation

Commands run from repository root:

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; `/` and `/playground` generated |
| `$env:GITHUB_PAGES='true'; $env:PAGES_BASE_PATH='/ting-accounting-maker'; npm run build` | Passed; static export in `out/` |

Some sandboxed build attempts failed with `spawn EPERM`; rerunning with approved permissions passed. Static output was served locally at `http://127.0.0.1:3105/ting-accounting-maker/`, including the nested `/playground/` route. Production deployment was not performed. `next-env.d.ts` was restored after builds because Next regenerates its development/production type paths.

Browser verification used `npx --yes --package @playwright/cli playwright-cli -s=task5 run-code --filename=<script>` with scripts saved under `output/playwright/`:

- `task5-check.cjs`: nine rapid edition switches at progress 0.43254 preserved exact camera position, orbit target, page scroll, assembly UUIDs and transforms. Reverse scroll restored all assembly-group positions to zero. Idle render counter stayed unchanged over 500 ms. Object navigation hid the selector on unfinished objects and remembered the Maker edition. Keyboard Tab/Enter selection, 390px layout without horizontal overflow, and reduced-motion static assembly passed. This inspection script uses development React internals and runs against the development server.
- `task5-static-check.cjs`: all four default archive images captured, all four archive links selected the correct object, and the exported playground route loaded. Its initial WebGL probe exposed the missing error boundary, subsequently fixed.
- `task5-motion-check.cjs`: all six playground motions (explode, reassemble, turntable, key press, rotary, LCD boot) retained transforms/visibility/progress through all three editions at midpoint. WebGL-disabled browser showed the descriptive fallback and preserved page headings/navigation after the fix.
- `task5-capture.cjs`: final exported-site screenshots at desktop 1440?1000 and mobile viewport 390?844, assembled and exploded for each edition, plus archive.

Performance: local headless Chromium animation-frame sampling was approximately 60.8 Hz over 60 requested frames, with the sampled frosted scene reporting 475 draw calls and 251,840 triangles (render-pass counters, not a hardware GPU benchmark). Idle demand rendering was separately verified. Real mobile hardware FPS, touch gestures on physical devices, Safari and Firefox remain unverified; viewport emulation does not establish those results.

## Visual review

The same studio lighting and default orbit are used across the final edition comparison captures.

| Edition | Desktop | Mobile | Exploded desktop | Exploded mobile |
| --- | --- | --- | --- | --- |
| Frosted | [View](../output/playwright/task5-frosted-desktop.png) | [View](../output/playwright/task5-frosted-mobile.png) | [View](../output/playwright/task5-frosted-exploded.png) | [View](../output/playwright/task5-frosted-mobile-exploded.png) |
| Aluminium | [View](../output/playwright/task5-aluminium-desktop.png) | [View](../output/playwright/task5-aluminium-mobile.png) | [View](../output/playwright/task5-aluminium-exploded.png) | [View](../output/playwright/task5-aluminium-mobile-exploded.png) |
| Graphite | [View](../output/playwright/task5-graphite-desktop.png) | [View](../output/playwright/task5-graphite-mobile.png) | [View](../output/playwright/task5-graphite-exploded.png) | [View](../output/playwright/task5-graphite-mobile-exploded.png) |

Additional captures: [baseline](../output/playwright/task5-baseline.png), [archive](../output/playwright/task5-archive.png), [WebGL fallback](../output/playwright/task5-webgl-fallback.png), [reduced motion](../output/playwright/task5-reduced-motion.png), [playground](../output/playwright/task5-playground.png). Baseline used the initial viewport and is not a pixel-aligned before/after comparison.

## Assets and remaining limits

All added surface textures are original deterministic 256?256 RGBA data generated in `surfaceTextures.ts`, with no external assets or third-party texture licences required. Bump maps use `NoColorSpace`; existing canvas labels use sRGB. Texture wrapping uses model-space extrusion UVs (one unit approximately 20 mm); anisotropy follows the shell UV direction. No new network asset paths or basePath exceptions.

This remains a procedural industrial-design study, not fabrication-ready CAD. Fine brushing is intentionally subtle at mobile hero scale; owner review must decide whether the three finishes meet the desired visual quality. Automated collision checking and exhaustive inspection at every orbit angle were not performed. Physical mobile performance remains an acceptance gap.

Existing dependency `THREE.Clock` deprecation warnings and the missing favicon 404 remain; no new runtime application errors were seen in the normal flow. WebGL-disabled probes intentionally cause a renderer error caught by the scene boundary.

Owner visual approval is required by `tasks/task5.md` before declaring Task 005 complete or starting Task 006. Keep the task filename unchanged until that approval.
