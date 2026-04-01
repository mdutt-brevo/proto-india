# Phase 2: Animation Infrastructure - Research

**Researched:** 2026-04-01
**Domain:** Motion for React v12 — state-machine hook, AnimatePresence orchestration,
reduced-motion accessibility fallback
**Confidence:** HIGH — all key APIs verified against project-level architecture and stack
research; motionTokens.js and LazyMotion already in place from Phase 1.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **useMoldingLoop hook**: Single `sceneIndex` integer state (0-6), advanced via
  `setTimeout` using `SCENE_DURATIONS` array from `src/lib/motionTokens.js` (already
  created in Phase 1, sums to 12.0s). Loops back to 0 after scene 6.
- **SceneWrapper component**: Uses `AnimatePresence mode="wait"` with `key={sceneIndex}`.
  Each scene component gets `initial="hidden" animate="visible" exit="exit"` variants.
  Cross-fade transitions using `SCENE_ENTER` and `SCENE_EXIT` presets from motionTokens.js.
- **InjectionMoldingStatic**: Static SVG showing the final product (Scene 7 frozen frame).
  Rendered when `useReducedMotion()` returns true. Must be a meaningful fallback, not blank.
- **Import from `motion/react`**: All Motion imports use this path (LazyMotion already
  set up in Phase 1).
- **File locations**: Hook in `src/hooks/useMoldingLoop.js`, components in
  `src/components/animation/`.

### Claude's Discretion
All implementation details are at Claude's discretion — this is an infrastructure phase.

### Deferred Ideas (OUT OF SCOPE)
None — infrastructure phase.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INF-03 | `useMoldingLoop` custom hook — scene index state machine with SCENE_DURATIONS array | setTimeout-based state machine pattern; motionTokens.js SCENE_DURATIONS already available |
| INF-04 | `SceneWrapper` component with AnimatePresence mode="wait" orchestration | AnimatePresence + variants pattern; SCENE_ENTER/SCENE_EXIT presets ready in motionTokens.js |
| INF-05 | `InjectionMoldingStatic` component — reduced-motion fallback (static final-frame SVG) | Static SVG component with COLOR constants from motionTokens.js; no motion imports needed |
| INF-06 | `useReducedMotion` integration — OS-level motion preference respected | `useReducedMotion()` from `motion/react`; subscribes to matchMedia, re-renders on change |
</phase_requirements>

---

## Summary

Phase 2 builds three independently testable infrastructure pieces before any scene SVG
exists: the `useMoldingLoop` hook (scene index state machine), the `SceneWrapper`
component (AnimatePresence cross-fade envelope), and `InjectionMoldingStatic` (static
accessibility fallback). All Phase 1 prerequisites are confirmed in place: `LazyMotion`
wraps the entire app in `App.jsx`, `motionTokens.js` exports `SCENE_DURATIONS`,
`SCENE_ENTER`, `SCENE_EXIT`, `COLOR`, and all relevant easings. No new dependencies
are required.

The `useMoldingLoop` hook uses a single integer index driven by `setTimeout`. The only
state is `sceneIndex`; the loop advances when a `setTimeout` fires and resets on scene
change via the `useEffect` dependency array. `useReducedMotion()` freezes the loop at
scene 0 when OS motion preference is reduce. The hook returns both `sceneIndex` and
`shouldReduceMotion` so the orchestrator can branch to the static fallback.

`SceneWrapper` is a thin `m.div` (using the `m` alias provided by `LazyMotion`) that
wraps whatever scene is currently active. It carries the cross-fade `variants` object
built from `SCENE_ENTER` and `SCENE_EXIT` transition presets. The `key={sceneIndex}` on
`SceneWrapper` is the sole trigger for AnimatePresence to intercept unmount, run the
exit animation, then allow the new scene to enter. `InjectionMoldingStatic` is a pure
SVG component — zero motion imports, `COLOR` constants only — showing the finished
injection-moulded part as a meaningful frame rather than a blank div.

