---
plan: "03-01"
phase: "03"
status: complete
---

# Plan 03-01: GranulesScene — Summary

## What was built

`src/components/animation/scenes/GranulesScene.jsx` — Scene 1 of the injection molding loop. An isometric technical-drawing hopper with motion.div granule particles that fall with eased gravity and staggered timing.

## Key decisions

- Particles are motion.div rounded squares with tumble rotation + scale variation
- Eased gravity fall (ease-in) with 30-50ms random stagger per particle
- Capped at 40 particles on mobile (hardwareConcurrency < 4), 60 on desktop
- All colors from COLOR constants in motionTokens.js
- Transparent background — floats on hero dark gradient

## Requirements addressed

- HER-01: Scene 1 granule particles falling into hopper ✓

## Commits

- `1e0b2e2`: feat(03-01): add GranulesScene with particle fall animation
