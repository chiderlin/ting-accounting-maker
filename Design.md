# TING — The Maker's Studio

## Landing Page V1 — approved direction
Industrial Design Portfolio × Digital Museum. A personal exhibition, not a SaaS template or a hardware sales site. TING is an accounting professional with five years of work experience in Japan, currently preparing for CPA, interested in RPA, AI, Game Boy assembly, leather notebook craft and retro photography. The Accounting Maker brand is a shared initiative; do not claim completed client projects or CPA certification.

## Visual system
- Warm gallery white #F4F3EE, ink #20211F, muted #64665D, accent #D35C37. Preserve existing object's ivory/olive/terracotta materials.
- Oversized editorial sans-serif typography, tight tracking, small monospace exhibition labels, generous negative space, fine rules, asymmetric 12-column compositions. No generic rounded cards, gradients, decorative particles or stock icon grids.
- Full-viewport opening exhibition with large real 3D object, title and restrained metadata. Dark contrasting About section; light editorial Work and Collection sections; strong contact closing.
- Reference: https://recent.design/i/jxpvlxl-ai-generated-macro-pad-3d-model and https://recent.design/i/qkfor3e-3d-product-explorations .

## Interaction
Entry: assembled OBJECT 001 / MAKER CONSOLE, drag to orbit. Wheel scroll must scroll page, not zoom canvas. Sticky canvas within opening chapter only. Scroll progress drives existing exploded-view controller from 0 to 1; keep object fully visible and hold final exploded view briefly, then reveal TING introduction. No compulsory reassembly before About; reverse scroll reassembles naturally. No scroll hijacking. Touch users retain vertical page scrolling. Reduced-motion users see static assembled scene or descriptive fallback. Essential content is HTML.

## Information architecture
1. Opening exhibition — THE MAKER'S STUDIO / OBJECT 001.
2. About — HELLO, I'M TING. Accountant. Maker. Curious mind. Include Japan experience, CPA in progress, accounting, automation and personal interests.
3. Work — accounting workflows, RPA and AI project explorations; distinguish offerings from verified completed work.
4. Collection — numbered exhibits; future OBJECT 002 Game Boy, 003 Leather Journal, 004 Film Camera. Do not build additional 3D models in V1 or imply they are available.
5. Collaboration — AI, automation, better workflows. Real contact details must be supplied before launch; no invented email or dead CTA.
10 identity tags: Accounting Maker, Automation Crafter, AI Explorer, Workflow Optimizer, Systematic Thinker, Retro Tech Lover, Leather Crafter, Film Photography Enthusiast, Japan Experience, CPA in Progress.

## Implementation boundary
Use task2-motion-studio as baseline. Preserve /playground and existing model, motion rig, materials and presets. Production home is /. No intermediate prototype or new framework. Test desktop/mobile, forward/reverse scroll, drag, fallback, lint/typecheck/build. Visual approval and real contact details are launch gates.

---

# Historical 3D specification (Tasks 001–002)
The following is retained for engineering reference. The V1 interaction and layout above supersede conflicting earlier landing-page requirements.

# 3D Art Direction & Motion Design

## Task 001 implementation — 2026-11-26

Scope: standalone `/playground`, using Next.js, TypeScript, React Three Fiber and drei. Warm ivory studio, separate inspection sidebar, six camera presets. Original six-key Maker Console with olive AI and terracotta RUN keycaps, LCD, knurled metal rotary encoder, frosted perforated cover, ivory perimeter enclosure, circuit board and visible fasteners.

Geometry strategy: beveled extruded rounded outlines with real holes, curved custom keycaps, cylindrical machined details and individually named assembly groups. Group axes use Y-up; encoder rotates around Y and key presses follow local Y. Printed legends are generated textures on actual geometry. Future exploded-view work should store assembled transforms before applying offsets.

Task 001 establishes geometry and adjustable PBR studio foundations. Task 002 refines materials and lighting; Tasks 003–006 remain separate work. No formal landing-page content or scroll animation is implemented here.

## 1. Creative Direction

**Style:** Soft Industrial Craft / Retro Tech Minimalism

The website should combine professional credibility with tactile, nostalgic, and playful industrial design.

The central visual metaphor is:

**Disassemble → Understand → Reassemble**

This represents the owner's passion for craftsmanship, retro hardware, accounting, process optimisation, and intelligent automation.

### Visual References

- https://recent.design/i/jxpvlxl-ai-generated-macro-pad-3d-model
- https://recent.design/i/qkfor3e-3d-product-explorations

Use these references for visual quality, material treatment, product composition, and mechanical animation language. Do not directly replicate the original product designs.

## 2. Signature 3D Object — The Maker Console

Create an original retro-inspired electronic device combining:

- Game Boy-inspired form factor
- Mechanical macro pad
- Calculator elements
- Physical knobs and buttons
- Retro monochrome LCD
- Translucent plastic casing
- Subtle leather details