**Primary recommendation:** Build in sequence — hook first (testable with a counter),
then SceneWrapper (testable with a plain div inside), then InjectionMoldingStatic
(testable by forcing `useReducedMotion` to return true). The orchestrator shell
(InjectionMoldingLoop) is Phase 2's final deliverable: it wires all three together
with placeholder stub scenes so the loop is visually exercisable before Phase 3 writes
any real SVG.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `motion` (import: `motion/react`) | 12.38.0 (installed) | Animation engine — `m` components, AnimatePresence, useReducedMotion | Only animation library in the project; LazyMotion already configured |
| React | 19.2.4 (installed) | useState, useEffect for hook state machine | Existing framework |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `src/lib/motionTokens.js` | — (Phase 1 output) | SCENE_DURATIONS, SCENE_ENTER, SCENE_EXIT, COLOR | Import in hook and both components |
| Tailwind CSS | 3.4.19 (installed) | Layout classes on InjectionMoldingStatic wrapper div | Wrapper div only; no custom styles on SVG |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `setTimeout` for scene timing | `useAnimate` async sequence | `useAnimate` creates a monolithic async function that is hard to pause, extend, or test in isolation. `setTimeout` + state machine keeps each scene independent. **Locked decision: use setTimeout.** |
| `m` alias (LazyMotion) | full `motion` import | Full `motion` adds 34KB; `m` with `domAnimation` is 4.6KB. LazyMotion is already in App.jsx — use `m`. |

**Installation:** No new packages. Everything is already installed.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── hooks/
│   └── useMoldingLoop.js          # Phase 2 — scene state machine hook
├── components/
│   └── animation/
│       ├── SceneWrapper.jsx        # Phase 2 — cross-fade AnimatePresence envelope
│       ├── InjectionMoldingStatic.jsx  # Phase 2 — reduced-motion fallback
│       ├── InjectionMoldingLoop.jsx    # Phase 2 — orchestrator shell (stub scenes)
│       └── scenes/                 # Phase 3-4 — real scene SVGs go here
│           └── (empty in Phase 2, stubs only)
└── lib/
    └── motionTokens.js             # Phase 1 output — already exists
```

### Pattern 1: useMoldingLoop — Single-Integer State Machine

**What:** A custom hook that owns `sceneIndex` state. A `useEffect` keyed on
`[sceneIndex, shouldReduceMotion]` sets a `setTimeout` for `SCENE_DURATIONS[sceneIndex]`
seconds. When the timeout fires, `setSceneIndex(i => (i + 1) % SCENE_COUNT)` advances
the scene. Cleanup clears the timeout on every render cycle.

**When to use:** Any component that needs to know the current scene index and whether to
show the static fallback.

```js
// src/hooks/useMoldingLoop.js
// Source: ARCHITECTURE.md pattern, verified against motionTokens.js actual values

import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { SCENE_DURATIONS } from "../lib/motionTokens";

const SCENE_COUNT = 7; // Matches SCENE_DURATIONS.length

export function useMoldingLoop() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // When OS prefers reduced motion, freeze at scene 0.
    // The orchestrator renders InjectionMoldingStatic instead.
    if (shouldReduceMotion) return;

    const duration = SCENE_DURATIONS[sceneIndex] * 1000; // convert s → ms
    const id = setTimeout(() => {
      setSceneIndex(i => (i + 1) % SCENE_COUNT);
    }, duration);

    return () => clearTimeout(id); // cleanup before next effect run
  }, [sceneIndex, shouldReduceMotion]);

  return { sceneIndex, shouldReduceMotion };
}
```

Key decisions baked in:
- `SCENE_COUNT` is a constant, not derived from `SCENE_DURATIONS.length`, to make
  it explicit for the reader. Both must stay in sync.
- `useReducedMotion()` from `motion/react` subscribes to `matchMedia` internally and
  re-renders the hook consumer when the OS preference changes at runtime (e.g., user
  toggles Low Power Mode on iOS mid-session).
- No `isRunning` toggle or play/pause API — Phase 2 does not need it. If pause is
  required in v2, add a `paused` param to the hook.

### Pattern 2: SceneWrapper — AnimatePresence Cross-Fade Envelope

**What:** A thin `m.div` that holds the cross-fade variants. The parent passes
`key={sceneIndex}` so React sees a new element on every scene change. AnimatePresence
intercepts the unmount and runs `exit` before mounting the new key.

**When to use:** Always wrap the active scene component in this. Never skip the wrapper
or the exit animation is lost.

```jsx
// src/components/animation/SceneWrapper.jsx
// Source: ARCHITECTURE.md pattern, using SCENE_ENTER/SCENE_EXIT from motionTokens.js

