# Task 009 — Landing Reading Motion

Branch: `task9-motion-discussion`. The owner reviewed the interactive first pass and accepted it on 2026-11-28.

## Intent

Give the landing page below the 3D exhibition a restrained editorial rhythm. Motion should support reading and interaction without competing with the objects or changing the established visual system.

## First pass

- A slim section reading guide appears from About through Contact. It follows reading progress, shows the current chapter on desktop, and becomes a top line on mobile. The existing exhibition progress line remains specific to the hero.
- Each chapter heading reveals once through a restrained vertical mask. Body copy remains stable and readable.
- Work dividers draw once when their rows enter view. Text does not animate into place.
- Archive previews and headings respond subtly to hover. The four Explore links have a small pointer-following movement, underline response and a circular arrow cue.
- Touch and keyboard navigation remain usable. Reduced-motion users see static lines and controls.

## Verification

- Lint, typecheck, regular production build and GitHub Pages static export passed with Node 24.22.1.
- Browser checks covered desktop and mobile layout, chapter progress, Work reveal, Archive magnet movement and reset, keyboard focus, reduced motion (`0s` transition), and no mobile horizontal overflow.
- A second static export with `PAGES_BASE_PATH=/ting-accounting-maker/task9` loaded both its homepage and `/playground/` route without failed nested assets or page errors.
- The owner accepted the visual direction. Keep the main homepage on its existing build and publish the task9 edition at the nested preview path.
