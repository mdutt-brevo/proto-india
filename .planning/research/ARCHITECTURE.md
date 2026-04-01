# Architecture Patterns: Motion for React SVG Animation System

**Domain:** Multi-scene sequential SVG animation loop
**Researched:** 2026-04-01
**Overall confidence:** HIGH — Motion v12 (already installed at 12.38.0), patterns verified
against official docs and Maxime Heckel's advanced orchestration guides.

---

## Recommended Architecture

The animation system sits entirely inside the existing Hero section layer.
It replaces `src/components/three/HeroScene.jsx` with a parallel
`src/components/animation/` directory. No other layers change.

```
src/components/animation/
  InjectionMoldingLoop.jsx      # Orchestrator — owns scene state machine
  scenes/
    GranulesScene.jsx           # Scene 1: raw granules drop into hopper
    MeltingScene.jsx            # Scene 2: granules melt, color shift
    InjectionScene.jsx          # Scene 3: screw drives molten plastic
    MouldFillScene.jsx          # Scene 4: cavity fills from gate outward
    CoolingScene.jsx            # Scene 5: thermal gradient fades
    EjectionScene.jsx           # Scene 6: ejector pins, mould opens
    ProductRevealScene.jsx      # Scene 7: finished part lifts clear
  shared/
    SceneWrapper.jsx            # Fade envelope (enter/exit) for each scene
    useMoldingLoop.js           # State machine hook — scene index + timing
    useReducedMotionFallback.js # Accessibility: static SVG if reduced-motion
    motionTokens.js             # Shared duration, ease, color constants
  static/
    InjectionMoldingStatic.jsx  # Reduced-motion fallback: single frozen frame
```

This is a **vertical slice** — the animation system is self-contained.
`Hero.jsx` imports only `InjectionMoldingLoop` (or the static fallback).
The `src/components/three/` directory is removed wholesale after migration.

---

## Component Hierarchy

```
Hero.jsx                            (Section layer — unchanged contract)
  └── InjectionMoldingLoop.jsx      (Orchestrator — STATE OWNER)
        ├── AnimatePresence          (Motion — manages enter/exit lifecycle)
        │     └── SceneWrapper.jsx   (Fade envelope keyed to sceneIndex)
        │           └── [Scene N].jsx (Presentational — pure Motion markup)
        └── [hidden: aria-live]      (Accessible scene label for SR)
```

### Responsibility breakdown

| Component | Owns | Does NOT own |
|-----------|------|-------------|
| `InjectionMoldingLoop` | `sceneIndex`, timer, loop restart, reduced-motion check | Any SVG paths or animation values |
| `SceneWrapper` | Cross-fade opacity (enter/exit props) | Which scene is shown |
| `[Scene N].jsx` | All SVG paths, Motion variants for that scene | When it appears/disappears |
| `useMoldingLoop` | Timer logic, `SCENE_DURATIONS` config array | React rendering |
| `motionTokens.js` | Shared `duration`, `ease`, `color` constants | Any component logic |

---

## Scene Transition State Machine

### Design

Use a **single integer index** as the only state. No enum, no string keys.
Advancing the scene is just `setScene(i => (i + 1) % SCENE_COUNT)`.

```js
// src/components/animation/shared/useMoldingLoop.js

const SCENE_COUNT = 7;

// Per-scene durations in seconds — tweakable without touching components.
// Total loop: sum of all durations. Target: 10-14 seconds.
const SCENE_DURATIONS = [1.8, 1.5, 2.0, 2.2, 1.8, 1.5, 1.8]; // 12.6 s

export function useMoldingLoop() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion(); // from motion/react

  useEffect(() => {
    if (shouldReduceMotion) return; // freeze on scene 0 (or static)

    const duration = SCENE_DURATIONS[sceneIndex] * 1000;
    const id = setTimeout(() => {
      setSceneIndex(i => (i + 1) % SCENE_COUNT);
    }, duration);

    return () => clearTimeout(id);
  }, [sceneIndex, shouldReduceMotion]);

  return { sceneIndex, shouldReduceMotion };
}
```

