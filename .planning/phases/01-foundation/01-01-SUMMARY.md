---
phase: 01-foundation
plan: 01
subsystem: ui
tags: [three.js, react, vite, bundle-size, cleanup]

# Dependency graph
requires: []
provides:
  - GearLoader SVG (direct import) as the Suspense page-loading fallback
  - Zero Three.js references in all src/ files
  - src/components/three/ directory removed from version control
  - Clean Vite build with three/@react-three/fiber/@react-three/drei removed
affects:
  - 02-foundation (framer-motion setup — clean bundle baseline)
  - 03-foundation and beyond (no WebGL canvas collisions with new animation layers)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GearLoader SVG used as direct (non-lazy) import for loading fallback — safe because it is pure CSS/SVG with no async dependencies"
    - "DarkModeProvider wrapper removed from App(); dark mode context still available via useDarkMode hook for leaf components"

key-files:
  created: []
  modified:
    - src/App.jsx
    - src/components/home/Hero.jsx
    - src/components/home/ServicesSection.jsx
    - src/components/home/IndustriesSection.jsx
    - src/components/home/WhyChooseUs.jsx
    - package.json
    - package-lock.json

key-decisions:
  - "GearLoader3D replaced with GearLoader SVG BEFORE npm uninstall to prevent Suspense boundary crash at build time"
  - "DarkModeProvider wrapper removed from App() root — the provider was wrapping BrowserRouter unnecessarily; dark mode hook still works in leaf components via useDarkMode"
  - "lazy import from react KEPT in App.jsx — still required for page-level code splitting (HomePage, AboutPage, etc.)"
  - "git rm used (not plain rm) for three/ files to maintain correct git history"

patterns-established:
  - "Replace imports before uninstalling packages — avoids broken Suspense boundaries and build errors mid-execution"
  - "Audit grep must return zero outside the deletion targets before running npm uninstall"

requirements-completed:
  - DEP-01
  - DEP-02
  - DEP-03
  - DEP-04
  - DEP-05

# Metrics
duration: 15min
completed: 2026-04-01
---

# Phase 01 Plan 01: Three.js Removal and Bundle Cleanup Summary

**GearLoader SVG replaces GearLoader3D, all HeroScene/SectionScene lazy imports purged, and three/@react-three packages uninstalled — bundle reduced by ~490 kB of WebGL code**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-01T17:00:00Z
- **Completed:** 2026-04-01T17:15:00Z
- **Tasks:** 3
- **Files modified:** 7 (src/App.jsx, 4 home components, package.json, package-lock.json) + 4 deleted

## Accomplishments

- Replaced double-Suspense GearLoader3D with direct GearLoader SVG import in App.jsx
- Removed DarkModeProvider wrapper from App() root — BrowserRouter is now the outermost element
- Deleted all 5 Three.js lazy constants and their JSX Suspense blocks from Hero, ServicesSection, IndustriesSection, WhyChooseUs
- Uninstalled 5 packages (three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing) — 60 total packages removed
- Deleted src/components/three/ directory (4 files) from version control via git rm
- Vite build passes in 1.23s; main chunk 236 kB gzip 75 kB (Three.js ~490 kB eliminated)
- CTA IDs hero-get-quote-cta and hero-view-work-cta preserved intact in Hero.jsx

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace GearLoader3D in App.jsx, remove DarkModeProvider** - `97e521b` (refactor)
2. **Task 2: Remove HeroScene and SectionScene from all home components** - `fa09ae2` (refactor)
3. **Task 3: Uninstall Three.js packages and delete three/ directory** - `72d70e2` (chore)

## Files Created/Modified

- `src/App.jsx` - GearLoader3D lazy constants removed; PageLoader simplified to `<GearLoader />`; DarkModeProvider wrapper removed; GearLoader SVG imported directly
- `src/components/home/Hero.jsx` - Removed lazy/Suspense/useState/useEffect imports, HeroScene lazy constant, LazyGearBackground function, sceneReady state, opacity-transition div; dark gradient and CTA buttons preserved
- `src/components/home/ServicesSection.jsx` - Removed lazy/Suspense import, SectionScene lazy constant, Suspense wrapper block (variant="forge")
- `src/components/home/IndustriesSection.jsx` - Removed lazy/Suspense import, SectionScene lazy constant, Suspense wrapper block (variant="injection")
- `src/components/home/WhyChooseUs.jsx` - Removed lazy/Suspense import, SectionScene lazy constant, Suspense wrapper block (variant="mould")
- `package.json` / `package-lock.json` - three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing removed

**Deleted files (via git rm):**
- `src/components/three/GearLoader3D.jsx`
- `src/components/three/HeroScene.jsx`
- `src/components/three/IndustrialGear.jsx`
- `src/components/three/SectionScene.jsx`

## Decisions Made

- **GearLoader SVG as direct import (not lazy):** Safe because it is pure CSS/SVG with zero async dependencies. Lazy was only needed for the Three.js version.
- **DarkModeProvider removed from App() root:** The wrapper was placed outside BrowserRouter unnecessarily. Dark mode hook still works in leaf components via `useDarkMode()`.
- **lazy import kept in App.jsx:** Still required for page-level code splitting — removing it would eliminate route-based lazy loading.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Build passed clean on first attempt (1.23s). Prerequisite audit showed Three.js references only in the `src/components/three/` files being deleted — zero references elsewhere in src/.

## Vite Build Output

```
dist/index.html                           0.75 kB │ gzip:  0.44 kB
dist/assets/index-D7O5Rs5H.css           50.28 kB │ gzip:  8.42 kB
dist/assets/HomePage-BSK58IG_.js         20.91 kB │ gzip:  5.34 kB
dist/assets/index-tJ2-_WoM.js           236.29 kB │ gzip: 75.32 kB
✓ built in 1.23s
```

Three.js previously added ~490 kB to the bundle; it no longer appears in any dist/ chunk.

## QA Note

CTA IDs confirmed preserved:
- `id="hero-get-quote-cta"` — intact in Hero.jsx
- `id="hero-view-work-cta"` — intact in Hero.jsx

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Bundle is clean — no WebGL/Three.js anywhere in dist/
- src/components/three/ directory is gone from git history going forward
- Hero section renders dark gradient background + content — ready for framer-motion animation layer
- All page Suspense fallbacks now use GearLoader SVG directly — Phase 2 can build on this

---
*Phase: 01-foundation*
*Completed: 2026-04-01*

## Self-Check: PASSED

- src/App.jsx: FOUND
- src/components/ui/GearLoader.jsx: FOUND
- src/components/three/ directory: DELETED (confirmed)
- .planning/phases/01-foundation/01-01-SUMMARY.md: FOUND
- Commit 97e521b (Task 1): FOUND
- Commit fa09ae2 (Task 2): FOUND
- Commit 72d70e2 (Task 3): FOUND
