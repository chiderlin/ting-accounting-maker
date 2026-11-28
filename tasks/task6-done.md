# Task 006 — Game Boy Editions

Baseline: task5-maker-console-editions at 80ceb4d. Follow Design.md Revision 2. User requested progression to Task 006; Task 005 visual approval is not independently recorded.

## Goal
Refine OBJECT 002 into a credible retro handheld design study with three independently selectable editions. Preserve the existing four-object Hero, Maker Console editions, archive, playground and deployment settings.

| ID | Edition | Art direction |
| --- | --- | --- |
| classic | Classic ABS (default) | Warm grey/ivory injection-moulded shell, burgundy A/B keys, charcoal D-pad, fine matte polymer grain, recessed green LCD. |
| transparent | Atomic Purple | Tinted translucent polycarbonate, real hollow shell walls, visible PCB, ICs, bosses and fasteners; dark controls, physically plausible transmission and thickness. |
| machined | CNC Machined | Satin silver aluminium, directional brushed grain and anisotropic highlights, smaller corner radii, precise seams and apertures, dark contrasting controls and glass. |

## Model and integration
- Improve front/rear shell, real screen/button/speaker apertures, circuit board, contacts, cartridge slot, battery door, screws and printed control legends. Retain retro handheld proportions. Original markings; no claim of Nintendo affiliation.
- Reuse editions.ts, surfaceTextures.ts, EditionSelector and existing scene/motion pipeline. Add typed handheld-specific configuration and keep Maker state independent.
- Use actual PBR materials with shell thickness and internal visibility; no simple colour-only variants. Dispose replaced resources. Default archive image uses Classic ABS.
- Preserve model orbit angle, scroll position and assembly progress when changing edition. Keep stable groups; any changed geometry must use identical compatible assembly transforms.
- Selector only for OBJECT 001 and 002; journal and camera remain unchanged. No new dependencies or production changes.

## Validation
- Check all editions in assembled and exploded views, from several angles, with matching lighting. Check shell apertures, geometry intersections, readable labels, internal visibility, silver reflections and accurate return to assembled transforms.
- Verify rapid switching preserves camera, motion progress and page position, per-object choice remembered when navigating, keyboard and mobile selector, archive selection, existing Maker Console editions and /playground.
- Test reduced motion, WebGL fallback, demand rendering and resource cleanup.
- Run lint, typecheck, regular build and GitHub Pages static export. Capture comparable desktop/mobile assembled and exploded screenshots. Record commands/results and limitations in tasks/task6-review.md. Do not mark done until owner visual review.
- No Task 007/008 implementation, merges or production deployment changes.
