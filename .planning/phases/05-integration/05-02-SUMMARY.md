---
phase: 05-integration
plan: "02"
subsystem: ui
tags: [motion, framer-motion, scroll-animation, whileInView, useInView, spring]

# Dependency graph
requires:
  - phase: 05-integration
    provides: Motion LazyMotion infrastructure wrapping the app in App.jsx
provides:
  - ServicesSection with Motion m.div whileInView scale-in card reveals
  - IndustriesSection with Motion m.div whileInView stamp-in card reveals
  - WhyChooseUs with Motion m.div whileInView stamp-in card reveals
affects: [05-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "module-level cardVariants const with hidden/show states and custom(i) stagger delay"
    - "whileInView + viewport once:true for scroll-triggered reveals"
    - "EASE_SPRING_DEFAULT spread into transition for spring overshoot animations"

key-files:
  created: []
  modified:
    - src/components/home/ServicesSection.jsx
    - src/components/home/IndustriesSection.jsx
    - src/components/home/WhyChooseUs.jsx

key-decisions:
  - "useInView hook completely removed from all three files — Motion whileInView is the single scroll-trigger mechanism"
  - "cardVariants defined at module level (not inside component) so each render does not recreate the object"
  - "custom={i} prop carries stagger index into variants — no animationDelay style attribute needed"

patterns-established:
  - "Module-level cardVariants with hidden/show + custom(i) stagger: reusable pattern for any grid card reveal"
  - "viewport={{ once: true, amount: 0.2 }} as the standard whileInView viewport config"

requirements-completed: [INT-02]

# Metrics
duration: 5min
completed: 2026-04-01
---

# Phase 05 Plan 02: Section Scroll Animations Summary

**Three section components migrated from custom useInView hook + CSS animate-* classes to Motion m.div whileInView variants with spring stagger**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-01T18:15:08Z
- **Completed:** 2026-04-01T18:20:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- ServicesSection: scale-in variant (opacity 0, scale 0.85) with EASE_SPRING_DEFAULT, 0.1s stagger
- IndustriesSection: stamp-in variant (opacity 0, y -16, scale 1.1) with EASE_SPRING_DEFAULT, 0.08s stagger
- WhyChooseUs: stamp-in variant (opacity 0, y -20, scale 1.15) with EASE_SPRING_DEFAULT, 0.15s stagger
- All three files: useInView hook removed, ref attributes removed from grid wrappers
- CTA IDs `home-view-all-services-cta` and `home-explore-industries-cta` preserved exactly

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert ServicesSection.jsx to Motion whileInView** - `26eacbd` (feat)
2. **Task 2: Convert IndustriesSection.jsx and WhyChooseUs.jsx to Motion whileInView** - `3663d52` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `src/components/home/ServicesSection.jsx` - Replaced useInView + animate-scale-in with m.div whileInView cardVariants
- `src/components/home/IndustriesSection.jsx` - Replaced useInView + animate-stamp-in with m.div whileInView cardVariants
- `src/components/home/WhyChooseUs.jsx` - Replaced useInView + animate-stamp-in with m.div whileInView cardVariants

## Decisions Made

- `cardVariants` defined at module level (outside component function) — avoids object recreation on every render without needing `useMemo`
- `custom={i}` prop passes stagger index into variant `show` function, replacing inline `style={{ animationDelay }}` entirely
- `viewport={{ once: true, amount: 0.2 }}` (amount 0.3 for WhyChooseUs) chosen to match the original `rootMargin: "0px 0px -60px 0px"` intent of the useInView hook

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- First build attempt after Task 2 failed with a JSX mismatch error in `Hero.jsx` (`</div>` instead of `</m.div>`). Re-reading the file showed `</m.div>` already in place — the build cache was stale. Re-running the build passed immediately. No code change was needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three section components now use Motion whileInView for scroll-triggered reveals
- useInView hook is no longer imported by any home page section component
- Plan 05-03 can proceed to remove or audit remaining useInView usages across the codebase

---
*Phase: 05-integration*
*Completed: 2026-04-01*

## Self-Check: PASSED

- FOUND: src/components/home/ServicesSection.jsx
- FOUND: src/components/home/IndustriesSection.jsx
- FOUND: src/components/home/WhyChooseUs.jsx
- FOUND: .planning/phases/05-integration/05-02-SUMMARY.md
- FOUND: commit 26eacbd (Task 1)
- FOUND: commit 3663d52 (Task 2)
