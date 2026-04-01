# Requirements: Protolabs India — Animation Overhaul

**Defined:** 2026-04-01
**Core Value:** The hero animation must visually communicate injection molding expertise in a smooth, performant loop on any screen.

## v1 Requirements

### Dependency Cleanup

- [ ] **DEP-01**: GearLoader3D replaced with CSS/SVG-only loader before Three.js removal
- [ ] **DEP-02**: All Three.js packages removed (three, @react-three/fiber, @react-three/drei, @react-three/postprocessing)
- [ ] **DEP-03**: All Three.js component files deleted (src/components/three/)
- [ ] **DEP-04**: SectionScene references removed from Services, Industries, WhyChooseUs sections
- [ ] **DEP-05**: Bundle size reduced by ~490KB from Three.js removal

### Theme & Design System

- [ ] **THM-01**: Dark-only theme enforced (remove theme toggle and light mode code)
- [ ] **THM-02**: Construction/Architecture color palette applied (#64748B primary, #EA580C safety orange accent, dark backgrounds)
- [ ] **THM-03**: Inter + JetBrains Mono typography system configured in Tailwind
- [ ] **THM-04**: Industrial CSS design tokens (metallic sheens, glow effects) updated for new palette

### Animation Infrastructure

- [ ] **INF-01**: LazyMotion with domAnimation features configured as app-wide provider
- [ ] **INF-02**: Motion animation tokens file (motionTokens.js) with shared durations, easings, spring configs
- [ ] **INF-03**: useMoldingLoop custom hook — scene index state machine with SCENE_DURATIONS array
- [ ] **INF-04**: SceneWrapper component with AnimatePresence mode="wait" orchestration
- [ ] **INF-05**: InjectionMoldingStatic component — reduced-motion fallback (static final-frame SVG)
- [ ] **INF-06**: useReducedMotion integration — OS-level motion preference respected

### Hero Animation Scenes

- [ ] **HER-01**: Scene 1 — Raw Material: Granule particles falling into hopper (SVG + Motion particle system, max 40 particles on mobile)
- [ ] **HER-02**: Scene 2 — Melting: Granules moving through barrel with heat color transition (orange-red glow via CSS gradients)
- [ ] **HER-03**: Scene 3 — Injection: Molten plastic pushed through nozzle into mould cavity (pathLength animation)
- [ ] **HER-04**: Scene 4 — Mould Filling: Semi-cutaway mould cavity filling with flow (clipPath reveal animation)
- [ ] **HER-05**: Scene 5 — Cooling: Glow reduction, mould halves separating smoothly (color + transform transition)
- [ ] **HER-06**: Scene 6 — Ejection: Ejector pins push finished part out (transform + opacity sequence)
- [ ] **HER-07**: Scene 7 — Product Reveal: Final product with brand line "Precision in Every Moulded Part" (scale + fade reveal)
- [ ] **HER-08**: Seamless loop — Scene 7 exit transitions smoothly back to Scene 1 initial state
- [ ] **HER-09**: Total loop duration 10–14 seconds with locked SCENE_DURATIONS constants
- [ ] **HER-10**: All scene SVGs inline as JSX components (required for Motion pathLength animations)

### Performance

- [ ] **PRF-01**: 60fps maintained on mid-range devices (< 16ms per frame)
- [ ] **PRF-02**: All animations use transform/opacity only — no width/height/top/left
- [ ] **PRF-03**: Particle count adapts to device capability (navigator.hardwareConcurrency heuristic)
- [ ] **PRF-04**: No layout thrashing — zero CLS from animation elements

### Responsive & Accessibility

- [ ] **RES-01**: SVG viewBox scales across all screen sizes (mobile 375px → desktop 1440px+)
- [ ] **RES-02**: Hero text content remains readable over animation at all breakpoints
- [ ] **RES-03**: prefers-reduced-motion shows InjectionMoldingStatic fallback
- [ ] **RES-04**: Animation does not block user interaction (no blocking animation)
- [ ] **RES-05**: Keyboard navigation and screen reader experience unaffected by animation

### Integration

- [ ] **INT-01**: Hero.jsx updated to use new Motion animation system instead of Three.js HeroScene
- [ ] **INT-02**: Section scroll animations converted to Motion whileInView
- [ ] **INT-03**: App.jsx loader replaced with CSS/SVG GearLoader (no Three.js)
- [ ] **INT-04**: Existing staggered text/CTA reveal animations preserved or upgraded to Motion

## v2 Requirements

### Polish & Enhancement

- **POL-01**: Annotation labels on hero scenes (e.g., "Hopper", "Barrel", "Nozzle")
- **POL-02**: Progress indicator bar showing current scene in loop
- **POL-03**: CTA animation synchronized to Scene 1 completion
- **POL-04**: Scroll-triggered parallax between hero animation layers
- **POL-05**: Scene-aware color palette shifts (warmer during melting, cooler during cooling)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Three.js / WebGL in any form | Entire rationale is to move away from GPU-heavy rendering |
| Video-based hero animation | Adds loading weight and format complexity |
| Lottie animations | Adds another dependency; SVG+Motion is sufficient |
| Light mode theme | Committing to dark-only industrial aesthetic |
| Section background replacements | Removing Three.js backgrounds entirely, not substituting |
| Path morphing between scenes (Flubber.js) | Evaluate per-scene in v2 if needed; Motion native transitions sufficient for v1 |
| Auto-playing sound/audio | Anti-feature per research; users reject it |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEP-01 | Phase 1 | Pending |
| DEP-02 | Phase 1 | Pending |
| DEP-03 | Phase 1 | Pending |
| DEP-04 | Phase 1 | Pending |
| DEP-05 | Phase 1 | Pending |
| THM-01 | Phase 1 | Pending |
| THM-02 | Phase 1 | Pending |
| THM-03 | Phase 1 | Pending |
| THM-04 | Phase 1 | Pending |
| INF-01 | Phase 1 | Pending |
| INF-02 | Phase 1 | Pending |
| INF-03 | Phase 2 | Pending |
| INF-04 | Phase 2 | Pending |
| INF-05 | Phase 2 | Pending |
| INF-06 | Phase 2 | Pending |
| HER-01 | Phase 3 | Pending |
| HER-02 | Phase 3 | Pending |
| HER-03 | Phase 3 | Pending |
| HER-10 | Phase 3 | Pending |
| HER-04 | Phase 4 | Pending |
| HER-05 | Phase 4 | Pending |
| HER-06 | Phase 4 | Pending |
| HER-07 | Phase 4 | Pending |
| HER-08 | Phase 4 | Pending |
| HER-09 | Phase 4 | Pending |
| PRF-01 | Phase 4 | Pending |
| PRF-02 | Phase 4 | Pending |
| PRF-03 | Phase 4 | Pending |
| PRF-04 | Phase 4 | Pending |
| RES-01 | Phase 4 | Pending |
| RES-02 | Phase 4 | Pending |
| RES-03 | Phase 4 | Pending |
| RES-04 | Phase 4 | Pending |
| RES-05 | Phase 4 | Pending |
| INT-01 | Phase 5 | Pending |
| INT-02 | Phase 5 | Pending |
| INT-03 | Phase 5 | Pending |
| INT-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-01*
*Last updated: 2026-04-01 after roadmap creation*