import { m } from "motion/react";
import { SCENE_ENTER, SCENE_EXIT } from "../../lib/motionTokens";

// Variants reference motionTokens presets — single place to tune timing
const FADE = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: SCENE_ENTER },  // 0.4s easeOutExpo
  exit:    { opacity: 0, transition: SCENE_EXIT },   // 0.3s easeInOutSine
};

export default function SceneWrapper({ children }) {
  return (
    <m.div
      className="absolute inset-0"
      variants={FADE}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </m.div>
  );
}
```

Note: `m` is the lightweight alias provided by `LazyMotion` already wrapping the app.
Do not import `motion` here — it would bypass LazyMotion and load the 34KB bundle.

### Pattern 3: InjectionMoldingLoop — Orchestrator Shell

**What:** The orchestrator owns the visual branch: animated loop vs. static fallback.
For Phase 2 it ships with stub scene components (colored rectangles) so the loop is
exercisable before Phase 3 SVGs exist.

```jsx
// src/components/animation/InjectionMoldingLoop.jsx (Phase 2 shell)
// Source: ARCHITECTURE.md component hierarchy

import { AnimatePresence } from "motion/react";
import { useMoldingLoop } from "../../hooks/useMoldingLoop";
import SceneWrapper from "./SceneWrapper";
import InjectionMoldingStatic from "./InjectionMoldingStatic";

// Accessibility: announce current scene to screen readers without
// interrupting reading flow (polite = waits for silence before speaking)
const SCENE_LABELS = [
  "Plastic granules feeding into hopper",
  "Granules melting in heated barrel",
  "Screw injecting molten plastic",
  "Mould cavity filling",
  "Part cooling inside mould",
  "Ejector pins releasing part",
  "Finished injection-moulded part",
];

// Phase 2 stubs — replaced with real scenes in Phase 3-4
const SCENE_COLORS = [
  "#64748b", "#7c6f3a", "#ea580c", "#b45309",
  "#1e6b8a", "#4a3f7a", "#2d6a4f",
];

function SceneStub({ sceneIndex }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: SCENE_COLORS[sceneIndex] }}
    >
      <span className="text-white text-lg font-mono">Scene {sceneIndex + 1}</span>
    </div>
  );
}