Key decisions:
- `setTimeout` drives transitions, not `onAnimationComplete`. This decouples
  scene lifetime from animation completion, preventing a stalled animation
  from blocking the entire loop. Motion's `delay()` utility (locked to the
  rAF loop) could replace `setTimeout` for sub-millisecond precision, but
  the added complexity is not justified here.
- `SCENE_DURATIONS` array is the single configuration surface. Adjusting
  timing requires touching one line, not six components.
- `useReducedMotion()` from `motion/react` is the canonical way to detect
  the OS preference. It subscribes to `matchMedia` and re-renders on change.

---

## AnimatePresence and SceneWrapper

`AnimatePresence` keeps an exiting scene in the DOM while its exit
animation plays. Use `mode="wait"` so the incoming scene only enters after
the outgoing scene has fully exited. This prevents two scenes overlapping
on slower devices.

```jsx
// InjectionMoldingLoop.jsx (simplified)
import { AnimatePresence } from "motion/react";
import SceneWrapper from "./shared/SceneWrapper";
import { SCENES } from "./scenes"; // array mapping index -> component

export default function InjectionMoldingLoop() {
  const { sceneIndex, shouldReduceMotion } = useMoldingLoop();

  if (shouldReduceMotion) return <InjectionMoldingStatic />;

  const SceneComponent = SCENES[sceneIndex];

  return (
    <div
      className="relative w-full aspect-video"
      role="img"
      aria-label="Injection moulding process animation"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <SceneWrapper key={sceneIndex}>
          <SceneComponent />
        </SceneWrapper>
      </AnimatePresence>
    </div>
  );
}
```

```jsx
// SceneWrapper.jsx
import { motion } from "motion/react";

const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function SceneWrapper({ children }) {
  return (
    <motion.div
      className="absolute inset-0"
      variants={FADE}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

The `key={sceneIndex}` on `SceneWrapper` is the trigger. When `sceneIndex`
changes, React unmounts the old wrapper and mounts the new one.
`AnimatePresence` intercepts the unmount, runs the `exit` variant first,
then allows the new scene to enter.

---

## Motion Variants and Orchestration Inside Scenes

Each scene is self-contained. It defines its own variants and runs a
one-shot animation from `initial` to `animate` when mounted.
Variant **propagation** handles parent-to-child coordination without
prop drilling.

### Pattern: Staggered SVG children

```jsx
// MouldFillScene.jsx (example)
import { motion } from "motion/react";

// Parent variant orchestrates children automatically.
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Each child resolves "hidden"/"visible" against its own variants.
const fillSegment = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }, // easeOutExpo
  },
};

export default function MouldFillScene() {
  return (
    <motion.svg
      viewBox="0 0 400 300"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Each <motion.rect> auto-receives staggered delay from parent */}
      <motion.rect variants={fillSegment} x="80"  y="150" width="40" height="80" />
      <motion.rect variants={fillSegment} x="130" y="120" width="40" height="110" />
      <motion.rect variants={fillSegment} x="180" y="100" width="40" height="130" />
      {/* ... */}
    </motion.svg>
  );
}
```

Rules:
- Child `motion.*` elements must NOT have their own `animate` prop — only
  `variants`. This is required for parent propagation to work.
- `initial` and `animate` are set only on the root `motion.svg` of each
  scene. Every other element uses `variants` only.
- Scene-internal stagger/delay lives in the container variant's
  `transition`, not in the hook.

### Pattern: pathLength for draw-on animations

For lines, borders, and flow paths use `pathLength`:

```jsx
const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.2, ease: "easeInOut" }, opacity: { duration: 0.2 } },
  },
};

// Inside a scene:
<motion.path d="M 50 200 C 150 50 250 250 350 100" variants={drawPath} />
```

Do not animate `stroke-dashoffset` manually — `pathLength` is the Motion
abstraction that handles cross-browser SVG normalization.

### Pattern: Keyframe arrays for non-linear motion

For thermal pulse, glow, or oscillation inside a scene:

```jsx
<motion.circle
  animate={{
    scale: [1, 1.15, 1],
    opacity: [0.6, 1, 0.6],
  }}
  transition={{
    duration: 1.2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "mirror",
  }}
