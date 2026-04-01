# Technology Stack — Animation Overhaul

**Project:** Protolabs India — Three.js → Motion for React
**Researched:** 2026-04-01
**Scope:** High-performance SVG/CSS animations in React 19 + Vite 8 + Tailwind 3.4

---

## Decision: No New Dependencies

The entire animation system is built on **Motion v12.38.0** (already installed) + **native SVG** + **Tailwind CSS keyframes**. Zero additional packages. The Three.js removal frees ~500KB; animation code adds <20KB total.

---

## Core Animation Stack

### Primary: Motion for React v12

| Aspect | Detail | Confidence |
|--------|--------|------------|
| Package | `motion` (npm) — formerly `framer-motion` | HIGH |
| Import path | `import { motion, ... } from "motion/react"` | HIGH |
| Version installed | 12.38.0 — current stable | HIGH |
| React 19 support | Full — v12 was built for React 19 RC | HIGH |

**Critical import note:** The package is `motion` on npm but the React entrypoint is `motion/react`. The old `framer-motion` package name still works as an alias but the canonical path is now `motion/react`. Every component file in this project must use `motion/react`.

---

## Motion v12 API Reference

### 1. `motion` Component (Declarative — primary tool)

Use for all elements that need animation. Wraps every HTML and SVG element.

```jsx
import { motion } from "motion/react";

// HTML element
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -12 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
/>

// SVG element — same API
<motion.path
  d={pathData}
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 1.2, ease: "easeInOut" }}
/>
```

**Rule:** Only animate `opacity`, `transform` (x, y, scale, rotate, skew), and SVG `pathLength`/`pathSpacing`/`pathOffset`. These are compositor-thread properties. Never animate `width`, `height`, `top`, `left`, `color`, or `fill` inside a hot animation loop.

### 2. Variants (Coordinated multi-element animation)

Use variants for the 7-scene hero loop where multiple SVG parts must move in concert. Variants propagate down the component tree automatically.

```jsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,   // 80ms between each child
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants} />
  <motion.div variants={itemVariants} />
</motion.div>
```

**Why variants over per-element animate props:** A single state change on the parent (`animate="visible"`) propagates to all children simultaneously, triggering stagger automatically. This is the correct pattern for scene transitions in the hero loop.

### 3. `useAnimate` Hook (Imperative sequencing — for the hero loop engine)

Use this hook for the 10–14 second 7-scene hero loop. It provides timeline-style sequencing, not possible with declarative variants alone.

```jsx
import { useAnimate, stagger } from "motion/react";

function HeroLoop() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const runLoop = async () => {
      // Scene 1: Granules appear
      await animate(".granule", { opacity: 1, scale: 1 }, { duration: 0.6 });

      // Scene 2: Melting — stagger granule disappearance
      await animate(".granule", { opacity: 0, y: 8 }, {
        duration: 0.4,
        delay: stagger(0.05),
      });

      // Scene 3: Injection — path draw
      await animate(".injection-path", { pathLength: 1 }, { duration: 1.0 });

      // ...repeat infinitely
      runLoop();
    };

    runLoop();
  }, [animate]);

  return <div ref={scope}>...</div>;
}
```

**Key properties:**
- `scope` ref scopes all CSS selectors to children of that element — no global DOM queries
- `stagger(seconds, { from: "center" | "first" | "last" | number })` for cascade effects
- Returns a Promise — `await` each step for sequential choreography
- Cleanup is automatic when the component unmounts

### 4. `AnimatePresence` (Scene mount/unmount transitions)

Required for animating scene transitions — when one scene exits and the next enters.

```jsx
import { AnimatePresence, motion } from "motion/react";

<AnimatePresence mode="wait">
  <motion.div
    key={currentScene}          // MUST change between scenes
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  />
</AnimatePresence>
```

**Mode choices:**
- `mode="wait"` — exit completes before enter starts. Use for scene transitions.
- `mode="sync"` (default) — exit and enter overlap. Use for list items.
- `mode="popLayout"` — removes exiting element from flow immediately. Use for list reorders.

