---
phase: 02-animation-infrastructure
plan: 03
subsystem: ui
tags: [react, motion, animation, framer-motion, lazy-motion, accessibility, aria-live]

# Dependency graph
requires:
  - phase: 02-animation-infrastructure
    plan: 01
    provides: "useMoldingLoop hook returning { sceneIndex, shouldReduceMotion }"
  - phase: 02-animation-infrastructure
    plan: 02
    provides: "InjectionMoldingStatic default export — reduced-motion fallback"
  - phase: 01-foundation
    provides: "motionTokens.js with SCENE_ENTER, SCENE_EXIT, COLOR constants; LazyMotion in App.jsx"

provides:
  - "SceneWrapper — m.div cross-fade envelope; takes key={sceneIndex} from parent to trigger AnimatePresence"
  - "InjectionMoldingLoop — orchestrator wiring useMoldingLoop + SceneWrapper + InjectionMoldingStatic"
  - "Phase 2 animation infrastructure complete and browser-observable"

affects:
  - "Phase 3-4 scene components (replace SceneStub inline stubs with real SVG scene files)"
  - "HomePage hero section (InjectionMoldingLoop is the component to embed)"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AnimatePresence mode='wait' with key on child (not on AnimatePresence itself)"
    - "m alias with eslint-disable comment — JSX member expression not tracked by no-unused-vars"
    - "Inline stub pattern — intentionally temporary placeholder, Phase 3 replaces by index"
    - "aria-live polite + aria-atomic on sr-only span for screen reader scene announcements"

key-files:
  created:
    - src/components/animation/SceneWrapper.jsx
    - src/components/animation/InjectionMoldingLoop.jsx
  modified: []

key-decisions:
  - "key={sceneIndex} on SceneWrapper (child), NOT on AnimatePresence — placing it on AnimatePresence silently breaks exit animations"
  - "SceneStub intentionally inline — separate stub files would be overwritten by Phase 3 scene imports, inline is cleaner"
  - "eslint-disable comment on m import — ESLint no-unused-vars cannot detect JSX member-expression usage (m.div), disable is the correct narrow fix"
  - "AnimatePresence imported directly (not m alias) — AnimatePresence is not an animated element and has no m equivalent"

patterns-established:
  - "SceneWrapper pattern: thin m.div envelope, FADE variants from motionTokens presets, parent sets key"
  - "Orchestrator pattern: useMoldingLoop → branch (static or animated) → AnimatePresence → keyed SceneWrapper → scene content"

requirements-completed: [INF-04]

# Metrics
duration: 5min
completed: 2026-04-01
---

# Phase 02 Plan 03: SceneWrapper + InjectionMoldingLoop Summary

**AnimatePresence cross-fade loop wiring useMoldingLoop through keyed SceneWrapper with 7 colored stub scenes and OS reduced-motion fallback to InjectionMoldingStatic**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-01T17:12:45Z
- **Completed:** 2026-04-01T17:17:00Z
- **Tasks:** 2 of 2
- **Files modified:** 2 created

## Accomplishments

- Created `src/components/animation/SceneWrapper.jsx` — m.div with FADE variants built from SCENE_ENTER/SCENE_EXIT presets in motionTokens.js
- Created `src/components/animation/InjectionMoldingLoop.jsx` — orchestrator with AnimatePresence mode="wait", keyed SceneWrapper, and aria-live accessibility region
- key={sceneIndex} correctly placed on SceneWrapper (not AnimatePresence) — exits fire before next scene mounts
- shouldReduceMotion true path renders InjectionMoldingStatic with no AnimatePresence overhead
- 7 distinct stub colors + SCENE_LABELS array — visually and semantically exercisable in the browser
- npm run build: 359ms, no errors; zero lint errors in new files

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SceneWrapper cross-fade envelope** - `f9dc3bc` (feat)
2. **Task 2: Create InjectionMoldingLoop orchestrator with stub scenes** - `7954a65` (feat)

**Plan metadata:** (added in final commit below)

## Files Created/Modified

- `src/components/animation/SceneWrapper.jsx` — Thin fade envelope; `m.div` with FADE variants, `absolute inset-0`, no AnimatePresence import
- `src/components/animation/InjectionMoldingLoop.jsx` — Orchestrator: useMoldingLoop → reduced-motion branch → AnimatePresence + keyed SceneWrapper + SceneStub; aria-live region

## Decisions Made

- `key={sceneIndex}` on `<SceneWrapper>`, not on `<AnimatePresence>` — AnimatePresence intercepts key changes on direct children to trigger exit animations; keying AnimatePresence itself silently prevents exits
- `SceneStub` is intentionally inline rather than extracted to files — Phase 3 will replace each scene by index with a real import; separate stub files would only be deleted
- `eslint-disable-next-line no-unused-vars` on the `m` import — `no-unused-vars` rule pattern `^[A-Z_]` does not cover lowercase `m`, and ESLint cannot track JSX member-expression usage (`m.div`). Narrow disable with explanation is the documented last-resort per project CLAUDE.md.
- `AnimatePresence` imported from `"motion/react"` directly (not through `m` alias) — AnimatePresence is a wrapper component, not a motion element; it has no `m` equivalent

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added eslint-disable comment for `m` alias**
- **Found during:** Task 1 (SceneWrapper lint verification)
- **Issue:** ESLint `no-unused-vars` with pattern `^[A-Z_]` flags lowercase `m` import as unused. JSX member expressions (`m.div`) are not recognized as variable references by the rule. Build succeeds but lint exits with error.
- **Fix:** Added `// eslint-disable-next-line no-unused-vars` with an inline explanation directly above the import line
- **Files modified:** `src/components/animation/SceneWrapper.jsx`
- **Verification:** `npm run lint --quiet` passes for SceneWrapper.jsx with zero new errors; pre-existing errors in Navbar.jsx, SparkBurst.jsx, AboutPage.jsx confirmed out of scope
- **Committed in:** `f9dc3bc` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (missing critical — lint correctness)
**Impact on plan:** Necessary for lint gate to pass. Does not affect runtime behavior or bundle size. No scope creep.

## Issues Encountered

None beyond the lint fix above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 2 animation infrastructure is complete: useMoldingLoop (Plan 01) + InjectionMoldingStatic (Plan 02) + SceneWrapper + InjectionMoldingLoop (Plan 03) are all wired and browser-observable
- `InjectionMoldingLoop` is ready to be embedded in `HomePage.jsx` hero section (Phase 3 or 4 task)
- Phase 3 replaces `SceneStub` inline stubs with real SVG scene components one by one, starting from `index=0`
- No blockers

## Self-Check: PASSED

- `src/components/animation/SceneWrapper.jsx` — FOUND
- `src/components/animation/InjectionMoldingLoop.jsx` — FOUND
- Commit `f9dc3bc` — FOUND in git log
- Commit `7954a65` — FOUND in git log

---
*Phase: 02-animation-infrastructure*
*Completed: 2026-04-01*