/>
```

`repeatType: "mirror"` reverses on repeat — avoids a hard visual jump at
the seam. Use this only for elements that live within a single scene's
duration. Cross-scene continuity is handled by the scene transition layer,
not by individual element repeat loops.

---

## Build Order (What Depends on What)

Build in this exact sequence. Each step is independently testable.

```
Step 1 — motionTokens.js
  No deps. Pure constants.
  Test: import in console, verify values exist.

Step 2 — useMoldingLoop.js
  Deps: motionTokens (for SCENE_DURATIONS), motion/react (useReducedMotion).
  Test: render in isolation with a counter display, verify scene advances.

Step 3 — InjectionMoldingStatic.jsx
  Deps: motionTokens (colors). No motion components.
  Test: render, screenshot at 390px/1440px, verify key process labels visible.

Step 4 — SceneWrapper.jsx
  Deps: motion/react only.
  Test: wrap a plain <div>, confirm fade-in/fade-out on mount/unmount.

Step 5 — InjectionMoldingLoop.jsx (shell only)
  Deps: Steps 2, 3, 4. AnimatePresence. SCENES array (stub with placeholders).
  Test: confirm scene index advances, placeholder scenes swap correctly.

Step 6 — Individual scenes (can parallelize after Step 5)
  GranulesScene → MeltingScene → InjectionScene → MouldFillScene
  → CoolingScene → EjectionScene → ProductRevealScene
  Each deps: motionTokens + motion/react only.
  Test each: render in isolation, watch full animation cycle.

Step 7 — Wire SCENES array in InjectionMoldingLoop
  Replace stubs with real scene components.
  Test: full 12-second loop plays without visual seams.

Step 8 — Hero.jsx integration
  Replace lazy-loaded HeroScene import with InjectionMoldingLoop.
  Remove React.lazy wrapper (SVG has no async loading cost).
  Test: hero renders, loop starts on mount, reduced-motion shows static.

Step 9 — Three.js removal
  Remove src/components/three/ directory.
  Remove three, @react-three/fiber, @react-three/drei, @react-three/postprocessing
  from package.json.
  Test: build succeeds, bundle analyzer shows ~500KB reduction.
```

### Dependency graph

```
motionTokens.js
    ├── useMoldingLoop.js
    ├── SceneWrapper.jsx
    ├── InjectionMoldingStatic.jsx
    └── [All Scene N].jsx
            └── InjectionMoldingLoop.jsx
                        └── Hero.jsx
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: useAnimate for scene timing
**What it is:** Using `useAnimate`'s sequence array to drive the 7-scene
loop imperatively.
**Why bad:** `useAnimate` sequences run to completion; looping requires
manually awaiting each scene and calling the sequence again.
The `setTimeout`-based state machine is simpler to read, debug, and extend.
**Instead:** Use `useMoldingLoop` (state machine) for timing.
Reserve `useAnimate` for complex within-scene choreography that cannot be
expressed cleanly with declarative variants (e.g., a 5-step hydraulic
press cycle in a single scene).

### Anti-Pattern 2: animate prop on children
**What it is:** Giving each `motion.rect` or `motion.path` its own
`animate` prop instead of using `variants` only.
**Why bad:** Breaks parent variant propagation. Children with their own
`animate` prop stop receiving parent state changes. Stagger stops working.
**Instead:** Set `animate` only on the root `motion.svg` of each scene.
All descendants use `variants` exclusively.

### Anti-Pattern 3: Animating layout properties
**What it is:** Animating `width`, `height`, `top`, `left`, or `margin`
on any Motion element.
**Why bad:** Triggers browser layout reflow on every frame. Breaks the
16ms frame budget on mid-range devices immediately.
**Instead:** Use `scaleX`/`scaleY` (with a correct `transform-origin`)
to simulate width/height growth. Use `x`/`y` (translate) for position.

