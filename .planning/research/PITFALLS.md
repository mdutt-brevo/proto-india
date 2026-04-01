# Domain Pitfalls: Three.js → Motion for React Migration

**Domain:** Manufacturing hero animation — Three.js removal, SVG/CSS loop replacement
**Project:** Protolabs India Animation Overhaul
**Researched:** 2026-04-01
**Scope:** Three.js-to-2D migration risks, SVG animation loops, Motion v12 misuse, mobile Safari, bundle size, accessibility

---

## Critical Pitfalls

Mistakes in this tier cause rewrites, visible jank on production, or silent regressions
that surface only on specific devices.

---

### Pitfall 1: Replacing GPU Wow Factor With a Flat SVG Diagram

**What goes wrong:** The Three.js hero — 4 stations, 200 particles, bloom/chromatic
aberration post-processing — produces real depth and light scattering that reads as
"impressive machine." A naive port renders engineering-diagram SVGs that feel like
a product datasheet. Users don't feel the manufacturing energy; they read text.

**Why it happens:** Engineers focus on matching feature parity (granule → moulding → eject)
but neglect perceptual depth. 2D SVG has no ambient occlusion, no perspective foreshortening,
no bloom. The wow factor was not the particle count; it was the sense of depth and heat.

**Consequences:**
- Hero animation communicates process steps but not manufacturing authority
- Perception of Protolabs as less sophisticated than competitors with 3D sites
- Stakeholder pushback requiring a second pass on the animation

**Prevention:**
- Simulate depth explicitly: multiple SVG layers at different `z`-ordered opacities
  act as parallax planes (background particles move slower than foreground pistons)
- Simulate heat/glow with CSS `filter: blur()` + orange radial gradient overlays
  behind molten material paths, not on the SVG itself (avoids Safari filter bugs)
- Use `strokeDashoffset` path-draw animations for machining paths — watching a tool
  path trace in real time reads as "precision" more than a static illustration
- Isometric projection of the mould tool using SVG transforms gives perceived 3D
  without WebGL — rotate 30°/45°/30° with skewX/skewY to create isometric depth
- Add 8–12 lightweight `div`-based particles (CSS `border-radius: 50%`) for granule
  flow — 10 divs are imperceptible overhead; they add the sense of material motion

**Detection (warning signs):**
- SVG viewBox is purely flat — all elements at the same visual depth
- No blur/gradient overlay layers simulating glow or heat
- Animation looks correct in a wireframe view (bad — should look wrong wireframe,
  rich when rendered)

**Phase:** Hero Animation Scene build (Phase 1 of active work)

---

### Pitfall 2: Animating Non-Composited SVG Properties

**What goes wrong:** Animating SVG `width`, `height`, `x`, `y`, `r`, `cx`, `cy`,
`d` (path morph), or CSS `top`/`left` triggers layout + paint every frame.
On a 10–14 second hero loop with 15+ animated elements, this saturates the main thread
on mid-range Android (Snapdragon 665-class) and drops frames below 30fps.

The current Three.js code already triggers this problem via `posAttr.needsUpdate = true`
on 200 particles every frame. The SVG replacement must not recreate this pattern in
a different medium.

**Why it happens:** SVG coordinate attributes feel natural for "moving parts" of a
mechanical animation. Developers reach for animating `cx` on a circle to slide it
rather than `transform: translateX()` on its group.

**Consequences:**
- Layout thrashing: each animated property read forces synchronous reflow
- Paint storms visible in Chrome DevTools Performance → green "Paint" bars every frame
- Total frame budget consumed before JS logic runs
- iOS Safari is 30–40% slower at paint than Chrome on identical hardware

**Prevention:**
- Animate **only** `transform` and `opacity` on `<motion.g>` or `<motion.div>` wrappers
- For path drawing: `pathLength` (0→1) is the single permitted exception —
  it maps to `stroke-dashoffset` which is compositor-eligible in modern browsers
- For "sliding piston" motion: wrap the piston path in `<motion.g>` and animate
  `translateY` on the group, not the `y` attribute of the path