export default function InjectionMoldingLoop() {
  const { sceneIndex, shouldReduceMotion } = useMoldingLoop();

  // Branch: static fallback for reduced-motion users
  if (shouldReduceMotion) return <InjectionMoldingStatic />;

  return (
    <div
      className="relative w-full aspect-video overflow-hidden"
      role="img"
      aria-label="Injection moulding process animation"
    >
      {/* sr-only span announced by screen readers on scene change */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {SCENE_LABELS[sceneIndex]}
      </span>

      {/* AnimatePresence must be at this level — not inside SceneWrapper.
          mode="wait" ensures exit completes before the new scene enters. */}
      <AnimatePresence mode="wait">
        <SceneWrapper key={sceneIndex}>
          <SceneStub sceneIndex={sceneIndex} />
        </SceneWrapper>
      </AnimatePresence>
    </div>
  );
}
```

### Pattern 4: InjectionMoldingStatic — Reduced-Motion Fallback

**What:** A pure SVG component. No `m.*` elements, no animation. Shows a meaningful
frozen frame of the finished moulded part using `COLOR` constants from motionTokens.js.
Must render a recognizable product illustration, not a blank placeholder.

**When to use:** Rendered exclusively by `InjectionMoldingLoop` when `shouldReduceMotion`
is true.

```jsx
// src/components/animation/InjectionMoldingStatic.jsx
// No motion imports — this component must render with zero JS animation.
// Color constants from motionTokens ensure visual consistency with animated scenes.

import { COLOR } from "../../lib/motionTokens";

export default function InjectionMoldingStatic() {
  return (
    <div className="w-full aspect-video flex items-center justify-center">
      <svg
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"  // outer div has role="img" in the parent
        className="w-full h-full"
      >
        {/* Background */}
        <rect width="400" height="300" fill={COLOR.baseBg} />

        {/* Finished part outline — simplified injection-moulded housing */}
        <rect
          x="120" y="80" width="160" height="120"
          rx="8" ry="8"
          fill="none"
          stroke={COLOR.surfacePrimary}
          strokeWidth="2"
        />

        {/* Part interior detail lines */}
        <line x1="140" y1="110" x2="260" y2="110"
          stroke={COLOR.textMuted} strokeWidth="1" />
        <line x1="140" y1="140" x2="260" y2="140"
          stroke={COLOR.textMuted} strokeWidth="1" />
        <line x1="140" y1="170" x2="260" y2="170"
          stroke={COLOR.textMuted} strokeWidth="1" />

        {/* Accent highlight on part edge */}
        <rect
          x="120" y="80" width="8" height="120"
          rx="4" ry="4"
          fill={COLOR.accentOrange}
          opacity="0.6"
        />

        {/* Label */}
        <text
          x="200" y="240"
          textAnchor="middle"
          fill={COLOR.textMuted}
          fontSize="12"
          fontFamily="monospace"
        >
          Precision in Every Moulded Part
        </text>
      </svg>
    </div>
  );
}
```

The static SVG complexity can be iterated in later phases. Phase 2 just needs a
non-blank meaningful shape. The "Precision in Every Moulded Part" text matches
HER-07's product reveal label.

### Anti-Patterns to Avoid

- **`AnimatePresence` inside SceneWrapper:** Exit animations fire after unmount — the
  AnimatePresence must always be the parent, never the child.
- **Full `motion` import instead of `m`:** Bypasses `LazyMotion`, adds 34KB.
  Use `m` from `motion/react`, not `motion`.
- **`key` on AnimatePresence instead of SceneWrapper:** AnimatePresence does not use
  a key prop for scene switching. The key goes on its direct child (`SceneWrapper`).
- **Driving scene timing from `onAnimationComplete`:** A stalled animation blocks the
  entire loop. `setTimeout` decouples timing from animation completion.
- **React Fragment as AnimatePresence direct child:** Silently breaks exit animations.
  The direct child must be a real DOM element or motion component.
- **`useReducedMotion` called inside SceneWrapper instead of the orchestrator:**
  The check must be at the top of the render tree so the entire animated subtree is
  replaced, not just suppressed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detecting OS reduced-motion preference | Manual `window.matchMedia` in a hook | `useReducedMotion()` from `motion/react` | Handles SSR, subscribes to matchMedia changes, re-renders consumers on change |
| Scene exit animations on unmount | Manual CSS transitions + delayed setState | `AnimatePresence mode="wait"` | AnimatePresence keeps the exiting element in the DOM while exit runs, then removes it |
| Cross-fade transition timing | Custom keyframe animation with opacity | `SCENE_ENTER` / `SCENE_EXIT` presets from motionTokens.js + `m.div variants` | Single source of truth; changing motionTokens changes all cross-fades at once |
| Loop timeout cleanup | Manual ref to store timeout ID | `useEffect` return `() => clearTimeout(id)` | Standard React cleanup pattern; Phase 1 architecture already established this |

**Key insight:** This phase has no complex third-party API surface to learn. The
complexity is structural — getting the AnimatePresence nesting correct and not
accidentally breaking exit animations by misplacing the `key` prop.

---

## Common Pitfalls

### Pitfall 1: `m` vs `motion` Import

**What goes wrong:** Importing `motion` directly in a component file bypasses the
`LazyMotion` feature bundle restriction in App.jsx. The component loads the full 34KB
motion bundle instead of the 4.6KB `domAnimation` lazy bundle.

**Why it happens:** `motion` works fine at runtime — there is no error. The bundle
size regression is invisible without running `vite build --report`.

**How to avoid:** Enforce `import { m } from "motion/react"` in all animation
components. `AnimatePresence` is still imported from `motion/react` directly (it does
not have an `m` alias); this is correct and expected.

**Warning signs:** `import { motion } from "motion/react"` in any file under
`src/components/animation/`.

### Pitfall 2: `key` Prop on the Wrong Element

**What goes wrong:** Placing `key={sceneIndex}` on `AnimatePresence` rather than on
`SceneWrapper`. AnimatePresence does not accept a `key` prop for scene switching.
The exit animation never fires.

**Why it happens:** Documentation examples sometimes show key on the child without
clarifying that AnimatePresence itself must NOT get the key.

**How to avoid:**

```jsx
// Correct
<AnimatePresence mode="wait">
  <SceneWrapper key={sceneIndex}>   {/* key goes here */}
    ...
  </SceneWrapper>
</AnimatePresence>

// Wrong — exit never fires
<AnimatePresence mode="wait" key={sceneIndex}>
  <SceneWrapper>
    ...
  </SceneWrapper>
</AnimatePresence>
```

**Warning signs:** Scene transitions cut instantly (no fade out) on scene change.

### Pitfall 3: useReducedMotion Returns null on First Render (SSR edge)

**What goes wrong:** On a server-render or hydration pass, `useReducedMotion()` may
return `null` (unknown) before the browser has evaluated `matchMedia`. Rendering the
animated loop on null and then switching to static on true causes a flash.

**Why it happens:** Motion's `useReducedMotion` returns `undefined` or `false` until
`matchMedia("(prefers-reduced-motion: reduce)")` resolves on the client.

**How to avoid:** In the orchestrator, treat `shouldReduceMotion === true` as the only
condition for static fallback. `null`/`undefined`/`false` all show the animated loop.
This is the correct UX — assume motion is fine until explicitly told otherwise.

```js
// Safe
if (shouldReduceMotion) return <InjectionMoldingStatic />;
```

**Warning signs:** Brief flash of static fallback on page load in a Vite dev server.
(Not a production issue for this project — Vite is CSR only.)

### Pitfall 4: SCENE_COUNT Drift from SCENE_DURATIONS

**What goes wrong:** `SCENE_DURATIONS` in motionTokens.js has 7 entries. If a
developer adds an 8th duration in a future phase but does not update `SCENE_COUNT`
in useMoldingLoop.js, the loop silently skips the new scene.

**Why it happens:** Two places store the same number — the array length and the modulo
constant.

**How to avoid:** Either derive `SCENE_COUNT` from the array, or add a comment warning:

```js
// Option A — derive at import time (no drift possible)
import { SCENE_DURATIONS } from "../lib/motionTokens";
const SCENE_COUNT = SCENE_DURATIONS.length; // keep in sync with motionTokens.js

// Option B — explicit constant with comment (matches ARCHITECTURE.md pattern)
const SCENE_COUNT = 7; // MUST match SCENE_DURATIONS.length in motionTokens.js
```

Option A is safer for this project since motionTokens.js is the declared source of
truth.

### Pitfall 5: Glow/filter on `<svg>` Element Instead of Wrapper `<div>`

**What goes wrong:** Applying CSS `filter: drop-shadow()` directly on the `<svg>` in
`InjectionMoldingStatic` renders incorrectly on Safari (initial frame drop, then
invisible).

**How to avoid:** Wrap the SVG in a `<div>` and apply any filter classes to the div,
not the svg element. Phase 2's static fallback is minimal enough to avoid this entirely
— no filter effects are specified.

---

## Code Examples

Verified patterns from project research and installed library version:

### useReducedMotion Basic Branch

```jsx
// Source: STACK.md + motion/react docs — verified pattern
import { useReducedMotion } from "motion/react";

function HeroAnimation() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <InjectionMoldingStatic />;
  return <InjectionMoldingLoop />;
}
```

### AnimatePresence with mode="wait" + keyed child

```jsx
// Source: ARCHITECTURE.md — AnimatePresence and SceneWrapper section
import { AnimatePresence } from "motion/react";

