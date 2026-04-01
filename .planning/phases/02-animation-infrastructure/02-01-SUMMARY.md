---
phase: 02-animation-infrastructure
plan: 01
subsystem: ui
tags: [react, motion, animation, hooks, state-machine]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: motionTokens.js with SCENE_DURATIONS array

provides:
  - useMoldingLoop hook: scene index state machine with OS reduced-motion awareness
  - Named export useMoldingLoop() returning { sceneIndex, shouldReduceMotion }

affects:
  - 02-02 (InjectionMoldingLoop orchestrator component)
  - 02-03 (all downstream scene components in Phases 3-4)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useEffect + clearTimeout pattern for timer-based state advancement"
    - "Functional updater setSceneIndex(i => ...) to avoid stale closures"
    - "shouldReduceMotion guard as early-return in useEffect body"

key-files:
  created:
    - src/hooks/useMoldingLoop.js
  modified: []

key-decisions:
  - "SCENE_COUNT derived from SCENE_DURATIONS.length to prevent drift when motionTokens.js changes"
  - "useReducedMotion null treated as false — animate until explicitly told to stop"
  - "No play/pause API in Phase 2 scope — kept hook minimal and composable"

patterns-established:
  - "Hook pattern: named export, no default export — matches useInView.js convention"
  - "Timer lifecycle: schedule in effect body, cancel in cleanup — one timer per scene"

requirements-completed: [INF-03]

# Metrics
duration: 2min
completed: 2026-04-01
---

# Phase 02 Plan 01: useMoldingLoop Scene State Machine Summary

**Scene index state machine advancing through 7 injection-moulding scenes via SCENE_DURATIONS timeouts, freezing on OS reduced-motion signal**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-01T17:09:28Z
- **Completed:** 2026-04-01T17:10:33Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- Created `src/hooks/useMoldingLoop.js` with named export matching project hook conventions
- SCENE_COUNT derived from `SCENE_DURATIONS.length` — stays in sync if motionTokens.js changes
- Reduced-motion path freezes index with no setTimeout fired; no cleanup needed for that branch
- useEffect deps `[sceneIndex, shouldReduceMotion]` with `clearTimeout` on every cycle prevents stacked timers
- Hook returns `{ sceneIndex, shouldReduceMotion }` — minimal surface area ready for InjectionMoldingLoop in Plan 02

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useMoldingLoop state machine hook** - `b798570` (feat)

**Plan metadata:** (added in final commit below)

## Files Created/Modified

- `src/hooks/useMoldingLoop.js` — Scene index state machine, imports SCENE_DURATIONS from ../lib/motionTokens

## Decisions Made

- SCENE_COUNT derived from `SCENE_DURATIONS.length` rather than hardcoding 7 — signals intent and auto-updates if durations change
- `useReducedMotion` returning `null` (SSR/unresolved) treated as `false` — animation plays until OS explicitly signals stop
- No play/pause or isRunning state — not in Phase 2 scope; keeps hook composable for Plan 02 orchestrator

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

The plan's automated verification (`node -e "import(...)..."`) failed due to Node's bare ESM resolution requiring `.js` extensions and lacking the JSX/React context. Replaced with a content-inspection script that verified all 9 acceptance criteria against the file source directly. Lint (`npx eslint src/hooks/useMoldingLoop.js`) and build (`npm run build`) both passed cleanly.

Pre-existing lint errors in `Navbar.jsx`, `SparkBurst.jsx`, and `AboutPage.jsx` are out of scope and logged as deferred.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `useMoldingLoop` is ready to be consumed by `InjectionMoldingLoop` in Plan 02-02
- Hook returns `{ sceneIndex, shouldReduceMotion }` matching the interface Plan 02-02 expects
- No blockers

## Self-Check: PASSED

- `src/hooks/useMoldingLoop.js` — FOUND
- `.planning/phases/02-animation-infrastructure/02-01-SUMMARY.md` — FOUND
- Commit `b798570` — FOUND in git log

---
*Phase: 02-animation-infrastructure*
*Completed: 2026-04-01*