**Common failure:** Wrapping children in a React Fragment inside `AnimatePresence` silently breaks exit animations. Use an array or a single parent element.

### 5. `whileInView` (Scroll-triggered section animations)

Replace the existing `IntersectionObserver` manual setup with Motion's built-in prop.

```jsx
<motion.section
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

- `viewport.once: true` — animates only on first scroll-into-view, does not reverse on scroll out
- `viewport.amount: 0.2` — triggers when 20% of element is visible

### 6. Transition Patterns

```jsx
// Seamless infinite loop — for the hero scene background elements
transition={{
  duration: 3,
  repeat: Infinity,
  repeatType: "loop",    // "loop" | "mirror" | "reverse"
  ease: "linear",        // linear for continuous motion (conveyor, rotation)
}}

// Spring physics — for mechanical part snapping into position
transition={{
  type: "spring",
  stiffness: 400,
  damping: 30,
}}

// Keyframe sequence within a single animation
animate={{
  opacity: [0, 1, 1, 0],     // array = keyframes
  y: [20, 0, 0, -10],
  scale: [0.8, 1, 1, 0.9],
}}
// Times array maps keyframes to 0–1 progress
transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
```

### 7. `useMotionValue` + `useTransform` (Derived values)

For the heat gauge and pressure indicators that derive from a single source value.

```jsx
import { useMotionValue, useTransform, animate } from "motion/react";

const pressure = useMotionValue(0);
const gaugeRotation = useTransform(pressure, [0, 100], ["-90deg", "90deg"]);
const glowOpacity = useTransform(pressure, [0, 100], [0.2, 1.0]);

// Drive all derived values by animating one source
animate(pressure, 85, { duration: 2, ease: "easeInOut" });
```

### 8. `useReducedMotion` (Accessibility — mandatory)

```jsx
import { useReducedMotion } from "motion/react";

function HeroAnimation() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <StaticHeroFallback />;  // Static SVG illustration, no animation
  }

  return <FullHeroLoop />;
}
```

This is the correct pattern over CSS `@media (prefers-reduced-motion)` alone — it lets you render a completely different component rather than just suppressing transitions.

### 9. `useAnimationFrame` (Custom math-based continuous animation)

For the molten flow particle effect where Physics math drives position, not keyframes.

```jsx
import { useAnimationFrame, useMotionValue } from "motion/react";

function MoltenParticle({ initialX, initialY }) {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  useAnimationFrame((time) => {
    // Sinusoidal drift — zero React re-renders, pure motion value updates
    x.set(initialX + Math.sin(time * 0.001) * 8);
    y.set(initialY - (time * 0.02 % 60));  // drift upward, wrap at 60px
  });

  return <motion.div style={{ x, y }} className="particle" />;
}
```

**Why this over `setInterval`/`setTimeout`:** `useAnimationFrame` is synchronized to the browser's RAF loop, batched with Motion's internal render loop, and automatically cancelled on unmount. No stale closures.

---

## SVG Animation Techniques

### Path Drawing (stroke-dasharray equivalent — Motion's abstraction)

Motion's `pathLength` property is a normalized 0–1 abstraction over the raw `stroke-dasharray`/`stroke-dashoffset` mechanism. Motion calculates the total path length automatically — you never need to call `getTotalLength()` manually.

```jsx
// Draw a manufacturing pipeline path
<motion.path
  d="M 20 80 Q 100 20 180 80 T 340 80"
  stroke="#EA580C"
  strokeWidth={2}
  fill="none"
  initial={{ pathLength: 0, opacity: 0 }}
  animate={{ pathLength: 1, opacity: 1 }}
  transition={{
    pathLength: { duration: 1.5, ease: "easeInOut" },
    opacity: { duration: 0.3 },
  }}