<AnimatePresence mode="wait">
  <SceneWrapper key={sceneIndex}>
    <ActiveScene />
  </SceneWrapper>
</AnimatePresence>
```

### useEffect cleanup pattern (from useInView.js — existing codebase style)

```js
// Source: src/hooks/useInView.js — existing hook pattern in this codebase
useEffect(() => {
  const id = setTimeout(() => { /* ... */ }, duration);
  return () => clearTimeout(id); // matches the observer.disconnect() cleanup style
}, [dependency]);
```

### m alias in LazyMotion context

```jsx
// Source: STACK.md — LazyMotion + m alias section
// App.jsx already wraps app in <LazyMotion features={domAnimation}>
// All animation components use m.* (not motion.*) for the feature-gated bundle

import { m, AnimatePresence } from "motion/react";
// m.div, m.path, m.svg — all use the lightweight 4.6KB bundle
// AnimatePresence is not an animated element — import directly, no m alias needed
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package name | `motion` package, import from `motion/react` | Motion v11 (2024) | Every component file must use `motion/react` import path, not `framer-motion` |
| Full `motion` import | `LazyMotion` + `m` alias + `domAnimation` feature bundle | Motion v10+ | 34KB → 4.6KB for animation-only pages |
| `AnimatePresence` children as Fragment | Children must be real elements or arrays | Motion v10+ | Fragment as direct child silently breaks exit animations |

