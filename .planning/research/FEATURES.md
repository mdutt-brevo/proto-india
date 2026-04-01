# Feature Landscape: Hero Animation for Industrial Manufacturing Website

**Domain:** B2B industrial/manufacturing website hero animation (injection molding process loop)
**Researched:** 2026-04-01
**Project:** Protolabs India — 10–14 second seamless hero loop, 7 scenes, SVG + Motion for React

---

## Table Stakes

Features users expect from a credible industrial manufacturing hero animation.
Missing any of these causes the hero to feel unpolished or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Smooth scene-to-scene transitions | Industrial buyers have high visual standards; abrupt cuts signal low production quality | Medium | easeInOut cubic-bezier on all cross-scene fades, 400–600ms overlap |
| Professional animation timing | 150–350ms for micro-elements, 400–700ms for major scene reveals — anything outside this range reads as "amateur" (NN/g) | Low | Per-element stagger of 80–120ms within a scene keeps motion readable |
| Seamless loop (no visible restart seam) | Looping hero is industry standard; a visible "jump" on restart destroys immersion | High | First-frame and last-frame properties must be identical; plan this before drawing any scene |
| Dark industrial aesthetic | Manufacturing sites universally use dark/steel palettes — light backgrounds signal consumer, not industrial | Low | Already validated: OLED dark, #64748B + #EA580C palette committed |
| Legible hero text overlaid on animation | B2B visitors need to understand capability within 5 seconds (Nopio, Windmill research) | Low | Animation must never fight text contrast; keep animation luminance low in text zones |
| Responsive scaling across breakpoints | Mobile traffic from engineers checking specs on site visits is real; broken mobile = lost quote | Medium | SVG viewBox + percentage-based layout; Motion values must scale, never use fixed px positions for animation origin points |
| prefers-reduced-motion support | WCAG 2.1 requirement; vestibular disorder users; iOS/macOS power-saving users | Low | Show final static "product reveal" frame as fallback — communicates result without motion |
| No autoplay audio | Universal web norm — never appropriate for an ambient loop | Trivial | Explicitly out-of-scope, flagged as anti-feature |
| Sub-16ms per-frame budget | Engineers visiting on mid-range devices (site visits via company IT laptops) expect smooth animation | High | transform/opacity only; no width/height/top/left animation; SVG DOM must stay shallow and flat |

---

## Differentiators