The object serves as a symbolic representation of the personal brand rather than a commercial hardware product.

### Component Structure

Every major component must be independently manipulable:

- Bottom enclosure
- PCB and electronic components
- Top enclosure
- LCD screen
- Mechanical switches
- Keycaps
- Rotary encoder
- Screws and connectors

Use meaningful mesh names and maintain consistent local origins for animation.

## 3. Material & Lighting

- Warm ivory matte plastic
- Translucent frosted polycarbonate
- Muted olive-green keycaps
- Terracotta accent keys
- Brushed aluminium
- Cognac brown leather
- Dark olive monochrome LCD

Use physically based materials (PBR), soft studio lighting, ambient occlusion, and soft contact shadows.

Avoid neon lighting, excessive bloom, glossy cyberpunk aesthetics, and generic low-quality cartoon objects.

## 4. Required Animations

### M01 — Hero Entrance

- Duration: 1.2–1.8 seconds
- Reveal the complete 3D object with subtle translation and rotation.
- Maintain a stable composition.
- Do not delay access to the main content.

### M02 — Idle Motion

- Subtle breathing motion when the object is visible.
- Rotation amplitude: approximately ±3 degrees.
- Slow, calm motion.
- Pause when outside the viewport.

### M03 — Pointer Interaction

- Respond to mouse position with subtle 3D rotation.
- Maximum rotation: approximately ±8 degrees.
- Smooth interpolation and damped return.
- Disable pointer tracking on touch devices.

### M04 — Scroll-driven Exploded View

- Animate individual 3D components along their own assembly axes.
- Separate the keycaps, switches, casing, LCD, PCB, and base.
- Preserve physical dimensions and visual alignment.
- Reveal internal details progressively.
- Synchronise animation progress with scroll position.
- Support reversible playback when scrolling upwards.

### M05 — Mechanical Reassembly

- Reassemble components in their physically appropriate order.
- Use staggered timing.
- Add subtle mechanical settling.
- Avoid exaggerated bouncing or elastic effects.

### M06 — Tactile Button Interaction

- Keycaps move vertically when pressed.
- Rotary knobs rotate around their actual axes.
- LCD content responds to selected interaction.
- Any sound effect must be optional and disabled by default.

### M07 — Supporting 3D Objects

Service and project cards may contain smaller retro-inspired objects.

Use restrained hover rotation and depth changes. Prefer pre-rendered images for secondary objects unless real-time 3D interaction is necessary.

## 5. Animation Principles

- Mechanical rather than decorative.
- Tactile rather than flashy.
- Smooth rather than fast.
- Purposeful rather than distracting.
- Every movement should communicate structure, craftsmanship, or functionality.

Do not use generic floating spheres, excessive particles, random object rotations, or animation solely for decoration.

## 6. Technical Implementation

Recommended stack:

- Next.js
- TypeScript
- Three.js
- React Three Fiber
- @react-three/drei
- GSAP
- GSAP ScrollTrigger

Prefer procedural geometry for the initial prototype.

Complex assets may be created externally and imported as GLB/glTF models.

The signature object must be rendered as a real 3D scene with independently animatable components.

Do not substitute the primary exploded-view experience with static images, GIFs, flat CSS layers, or simple image rotation without explicit approval.

## 7. Performance & Accessibility

- Target 60 FPS on capable desktop devices.
- Target at least 30 FPS on supported mobile devices.
- Use adaptive device pixel ratio.
- Lazy-load non-critical 3D assets.
- Pause rendering when scenes are off-screen.
- Use on-demand rendering when animations are idle.
- Provide a static fallback when WebGL is unavailable.
- Respect prefers-reduced-motion.
- All essential website content must remain accessible without WebGL.
- Never block normal scrolling or navigation.

## 8. Acceptance Criteria

- The object is visually convincing from multiple angles.
- All major mechanical components can move independently.
- Exploded-view animation is smooth and reversible.
- No unintended mesh intersections during disassembly.
- Components return to their exact assembled positions.
- Materials and lighting maintain visual consistency.
- The experience works across desktop and mobile layouts.
- The landing page remains usable if 3D rendering fails.

## 9. Development Order

1. Build a standalone 3D object prototype.
2. Implement exploded-view and reassembly animations.
3. Validate geometry, materials, lighting, and performance.
4. Obtain visual approval.
5. Integrate the approved scene into the landing page.
6. Implement supporting interactions and responsive layouts.
7. Complete performance and accessibility testing.

## Task 002 implementation candidate

The standalone playground adds a profile-based motion controller, component registry and timeline, with independent key and rotary-cap control, LCD boot stages and scrubber. Presets are shared in presets.ts. The original landing-page motion requirements above remain unchanged; studio M01–M06 are defined separately in task2.md. See MOTION.md for pending visual and runtime checks.
