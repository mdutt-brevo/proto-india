---
phase: 01-foundation
plan: 03
subsystem: animation-infrastructure
tags: [lazymotion, motion, animation-tokens, performance]
dependency_graph:
  requires: [01-01]
  provides: [LazyMotion provider, motionTokens constants]
  affects: [Phase 2 useMoldingLoop, Phase 3-4 scene components]
tech_stack:
  added: [motion/react LazyMotion, domAnimation feature bundle]
  patterns: [LazyMotion provider wrapping, shared animation constants module]
key_files:
  modified:
    - src/App.jsx
  created:
    - src/lib/motionTokens.js
decisions:
  - "LazyMotion wraps BrowserRouter (outermost JSX) — ensures all m.* components in the entire tree use the 4.6KB lazy bundle, not the 34KB full motion import"
  - "motionTokens.js placed in src/lib/ as a pure constants module with no React imports — importable by hooks, components, and utilities without circular dep risk"
  - "COLOR constants duplicated from tailwind.config.js — Motion animate() calls bypass Tailwind JIT so hex values must be explicit"
metrics:
  duration: "74 seconds"
  completed_date: "2026-04-01"
  tasks_completed: 2
  files_changed: 2
requirements_met: [INF-01, INF-02]
---

# Phase 01 Plan 03: LazyMotion Provider + Animation Tokens Summary

**One-liner:** LazyMotion with domAnimation wraps BrowserRouter in App.jsx; motionTokens.js exports 9 named constants (SCENE_DURATIONS sum 12.0s, easing curves, transition presets, brand colors) as the Phase 2-4 animation contract.

## What Was Built

### Task 1: LazyMotion provider in App.jsx

`src/App.jsx` was updated with exactly two changes:

1. Added `import { LazyMotion, domAnimation } from "motion/react"` after the react-router-dom and react imports.
2. Wrapped `BrowserRouter` with `<LazyMotion features={domAnimation}>` in the `App()` return statement.

`App()` now returns:

```jsx
<LazyMotion features={domAnimation}>
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
</LazyMotion>
```

All Phase 2-4 components that use `m.div`, `m.span`, etc. will now pay the 4.6KB lazy animation bundle cost rather than the full 34KB motion import.

### Task 2: src/lib/motionTokens.js

New file created at `src/lib/motionTokens.js` with **9 named exports**:

| Export | Type | Value |
|--------|------|-------|
| `SCENE_DURATIONS` | `number[]` | `[1.5, 1.5, 1.5, 2.0, 2.0, 1.5, 2.0]` — **sum: 12.0s** |
| `EASE_OUT_EXPO` | `number[]` | `[0.16, 1, 0.3, 1]` |
| `EASE_IN_OUT_SINE` | `number[]` | `[0.37, 0, 0.63, 1]` |
| `EASE_SPRING_DEFAULT` | `object` | `{ type: "spring", stiffness: 300, damping: 30 }` |
| `SCENE_ENTER` | `object` | `{ duration: 0.4, ease: EASE_OUT_EXPO }` |
| `SCENE_EXIT` | `object` | `{ duration: 0.3, ease: EASE_IN_OUT_SINE }` |
| `MICRO` | `object` | `{ duration: 0.15 }` |
| `REVEAL` | `object` | `{ duration: 0.6, ease: EASE_OUT_EXPO }` |
| `COLOR` | `object` | `{ baseBg, surfacePrimary, accentOrange, textPrimary, textMuted }` |

SCENE_DURATIONS sum verification: `node --input-type=module` confirmed `Sum: 12 PASS`.

## Success Criteria Status

- INF-01: LazyMotion with `features={domAnimation}` wraps BrowserRouter in App.jsx — PASS
- INF-02: `src/lib/motionTokens.js` exists with SCENE_DURATIONS (7 elements, sum 12.0s), easing curves, transition presets, and COLOR constants — 9 named exports total — PASS
- Build: `npm run build` exits with code 0 — PASS (`built in 516ms`)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | `49493ca` | feat(01-03): wrap app tree with LazyMotion + domAnimation |
| Task 2 | `a08e4d6` | feat(01-03): add motionTokens.js animation constants |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `src/App.jsx` — FOUND, contains LazyMotion import and JSX wrapper
- `src/lib/motionTokens.js` — FOUND, 9 exports, SCENE_DURATIONS sum = 12.0
- Commit `49493ca` — FOUND
- Commit `a08e4d6` — FOUND
- Build — PASSED (516ms, no errors)
