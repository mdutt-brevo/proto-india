---
phase: 04-scenes-4-7-and-polish
plan: "02"
subsystem: hero-animation
tags: [scenes, svg, framer-motion, ejection, product-reveal]
dependency_graph:
  requires: []
  provides: [EjectionScene, ProductRevealScene]
  affects: [InjectionMoldingLoop, SceneWrapper]
tech_stack:
  added: []
  patterns:
    - m.g grouping for shared scale transform-origin on SVG elements
    - y-translate variant on m.line (compositor-safe, never y1/y2 attribute)
    - SceneWrapper AnimatePresence exit handles loop seam — no special exit in component
key_files:
  created:
    - src/components/animation/scenes/EjectionScene.jsx
    - src/components/animation/scenes/ProductRevealScene.jsx
  modified: []
decisions:
  - "m.g used to group housing shapes in ProductRevealScene so scale transform applies from shared center — individual rects cannot share a transform-origin without a group"
  - "taglineVariant delay:0.8 places text after housing (0.7s) + accent (0.65+0.4s) are stable — prevents text competing visually with the part reveal"
  - "Loop seam handled entirely by SceneWrapper AnimatePresence exit — ProductRevealScene needs no exit variant; comment documents this explicitly"
metrics:
  duration: "~4min"
  completed_date: "2026-04-01"
  tasks_completed: 2
  files_created: 2
  files_modified: 0
---

# Phase 04 Plan 02: EjectionScene and ProductRevealScene Summary

**One-liner:** SVG+Motion Scene 6 (ejector pins y-translate pushing part upward) and Scene 7 (housing scale-reveal with brand tagline fade-up), sealing the animation loop.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | EjectionScene — ejector pins pushing part upward | 1fde840 | src/components/animation/scenes/EjectionScene.jsx |
| 2 | ProductRevealScene — finished part scale+fade + brand tagline | 53896c7 | src/components/animation/scenes/ProductRevealScene.jsx |

## What Was Built

### EjectionScene.jsx (Scene 6 — 1.5s)

Mould base fades in first via `frameVariant` (0.35s). Three `m.line` ejector pins then
translate upward via `pinVariant` (y: -45, delay: 0.25). The finished part `m.rect`
follows with `partVariant` (y: -50, delay: 0.3). The 50ms lead on the pins creates a
natural "pushing" relationship. All transforms are compositor-safe CSS transforms —
SVG `y1`/`y2` attributes are never mutated.

### ProductRevealScene.jsx (Scene 7 — 2.0s)

An `m.g` group wraps all housing shapes (outer shell, three connector ports, body recess)
and receives `partRevealVariant` (scale: 0.6→1, opacity: 0→1, delay: 0.1). An orange
accent dot pulses in at delay: 0.65 via `accentVariant`. Two `m.text` lines sharing
`taglineVariant` (y: 8→0, delay: 0.8) deliver the brand tagline "Precision in Every
Moulded Part". Total motion fits the 2.0s window with comfortable headroom.

### Loop Seam (HER-08)

ProductRevealScene contains no exit animation. A comment in the file documents that
SceneWrapper's AnimatePresence mode="wait" exit variant (opacity: 0) handles the
Scene 7 → Scene 1 transition seam. This keeps the component clean and avoids
duplicating exit logic.

## Verification Results

- `grep -r '"#' EjectionScene.jsx ProductRevealScene.jsx` → No bare hex literals
- Both files: `viewBox="0 0 400 300"` confirmed
- `grep "Precision in Every" ProductRevealScene.jsx` → tagline present
- `npx vite build --mode development` → clean build (302 kB index bundle)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- [x] src/components/animation/scenes/EjectionScene.jsx — exists
- [x] src/components/animation/scenes/ProductRevealScene.jsx — exists
- [x] Commit 1fde840 — EjectionScene
- [x] Commit 53896c7 — ProductRevealScene
- [x] Vite build clean
- [x] No bare hex literals
- [x] viewBox 0 0 400 300 on both files
- [x] Loop seam comment in ProductRevealScene
