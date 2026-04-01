# Protolabs India — Animation Overhaul

## What This Is

A performance-focused animation overhaul for Protolabs India's manufacturing website. Replaces the resource-heavy Three.js 3D animation system with optimized Motion for React (framer-motion v12) + SVG/CSS animations. The centerpiece is a 10–14 second seamless hero loop depicting the injection molding process — from raw granules to finished product — rendered entirely in 2D for universal device compatibility.

## Core Value

The hero animation must visually communicate Protolabs India's injection molding expertise — from granule to finished component — in a smooth, performant loop that runs on any screen without lag.

## Requirements

### Validated

- ✓ Dark industrial aesthetic with cinematic feel — existing
- ✓ Hero section with staggered text/CTA reveal animations — existing
- ✓ Scroll-triggered section animations via IntersectionObserver — existing
- ✓ Responsive layout with Tailwind CSS — existing
- ✓ Multi-page routing (Home, About, Services, Industries, Contact, Quote) — existing
- ✓ Industrial design language (blueprint grid, metallic sheens, toolpath dividers) — existing

### Active

- [ ] 7-scene hero animation loop (granules → melting → injection → mould filling → cooling → ejection → product reveal)
- [ ] Remove Three.js entirely (three, @react-three/fiber, @react-three/drei, @react-three/postprocessing)
- [ ] Dark-only theme (remove theme toggle, commit to OLED dark industrial look)
- [ ] Construction/Architecture color palette (#64748B primary, #EA580C safety orange accent)
- [ ] Inter + JetBrains Mono typography system
- [ ] Motion for React integration for all animations
- [ ] Resolution-friendly animations (scale across all screen sizes)
- [ ] prefers-reduced-motion support
- [ ] Remove Three.js section backgrounds (Services, Industries, WhyChooseUs) — no replacement
- [ ] Optimized bundle size (remove ~500KB of Three.js packages)

### Out of Scope

- Three.js or WebGL in any form — entire rationale is to move away from GPU-heavy rendering
- Video-based hero animation — adds loading weight and format complexity
- Lottie animations — adds another dependency, SVG+Motion is sufficient
- Light mode theme — committing to dark-only industrial aesthetic
- Section background replacements — removing Three.js backgrounds entirely, not substituting

## Context

- **Current state:** HeroScene.jsx is 673 lines of Three.js with 150+ CPU-driven particles, per-frame GPU buffer uploads, 4 manufacturing stations, post-processing (Bloom, ChromaticAberration, Vignette). 3-4 simultaneous Canvas instances across the page.
- **Motion library:** Already installed (v12.38.0) but completely unused — zero imports in codebase.
- **Design system:** UI/UX Pro Max recommendations — Dark Mode OLED style, Construction/Architecture palette, Hero-Centric + Immersive pattern, Inter typography.
- **Animation medium:** SVG paths + Motion for mechanical parts, CSS gradients + Motion for heat/glow effects, lightweight div-based particles for granules/molten flow.
- **Target:** 60fps on mid-range devices, <16ms per-frame budget, transform/opacity only animations.

## Constraints

- **Tech stack**: React 19 + Vite 8 + Tailwind CSS 3.4 + Motion v12 — no additional animation deps
- **Performance**: All animations must use transform/opacity only — no width/height/top/left animation
- **Accessibility**: Must respect prefers-reduced-motion — show static fallback or simplified version
- **Bundle**: Removing Three.js should reduce bundle by ~500KB — net animation code must stay lean
- **Compatibility**: Must work on mobile Safari, Chrome, Firefox — no WebGL dependency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SVG + Motion over Three.js | Three.js causes 9,000+ GPU uploads/sec, multiple Canvas contexts, ~500KB bundle. SVG+Motion is GPU-composited via transform/opacity. | — Pending |
| Dark-only theme | Industrial manufacturing aesthetic demands dark backgrounds. Dual theme adds complexity without value for this brand. | — Pending |
| Remove section backgrounds entirely | Three.js section backgrounds (SectionScene.jsx) add 3 extra Canvas instances. Removing without replacement keeps sections clean. | — Pending |
| 7-scene seamless loop | Maps directly to injection molding process stages — communicates manufacturing expertise visually. | — Pending |
| Construction/Architecture palette | UI/UX Pro Max recommendation — industrial grey (#64748B) + safety orange (#EA580C) is authentic to factory/manufacturing. | — Pending |

---
*Last updated: 2026-04-01 after initialization*