**Deprecated/outdated:**
- `import { motion } from "framer-motion"`: Package renamed to `motion`. Old name still
  works as alias but canonical path is `motion/react`.
- Manual `matchMedia` for reduced-motion detection: Replaced by `useReducedMotion()`
  which handles SSR and runtime changes.

---

## Open Questions

1. **InjectionMoldingStatic SVG complexity level**
   - What we know: Must be "a meaningful fallback, not blank" (CONTEXT.md decision).
     Must show finished product.
   - What's unclear: How detailed should the Phase 2 static SVG be? A rough placeholder
     shape or a polished product illustration?
   - Recommendation: Phase 2 ships a rough but recognizable shape (rectangular housing
     with detail lines as shown in the Pattern 4 example). Phase 3-4 can refine it with
     a real product outline once the Scene 7 SVG is designed. This is infrastructure
     phase — the contract (component exists, non-blank, COLOR constants used) is what
     matters.

2. **Stub scene components — inline or separate files?**
   - What we know: Scenes 1-7 are Phase 3-4 work. Phase 2 needs stubs to exercise the
     loop.
   - What's unclear: Whether stubs should live in scene files (forward compatibility)
     or inline in InjectionMoldingLoop as local components (simpler).
   - Recommendation: Inline `SceneStub` in `InjectionMoldingLoop.jsx` for Phase 2.
     Phase 3 creates the real scene files and replaces the inline stub import by import.
     This avoids creating 7 placeholder files that Phase 3 will overwrite.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — no test runner found in package.json or project root |
| Config file | None — Wave 0 gap |
| Quick run command | N/A — see Wave 0 Gaps |
| Full suite command | N/A — see Wave 0 Gaps |

