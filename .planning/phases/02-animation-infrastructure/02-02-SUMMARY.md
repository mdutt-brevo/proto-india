---
phase: 02-animation-infrastructure
plan: 02
subsystem: ui
tags: [react, svg, accessibility, reduced-motion, injection-molding]

requires:
  - phase: 02-animation-infrastructure
    provides: "motionTokens.js COLOR constants (baseBg, surfacePrimary, accentOrange, textPrimary, textMuted)"

provides:
  - "InjectionMoldingStatic — pure SVG, zero-motion fallback component for prefers-reduced-motion users"
  - "src/components/animation/ directory established for Phase 3-4 scene components"

affects:
  - 02-animation-infrastructure plan 03 (InjectionMoldingLoop orchestrator)
  - Phase 3-4 scene components (share animation/ directory)

tech-stack:
  added: []
  patterns:
    - "Static SVG component with COLOR token imports — zero motion dependency"
    - "Accessibility split: role=img on wrapper div, aria-hidden=true on svg (prevents screen-reader double-announcement)"
    - "COLOR constants via motionTokens.js — no hardcoded hex in JSX"

key-files:
  created:
    - src/components/animation/InjectionMoldingStatic.jsx
  modified: []

key-decisions:
  - "Outer div carries role=img and aria-label; svg itself is aria-hidden=true to prevent double-announcement by screen readers"
  - "No framer-motion or motion/react imports — component is intentionally static; orchestrator (Plan 03) makes the branch decision"
  - "COLOR constants from motionTokens.js used for all colors; no hardcoded hex values inline"

patterns-established:
  - "animation/ directory: home for all scene components in Phases 3-4"
  - "Static fallback pattern: pure JSX/SVG with no animation dependency, consumed conditionally by orchestrator"

requirements-completed: [INF-05, INF-06]

duration: 2min
completed: 2026-04-01
---

# Phase 02 Plan 02: InjectionMoldingStatic Summary

**Pure SVG reduced-motion fallback showing a frozen injection-moulded part with rib detail, orange accent stripe, and brand tagline — zero framer-motion imports**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-01T17:09:29Z
- **Completed:** 2026-04-01T17:11:35Z
- **Tasks:** 1 completed
- **Files modified:** 1 created

## Accomplishments

- Created `src/components/animation/InjectionMoldingStatic.jsx` as a default export
- SVG depicts a recognisable injection-moulded rectangular housing with internal rib lines, gate mark, and orange accent edge
- All colors sourced exclusively from `COLOR` constants in `motionTokens.js` — no hardcoded hex
- Accessibility split: `role="img"` on wrapper div, `aria-hidden="true"` on SVG element
- Brand tagline "Precision in Every Moulded Part" present in JSX (HER-07 Scene 7 copy)
- `npm run build` succeeds; zero lint errors in the new file

## Task Commits

Each task was committed atomically:

1. **Task 1: Create InjectionMoldingStatic SVG fallback component** - `b6e6658` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified

- `src/components/animation/InjectionMoldingStatic.jsx` — Static SVG fallback for prefers-reduced-motion, consumed by InjectionMoldingLoop (Plan 03)

## Decisions Made

- The outer `<div>` carries `role="img"` and `aria-label`; the `<svg>` itself is `aria-hidden="true"`. This pattern prevents screen readers from double-announcing the content — the div is the semantic landmark, the SVG is purely visual decoration.
- No `useReducedMotion()` call in this component — that branch decision lives in the orchestrator (Plan 03), keeping this component unconditionally static and dependency-free.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. Pre-existing lint errors (`react-hooks/set-state-in-effect` in a different file, `no-unused-vars` in AboutPage.jsx) are unrelated to this plan and were not modified.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `src/components/animation/InjectionMoldingStatic.jsx` is ready for consumption by Plan 03 (InjectionMoldingLoop orchestrator)
- `src/components/animation/` directory is established for all subsequent scene components (Phases 3-4)
- No blockers

---
*Phase: 02-animation-infrastructure*
*Completed: 2026-04-01*