- For granule particles: use `<motion.div>` absolutely positioned `div`s with
  `transform: translate(x, y)` — **not** SVG `<circle>` elements with animated `cx/cy`
- Audit every animation property before implementation: if it isn't `transform`,
  `opacity`, or `stroke-dashoffset`, get explicit approval before using it

**Detection (warning signs):**
- Chrome DevTools → Performance → "Layout" events fire every animation frame
- `will-change: transform` absent on animated elements
- Animating SVG presentation attributes directly (`animate={{ cx: 100 }}`)

**Phase:** Hero Animation Scene build

---

### Pitfall 3: Seamless Loop Gap — The Frame-Zero Jump

**What goes wrong:** A 10–14 second `repeat: Infinity` animation plays perfectly
for 10 seconds, then on loop restart there is a visible 1-2 frame jump as Motion
resets internal state before re-triggering the keyframe sequence.

Known Motion issue: stopping and restarting an infinite loop mid-rotation causes
incorrect reset to the start keyframe value rather than continuing at current position.
([GitHub issue #2714](https://github.com/framer/motion/issues/2714))

**Why it happens:**
- The final keyframe value doesn't match the initial keyframe value (e.g., piston
  ends at `y: -40` but loop restarts from `y: 0`)
- Multiple independent `motion.*` elements with separate `transition.delay` values
  drift out of sync after the first loop completion because each timer resets
  independently — there is no shared loop clock
- `repeatType: "loop"` resets to keyframe[0]; `repeatType: "mirror"` reverses —
  using the wrong one causes a directional jump

**Consequences:**
- Visible "pop" at loop boundary — immediately noticeable to users
- Different elements falling out of sync after loop 2 or 3

**Prevention:**
- **Ensure keyframe[0] === keyframe[-1]** for every looping property:
  `animate={{ y: [0, -40, -40, 0] }}` — the trailing `0` closes the gap
- Drive the entire 7-scene sequence from a **single master `useAnimate` timeline**
  using `sequence()` — one loop clock, not 15 independent timers.
  This is the most important architectural decision for seamless looping.
- Use `repeatType: "loop"` (not `"mirror"`) for mechanical motions; use
  `repeatType: "mirror"` only for oscillating elements (pulsing glow, breathing)
- Test the loop boundary explicitly: fast-forward to t=9.8s and watch the cut
- For elements that must be offset from each other (staggered pistons), use
  `delay` only on the first play; for repeats use keyframe timing arrays to
  express relative phase within a single animation

**Detection (warning signs):**
- Each `<motion.*>` element has its own `repeat: Infinity` with different `delay`
- No master timeline / no `useAnimate` sequence orchestration
- Loop visually inspected only from start, not from the loop boundary moment

**Phase:** Hero Animation Scene build

---

### Pitfall 4: Mobile Safari SVG Filter Crashes and Rendering Gaps

**What goes wrong:** Three browser-specific behaviors break the animation on iOS:

1. **CSS `filter` on SVG elements drops on initial render in WebKit.** The glow
   effect appears for 1 frame then disappears, or never renders. This affects
   `filter: blur()`, `filter: drop-shadow()`, and `feGaussianBlur` SVG filters.

2. **Separate transform properties (`rotate`, `scale`, `translate`) are not
   composited correctly in Safari ≤16.** Using `transform: rotate(45deg) scale(1.2)`
   in two separate CSS declarations silently breaks — must be combined into a single
   `transform` property.

3. **SVG `<mask>` reveal animations silently fail on iOS 16 / macOS Safari.**
   ([GSAP community report](https://gsap.com/community/forums/topic/41299-svg-mask-reveal-animation-not-working-on-ios-16-and-macos-safari/))
   A machining path masked by a travelling reveal window may not animate at all.

**Why it happens:** WebKit's SVG compositing pipeline lags Blink/Gecko by 12–18
months. Features well-supported in Chrome 120 may not work in Safari 17.

**Consequences:**
- Glow/heat effects (critical to the "industrial" look) invisible on iPhone
- Isometric depth illusions break when scale + rotate transforms decouple
- Path reveal animations (toolpath tracing) silently show end-state immediately

**Prevention:**
- Apply CSS `filter: blur()` on a **wrapping `<div>`**, not on the `<svg>` or
  `<g>` element — div filters composite correctly in Safari
- Use `transform` as a single shorthand always: never separate `rotate` + `scale`
  in CSS; Motion handles this correctly when you pass both in the same
  `animate={{ rotate: X, scale: Y }}` call — do not split into two motion elements
- For reveal animations: prefer `stroke-dashoffset` path drawing over SVG masks
  for maximum Safari compatibility
- Test on physical iOS Safari (not just Chrome mobile emulation) after every scene
  — Safari's WebKit rendering diverges too much for emulation to catch these

**Detection (warning signs):**
- Glow effects look correct in Chrome DevTools mobile but invisible on real iPhone
- Combining separate `style={{ rotate: '30deg' }}` and `style={{ scale: '1.2' }}`
  props on the same element
- Using `<clipPath>` or `<mask>` for reveal transitions

**Phase:** Hero Animation Scene build + QA pass

---

### Pitfall 5: Bundle Size Regression After Three.js Removal

**What goes wrong:** Three.js removal frees ~500KB (`three` + `@react-three/fiber`
+ `@react-three/drei` + `@react-three/postprocessing`). However, the full Motion
for React declarative API (`import { motion } from "motion/react"`) adds back
~34KB uncompressed. If the hero SVG is also inlined as JSX with hundreds of
`<motion.*>` elements, the component file itself becomes the new bundle problem.

**Current situation:** `motion` v12.38.0 is already installed but entirely unused.
This means the bundle currently pays the 25KB+ base cost with zero benefit.

**Why it happens:**
- Developers import `motion` at the top level without using `LazyMotion`
- Every `<motion.div>` and `<motion.path>` is eagerly loaded, including gesture
  and drag feature sets that are never used in a hero loop
- A 600-line hero SVG inlined as JSX is not tree-shakeable; the entire component
  ships even if only 3 scenes are visible

**Consequences:**
- Net bundle savings from Three.js removal are partially eaten by Motion overhead
- Hero component becomes the new largest chunk (replacing HeroScene.jsx at 673 lines)

**Prevention:**
- Use `LazyMotion` + `m` (the lightweight alias) instead of `motion`:
  ```jsx
  import { LazyMotion, domAnimation, m } from "motion/react"
  // Reduces initial payload to ~4.6KB
  ```
- Load animation features only when the hero section is in view using `loadFeatures`
  lazy import — aligns with the existing `IntersectionObserver` pattern already
  in the codebase
- Split the 7-scene animation into separate scene components loaded with `React.lazy`
  — only the active scene's code is parsed
- After removing Three.js packages (`three`, `@react-three/fiber`, `@react-three/drei`,
  `@react-three/postprocessing`), run `vite build --report` to confirm net savings
  before shipping

**Detection (warning signs):**
- `import { motion } from "motion/react"` without `LazyMotion` wrapper
- Hero component exceeds 400 lines of JSX
- `vite build` chunk analysis shows `motion` as top-5 largest chunk

**Phase:** Dependency cleanup + Hero Scene build

---

### Pitfall 6: Invisible `prefers-reduced-motion` Breakage

**What goes wrong:** The 10–14 second looping hero animation runs unconditionally.
Users with vestibular disorders, motion sensitivity, or low-battery mode on iOS
(which sets `prefers-reduced-motion: reduce` automatically) experience continuous
animation against their system preference. This is a WCAG 2.1 Level AA violation
(Criterion 2.3.3).

**Current state:** The existing codebase has zero `prefers-reduced-motion` handling
in any component (confirmed by codebase audit in CONCERNS.md). The hero's
`animate-slide-up`, `animate-stamp-in`, and `animate-pulse-glow` CSS animations
run for all users.

**Why it happens:** Developers build animations that look great, add the feature,
then treat accessibility as a later polish step that never arrives.

**Consequences:**
- Accessibility audit failure — manufacturing B2B sites serve users across all
  physical capabilities
- iOS Low Power Mode silently sets `prefers-reduced-motion: reduce` — the hero
  loop running on a low-battery iPhone is an invisible bug
- No static fallback means users with motion sensitivity see a black hero section
  if JS is disabled

**Prevention:**
- Use Motion's built-in `useReducedMotion()` hook as the single source of truth:
  ```jsx
  import { useReducedMotion } from "motion/react"
  const shouldReduce = useReducedMotion()
  // Pass shouldReduce to all scene components as a prop
  ```
- For the hero loop: when `shouldReduce` is true, show the final scene frame as
  a static SVG (the finished injection-moulded product) — not a blank section
- CSS animations in `index.css` (`animate-slide-up`, `animate-stamp-in`) must also
  have a `@media (prefers-reduced-motion: reduce)` block that sets
  `animation: none; opacity: 1;` — Motion's JS hook does not cover CSS animations
- Implement this in Phase 1, not as a post-launch addition

**Detection (warning signs):**
- No `useReducedMotion` import anywhere in codebase
- No `@media (prefers-reduced-motion: reduce)` block in `index.css`
- Manually enabling "Reduce Motion" in macOS/iOS System Settings causes blank hero
  or identical animation

**Phase:** Hero Animation Scene build (must ship with initial implementation)

---

## Moderate Pitfalls

Mistakes in this tier cause user-visible issues but are recoverable without full rewrites.

---

### Pitfall 7: `will-change` Memory Pressure on Mobile

**What goes wrong:** Applying `will-change: transform` to every animated element
in the SVG promotes each to its own GPU layer. With 15+ animated elements in the
hero, mobile GPUs allocate separate textures per layer. On iPhone 12 and older
Android mid-range devices, this exhausts compositor memory and degrades performance
worse than no `will-change` at all.

**Prevention:**
- Do not add `will-change` manually — Motion v11.10.0+ adds it only when needed
  for lazy animations; trust the library
- If manually adding: limit to 3–5 elements maximum — the piston, the flow path,
  and the product reveal; not every `<motion.g>`
- Remove any `style={{ willChange: 'transform' }}` from static elements that only
  animate once (entrance animations, not loops)

**Phase:** Performance review pass after hero build

---

### Pitfall 8: `useMotionValue` / `useTransform` Leaks in Long-Running Loops

**What goes wrong:** Creating `useMotionValue` inside a component that remounts
(e.g., scene transitions that unmount/remount) without cleanup can retain motion
value subscriptions. In a 7-scene sequence where scenes mount and unmount, this
accumulates listeners over time.

**Why it happens:** Motion values are React-unmanaged state. `useMotionValue` created
in a component is cleaned up on unmount, but event listeners added via `.on()` outside
a `useEffect` are not.

**Prevention:**
- Always wrap `.on()` subscriptions in `useEffect` with a cleanup return:
  ```jsx
  useEffect(() => {
    const unsubscribe = motionValue.on("change", handler)
    return unsubscribe
  }, [motionValue])
  ```
- Prefer `useMotionValueEvent(motionValue, "change", handler)` — it handles cleanup
  automatically
- For scene sequencing: use a single top-level `useAnimate` scope rather than
  distributed `useMotionValue` instances per scene component

**Phase:** Hero Animation Scene build

---

### Pitfall 9: GearLoader3D Orphaned Canvas After Three.js Removal

**What goes wrong:** `App.jsx` still lazy-loads `GearLoader3D` as the page loading
spinner (lines 27–43). After Three.js packages are removed from `package.json`,
this import throws at runtime on first page load, causing the entire `Suspense`
boundary to render its fallback permanently — users see a spinner and never see
page content.

**Why it happens:** The Three.js removal milestone focuses on `HeroScene` and
`SectionScene` but `GearLoader3D.jsx` is in a different import path and easy to miss.

**Consequences:**
- Entire application shows only a loading spinner on first visit — catastrophic UX
- Error is silent in development if Three.js packages are only removed from
  `dependencies` but still resolvable from `node_modules`

**Prevention:**
- Audit all Three.js imports before removing packages:
  ```bash
  grep -r "from.*three\|@react-three" src/ --include="*.jsx"
  ```
- Remove or replace `GearLoader3D` with an SVG gear loader **before** running
  `npm uninstall three @react-three/fiber @react-three/drei @react-three/postprocessing`
- The SVG fallback `GearLoaderSVG` already exists in `src/components/ui/GearLoader.jsx`
  — use it directly rather than the `Suspense`-over-`Suspense` pattern in `App.jsx`

**Detection (warning signs):**
- App shows infinite spinner after Three.js removal
- `grep` finds Three.js imports outside of `src/components/three/`

**Phase:** Three.js removal / dependency cleanup (must happen first, before hero build)

---

### Pitfall 10: SVG Viewbox and Responsive Scaling Mismatch

**What goes wrong:** The hero SVG is designed at a fixed artboard (e.g., 800×600)
and looks perfect on desktop. On mobile (375px wide), the browser scales the
`viewBox` down proportionally, but the hero section has `min-h-[90vh]` — on a
portrait phone, the scaled SVG is 250px tall with massive empty space, or the
SVG clips and important elements fall outside the visible area.

**Why it happens:** SVG `viewBox` and `preserveAspectRatio` interact non-intuitively
with CSS `height: 100%` containers. The default `xMidYMid meet` centres and
letter-boxes, which looks wrong in a full-bleed hero.

**Consequences:**
- Mobile hero shows a tiny centred SVG surrounded by dark background
- Key animation elements (product reveal) fall below the visible fold on phones

**Prevention:**
- Design the SVG artboard in a 16:9 landscape ratio — it will scale down
  proportionally on most screens
- For portrait mobile: provide an alternate `viewBox` via a CSS media query or
  React state that reframes the animation to show the most important elements
  (the injection moment and product) rather than the full process
- Use `preserveAspectRatio="xMidYMid slice"` on mobile and `"xMidYMid meet"` on
  desktop — `slice` fills the container (like `object-fit: cover`)
- Test at 375px, 390px (iPhone 14), 428px (iPhone 14 Plus), 360px (Android), and
  768px (iPad)

**Phase:** Hero Animation Scene build

---

## Minor Pitfalls

Known friction points that slow development but do not require rewrites.

---

### Pitfall 11: Dark Mode Toggle Removal Race Condition

**What goes wrong:** Removing the theme toggle (per PROJECT.md requirements) while
`DarkModeProvider` still wraps the app creates an inconsistency: localStorage may
have `theme: "light"` from a previous session, causing a light-mode flash on load
before the forced dark mode kicks in.

**Prevention:**
- When committing to dark-only: remove `DarkModeProvider`, set `dark` class
  statically on `<html>` in `index.html`, and delete `useDarkMode.jsx`
- Run `localStorage.removeItem("theme")` migration or simply ignore localStorage
  entirely by removing the hook's read logic

**Phase:** Dark mode cleanup

---

### Pitfall 12: CSS `animate-*` Classes Not Respecting `prefers-reduced-motion`

**What goes wrong:** `index.css` defines custom animation utilities (`animate-slide-up`,
`animate-stamp-in`, `animate-pulse-glow`, `animate-fade-in`) as standard CSS
`@keyframes`. These run regardless of system motion preferences because there is
no `@media (prefers-reduced-motion: reduce)` override in the file.

Motion's `useReducedMotion` hook only controls JS-driven Motion animations, not
these CSS utilities. The two systems need separate handling.

**Prevention:**
Add to `index.css`:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-slide-up,
  .animate-stamp-in,
  .animate-fade-in,
  .animate-pulse-glow {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

**Phase:** Accessibility pass (should be same PR as `useReducedMotion` implementation)

---

### Pitfall 13: `AnimatePresence` Not Wrapping Scene Transitions

**What goes wrong:** The 7-scene sequence mounts and unmounts scenes. Without
`AnimatePresence`, unmounting scenes disappear instantly (no exit animation) and
newly mounting scenes have no entry coordination. The result is abrupt cuts rather
than the cinematic cross-fade the PROJECT.md design intent requires.

**Prevention:**
- Wrap the scene switcher in `<AnimatePresence mode="wait">` or `mode="sync"`
- Set `initial={false}` on `AnimatePresence` if the first scene should appear
  without an entrance animation (cleaner hero load)
- Each scene component must define `exit` variants or the `AnimatePresence`
  wrapper has no effect

**Phase:** Hero Animation Scene build

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Dependency cleanup (remove Three.js) | Orphaned `GearLoader3D` import breaks entire app | Audit all Three.js imports first; replace GearLoader3D before uninstall |
| Hero SVG scene design | Flat diagram with no depth perception — loses wow factor | Layer parallax, CSS glow overlays, isometric projection |
| Hero animation loop | Per-element `repeat: Infinity` timers drift out of sync | Single `useAnimate` sequence timeline, not distributed timers |
| Hero animation loop | Non-composited SVG properties trigger layout per frame | Audit: only `transform`, `opacity`, `stroke-dashoffset` |
| Seamless loop | Frame-zero jump at loop boundary | Ensure keyframe[0] === keyframe[-1] on all looping properties |
| Mobile testing | Safari filter drops, separate transform props break | Test on physical iOS device; use div wrappers for filters |
| Accessibility | Hero loop runs on `prefers-reduced-motion: reduce` | `useReducedMotion` + CSS `@media` override; static fallback frame |
| Bundle optimization | `motion` adds 34KB if not using `LazyMotion` | Use `LazyMotion` + `m` from day one of hero build |
| Dark mode removal | Light flash on load from stale localStorage | Remove `DarkModeProvider` entirely; set dark class in HTML |
| Responsive | SVG clips or letter-boxes on portrait mobile | `preserveAspectRatio="xMidYMid slice"` on mobile viewports |

---

## Sources

**Confidence levels:**

| Finding | Confidence | Source |
|---|---|---|
| `LazyMotion` + `m` reduces bundle to 4.6KB | HIGH | [Motion docs — Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) |
| `repeat: Infinity` stop/restart jump bug | HIGH | [GitHub issue #2714](https://github.com/framer/motion/issues/2714) |
| SVG mask reveal fails on iOS 16 Safari | MEDIUM | [GSAP community report](https://gsap.com/community/forums/topic/41299-svg-mask-reveal-animation-not-working-on-ios-16-and-macos-safari/) |
| Safari drops CSS filter on SVG initial render | MEDIUM | [SVGator Safari lag guide](https://www.svgator.com/help/animation-and-interactivity/how-to-fix-svg-animation-lag-in-safari) |
| `.on()` outside `useEffect` leaks listeners | HIGH | [Motion docs — MotionValue](https://motion.dev/docs/react-motion-value) |
| `useReducedMotion` hook API | HIGH | [Motion docs — Accessibility](https://motion.dev/docs/react-accessibility) |
| `will-change: transform` auto-applied in Motion v11.10+ | MEDIUM | [Motion CHANGELOG](https://raw.githubusercontent.com/framer/motion/main/CHANGELOG.md) |
| iOS Low Power Mode sets `prefers-reduced-motion` | HIGH | [Josh Comeau — accessible animations](https://www.joshwcomeau.com/react/prefers-reduced-motion/) |
| Non-composited SVG properties cause layout per frame | HIGH | [WebPerf tips — layout thrashing](https://webperf.tips/tip/layout-thrashing/) |
| SVG `transform` combined shorthand required in Safari | MEDIUM | [SVGator Safari fix guide](https://seanmcp.com/articles/fix-svg-css-animation-issue-in-safari/) |

---

*Pitfalls audit: 2026-04-01 — specific to Protolabs India Three.js → Motion migration*
