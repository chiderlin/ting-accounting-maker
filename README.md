# Maker Console 01

Task 001 procedural 3D playground. Run `npm install`, then `npm run dev` and open http://127.0.0.1:3000/playground.

Checks: `npm run lint`, `npm run typecheck`, `npm run build`.

Model: `src/components/MakerConsole.tsx`; reusable geometry: `geometry.ts`; studio/camera: `Scene.tsx`; independent controls: `Playground.tsx`.

Nine named assembly groups can be controlled independently. Keycaps, switches, encoder and screws also have individual local transforms. Units are artistic scene units, not manufacturing specifications. All physical components are geometry; only printed legends use generated canvas textures. No downloaded model or product image is used.

Use layer checkboxes to inspect internals, drag to orbit, scroll/pinch to zoom. Presets include front, side, back, top, bottom and 45 degrees. Animation Studio supports six mechanical motions, playback controls and normalized timeline scrubbing. See MOTION.md for controller and validation details. Scroll-driven landing-page integration remains deferred.

Screenshots: `output/playwright/`. Materials are a first-pass studio treatment; brushed-metal microstructure, realistic PCB routing, smoother enclosure normals and reference-level transmission remain Task 002 refinements. Browser dependency warnings about Three.Clock and PCFSoftShadowMap are nonfatal upstream compatibility warnings. Physical-device performance has not been benchmarked.
