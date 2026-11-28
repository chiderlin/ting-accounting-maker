# Task 008 — Film Camera Editions

Baseline: task7-journal-editions at 9a24559. Follow Design.md Revision 2. Owner requested progression; earlier visual approvals are not independently verified.

## Objective
Refine OBJECT 004 into an original analogue rangefinder-inspired camera study. Deliver three genuinely distinguishable interactive 3D editions. Preserve all nine prior editions, the four-object gallery, archive, playground and production deployment settings.

| ID | Edition | Art direction |
| --- | --- | --- |
| chrome | Silver Chrome (default) | Satin silver top and bottom plates, brushed metallic highlights, polished bevels, black pebbled leatherette, engraved dials and dark lens barrel. |
| matte | Matte Black | Fine-grain black finish, restrained satin highlights on controls, readable white engravings, layered black metal and leatherette. |
| brass | Heritage Brass | Black-painted brass, localized exposed brass on contact edges and corners, restrained scratches, warm aged hardware, subtle leatherette wear. |

## Implementation
- Extend existing edition registry and selector; preserve independent selection for all four objects. No new framework or dependencies.
- Improve camera silhouette, plate seams, leatherette panels, finder windows, hot shoe, shutter speed and advance controls, rewind knob, film door, mount and screws.
- Construct lens as actual hollow annular geometry, not stacked solid discs. Add knurled focus/aperture rings, engraved scales, internal aperture diaphragm and curved coated glass surfaces. Preserve independently named mount, focus barrel, optics and top deck groups.
- Use physically based metal, paint, glass and nonmetal leatherette. Use local original texture maps with correct colour space; black paint is a dielectric, exposed brass is metallic. Localize wear to handling edges rather than uniform noise. Keep studio reflections legible and subtle.
- Preserve camera/orbit position, scroll and normalized exploded-view progress on edition changes. Keep model visible through assembly animation. Archive defaults to Silver Chrome.
- Dispose generated textures/geometries/materials; retain demand rendering, fallback and reduced-motion behaviour.

## Acceptance
- [ ] Inspect all three editions in assembled and exploded views, multiple angles, comparable desktop/mobile lighting; verify curved glass, hollow barrel, engraving readability, leatherette and edge wear.
- [ ] Verify independent edition selection on all four exhibits (12 editions total), rapid switching, orbit/scroll stability, reverse animation, archive navigation, playground and mobile/keyboard accessibility.
- [ ] Check for clipping/intersections, resource leaks and performance regressions; check reduced motion and WebGL fallback.
- [ ] Run lint, typecheck, regular production build and GitHub Pages static export. Record exact results and screenshots in tasks/task8-review.md.
- [ ] Owner visual approval before marking done or changing deployment. Do not merge main or modify workflow as part of this task.

Procedural geometry is a first implementation, not a guarantee of photorealism. If visual approval fails, refine the geometry or use licensed scanned textures / suitable authored GLB assets before release.
