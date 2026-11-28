# Task 007 — Leather Journal Editions

Baseline: task6-gameboy-editions at 7229dc2. Follow Design.md Revision 2. The owner requested progression to Task 007; this does not independently establish prior visual approval.

## Objective
Refine OBJECT 003 into a tactile handmade leather journal with three actual 3D editions. Preserve the existing Hero gallery, Maker Console and Game Boy editions, archive, playground and production deployment configuration.

| ID | Edition | Material and construction |
| --- | --- | --- |
| cognac | Cognac (default) | Warm vegetable-tanned leather, fine natural grain, burnished layered cut edges, waxed tan thread, cream paper and brass snap. |
| noir | Noir | Black fine-grain leather, restrained satin highlights, charcoal stitching, ivory paper, darkened metal closure. |
| patina | Vintage Patina | Aged olive leather, organic tonal variation, creases at the hinge, edge wear, muted warm stitching, aged brass hardware and slightly warmer paper. |

## Implementation
- Reuse the existing typed edition registry and selector. Preserve per-object selection independently; show options on Object 003, not on the unfinished camera.
- Create original deterministic leather grain, broad colour/roughness variation and localized edge wear maps. Use physically based non-metal leather and metallic closure materials. Avoid uniform noise-only texture and colour-only variants.
- Refine front and back leather, lining, rounded burnished edges, thread holes and individual saddle stitches, spine, page block and paper edges. Show a ruled interior sheet and meaningful closure construction.
- Preserve a stable hinge group and scroll-driven reversible opening. The cover, lining, stitches and closure must move together. Avoid intersections and keep the whole book visible as it opens.
- Keep the existing canvas, orbit angle, scroll position and opening progress on edition change. Default archive capture uses Cognac.
- Dispose generated geometry, textures and materials. Keep demand rendering and static-export compatibility. No external dependencies or new backend.

## Acceptance
- [ ] Three convincing and clearly distinguishable editions; compare under the same lighting at desktop and mobile.
- [ ] Assembled and open views show leather grain, realistic edge finishing, paper and stitching.
- [ ] Rapid switches preserve camera and hinge state; reverse scroll returns to the exact closed state.
- [ ] Prior objects, archive, playground, keyboard controls, reduced motion and WebGL fallback remain functional.
- [ ] Run lint, typecheck, production build and Pages static export; record results and screenshots in tasks/task7-review.md.
- [ ] Owner visual approval before marking done. No Task 008 implementation or production deployment change.