**Note:** The project has no test infrastructure. `package.json` defines only `dev`,
`build`, `lint`, and `preview` scripts. No Vitest, Jest, or RTL is installed. For
Phase 2 infrastructure components, validation is manual via the dev server.

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INF-03 | useMoldingLoop advances sceneIndex on timeout | unit | none yet | ❌ Wave 0 |
| INF-03 | useMoldingLoop freezes when shouldReduceMotion=true | unit | none yet | ❌ Wave 0 |
| INF-03 | Loop wraps back to 0 after scene 6 | unit | none yet | ❌ Wave 0 |
| INF-04 | SceneWrapper renders children with fade variants | unit | none yet | ❌ Wave 0 |
| INF-04 | AnimatePresence triggers exit on key change | integration | visual — dev server | manual only |
| INF-05 | InjectionMoldingStatic renders non-blank SVG | unit | none yet | ❌ Wave 0 |
| INF-05 | InjectionMoldingStatic contains "Precision in Every Moulded Part" text | unit | none yet | ❌ Wave 0 |
| INF-06 | useReducedMotion=true renders static fallback | integration | visual — dev server | manual only |
| INF-06 | useReducedMotion=false renders animated loop | integration | visual — dev server | manual only |

### Sampling Rate

- **Per task commit:** Manual — render component in dev server, observe behavior
- **Per wave merge:** Manual — toggle OS "Reduce Motion" on/off, verify branch
- **Phase gate:** All four components render without console error; loop advances
  visually; toggling OS Reduce Motion switches between loop and static

### Wave 0 Gaps

The project has no test infrastructure. For Phase 2 to have automated tests, the
following must be installed first:

- [ ] `npm install -D vitest @testing-library/react @testing-library/user-event jsdom` —
  Vitest + RTL for React 19 component tests
- [ ] `vitest.config.js` — Vitest config with jsdom environment
- [ ] `src/test/setup.js` — RTL cleanup setup (`afterEach(() => cleanup())`)
- [ ] `src/hooks/useMoldingLoop.test.js` — covers INF-03 state machine logic
- [ ] `src/components/animation/InjectionMoldingStatic.test.jsx` — covers INF-05

For Phase 2 specifically, the state machine hook (useMoldingLoop) is the highest
value test target because it is pure logic with no visual dependency. RTL + `vi.useFakeTimers()`
can fully exercise the setTimeout advancement and reduced-motion freeze without a
browser. Whether to add this test infrastructure in Phase 2 or defer to a dedicated
test phase is a planning decision.

---

## Sources

### Primary (HIGH confidence)

- `src/lib/motionTokens.js` — Verified actual SCENE_DURATIONS values (7 elements, 12.0s total), SCENE_ENTER, SCENE_EXIT, COLOR constants
- `src/App.jsx` — Confirmed LazyMotion + domAnimation wrapping BrowserRouter; confirmed `m` alias is available app-wide
- `src/hooks/useInView.js` — Confirmed codebase hook pattern (useEffect + cleanup return)
- `.planning/research/ARCHITECTURE.md` — useMoldingLoop, SceneWrapper, AnimatePresence patterns with full code examples
- `.planning/research/STACK.md` — `m` vs `motion` import, AnimatePresence modes, useReducedMotion API
- `.planning/research/PITFALLS.md` — Pitfall 6 (invisible reduced-motion breakage), Pitfall 13 (AnimatePresence missing), AnimatePresence fragment child trap

### Secondary (MEDIUM confidence)

- [motion.dev/docs/react-animate-presence](https://motion.dev/docs/react-animate-presence) — AnimatePresence mode="wait" behavior (confirmed in STACK.md)
- [motion.dev/docs/react-accessibility](https://motion.dev/docs/react-accessibility) — useReducedMotion return behavior (confirmed in PITFALLS.md)

### Tertiary (LOW confidence)

- None — all critical findings sourced from project-level research files and direct
  code inspection.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — motionTokens.js and App.jsx directly inspected; all imports confirmed
- Architecture: HIGH — full code examples in ARCHITECTURE.md, cross-checked with STACK.md
- Pitfalls: HIGH — INF-relevant pitfalls documented in project PITFALLS.md with sources

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (Motion v12 is stable; no breaking changes expected in 30 days)