### Anti-Pattern 4: One `AnimatePresence` per scene
**What it is:** Placing `AnimatePresence` inside each scene component.
**Why bad:** Exit animations fire when the scene component itself unmounts,
but if `AnimatePresence` is inside the scene, it has already unmounted by
the time Motion tries to animate the exit.
**Instead:** `AnimatePresence` lives in `InjectionMoldingLoop`, wrapping
the `SceneWrapper`. One `AnimatePresence` for the entire system.

### Anti-Pattern 5: CSS `animation` + Motion on the same element
**What it is:** Putting a `@keyframes` CSS animation and a Motion
`animate` prop on the same element.
**Why bad:** The compositor receives conflicting instructions. Motion's
WAAPI path and the CSS animation path fight, producing jank.
**Instead:** Choose one system per element. CSS `@keyframes` in
`index.css` is fine for ambient background effects (blueprint grid pulse).
Motion handles everything inside the animation canvas.

---

## Scalability Considerations

| Concern | Current (7 scenes) | If expanded (12+ scenes) |
|---------|-------------------|--------------------------|
| Scene timing | `SCENE_DURATIONS` array in hook | Same — add entries to array |
| Scene list | `SCENES` array in loop component | Same — import and append |
| Scene complexity | Each scene is isolated JSX | Extract shared sub-components to `shared/` |
| Bundle size | All SVG is inline JSX — zero extra fetches | Consider code-splitting per scene only if individual scenes exceed ~10KB |
| Reduced-motion | Static single-frame component | Consider per-section statics if scenes diverge significantly |

---

## Accessibility

```jsx
// InjectionMoldingLoop.jsx — accessibility shell
const SCENE_LABELS = [
  "Plastic granules feeding into hopper",
  "Granules melting in heated barrel",
  "Screw injecting molten plastic",
  "Mould cavity filling",
  "Part cooling inside mould",
  "Ejector pins releasing part",
  "Finished injection-moulded part",
];

// In render:
<div role="img" aria-label="Injection moulding process animation">
  <span className="sr-only" aria-live="polite" aria-atomic="true">
    {SCENE_LABELS[sceneIndex]}
  </span>
  <AnimatePresence mode="wait">
    {/* ... */}
  </AnimatePresence>
</div>
```

- `aria-live="polite"` announces scene changes to screen readers without
  interrupting. Use `aria-atomic="true"` so the label replaces fully rather
  than being read character-by-character.
- The entire loop container has `role="img"` — it is a single decorative
  illustration, not interactive content.
- `useReducedMotion()` returns `true` → render `InjectionMoldingStatic`
  instead of the animated loop. The static component must show the final
  product (Scene 7) or a representative mid-process frame, not a blank div.

---

## Sources

- [Motion for React: Animation docs](https://motion.dev/docs/react-animation) — MEDIUM confidence (WebSearch
  confirmed, official domain)
- [Motion: AnimatePresence](https://motion.dev/docs/react-animate-presence) — MEDIUM confidence
- [Motion: useAnimate](https://motion.dev/docs/react-use-animate) — MEDIUM confidence
- [Advanced animation patterns with Framer Motion — Maxime Heckel](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/) — MEDIUM confidence (multiple sources corroborate variant propagation rules)
- [Motion: SVG Animation docs](https://motion.dev/docs/react-svg-animation) — MEDIUM confidence
- [Motion: Path morphing tutorial](https://motion.dev/tutorials/react-path-morphing) — MEDIUM confidence
- [Josh W. Comeau: prefers-reduced-motion](https://www.joshwcomeau.com/react/prefers-reduced-motion/) — HIGH confidence (canonical reference, verified against Motion's `useReducedMotion` API)
- [Motion v12 release notes](https://motion.dev/) — MEDIUM confidence (rebranding and v12 feature set confirmed via WebSearch)

---

*Architecture research: 2026-04-01*
