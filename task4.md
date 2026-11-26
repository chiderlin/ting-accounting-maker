# Task 004 — Object Collection

## Objective
Extend the existing Task 003 landing page with three original, high-quality, real-time 3D objects. Preserve the Maker Console opening, drag interaction, reversible scroll-driven exploded view, TING introduction and existing navigation. Work only on task4-object-collection; do not merge or change the production Pages deployment trigger.

## Objects
- OBJECT 002 — Game Boy: retro handheld console, ivory or translucent shell, recessed monochrome LCD, D-pad, A/B buttons, start/select buttons, speaker slots, cartridge and battery compartment. Use original detailing, accurate proportions, rounded/beveled geometry, tactile plastic and independently named assemblies. Do not imply Nintendo affiliation.
- OBJECT 003 — Leather Journal: handmade cognac leather cover, rounded corners, visible stitching, paper block with layered edges, spine and closure. Distinguish leather and paper materials. Use a meaningful cover-opening motion rather than forcing an electronic exploded-view pattern onto a notebook.
- OBJECT 004 — Film Camera: retro analogue camera, brushed metal and textured dark body, lens barrel, optical glass, shutter button, film advance lever, viewfinder and control dials. Use separate meaningful assemblies. Lens or film compartment exploration is optional after visual quality is established.

## Art direction
Industrial Design Portfolio × Digital Museum, per Design.md. Each object is a curated exhibit representing TING's personality: curiosity/assembly, craftsmanship/details, observation/perspective. Reuse existing studio lighting/material principles, fine details, believable contact shadows and restrained warm gallery backgrounds. Avoid generic cubes, emoji, stock images, fake CSS 3D or repeating the Maker Console geometry.

## Integration — Horizontal Hero Gallery
All four objects occupy the same existing top Hero exhibit position, not separate vertical Collection sections. Maker Console is the default first slide, followed by Game Boy, Leather Journal and Film Camera. Keep The Maker's Studio heading and existing spacious composition. Each slide updates its exhibit number, name, descriptive tags and model. Provide previous/next arrows, clickable exhibit indicators and horizontal touch swipe with a smooth lateral transition; no autoplay. Keep drag-to-orbit on the model independent of gallery navigation (mouse drag on model rotates; arrows/indicators and touch swipe outside the model switch exhibits). Vertical wheel continues to drive the active object's appropriate reversible motion, then enters TING About. Maker Console retains its existing exploded animation; Game Boy may disassemble, journal opens, camera may reveal lens/film assembly. Reset or deterministically sample the active motion at current scroll progress when switching. No need to visit every exhibit before About. No mandatory extra pinned chapters. Collection lower down may be a compact index linking to Hero exhibits; do not duplicate the large 3D scenes.

## Implementation
Inspect existing MakerConsole, Scene, MotionRig, controller, presets, Landing and CSS. Reuse compatible parts, add separate model components and minimal reusable exhibit scene/configuration as needed. Keep existing playground working. Lazy-load secondary models on selection or prefetch adjacent models when appropriate; use demand rendering and bounded DPR; avoid loading/rendering four active WebGL scenes at once where possible. Dispose resources, handle reduced motion and WebGL fallback. Keep Next.js static export and GitHub Pages basePath compatible. No new backend or unnecessary dependencies.

## Acceptance
- All three new objects are recognisable, visually refined actual 3D models with distinct materials and meaningful structure.
- Hero displays all four actual models in one horizontal gallery; arrows and indicators work in both directions, exhibit metadata updates, and lateral transitions do not conflict with model orbit or vertical scroll.
- Inspect each assembled model from multiple angles; no clipping or obvious mesh intersections.
- Drag works, wheel scrolls page, mobile layout readable, reduced-motion fallback available.
- Task 003 Maker Console motion and playground remain functional; Hero is extended to a horizontal gallery.
- Run lint, typecheck, build and GitHub Pages static export build; report exact results. If browser available, capture desktop and mobile screenshots of each exhibit and opening hero.
- Commit changes to task4-object-collection only. Document remaining issues and do not claim visual acceptance without browser verification.
