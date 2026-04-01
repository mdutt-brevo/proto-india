---
phase: 04-scenes-4-7-and-polish
plan: 01
subsystem: ui
tags: [react, svg, motion, animation, framer-motion, injection-molding]

# Dependency graph
requires:
  - phase: 03-scenes-1-3
    provides: InjectionScene pattern (variants-only, m.svg root, COLOR constants, ESLint disable comment)
  - phase: 02-animation-infrastructure
    provides: motionTokens.js constants (COLOR, EASE_OUT_EXPO, EASE_IN_OUT_SINE, SCENE_DURATIONS)
provides:
  - FillingScene.jsx — Scene 4, clipPath mould cavity fill reveal (accentOrange rising upward)
  - CoolingScene.jsx — Scene 5, orange-to-slate color shift + left/right mould half separation
affects: [04-02, 04-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - clipPath reveal animation via m.rect inside <defs><clipPath> — clip rect y/height animate, orange fill rect is static
    - fill color keyframe array with times[] for staged color transitions on m.rect
    - per-axis transition overrides inside a single variants object (x, opacity each with their own duration/delay)

key-files:
  created:
    - src/components/animation/scenes/FillingScene.jsx
    - src/components/animation/scenes/CoolingScene.jsx
  modified: []

key-decisions:
  - "FillingScene uses clipPath rect y/height animation — orange fill rect is static and always full-size; only the visible clip window grows"
  - "CoolingScene fill keyframe uses times:[0, 0.3, 1] so color holds orange for first 30% of 1.2s, then cools to surfacePrimary"
  - "Mould separation delay=0.9 fires after color shift largely completes (0.2 + ~0.7s into 1.2s fill transition)"
  - "fill color is the ONLY animated property on the part rect in CoolingScene — no layout thrashing risk"

patterns-established:
  - "clipPath reveal: define <clipPath id> in <defs>, place m.rect inside, put static fill rect outside defs with clipPath='url(#id)'"
  - "Per-axis transition overrides: x, opacity, fill each get their own duration/delay inside the transition object of a single variant"

requirements-completed: [HER-04, HER-05]

# Metrics
duration: 4min
completed: 2026-04-01
---

# Phase 4 Plan 01: Mould Filling + Cooling Scenes Summary

**ClipPath upward cavity reveal (FillingScene) and orange-to-slate color shift with mould half separation (CoolingScene) — both self-contained SVG+Motion components fitting within their 2.0s SCENE_DURATIONS slots**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-01T17:53:05Z
- **Completed:** 2026-04-01T17:57:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- FillingScene delivers a clipPath reveal: an m.rect inside `<defs><clipPath>` grows from y=215,h=0 to y=85,h=130 over 1.4s (EASE_OUT_EXPO, delay=0.3), uncovering a static accentOrange fill rect bottom-to-top
- CoolingScene delivers a two-phase animation: fill keyframe transitions accentOrange→surfacePrimary over 1.2s (EASE_IN_OUT_SINE), then left/right mould halves translate ±30px over 0.6s (EASE_OUT_EXPO, delay=0.9)
- Both follow the established InjectionScene pattern: variants-only on children, container staggerChildren, no bare hex literals, viewBox 0 0 400 300, eslint-disable comment on m import

## Task Commits

Each task was committed atomically:

1. **Task 1: FillingScene — clipPath mould cavity reveal** - `c32145c` (feat)
2. **Task 2: CoolingScene — color shift + mould separation** - `f38baff` (feat)

**Plan metadata:** (docs: to be committed after summary)

## Files Created/Modified

- `src/components/animation/scenes/FillingScene.jsx` — Scene 4, mould cavity clipPath fill reveal animation
- `src/components/animation/scenes/CoolingScene.jsx` — Scene 5, cooling color shift + mould half separation animation

## Decisions Made

- clipPath approach for FillingScene: the orange fill rect is full-size and static; only the clip rect y/height animates. This avoids animating fill opacity (which would require a semi-transparent mid-state) and keeps the animation semantically correct — the material IS there, it's just being revealed.
- fill keyframe with `times` in CoolingScene: `times:[0, 0.3, 1]` holds orange through the first 0.3s so the part is clearly visible before cooling begins. Pure linear would start cooling immediately and feel too abrupt.
- Mould separation delay=0.9: fires when ~0.7s into the 1.2s fill duration has elapsed, giving the color shift about 60% completion before the halves open. This reads as "part cooled enough to release" rather than "mould opens while still hot".

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- FillingScene and CoolingScene are ready for wiring in Plan 03 (`04-03-PLAN.md`)
- Both files export a default named component, accept no props, and follow the scene pattern established in Phase 3
- Blocker still noted: clipPath + preserveAspectRatio interaction on Safari needs physical iOS device validation (pre-existing concern from STATE.md)

---
*Phase: 04-scenes-4-7-and-polish*
*Completed: 2026-04-01*