/>
```

**Compatible SVG elements:** `path`, `circle`, `ellipse`, `line`, `rect`, `polygon`, `polyline`.

**`pathSpacing`** — controls gaps between dashes (0–1). Use for dashed toolpath lines.
**`pathOffset`** — offsets the draw start point. Use for "marching ants" loop animations.

### Marching Ants (continuous toolpath loop)

```jsx
<motion.path
  d={toolpathD}
  stroke="#64748B"
  strokeWidth={1}
  strokeDasharray="4 4"
  animate={{ pathOffset: [0, 1] }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
/>
```

### Reveal via clipPath (mould filling animation)

The correct technique for "liquid filling a mould" — avoid animating SVG `height` or `y` directly.

```jsx
// In SVG defs
<defs>
  <clipPath id="mould-fill">
    <motion.rect
      x={0}
      width={200}
      initial={{ height: 0, y: 200 }}
      animate={{ height: 200, y: 0 }}
      transition={{ duration: 1.5, ease: "easeIn" }}
    />
  </clipPath>
</defs>

// Apply to fill shape
<rect
  x={0} y={0} width={200} height={200}
  fill="url(#molten-gradient)"
  clipPath="url(#mould-fill)"
/>
```

This keeps the fill animation inside the compositor — the `rect` inside `clipPath` uses `transform` internally.

### Glow and Heat Effects (CSS + Tailwind)

Motion does not animate `filter: blur()` or `box-shadow` on the compositor thread — these cause repaints. Use Tailwind keyframe animations for static/looping glows.

```css
/* In tailwind.config.js — already has pulseGlow, add heat variants */
pulseHeat: {
  "0%, 100%": {
    filter: "drop-shadow(0 0 4px #EA580C40)",
    opacity: "0.7",
  },
  "50%": {
    filter: "drop-shadow(0 0 12px #EA580CB0)",
    opacity: "1.0",
  },
},
```

**Rule:** Animate `opacity` via Motion (compositor), animate `filter`/`box-shadow` via CSS keyframes (browser-managed). Never drive `filter` values through Motion's animate() on a per-frame basis.

---

## Particle Effects (No WebGL)

### Recommended Pattern: CSS-Keyframe Particles

For the granule and molten particle effects — **CSS keyframe + Tailwind** for continuous loops, **Motion** for spawn/despawn lifecycle.

```jsx
// Particle component — pure CSS animation, Motion only for mount/unmount
function Granule({ x, y, delay }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-surface-400"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      {/* Inner CSS animation for continuous jitter */}
      <div className="w-full h-full animate-[granuleJitter_2s_ease-in-out_infinite]" />
    </motion.div>
  );
}
```

**Particle count budget:**
- Safe: ≤40 simultaneously animated DOM particles on mid-range mobile
- Caution: 41–80 particles — test on iPhone 12 class hardware
- Avoid: 80+ DOM particles — use Canvas 2D instead

**Do NOT use `tsParticles` or `react-particles`.** These add a full library dependency for an effect that is achievable with 30 lines of CSS + Motion lifecycle management.

### Spawn Pattern for Granule Scene

```jsx
// Granules spawn, fall into barrel, despawn — driven by scene state
const [granules, setGranules] = useState([]);

useEffect(() => {
  if (scene !== "granules") return;

  const interval = setInterval(() => {
    setGranules(prev => [
      ...prev.slice(-20),   // cap at 20 active granules
      { id: Date.now(), x: rand(60, 140), y: 0, delay: 0 },
    ]);
  }, 180);

  return () => clearInterval(interval);
}, [scene]);
```

---

## Performance Architecture

### The Compositor-Only Rule

**Allowed in animate() / transition:**
- `x`, `y`, `translateX`, `translateY` — triggers compositor
- `scale`, `scaleX`, `scaleY` — triggers compositor
- `rotate`, `rotateX`, `rotateY`, `rotateZ` — triggers compositor
- `opacity` — triggers compositor
- `pathLength`, `pathOffset`, `pathSpacing` — SVG only, safe
- `skewX`, `skewY` — triggers compositor

**Forbidden in animate() / transition (causes layout/repaint):**
- `width`, `height` — layout recalc
- `top`, `left`, `right`, `bottom` — layout recalc
- `margin`, `padding` — layout recalc
- `border-width` — layout recalc
- `fill` (SVG) — repaint on every frame
- `stroke` (SVG color) — repaint on every frame
- `filter` — repaint (use CSS keyframes instead)
- `background-color` — repaint

### will-change Strategy

Apply `will-change: transform` only to elements that are actively mid-animation. Do not apply globally.

```jsx
// Apply via Motion's style prop — Motion manages this automatically
// for elements using the motion component

