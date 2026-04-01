# Roadmap: Protolabs India — Animation Overhaul

## Overview

Replace a GPU-heavy Three.js hero scene with a 7-scene SVG + Motion for React injection
molding loop. The migration has a strict dependency order: the GearLoader3D replacement
and Three.js package removal must land before any animation code ships. Infrastructure
(state machine, timing tokens, fallback) must exist before scenes are built. Scenes 1-3
come before 4-7 to surface hard animation patterns early. Integration into Hero.jsx is
last — the loop is verified in isolation first, then wired to the live page.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Replace Three.js with SVG loader, apply design system, establish Motion provider (completed 2026-04-01)
- [x] **Phase 2: Animation Infrastructure** - State machine, timing tokens, SceneWrapper, reduced-motion fallback (completed 2026-04-01)
- [ ] **Phase 3: Scenes 1-3** - Granules, Melting, Injection scenes — hardest animation patterns first
- [x] **Phase 4: Scenes 4-7 and Polish** - Fill, Cooling, Ejection, Product Reveal + performance and responsive validation (completed 2026-04-01)
- [ ] **Phase 5: Integration** - Wire InjectionMoldingLoop into Hero.jsx, delete Three.js directory, final bundle check

## Phase Details

### Phase 1: Foundation
**Goal**: The app builds and runs with zero Three.js — bundle shrinks ~490KB, dark theme is
committed, design tokens are applied, and Motion is available as an app-wide provider.
**Depends on**: Nothing (first phase)
**Requirements**: DEP-01, DEP-02, DEP-03, DEP-04, DEP-05, THM-01, THM-02, THM-03, THM-04, INF-01, INF-02
**Success Criteria** (what must be TRUE):
  1. `vite build --report` shows no three / @react-three/* packages in the bundle
  2. The app loads and navigates all routes without a white screen or console errors
  3. The GearLoader spinner appears using CSS/SVG only (no Three.js canvas)
  4. The page renders in dark mode only — no theme toggle visible, no light mode flash
  5. Tailwind config resolves Inter and JetBrains Mono fonts and the #64748B / #EA580C palette tokens
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Three.js removal (GearLoader3D swap, HeroScene/SectionScene cleanup, npm uninstall)
- [ ] 01-02-PLAN.md — Dark-only theme + design system (static dark class, Inter fonts, slate primary, simplified CSS tokens)
- [ ] 01-03-PLAN.md — Motion infrastructure (LazyMotion provider, motionTokens.js constants)

### Phase 2: Animation Infrastructure
**Goal**: The scene state machine, timing constants, AnimatePresence envelope, and
reduced-motion fallback all exist and are independently testable before any scene SVG
is written.
**Depends on**: Phase 1
**Requirements**: INF-03, INF-04, INF-05, INF-06
**Success Criteria** (what must be TRUE):
  1. `useMoldingLoop` advances sceneIndex through 7 scenes and loops back to 0
  2. A user with prefers-reduced-motion enabled sees InjectionMoldingStatic (static SVG) instead of any animation
  3. SceneWrapper renders placeholder divs with a visible fade-in/fade-out when sceneIndex changes
  4. `motionTokens.js` exports SCENE_DURATIONS that sum to 10-14 seconds
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — useMoldingLoop hook (scene index state machine, SCENE_DURATIONS-driven, reduced-motion freeze)
- [ ] 02-02-PLAN.md — InjectionMoldingStatic (static SVG fallback, COLOR constants, zero motion imports)
- [ ] 02-03-PLAN.md — SceneWrapper + InjectionMoldingLoop orchestrator shell (AnimatePresence wiring, 7 stub scenes)

### Phase 3: Scenes 1-3
**Goal**: The first three injection molding scenes (Granules, Melting, Injection) are
built as fully-animated SVG components — establishing particle, color-shift, and pathLength
patterns that all subsequent scenes reuse.
**Depends on**: Phase 2
**Requirements**: HER-01, HER-02, HER-03, HER-10
**Success Criteria** (what must be TRUE):
  1. Scene 1 shows granule particles falling into a hopper — particles are motion.div elements, capped at 40 on mobile
  2. Scene 2 shows granules moving through a barrel with a visible orange-red heat color transition
  3. Scene 3 shows a pathLength stroke animation of molten plastic flowing through the nozzle into the mould
  4. All three scenes are inline JSX SVG components compatible with Motion pathLength animations
**Plans**: 4 plans

Plans:
- [ ] 03-01-PLAN.md — GranulesScene (staggered m.rect particle fall, hopper SVG, 40/60 particle cap)
- [ ] 03-02-PLAN.md — MeltingScene (barrel SVG, linear gradient heat sweep, granule scaleX compression)
- [x] 03-03-PLAN.md — InjectionScene (pathLength 0→1 nozzle stroke, thick orange line, mould cavity SVG)
- [ ] 03-04-PLAN.md — Wire scenes 1-3 into InjectionMoldingLoop (replace SceneStub indices 0-2, human verify)

### Phase 4: Scenes 4-7 and Polish
**Goal**: The final four scenes complete the injection molding narrative, the seamless loop
is verified at the Scene 7 → Scene 1 boundary, and the full animation is validated for
60fps performance and responsive scaling across all target breakpoints.
**Depends on**: Phase 3
**Requirements**: HER-04, HER-05, HER-06, HER-07, HER-08, HER-09, PRF-01, PRF-02, PRF-03, PRF-04, RES-01, RES-02, RES-03, RES-04, RES-05
**Success Criteria** (what must be TRUE):
  1. Scene 4 shows a clipPath reveal filling the mould cavity; Scene 5 shows glow reduction and mould separation; Scene 6 shows ejector pins pushing out the part; Scene 7 shows the finished product with the brand tagline
  2. Scene 7 exits into Scene 1 with no visible jump or frame pop (loop seam is seamless)
  3. Total loop duration is 10-14 seconds as measured in-browser
  4. On a 375px viewport the hero animation scales without overflow, and hero text remains readable over it
  5. Chrome DevTools Performance panel shows no frames exceeding 16ms during a full loop
**Plans**: 4 plans

Plans:
- [ ] 04-01-PLAN.md — Scene 4 (FillingScene: clipPath reveal) + Scene 5 (CoolingScene: color shift + mould separation)
- [x] 04-02-PLAN.md — Scene 6 (EjectionScene: ejector pins) + Scene 7 (ProductRevealScene: part reveal + tagline)
- [ ] 04-03-PLAN.md — Wire scenes 4-7 into InjectionMoldingLoop + full loop human verify
- [ ] 04-04-PLAN.md — Performance/responsive audit (60fps + 375px scaling) + human verify

### Phase 5: Integration
**Goal**: InjectionMoldingLoop is wired into the live Hero.jsx and all remaining Three.js
import paths are permanently removed — the site ships with the new animation system.
**Depends on**: Phase 4
**Requirements**: INT-01, INT-02, INT-03, INT-04
**Success Criteria** (what must be TRUE):
  1. The hero section on the live page shows the injection molding loop — Three.js HeroScene is gone
  2. Section scroll animations (Services, Industries, WhyChooseUs) use Motion whileInView — no SectionScene canvas
  3. App.jsx shows the CSS/SVG GearLoader during page load, not a Three.js canvas
  4. Existing staggered text and CTA reveal animations still play correctly on the hero section
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete   | 2026-04-01 |
| 2. Animation Infrastructure | 3/3 | Complete   | 2026-04-01 |
| 3. Scenes 1-3 | 0/4 | Not started | - |
| 4. Scenes 4-7 and Polish | 4/4 | Complete   | 2026-04-01 |
| 5. Integration | 0/? | Not started | - |
