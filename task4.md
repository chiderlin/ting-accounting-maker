# Task 004 — Object Collection

## Objective
Extend the existing Task 003 landing page with three original, high-quality, real-time 3D objects. Preserve the Maker Console opening, drag interaction, reversible scroll-driven exploded view, TING introduction and existing navigation. Work only on task4-object-collection; do not merge or change the production Pages deployment trigger.

## Objects
- OBJECT 002 — Game Boy: retro handheld console, ivory or translucent shell, recessed monochrome LCD, D-pad, A/B buttons, start/select buttons, speaker slots, cartridge and battery compartment. Use original detailing, accurate proportions, rounded/beveled geometry, tactile plastic and independently named assemblies. Do not imply Nintendo affiliation.
- OBJECT 003 — Leather Journal: handmade cognac leather cover, rounded corners, visible stitching, paper block with layered edges, spine and closure. Distinguish leather and paper materials. Use a meaningful cover-opening motion rather than forcing an electronic exploded-view pattern onto a notebook.
- OBJECT 004 — Film Camera: retro analogue camera, brushed metal and textured dark body, lens barrel, optical glass, shutter button, film advance lever, viewfinder and control dials. Use separate meaningful assemblies. Lens or film compartment exploration is optional after visual quality is established.

## Art direction
Industrial Design Portfolio × Digital Museum, per Design.md. Each object is a curated exhibit representing TING's personality: curiosity/assembly, craftsmanship/details, observation/perspective. Reuse existing studio lighting/material principles, fine details, believable contact shadows and restrained warm gallery backgrounds. Avoid generic cubes, emoji, stock images, fake CSS 3D or repeating the Maker Console geometry.

## Integration
Replace the three PLANNED text-only exhibits in the existing Collection section with large editorial 3D exhibition sections in the same page. Use alternating/asymmetric compositions, generous whitespace, numbered captions and short existing personal stories. Each object can be dragged to rotate on desktop; wheel continues page scrolling. Maintain normal touch scrolling and responsive framing. The Maker Console remains the opening object; do not insert three more mandatory pinned scroll chapters before About. Additional object motion should be brief, optional, reversible and appropriate to its construction. Prioritise getting all three models visually convincing and integrated over building another animation studio.

## Implementation
Inspect existing MakerConsole, Scene, MotionRig, controller, presets, Landing and CSS. Reuse compatible parts, add separate model components and minimal reusable exhibit scene/configuration as needed. Keep existing playground working. Lazy-load secondary scenes near viewport; use demand rendering and bounded DPR; avoid loading/rendering four active WebGL scenes at once where possible. Dispose resources, handle reduced motion and WebGL fallback. Keep Next.js static export and GitHub Pages basePath compatible. No new backend or unnecessary dependencies.

## Acceptance
- All three new objects are recognisable, visually refined actual 3D models with distinct materials and meaningful structure.
- Collection displays actual models, not planned placeholders.
- Inspect each assembled model from multiple angles; no clipping or obvious mesh intersections.
- Drag works, wheel scrolls page, mobile layout readable, reduced-motion fallback available.
- Task 003 hero and playground unchanged in behaviour.
- Run lint, typecheck, build and GitHub Pages static export build; report exact results. If browser available, capture desktop and mobile screenshots of each exhibit and opening hero.
- Commit changes to task4-object-collection only. Document remaining issues and do not claim visual acceptance without browser verification.