// For CSS-only animated elements that need the hint:
<div
  className="animate-[moltenFlow_3s_ease-in-out_infinite]"
  style={{ willChange: "transform" }}  // only while animation is active
/>
```

**Caution:** Over-applying `will-change` forces GPU layer promotion for every marked element simultaneously. On mobile with limited VRAM this causes frame drops worse than the original problem. Apply surgically, only to elements in the hot animation path.

### Frame Budget

Target: 16ms per frame (60fps).

| Animation type | Cost | Notes |
|---------------|------|-------|
| `transform`/`opacity` via Motion | ~0.1ms | Compositor thread, no layout |
| SVG `pathLength` | ~0.2ms | Compositor via Motion's internal handler |
| CSS keyframe (transform/opacity) | ~0.1ms | Browser compositor |
| CSS keyframe (filter/box-shadow) | ~1–3ms | Main thread repaint |
| DOM particle (div, 20 elements) | ~1ms | One layout per batch |
| Canvas 2D particle (100+ particles) | ~2ms | Single draw call |
| Three.js (previous system) | ~9ms+ | GPU buffer upload + WebGL draw |

Motion's internal optimised DOM renderer bypasses React's reconciler for motion value updates. Values driven by `useMotionValue` → `style` props do NOT trigger React re-renders.

---

## Seamless Loop Architecture

For the 7-scene 10–14 second hero loop, the correct pattern is a state machine driving scene transitions, not a single massive keyframe sequence.

```
Scene state machine:
granules (2s) → melting (1.5s) → injection (2s) → filling (2s)
  → cooling (1.5s) → ejection (1s) → product-reveal (2s) → [repeat]
```

### Implementation Pattern

```jsx
const SCENES = ["granules", "melting", "injection", "filling",
                 "cooling", "ejection", "product-reveal"];
const DURATIONS = [2000, 1500, 2000, 2000, 1500, 1000, 2000];