Features that set the Protolabs India hero apart from generic manufacturing websites.
Not expected, but immediately noticed by engineers and procurement managers.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Technical process accuracy (7-stage injection molding) | Engineers recognize the real process — granules → melt → inject → fill → cool → eject → product. Accuracy signals domain expertise before a single word is read. | High | Each scene must depict correct physics metaphors: granules have random scatter, melt flow has viscosity, cooling uses temperature gradient color shift |
| Scene label/annotation overlays | Text callouts ("Polymer Melting", "260°C", "Mould Cavity Filling") read as technical documentation, not decoration. Immediately communicates precision culture. | Medium | JetBrains Mono font for labels (already in design system); fade-in timed to scene peak, fade-out 200ms before transition |
| Material state transitions (solid → liquid → solid) | Visually communicating the phase change is the core story of injection molding. No competitor does this in SVG — most use video or skip it. | High | Colour + opacity shift on the polymer body: cool grey (#94A3B8) → orange-amber (#EA580C) → cool grey; use Motion keyframes not CSS transitions for control |
| Industrial HUD / blueprint grid background | Blueprint grid behind the animation signals engineering precision, not marketing polish. Makes the SVG feel like a CAD/CAM schematic. | Low | Already exists in design language (blueprint grid validated) — extend it into hero animation container |
| Safety orange accent on key moments | #EA580C highlighting at injection point and product reveal ties brand colour to the moments of highest drama. Subconsciously anchors the colour as "action/result". | Low | Use sparingly: 2–3 accent moments per loop, not continuous |
| Staggered CTA reveal after first scene completion | CTA appears after the hero animation completes its first pass (~2–3s in), not immediately. Respects the user's attention and rewards watching. | Medium | Already validated: staggered text/CTA reveal exists in codebase — extend timing to sync with animation state |
| Progress indicator (scene dots or timeline bar) | Thin progress bar or 7-dot scene indicator at bottom of hero tells engineers "this is a structured process, 7 steps". Mirrors how they think about manufacturing specs. | Medium | Thin 1px progress bar preferred over dots for mobile compactness; opacity 0.4 at rest, 0.9 on active segment |

---

## Anti-Features

Features to explicitly NOT build, with rationale.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Autoplay audio / ambient sound | Universally jarring; violates browser autoplay policies on mobile; alienates engineers in open offices | Silence is the right default; consider muted video overlay only if branding demands (it doesn't here) |
| Video-based hero | Adds loading weight, format complexity (MP4/WebM), CDN dependency, and mobile Safari quirks | Already ruled out in PROJECT.md; SVG+Motion is the correct path |
| 3D / WebGL effects | The entire point of this milestone is eliminating Three.js; WebGL reintroduction would be a regression | SVG paths + CSS gradients are sufficient for all required visual metaphors |
| Flashy particle storms | Random floating particles unrelated to the process narrative add visual noise without meaning | Particles are only valid in Scene 1 (granule scatter) — constrained to that scene, purposeful |
| Interactive/hover-driven animation | Manufacturing hero must loop autonomously; requiring user interaction to progress defeats the purpose | Save interactivity for the Services section detail pages |
| Progress control scrubbing | Giving users a playback scrubber adds complexity, breaks the loop narrative, and is not expected by B2B audiences | Passive progress indicator (no interaction) is sufficient |
| Light mode variant of the animation | Dark-only is committed in PROJECT.md; building a light version doubles maintenance surface | Commit to OLED dark; the construction palette has no light mode equivalent |
| Lottie / external animation file formats | Adds a dependency not in the approved stack; file-based animations are harder to customise or synchronise with React state | Motion for React keyframes give full programmatic control without extra deps |
| Fake "live data" counters in hero | "1,247 parts manufactured today"-style counters look credible but require real data plumbing or visible fakery | If metrics appear, they belong in a static trust strip below the hero, not inside the animation |
| Scroll-driven animation (hero plays on scroll) | The loop should be autonomous, not scroll-gated — engineers may not scroll immediately, and the process narrative needs to play unprompted | Use IntersectionObserver only to start the loop on viewport entry, then let it run freely |

---

## Feature Dependencies

```
Scene label overlays → Scene timing constants (labels need fixed timestamps to attach to)
Scene timing constants → All 7 scene durations decided upfront (planning artefact, not code)
Material state transitions → Per-scene color keyframes in Motion
Safety orange accents → Material state transitions (orange peaks at inject and reveal)
Progress indicator → Scene timing constants (bar width derived from scene duration ratios)
Staggered CTA reveal → Scene 1 completion signal (CTA watches animation progress, not a timer)
prefers-reduced-motion fallback → Product reveal static frame exists as a standalone SVG or snapshot
Seamless loop → First/last frame identity (architectural constraint on Scene 7 → Scene 1 handoff)
```

---

## Animation Timing Reference

Grounded in NN/g animation duration research and Motion documentation.

| Element Type | Duration | Easing | Rationale |
|--------------|----------|--------|-----------|
| Scene cross-fade (background shift) | 500–700ms | easeInOut | Large spatial transitions need more time to read as intentional |
| Major element entrance (mould, barrel) | 400–600ms | easeOut | Objects entering from off-screen decelerate to rest |
| Major element exit | 300–400ms | easeIn | Objects leaving accelerate away — feels purposeful |
| Within-scene micro-motion (granule scatter) | 200–300ms per particle | linear with stagger | Constant speed appropriate for ambient/idle motion |
| Label/annotation fade-in | 250ms | easeOut | Fast enough not to lag behind scene, slow enough to be legible |
| Color phase transition (solid → molten) | 800ms–1200ms | easeInOut | Material state changes are slow in reality; fast transitions look fake |
| CTA entrance | 350ms | easeOut | Standard hero CTA timing — responsive feel |
| Progress bar fill per segment | Proportional to scene duration | linear | Progress must track real time, not ease |
| Loop restart cross-dissolve | 400ms | easeInOut | Invisible seam requires gentle overlap |

**Total loop target:** 10–14 seconds. Recommended distribution:

| Scene | Duration | Notes |
|-------|----------|-------|
| 1. Granule scatter | 1.5s | Short — sets context quickly |
| 2. Melting / barrel | 1.8s | Colour shift needs time to read |
| 3. Injection stroke | 1.5s | Fast, mechanical — intentionally brief |
| 4. Mould cavity filling | 2.0s | Most complex visual — deserves more time |
| 5. Cooling (gradient shift) | 1.5s | Temperature colour change |
| 6. Ejection | 1.2s | Satisfying snap — keep short |
| 7. Product reveal | 2.0s | Payoff moment — hold longest |
| Loop crossfade buffer | 0.5s | Dissolve back to Scene 1 |
| **Total** | **12.0s** | Within 10–14s target |

---

## Mobile and Accessibility Considerations by Feature

| Feature | Mobile Consideration | Accessibility Consideration |
|---------|---------------------|------------------------------|
| 7-scene loop | Scale SVG viewBox to 100vw; reduce particle count by 50% on mobile (detect via navigator.hardwareConcurrency < 4) | prefers-reduced-motion: show static product reveal frame, no animation |
| Scene label overlays | Hide verbose labels on screens < 480px; show only scene name, hide technical values | Add aria-hidden="true" to all animation elements; use a visually-hidden <p> describing the process for screen readers |
| Progress indicator | Full-width bar on mobile, same height (1px) | role="progressbar" with aria-valuemin, aria-valuemax, aria-valuenow updating per scene |
| Material colour transitions | Colour alone never carries meaning — shape change (melt deformation) must accompany colour shift | Colourblind safe: transition from cool grey to warm orange is distinguishable under deuteranopia |
| Safety orange accents | Orange on dark background passes WCAG AA at 3:1 for large graphic elements (not text contrast rule) | If orange is used for a text label, verify 4.5:1 contrast against #0F172A background |
| Staggered CTA reveal | On mobile, CTA should appear no later than 3s after page load regardless of animation state | CTA must be keyboard-focusable from page load; animation state must not block focus order |
| Hero animation container | Set will-change: transform on the SVG root — sparingly, one element only | Do not trap focus inside animation container; it is presentational |
| Seamless loop | On mobile Safari, test loop restart specifically — Safari has known compositor issues with SVG transform resets | Loop must not cause a layout shift (CLS) on restart; use position: absolute for animation layer |

---

## MVP Recommendation

Prioritize in this order for the first working version:

1. **7-scene SVG layout with correct process iconography** — the skeleton everything else attaches to
2. **Scene timing constants file** — single source of truth for all durations; every other feature depends on this
3. **Seamless loop mechanism** — hardest technical problem; solve early before adding decorative features
4. **Material state colour transitions** (solid → molten → solid) — the single highest-value visual differentiator
5. **prefers-reduced-motion static fallback** — non-negotiable accessibility requirement; implement alongside the loop, not after

Defer to a polish pass:
- Scene label/annotation overlays (add after timing is locked)
- Progress indicator (add after timing is locked)
- Safety orange accent moments (tune after colour transitions are working)
- Particle count mobile optimisation (profile first, then optimise)

---

## Sources

- [NN/g — Animation Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/) — MEDIUM confidence (authoritative UX research)
- [Motion.dev — Easing Functions](https://motion.dev/docs/easing-functions) — HIGH confidence (official library docs)
- [Motion.dev — React SVG Animation](https://motion.dev/docs/react-svg-animation) — HIGH confidence (official library docs)
- [Material Design 3 — Easing and Duration](https://m3.material.io/styles/motion/easing-and-duration) — HIGH confidence (design system reference)
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) — HIGH confidence (official spec)
- [W3C WCAG 2.1 — C39 Using prefers-reduced-motion](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) — HIGH confidence (official standard)
- [Nopio — B2B Website Design for Manufacturers](https://www.nopio.com/blog/b2b-website-design/) — MEDIUM confidence (industry analysis)
- [Webstix — Industrial Web Design 2025](https://www.webstix.com/the-webstix-blog/key-elements-of-web-design-for-manufacturing-companies/) — MEDIUM confidence (industry practitioner)
- [Blendb2b — 10 Best Manufacturing Website Designs 2025](https://www.blendb2b.com/blog/the-10-best-manufacturing-website-designs-for-2025) — LOW confidence (aggregator, useful for pattern observation)
- [Red27Creative — Manufacturing Process Animation Benefits 2025](https://red27creative.com/manufacturing-process-animation) — MEDIUM confidence (animation practitioner)
- [SVGator — Fix SVG Animation Lag in Safari](https://www.svgator.com/help/animation-and-interactivity/how-to-fix-svg-animation-lag-in-safari) — MEDIUM confidence (tooling vendor, Safari-specific guidance useful)
- [MDN — Animation Performance and Frame Rate](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) — HIGH confidence (official docs)
- [Motion.dev — Web Animation Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list) — HIGH confidence (library authors)
