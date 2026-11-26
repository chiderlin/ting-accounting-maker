# Task 003 — TING Landing Page V1

Implement the production homepage on task3-landing-page, based on task2-motion-studio. Follow Design.md V1 direction. No extra prototype.

- Replace root redirect with the actual landing page; preserve /playground.
- Reuse Scene, MakerConsole, StudioController, makerProfile and MotionRig. Add optional exhibition mode to Scene; preserve default playground behaviour.
- Opening full-screen exhibition, drag orbit, disable wheel zoom in exhibition. Sticky canvas during first chapter, normalized scroll drives controller.setProgress(0–1). Reverse scroll restores assembled state. Hold exploded view, then leave canvas and reveal About.
- Add editorial About, Work, Collection and Collaboration sections; no generic SaaS cards or new models. Use actual biographical facts only. Clearly mark planned exhibits and service directions. Do not invent contact information.
- Scope styles to landing so existing playground remains intact. Responsive layout, keyboard-accessible navigation, reduced-motion and WebGL fallback; normal touch scrolling.
- Verify actual rendering at desktop and mobile widths, framing at 0/50/100%, scroll over canvas, drag, reverse scroll, and playground regression. Run lint, typecheck, build. Report unverified tests and remaining launch blockers.
- Do not merge to main or deploy without review.