function HeroLoop() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const timeout = setTimeout(() => {
      setSceneIndex(i => (i + 1) % SCENES.length);
    }, DURATIONS[sceneIndex]);

    return () => clearTimeout(timeout);
  }, [sceneIndex, prefersReduced]);

  return (
    <AnimatePresence mode="wait">
      <SceneComponent
        key={SCENES[sceneIndex]}
        scene={SCENES[sceneIndex]}
      />
    </AnimatePresence>
  );
}
```

**Why state machine over `useAnimate` single timeline:** Individual scene components can be code-split, independently tested, and swapped without touching the loop engine. The `await animate(...)` approach creates a monolithic async function that is hard to pause, interrupt, or extend with new scenes.

**Cross-fade between scenes:** Use `mode="wait"` in `AnimatePresence` with a 0.3s overlap. Each scene has `initial={{ opacity: 0 }}` and `exit={{ opacity: 0 }}`.

---

## What NOT to Use

| Technology | Reason to Avoid |
|------------|----------------|
| Three.js / WebGL | Entire reason for this migration — GPU buffer uploads, 500KB bundle |
| `tsParticles` / `react-particles` | Adds library dependency for effects achievable with 30 lines |
| Lottie / `lottie-react` | Adds 150KB+ dependency, SVG+Motion achieves same results |
| GSAP | Excellent library but redundant — Motion v12 covers all required patterns |
| `react-spring` | Physics springs are valuable but Motion has spring support; no need for two animation libraries |
| `anime.js` | Redundant with Motion; no React integration |
| CSS `animation` on `filter` | Causes repaint per frame; use as static decorative glow only |
| Animating SVG `fill` color | Per-frame repaint; use `opacity` + colored overlay instead |
| `setInterval` for particle spawning | Use `useAnimationFrame` or React state + `useEffect` cleanup |
| `requestAnimationFrame` directly | Use `useAnimationFrame` from `motion/react` — handles cleanup and sync |
| Video-based hero | Loading weight, format complexity, no interactivity |

---

## Integration with Existing Tailwind Keyframes

The project's `tailwind.config.js` already defines production-ready keyframes. These should be **reused**, not replaced.

| Tailwind animation | Use for |
|-------------------|---------|
| `animate-gear-spin` | Rotating mechanical parts, screw threads |
| `animate-shimmer` | Metallic sheen on finished product surface |
| `animate-draw-line` | SVG toolpath reveal (CSS fallback; prefer Motion pathLength) |
| `animate-molten-flow` | Background gradient on barrel/chamber |
| `animate-spark` | CSS-driven individual spark particles |
| `animate-pulse-glow` | Ambient glow on heat elements |
| `animate-wipe-right` | `clipPath: inset()` mechanical reveal |
| `animate-stamp-in` | Hydraulic press impact with overshoot spring feel |

**Coordination rule:** Use Tailwind animations for decoration and loops that run indefinitely independent of scene state. Use Motion for anything that needs to be triggered, sequenced, or tied to scene transitions.

---

## Bundle Impact

| Action | Delta |
|--------|-------|
| Remove `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` | -~490KB gzipped |
| `motion` already installed — no new cost | +0KB |
| SVG inline (inline in JSX, tree-shaken) | +~15–40KB per SVG file |
| Tailwind keyframes (already in config) | +0KB |
| **Net change** | **-450KB+ gzipped** |

---

## Sources

- [React motion component — Motion docs](https://motion.dev/docs/react-motion-component)
- [useAnimate — Manual React animation controls](https://motion.dev/docs/react-use-animate)
- [AnimatePresence — React exit animations](https://motion.dev/docs/react-animate-presence)
- [React FLIP & Shared Element — Layout animations](https://motion.dev/docs/react-layout-animations)
- [stagger — Stagger the delay of multiple animations](https://www.framer.com/motion/stagger/)
- [SVG Animation in React — Paths, Morph & Line Drawing](https://motion.dev/docs/react-svg-animation)
- [useScroll — React scroll-linked animations](https://motion.dev/docs/react-use-scroll)
- [useTransform — Composable React animation values](https://motion.dev/docs/react-use-transform)
- [useAnimationFrame — React requestAnimationFrame](https://motion.dev/docs/react-use-animation-frame)
- [Motion Values — composable React values](https://motion.dev/docs/react-motion-value)
- [Motion & Framer Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide)
- [CSS GPU Acceleration: will-change & translate3d Guide (2025)](https://www.lexo.ch/blog/2025/01/boost-css-performance-with-will-change-and-transform-translate3d-why-gpu-acceleration-matters/)
- [MDN — CSS performance optimization](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS)
- [Accessible Animations — prefers-reduced-motion — Josh W. Comeau](https://www.joshwcomeau.com/react/prefers-reduced-motion/)
- [SVG Animation Encyclopedia 2025 — SVG AI](https://www.svgai.org/blog/research/svg-animation-encyclopedia-complete-guide)
- [Path drawing — Motion tutorial](https://motion.dev/tutorials/react-path-drawing)
- [Tailwind CSS custom animations — LogRocket](https://blog.logrocket.com/creating-custom-animations-tailwind-css/)
- [motion/CHANGELOG.md — GitHub](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)
