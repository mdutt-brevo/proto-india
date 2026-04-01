---
phase: 03-scenes-1-3
plan: 02
subsystem: ui
tags: [react, framer-motion, svg, animation, injection-molding]

# Dependency graph
requires:
  - phase: 02-animation-infrastructure
    provides: SceneWrapper, useMoldingLoop, InjectionMoldingLoop orchestrator shell

provides:
  - MeltingScene.jsx — Scene 2 self-contained SVG animation (barrel heat glow + granule melt)

affects:
  - InjectionMoldingLoop.jsx (Phase 3 will swap SceneStub index 1 for MeltingScene)
  - 03-03-PLAN.md (Scene 3 injection stroke builds on heat-glow pattern)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "linearGradient + animated rect x-translate as proxy for animating SVG gradient position"
    - "Per-child inline variant object for per-item delay (staggered granule melt)"
    - "Barrel glow via opacity keyframe array — never mixing CSS keyframe + Motion variants on same element"

key-files:
  created:
    - src/components/animation/scenes/MeltingScene.jsx
  modified: []

key-decisions:
  - "SVG linearGradient cx/cy are not directly animatable via Motion; x-translate on a gradient-filled rect achieves equivalent left-to-right heat sweep"
  - "Barrel exterior glow uses Motion opacity keyframe array instead of Tailwind animate-pulse-glow class to avoid compositor conflict with variants"
  - "Per-granule delay uses inline variant object (not shared const) — shared consts cannot carry per-item delay values"

patterns-established:
  - "Gradient-sweep pattern: place linearGradient in defs, animate a rect with fill=url(#id) via x translation"
  - "Child variant-only pattern: root m.svg owns initial/animate; all descendants use variants only"
  - "No bare hex in JSX: all colors via COLOR.* from motionTokens.js"

requirements-completed:
  - HER-02

# Metrics
duration: 3min
completed: 2026-04-01
---

# Phase 03 Plan 02: MeltingScene Summary

**Isometric barrel SVG with progressive heat sweep (linearGradient + x-translate) and staggered granule scaleX/scaleY compression using variants-only Motion pattern**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-01T17:34:59Z
- **Completed:** 2026-04-01T17:37:30Z
- **Tasks:** 1
- **Files modified:** 1 (created)

## Accomplishments

- Created `MeltingScene.jsx` in the new `src/components/animation/scenes/` directory
- Barrel drawn as isometric rectangle with feed-throat and nozzle end caps, screw thread dashes — all in `COLOR.surfacePrimary`
- Progressive heat sweep: `linearGradient` in `<defs>`, animated `m.rect` sweeps x from -160 to 160 over 1.5s with `EASE_OUT_EXPO`
- Five granule rects fade and compress via `scaleX`/`scaleY` keyframe arrays with staggered `delay` (0.2–0.48s), never touching `width`/`height`
- Barrel exterior glow pulse via `opacity` keyframe array on a separate `m.rect` in `COLOR.accentOrange` — Motion variants only, no CSS keyframe conflict
- All children use `variants` only; `initial="hidden"` and `animate="visible"` live exclusively on root `m.svg`
- Zero bare hex literals — all colors via `COLOR.*` from `motionTokens.js`
- Vite build passes clean with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MeltingScene.jsx with progressive heat glow** - `5acd30f` (feat)

**Plan metadata:** (added below in final commit)

## Files Created/Modified

- `src/components/animation/scenes/MeltingScene.jsx` — Scene 2 animated SVG; isometric barrel with heat sweep, barrel glow pulse, and granule melt compression

## Decisions Made

- **SVG gradient position not animatable via Motion:** `linearGradient` `cx`/`cy` attributes are SVG presentation attributes, not CSS properties — Motion cannot interpolate them. Solution: place gradient in `<defs>`, fill a `m.rect` with `url(#heatGradient)`, and translate that rect with `x`. Achieves the same visual left-to-right sweep.
- **No CSS + Motion on same element:** Tailwind `animate-pulse-glow` class conflicts with Motion `variants` on compositor. Barrel glow uses Motion opacity keyframe array only.
- **Per-item delay requires inline variants:** Shared `const granuleVariant` cannot carry different `delay` values per granule. Each granule gets its own inline variant object with computed `delay: 0.2 + i * 0.07`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `MeltingScene.jsx` is ready to be imported into `InjectionMoldingLoop.jsx` — swap `<SceneStub index={1} />` for `<MeltingScene />` (Phase 3 plan 03 or integration step)
- Pattern established: gradient-sweep animation using x-translate proxy is reusable for Scene 3 injection stroke
- Build passes clean; component is self-contained, no props, exports `default MeltingScene`

---
*Phase: 03-scenes-1-3*
*Completed: 2026-04-01*
