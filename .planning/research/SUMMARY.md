# Project Research Summary

**Project:** Protolabs India — Three.js → Motion for React Animation Overhaul
**Domain:** B2B industrial manufacturing website hero animation
**Researched:** 2026-04-01
**Confidence:** HIGH

## Executive Summary

This project is a focused animation migration: replace a Three.js/WebGL hero scene (~500KB bundle, GPU-heavy) with a 7-scene SVG + Motion for React loop that narrates the injection molding process (granules → melt → inject → fill → cool → eject → product). The correct approach, validated across all four research threads, is a state-machine-driven scene orchestrator (`InjectionMoldingLoop`) that owns a single `sceneIndex` integer, advances it via `setTimeout`, and swaps scene components through `AnimatePresence mode="wait"`. Each scene is a self-contained presentational component — pure SVG + Motion variants — with no awareness of the loop timing. Motion v12.38.0 is already installed and covers every required animation primitive (pathLength, variants, stagger, useReducedMotion). Zero new dependencies are needed.

The highest-value technical differentiator is the material phase transition: a color shift from cool grey (#94A3B8) to molten orange (#EA580C) and back, timed to real injection molding physics. B2B engineering audiences implicitly trust sites where the process illustration matches reality. The greatest risk is producing a "flat diagram" that technically depicts the process but loses the sense of industrial energy that the Three.js scene provided through depth and light. This risk is mitigated by: CSS radial gradient glow layers behind SVG elements (simulating heat bloom), isometric SVG transform projection for 3D depth illusion, and a parallax layer structure where background elements move at 60% the speed of foreground elements.

The migration must begin with GearLoader3D replacement before any Three.js package removal, or the entire app breaks at the Suspense boundary. Accessibility (useReducedMotion + CSS @media override) and bundle optimization (LazyMotion + m alias) must be built in Phase 1, not deferred — both are invisible until they break in production.

---

## Key Findings

### Recommended Stack

The animation system requires no new packages. Motion v12.38.0 (already installed) provides the complete toolset: declarative `motion.*` components for scene markup, `AnimatePresence` for enter/exit lifecycle, `useReducedMotion` for accessibility, and the variant propagation system for staggered SVG children. Tailwind CSS keyframe utilities already in `tailwind.config.js` (`animate-gear-spin`, `animate-molten-flow`, `animate-pulse-glow`, etc.) handle ambient/decorative loops that run independently of scene state.

The critical constraint is the compositor-only rule: only `transform` properties (x, y, scale, rotate, skew), `opacity`, and SVG `pathLength`/`pathOffset`/`pathSpacing` are permitted inside `animate()` calls. Animating SVG coordinate attributes (`cx`, `cy`, `r`, `width`, `height`) or CSS paint properties (`fill`, `filter`, `background-color`) on every frame causes layout thrashing and drops below the 16ms frame budget on mid-range mobile.

**Core technologies:**
- `motion/react` v12.38.0: scene variants, pathLength, AnimatePresence, useReducedMotion — already installed, covers all patterns
- `LazyMotion` + `m` alias: reduces Motion initial payload from 34KB to 4.6KB — required for bundle optimization
- Tailwind CSS keyframes (existing): ambient/decorative loops — zero additional cost
- Inline SVG as JSX: tree-shakeable, no network fetch, supports all Motion `pathLength` animations
- `useState` + `setTimeout`: scene state machine timing — simpler and more testable than `useAnimate` sequence

**What NOT to use:** Three.js, GSAP, Lottie, tsParticles, react-particles, react-spring, anime.js, Canvas 2D (unless DOM particle count exceeds 80), video-based hero.

### Expected Features

**Must have (table stakes):**
- Smooth scene-to-scene cross-fades (400–600ms easeInOut) — abrupt cuts signal low production quality
- Professional per-element timing (150–350ms micro-elements, 400–700ms major reveals, 80–120ms stagger)
- Seamless loop — no visible jump at the Scene 7 → Scene 1 boundary
- Dark industrial aesthetic — OLED dark + #64748B + #EA580C palette (committed)
- Legible hero text overlaid without competing with animation luminance
- Responsive SVG scaling across mobile breakpoints (375px–1440px)
- `prefers-reduced-motion` static fallback — WCAG 2.1 Level AA requirement
- Sub-16ms per-frame budget — compositor-only animation properties

**Should have (competitive differentiators):**
- Technical process accuracy — 7 scenes matching real injection molding physics
- Material state transitions (solid grey → molten orange → cool grey) — highest-value visual differentiator; no competitor does this in SVG
- Scene annotation overlays (JetBrains Mono labels: "Polymer Melting", "260°C") — reads as domain expertise
- Industrial HUD / blueprint grid background — already in design language, extend into animation container
- Safety orange accent on injection + product reveal moments — anchors brand color to high-drama beats
- Staggered CTA reveal synced to first animation pass (~2–3s in, not immediate)
- Scene progress indicator (1px thin bar, opacity 0.4/0.9 active)

**Defer to post-launch polish:**
- Particle count mobile optimization (profile on real hardware first)
- Verbose annotation labels on mobile < 480px (show scene name only)
- Alternate mobile viewBox for portrait phones

**Explicit anti-features (never build):**
- Autoplay audio, video-based hero, 3D/WebGL effects, flashy unrelated particles, interactive scrubbing, light mode animation variant, Lottie, fake live data counters, scroll-driven gating

### Architecture Approach

The animation system is a vertical slice inside `src/components/animation/`. `InjectionMoldingLoop.jsx` owns the scene state machine via a custom `useMoldingLoop` hook and renders scenes through a single `AnimatePresence` wrapper. Scene components are purely presentational — they define SVG paths and Motion variants, own nothing about when they appear. `SceneWrapper.jsx` provides the fade envelope (0.4s enter, 0.3s exit). Shared timing/color constants live in `motionTokens.js`. `Hero.jsx` imports only `InjectionMoldingLoop` and does not change its contract with the rest of the app. The `src/components/three/` directory is removed wholesale after migration is verified.

**Major components:**
1. `InjectionMoldingLoop.jsx` — Orchestrator; owns `sceneIndex`, timer, loop restart, reduced-motion check; no SVG
2. `useMoldingLoop.js` — Hook encapsulating `SCENE_DURATIONS` config array and `setTimeout` advancement
3. `SceneWrapper.jsx` — Fade envelope (enter/exit Motion variants); keyed to `sceneIndex` for AnimatePresence
4. `[Scene N].jsx` × 7 — Fully self-contained SVG + Motion variant markup; no timing knowledge
5. `motionTokens.js` — Single source of truth for durations, easings, and color constants
6. `InjectionMoldingStatic.jsx` — Reduced-motion fallback; renders Scene 7 (product reveal) as a static SVG

**Build sequence is strictly ordered** (each step is independently testable): `motionTokens.js` → `useMoldingLoop.js` → `InjectionMoldingStatic.jsx` → `SceneWrapper.jsx` → `InjectionMoldingLoop.jsx` shell → individual scenes → wire SCENES array → Hero.jsx integration → Three.js removal.

### Critical Pitfalls

1. **Flat diagram loses industrial wow factor** — Simulate depth with parallax SVG layers, CSS radial gradient heat overlays on wrapping divs (not SVG elements), and isometric projection (skewX/skewY). Without these, the SVG reads as a datasheet, not a manufacturing powerhouse.

2. **Non-composited SVG properties cause layout thrashing** — Never animate `cx`, `cy`, `r`, `width`, `height`, `x`, `y` (SVG attributes), or `fill`/`stroke`/`filter` via Motion. Wrap moving parts in `<motion.g>` and animate `translateX`/`translateY`. Granule particles must be `<motion.div>` not `<circle>` with animated `cx`.

3. **GearLoader3D orphaned import breaks the entire app** — Must audit all Three.js imports with `grep -r "from.*three\|@react-three" src/` and replace `GearLoader3D` with the existing `GearLoaderSVG` **before** running `npm uninstall`. This is the highest-priority prerequisite.

4. **Frame-zero loop jump at Scene 7 → Scene 1 boundary** — Every looping property's keyframe[0] must equal keyframe[-1]. Use `animate={{ y: [0, -40, -40, 0] }}` not `[0, -40]`. Test explicitly by fast-forwarding to t=11.8s.

5. **Mobile Safari SVG filter drops + mask failures** — Apply `filter: blur()` on wrapping `<div>` elements, not on `<svg>` or `<g>`. Never use `<mask>` for reveal animations on Safari; use `pathLength` instead. Test on physical iOS device after every scene build.

6. **`prefers-reduced-motion` completely unimplemented** — Current codebase has zero handling. Must ship with Phase 1: `useReducedMotion()` for JS animations + `@media (prefers-reduced-motion: reduce)` block in `index.css` for CSS keyframe utilities.

---

## Implications for Roadmap

Based on research, the dependency graph forces a specific build order. Scene components cannot be built without the state machine; the state machine cannot be safely deployed without the GearLoader3D replacement; bundle optimization with LazyMotion must wrap everything from the start to avoid paying the full Motion cost twice.

### Phase 1: Prerequisites and Foundation
**Rationale:** Three.js removal will break the app unless GearLoader3D is replaced first. This phase unblocks everything else and delivers the bundle savings that justify the migration.
**Delivers:** Three.js-free build, ~490KB bundle reduction, SVG gear loader in place, dark mode provider cleaned up, LazyMotion wrapper established
**Addresses:** Anti-feature removal (Three.js, WebGL), bundle optimization (LazyMotion + m alias)
**Avoids:** Pitfall 9 (GearLoader3D orphan), Pitfall 5 (bundle regression), Pitfall 11 (dark mode localStorage flash)
**Tasks:**
- Audit all Three.js imports; replace GearLoader3D with GearLoaderSVG
- Remove Three.js packages from package.json
- Wrap app with LazyMotion + domAnimation; switch all future motion imports to `m`
- Remove DarkModeProvider; set dark class statically on `<html>`
- Verify build: `vite build --report` confirms ~490KB reduction

### Phase 2: Animation Infrastructure (motionTokens, useMoldingLoop, SceneWrapper)
**Rationale:** The shared infrastructure (timing constants, state machine hook, fade envelope, static fallback) must exist before any scene component is written. This phase produces independently testable, zero-visual-output code.
**Delivers:** `motionTokens.js`, `useMoldingLoop.js`, `SceneWrapper.jsx`, `InjectionMoldingStatic.jsx`, and a shell `InjectionMoldingLoop.jsx` with placeholder scenes
**Addresses:** Seamless loop architecture, prefers-reduced-motion (static fallback built here), scene timing configuration surface
**Avoids:** Pitfall 3 (loop gap — architecture prevents distributed timers), Pitfall 6 (reduced-motion — built into state machine), Pitfall 13 (AnimatePresence wrapping)
**Tasks:**
- Create `src/components/animation/` directory structure
- Write `motionTokens.js` with SCENE_DURATIONS (target 12.0s total), shared easings, brand colors
- Write `useMoldingLoop.js` with setTimeout-based state machine + useReducedMotion guard
- Write `SceneWrapper.jsx` (0.4s enter, 0.3s exit fade)
- Write `InjectionMoldingStatic.jsx` (Scene 7 product reveal, static SVG)
- Write `InjectionMoldingLoop.jsx` shell with 7 placeholder divs in SCENES array
- Add `@media (prefers-reduced-motion: reduce)` block to `index.css`
- Test: confirm scene index advances in isolation, static fallback renders

### Phase 3: Scene 1–3 (Granules, Melting, Injection)
**Rationale:** The first three scenes establish the entry narrative and the most technically challenging animation patterns (particle spawn/despawn, color phase transition, pathLength injection stroke). Solving these patterns early surfaces cross-browser issues before all 7 scenes are built.
**Delivers:** GranulesScene.jsx, MeltingScene.jsx, InjectionScene.jsx — each independently testable
**Addresses:** Material state transitions (highest-value differentiator), granule particle system, path-draw animations
**Avoids:** Pitfall 2 (non-composited properties — use motion.div particles, not SVG circle cx), Pitfall 4 (Safari filter — div wrapper for glow), Pitfall 1 (depth illusion — parallax layers from day one)
**Key technical decisions:** Granules as `<motion.div>` (not `<circle cx>`), cap at 20 active particles, CSS keyframe jitter inside Motion lifecycle, color shift via Motion keyframe arrays not CSS transitions

### Phase 4: Scene 4–7 (Fill, Cooling, Ejection, Product Reveal)
**Rationale:** Scenes 4–7 complete the narrative arc and include the highest-drama moments (mould fill, product reveal) that must hold attention. The cooling scene's thermal gradient and the product reveal's satisfying hold are the emotional payoff.
**Delivers:** MouldFillScene.jsx, CoolingScene.jsx, EjectionScene.jsx, ProductRevealScene.jsx
**Addresses:** Mould cavity fill (clipPath reveal technique), thermal gradient cooling, ejector pin snap, product shimmer
**Avoids:** Pitfall 1 (depth — isometric projection on mould tool using skewX/skewY), Pitfall 2 (clipPath rect uses scaleY not height), Pitfall 3 (seamless loop — product reveal final frame must match granule scatter initial frame)
**Key technical decision:** Loop seam lives here — ProductRevealScene's exit keyframe must match GranulesScene's initial keyframe

### Phase 5: Polish, Accessibility, and Responsive
**Rationale:** All scenes are built and looping correctly. This phase adds the differentiating visual details and validates the loop on real devices before wiring to Hero.jsx.
**Delivers:** Scene annotation overlays, progress indicator, safety orange accent moments, responsive viewBox strategy, physical iOS Safari QA pass
**Addresses:** Scene label overlays (JetBrains Mono), progress bar (role=progressbar), staggered CTA reveal sync, mobile particle count reduction
**Avoids:** Pitfall 4 (Safari — physical device test required here), Pitfall 10 (responsive viewBox — preserveAspectRatio strategy), Pitfall 7 (will-change — audit and remove over-application), Pitfall 8 (motion value leaks — audit .on() subscriptions)
**Test gates:** Loop seamless at boundary, prefers-reduced-motion shows static, 375px/390px/1440px responsive, physical iOS device confirms glow effects render

### Phase 6: Hero.jsx Integration and Three.js Directory Removal
**Rationale:** Final wiring step. Animation system is complete and QA'd in isolation; now integrate into the live Hero component and remove the Three.js directory permanently.
**Delivers:** Hero.jsx updated (remove lazy HeroScene, import InjectionMoldingLoop directly), `src/components/three/` deleted, final bundle analysis
**Addresses:** React.lazy removal (SVG has no async loading cost), SectionScene migration if applicable
**Avoids:** Pitfall 5 (bundle regression — run vite build --report to confirm net savings)
**Final validation:** Full page loads correctly, animation starts on hero viewport entry, no Three.js in bundle

### Phase Ordering Rationale

- Phase 1 before everything: GearLoader3D must be replaced before Three.js packages are removed or the app breaks entirely.
- Phase 2 before scenes: The state machine, timing constants, and AnimatePresence structure must be in place before scenes are written. Scenes written against the wrong architecture require rewrites.
- LazyMotion from Phase 1: Establishing `m` alias in Phase 1 means all scene components in Phases 3–4 use the lightweight API from the start. Migrating later is error-prone.
- Phases 3–4 can partially parallelize: Scenes 1–3 and Scenes 4–7 are independent components once the SCENES array stub exists. They can be developed in parallel by different contributors.
- Phase 5 before Phase 6: Polish and iOS QA before Hero.jsx integration, not after. Avoid shipping a broken animation to production while debugging Safari filters.
- Physical iOS testing gates Phase 5: Safari filter and mask bugs are invisible in Chrome DevTools emulation. This is a hard gate, not optional.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (GranulesScene):** Particle spawn/despawn with capped array and CSS keyframe jitter — validate the exact 20-particle cap on target hardware (mid-range Android Snapdragon 665-class)
- **Phase 4 (MouldFillScene):** clipPath animation is a less-common Motion + SVG pattern; verify `preserveAspectRatio` interaction with the animated clipPath rect on Safari before committing to this approach
- **Phase 5 (Responsive viewBox):** The mobile viewBox strategy (alternate viewBox via React state + preserveAspectRatio="slice") needs validation against Tailwind's responsive breakpoints and the hero's min-h constraints

Phases with standard well-documented patterns (skip extra research):
- **Phase 1 (Dependency cleanup):** Mechanical — grep, uninstall, replace
- **Phase 2 (Infrastructure):** Patterns fully documented in ARCHITECTURE.md and STACK.md; no research needed
- **Phase 6 (Hero.jsx integration):** Straightforward import swap; no new patterns

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Motion v12 official docs verified; all API examples confirmed against motion.dev; no new deps needed |
| Features | HIGH | NN/g timing research + WCAG 2.1 standard + B2B manufacturing pattern research; 7-scene breakdown well-grounded |
| Architecture | HIGH | Patterns verified against official Motion docs and Maxime Heckel's advanced orchestration guide; state machine approach corroborated by multiple sources |
| Pitfalls | HIGH (critical), MEDIUM (moderate) | Critical pitfalls sourced from official docs, confirmed GitHub issues, and MDN. Safari SVG mask failure and filter drop are MEDIUM — community-sourced, requires physical device validation |

**Overall confidence:** HIGH

### Gaps to Address

- **Isometric SVG depth illusion implementation:** Research identified the approach (skewX/skewY transforms) but exact values for the injection molding mould tool viewBox require visual iteration during Phase 3–4 build. No single correct answer exists — needs designer input.
- **12.0s total loop vs. 10–14s target:** Timing distribution in `motionTokens.js` is a research recommendation, not a stakeholder-approved spec. The exact per-scene durations should be validated with product/design before locking in Phase 2.
- **Safari physical device availability:** Pitfall 4 (SVG filter drops on Safari) can only be confirmed on physical iOS hardware. If no device is available during Phase 5, use BrowserStack with a real device session — Chrome DevTools mobile emulation is explicitly insufficient.
- **`SectionScene` Three.js dependency:** PITFALLS.md identifies GearLoader3D but does not confirm whether `SectionScene` (mentioned in Architecture) also uses Three.js. Audit required before Phase 6.

---

## Sources

### Primary (HIGH confidence)
- [motion.dev/docs](https://motion.dev/docs/react-animation) — Motion v12 API: motion component, AnimatePresence, useAnimate, useReducedMotion, SVG pathLength, LazyMotion
- [MDN — Animation Performance and Frame Rate](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) — compositor thread properties, layout vs paint
- [W3C WCAG 2.1 — C39](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) — prefers-reduced-motion standard
- [Josh W. Comeau — Accessible Animations](https://www.joshwcomeau.com/react/prefers-reduced-motion/) — useReducedMotion patterns, iOS Low Power Mode behavior
- [GitHub issue #2714 — framer/motion](https://github.com/framer/motion/issues/2714) — repeat: Infinity stop/restart jump bug (confirmed)
- [Motion docs — Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) — LazyMotion + m alias, 4.6KB figure

### Secondary (MEDIUM confidence)
- [Maxime Heckel — Advanced animation patterns with Framer Motion](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/) — variant propagation rules, parent-to-child orchestration
- [NN/g — Animation Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/) — per-element timing recommendations
- [SVGator — Fix SVG Animation Lag in Safari](https://www.svgator.com/help/animation-and-interactivity/how-to-fix-svg-animation-lag-in-safari) — Safari filter drop behavior
- [GSAP community — SVG mask reveal on iOS 16](https://gsap.com/community/forums/topic/41299-svg-mask-reveal-animation-not-working-on-ios-16-and-macos-safari/) — mask failure on Safari (community-sourced)
- [Nopio — B2B Website Design for Manufacturers](https://www.nopio.com/blog/b2b-website-design/) — industrial aesthetic expectations, dark palette norm
- [Red27Creative — Manufacturing Process Animation Benefits 2025](https://red27creative.com/manufacturing-process-animation) — process accuracy as trust signal

### Tertiary (LOW confidence)
- [Blendb2b — 10 Best Manufacturing Website Designs 2025](https://www.blendb2b.com/blog/the-10-best-manufacturing-website-designs-for-2025) — pattern observation only; used for aesthetic validation not technical decisions

---

*Research completed: 2026-04-01*
*Ready for roadmap: yes*
