# Task 005 — Maker Console Editions

## Objective

Upgrade OBJECT 001 from the existing Task 004 prototype into a refined interactive industrial design exhibit with three genuinely distinct editions. Follow root Design.md Revision 2. Complete this object before developing editions for Game Boy, Leather Journal or Film Camera.

## Scope and baseline

- Work on task5-maker-console-editions, based on the current main branch containing Task 004.
- Preserve the horizontal four-object hero, archive previews, About, Work and Collaboration sections, and /playground.
- Keep Objects 002–004 unchanged except for necessary shared infrastructure integration. Do not show edition selectors for unfinished objects.
- Do not merge to main or change production deployment settings as part of this task.

## Three editions

| ID | Edition | Required visual treatment |
| --- | --- | --- |
| frosted | Frosted Polycarbonate (default) | Ivory translucent shell with physical thickness, believable softened transmission, visible PCB and hardware, olive AI and terracotta RUN accents, crisp monochrome LCD and tactile keycaps. |
| aluminium | Brushed Aluminium | Satin silver CNC-inspired housing, directional fine grain and anisotropic reflection, machined chamfers, precise seams and fasteners, contrasting keys and metal encoder. |
| graphite | Anodised Graphite | Dark graphite anodised/bead-blasted housing, subtle fine-grain texture, controlled reflections, contrasting edges, readable key legends and restrained accent colours. |

Retain the original six-key device identity. Refine proportions, chamfers, shell construction, switch openings, PCB details, screw heads, encoder knurling and labels wherever needed. Editions may differ in geometry and small construction details, not merely colour. The three art directions are provisional until visual approval.

## Implementation sequence

1. Inspect existing MakerConsole.tsx, Scene.tsx, Landing.tsx, geometry.ts, presets.ts, motion profiles and current package scripts. Record baseline assembled/exploded renders if browser access permits.
2. Establish a minimal typed edition registry with stable IDs, display names, swatches, defaults and material/geometry settings. Keep it extensible for Tasks 006–008 without building those editions yet.
3. Improve shared geometry and studio lighting, then implement and visually review Frosted Polycarbonate first.
4. Implement Brushed Aluminium, validating realistic directional highlights, surface grain, seams and edge treatment.
5. Implement Anodised Graphite, validating dark material readability and subtle roughness contrast.
6. Add the reusable Design Edition Selector near hero metadata. Display three labelled choices and selected state only for Maker Console. Update actual 3D materials and optional geometry in place.
7. Preserve orbit angle, page scroll and normalized animation progress on edition changes. Keep named assembly groups, physical axes and assembled transforms compatible with Motion Studio. Rebind replaced geometry and reapply progress when necessary.
8. Integrate default-edition archive thumbnail and confirm that clicking the archive still selects the correct object.
9. Test interactions, visual quality, performance and production static export. Record results and unresolved issues for owner approval.

## Rendering standards

Use physically based materials and suitable base colour, normal/bump, roughness and metalness data where warranted. For brushed aluminium use correctly oriented grain and anisotropic reflection where supported by the installed Three.js version. For frosted plastic use physical transmission, IOR and shell thickness rather than arbitrary transparency. Ensure correct texture colour space, consistent scale and UVs. Improve softbox lighting and environment reflections, preserving the warm neutral gallery background. Avoid excessive bloom, exaggerated wear, mirrored plastic or flat recolouring.

Procedural geometry is acceptable; Blender/GLB may be used if necessary for convincing details. Any external assets must have verified licences, documented provenance and locally bundled basePath-compatible URLs. Preserve independently animated parts. Do not substitute an image for the interactive model.

## Interaction and performance

- Separate object navigation, edition navigation, orbit and vertical scroll.
- Keep one active hero canvas; avoid remounting it on edition change.
- No autoplay; preserve reduced-motion behaviour and WebGL fallback.
- Use demand rendering, bounded DPR, texture reuse and appropriate cleanup.
- Keep selector keyboard accessible and readable on mobile.
- Keep default edition archive preview accurate without rendering all editions at once.

## Acceptance checklist

- [ ] All three editions have distinct, convincing surfaces and refined geometry at hero scale.
- [ ] Actual edition selector works in both directions, including rapid switching.
- [ ] Orbit angle and scroll-driven assembly progress remain stable across switches.
- [ ] All three editions explode and reassemble correctly; no clipping or unintended mesh intersections.
- [ ] Existing playground motions, other objects, gallery navigation and archive previews remain functional.
- [ ] Desktop and mobile assembled screenshots of all three editions and representative exploded views are recorded under comparable lighting for review.
- [ ] Mobile layout, keyboard controls, reduced motion, WebGL fallback and representative performance are tested.
- [ ] Run repository lint, typecheck and production build scripts; additionally test GitHub Pages static export with current repository configuration. Report exact commands and results.
- [ ] Document texture sources/licences, remaining limitations and any unverified tests.
- [ ] Obtain owner visual approval before declaring completion or proceeding to Task 006.

## Out of scope

Game Boy, Leather Journal and Film Camera editions; new objects; backend services; whole-site redesign; production deployment changes. Shared code should be introduced only as required by this object's three versions.

## References

See Design.md Revision 2 for the complete visual system, edition roadmap, interaction contract and PBR references. Existing tasks/task2.md, tasks/task3.md, tasks/task4.md and MOTION.md remain engineering references.
