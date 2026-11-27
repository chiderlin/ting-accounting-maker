# Task 002 — Motion Studio

The controller is independent of React and the model. Use select(id), play(), pause(), reverse(), replay(), reset(), setProgress(0–1). The component registry stores assembled transforms; every evaluation restores them before applying the profile. Reassembly samples the same explode path at 1-progress. No per-frame model React render is required; only the panel subscribes to state. The rig invalidates the demand canvas on changes.

## Audit and implementation notes

Task 001 already had nine named assembly groups and individual keycaps. Existing limitations: coarse bevels, straight PCB traces, floating LCD labels, encoder cap not separated from base, unmanaged materials/textures. Task 002 candidate improves bevel subdivisions, keycap dish, routed traces and pads, LCD label placement, presets, rotary cap hierarchy and explicit resource disposal. The original baseline screenshots remain under output/playwright.

## Verification status

Source changes only: lint, typecheck, build, browser screenshots, collision clearance, geometry normals, visual approval, resource lifetime under repeated operations and physical device performance have NOT been verified. Full industrial geometry refinement (machined knob, real USB opening, screw posts, switch pins and enclosure normals) remains outstanding. Camera presets retain user-controlled orbit; zoom out when inspecting the full exploded assembly. Contact shadow remains the original static floor treatment.

The branch is a review candidate, not a completed acceptance test.
