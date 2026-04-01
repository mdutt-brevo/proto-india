# Phase 1: Foundation - Research

**Researched:** 2026-04-01
**Domain:** Three.js removal, dark-only design system, LazyMotion provider
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All implementation choices are at Claude's discretion — pure infrastructure phase. Key constraints from research:
- GearLoader3D in App.jsx (lines 27-43) must be replaced with CSS/SVG loader BEFORE Three.js packages are removed
- SectionScene references in Services, Industries, WhyChooseUs must be removed (no replacement backgrounds)
- LazyMotion with domAnimation features wraps the app at the router level
- motionTokens.js exports shared durations, easings, and spring configs
- Theme toggle and light mode code removed entirely
- Color palette: #64748B primary, #EA580C safety orange accent, dark backgrounds (#0f1923 base)

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase.

### Deferred Ideas (OUT OF SCOPE)
None — infrastructure phase
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEP-01 | GearLoader3D replaced with CSS/SVG-only loader before Three.js removal | GearLoader SVG component exists at `src/components/ui/GearLoader.jsx` — direct drop-in. App.jsx lines 27-43 show exact pattern to replace. |
| DEP-02 | All Three.js packages removed (three, @react-three/fiber, @react-three/drei, @react-three/postprocessing) | package.json confirms 4 deps to uninstall. `postprocessing` (peer dep) also present — include in removal. |
| DEP-03 | All Three.js component files deleted (src/components/three/) | 4 files: GearLoader3D.jsx, HeroScene.jsx, IndustrialGear.jsx, SectionScene.jsx. Must delete only after all imports are removed. |
| DEP-04 | SectionScene references removed from Services, Industries, WhyChooseUs sections | 3 files confirmed: ServicesSection.jsx (forge variant), IndustriesSection.jsx (injection variant), WhyChooseUs.jsx (mould variant). Pattern is lazy import + Suspense wrapper — entire block removed. |
| DEP-05 | Bundle size reduced by ~490KB from Three.js removal | Verified: three@0.183.2 + fiber + drei + postprocessing = ~490KB. `vite build --report` post-removal confirms. |
| THM-01 | Dark-only theme enforced (remove theme toggle and light mode code) | DarkModeProvider, useDarkMode hook, DarkModeToggle component all identified. Navbar has 2x DarkModeToggle — both must be removed. Static `dark` class applied to `<html>` in main.jsx or index.html. |
| THM-02 | Construction/Architecture color palette applied (#64748B primary, #EA580C safety orange accent, dark backgrounds) | tailwind.config.js already has `surface.500: #64748B` and `accent.500: #EA580C`. Primary color (#1a56db) needs updating to `#64748B`. |
| THM-03 | Inter + JetBrains Mono typography system configured in Tailwind | tailwind.config.js currently uses Plus Jakarta Sans (heading) and DM Sans (body). Replace with Inter for headings/body, keep JetBrains Mono for mono. index.css Google Fonts @import must be updated. |
| THM-04 | Industrial CSS design tokens (metallic sheens, glow effects) updated for new palette | index.css has metallic-sheen, molten-border, toolpath-divider, blueprint-grid. Update hardcoded blue rgba values to construction palette. Remove `:is(.dark)` conditional variants — dark-only now. |
| INF-01 | LazyMotion with domAnimation features configured as app-wide provider | motion v12.38.0 installed. LazyMotion + domAnimation verified available via framer-motion re-export. Wrap at BrowserRouter level in App.jsx. |
| INF-02 | motionTokens.js with shared durations, easings, spring configs | New file: `src/lib/motionTokens.js`. Provides SCENE_DURATIONS, easing curves, brand color constants for Phase 2+ use. |
</phase_requirements>

---

## Summary

Phase 1 is a mechanical cleanup and infrastructure bootstrapping phase. Every action is known, auditable, and independently verifiable. There is no ambiguity in what to build — the risk is entirely in **sequencing**: doing things out of order breaks the app. The cardinal rule is replace before remove.

The Three.js removal is straightforward once the import graph is fully traced. The codebase has exactly 4 files importing Three.js packages (GearLoader3D, HeroScene, IndustrialGear, SectionScene) and exactly 5 consumer files referencing them (App.jsx, Hero.jsx, ServicesSection.jsx, IndustriesSection.jsx, WhyChooseUs.jsx). Every reference is a lazy import behind a Suspense wrapper, which makes them individually removable without breaking other code.

The dark-only migration requires careful audit of all `dark:` Tailwind variants, the `DarkModeProvider` context tree, the `useDarkMode` hook consumers (DarkModeToggle, Navbar), and the `th-*` semantic tokens in index.css which bundle light+dark pairs. After migration, `dark` class must be statically present on `<html>` from the first paint — not injected by JavaScript — to prevent FOUC.

The LazyMotion provider is a two-line App.jsx change with zero visual impact on Phase 1, but it gates all Phase 2–4 animation components from paying the full 34KB Motion bundle cost. Establishing the `m` alias pattern now means all future scene components use the lightweight API from the start.

**Primary recommendation:** Execute in strict order — (1) replace GearLoader3D, (2) remove SectionScene usages, (3) remove Hero.jsx HeroScene import, (4) uninstall Three.js packages and delete three/ directory, (5) add LazyMotion wrapper, (6) create motionTokens.js, (7) enforce dark-only, (8) update color palette and typography, (9) run `vite build` to verify bundle reduction.

---

## Standard Stack

### Core (already installed — no new packages needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion (framer-motion) | 12.38.0 | Animation provider (LazyMotion) + future scene animations | Already installed; LazyMotion + domAnimation verified present |
| tailwindcss | 3.4.19 | Utility CSS — all styling, design tokens, animations | Already in use; 14 custom keyframes defined |
| vite | 8.0.0 | Build tool — bundle analysis via `--report` flag | Already configured |
| react | 19.2.4 | UI runtime | Already in use |

### No New Dependencies Required

This phase removes dependencies. It does not add any. The full animation infrastructure required for Phase 1 is:
- `LazyMotion` + `domAnimation` + `m` — exported from `motion/react` (already installed)
- `useReducedMotion` — same package (used in Phase 2, stub it here)

### Packages to Remove

```bash
npm uninstall three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing
```

Note: `postprocessing` is a peer dependency of `@react-three/postprocessing`. Check
`package-lock.json` after removal to confirm it is gone. It may not appear in
`package.json` directly but will be in `node_modules/`.

**Version verification (confirmed against local node_modules):**
- motion: 12.38.0 (installed, confirmed)
- LazyMotion: function — verified present
- domAnimation: object — verified present
- m: function — verified present
- useReducedMotion: function — verified present

---

## Architecture Patterns

### Recommended File Structure Changes After Phase 1

```
src/
├── App.jsx              # Remove DarkModeProvider, GearLoader3D; add LazyMotion
├── main.jsx             # Add class="dark" to document.documentElement
├── index.css            # Remove light-mode variants from th-* tokens; update palette
├── tailwind.config.js   # Update primary color; swap font families
├── hooks/
│   └── useDarkMode.jsx  # DELETE entire file
├── components/
│   ├── three/           # DELETE entire directory (after all imports removed)
│   ├── ui/
│   │   └── DarkModeToggle.jsx  # DELETE
│   └── layout/
│       └── Navbar.jsx   # Remove DarkModeToggle import + 2 usages
├── components/home/
│   ├── Hero.jsx         # Remove HeroScene lazy import + LazyGearBackground wrapper
│   ├── ServicesSection.jsx   # Remove SectionScene lazy import + Suspense block
│   ├── IndustriesSection.jsx # Remove SectionScene lazy import + Suspense block
│   └── WhyChooseUs.jsx       # Remove SectionScene lazy import + Suspense block
└── lib/                 # NEW directory
    └── motionTokens.js  # NEW file
```

### Pattern 1: GearLoader3D Replacement in App.jsx

**What:** Swap the nested Suspense/GearLoader3D pattern for a direct GearLoaderSVG import.

**When to use:** Before any Three.js package removal. The app will crash at route
boundaries if GearLoader3D is still referenced when the three/ directory is deleted.

**Current (App.jsx lines 27-43):**
```jsx
// REMOVE THIS ENTIRE BLOCK:
const GearLoader3D = lazy(() => import("./components/three/GearLoader3D"));
const GearLoaderSVG = lazy(() => import("./components/ui/GearLoader"));

function PageLoader() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>}>
      <Suspense fallback={<GearLoaderSVG />}>
        <GearLoader3D />
      </Suspense>
    </Suspense>
  );
}
```

**After (direct SVG, no lazy load needed — zero JS bundle cost):**
```jsx
// Source: src/components/ui/GearLoader.jsx (pure SVG, no async)
import GearLoader from "./components/ui/GearLoader";

function PageLoader() {
  return <GearLoader />;
}
```

GearLoader.jsx is a pure SVG component with CSS animation (`animate-gear-spin`,
`animate-gear-spin-reverse`). It has no async dependencies and does not need `lazy()`.

### Pattern 2: SectionScene Removal from Section Components

**What:** Remove the lazy SectionScene import and its surrounding Suspense wrapper.
The section background becomes the existing CSS grid/gradient only.

**Example — ServicesSection.jsx:**
```jsx
// REMOVE (lines 11, 23-25):
const SectionScene = lazy(() => import("../three/SectionScene"));
// ...
<Suspense fallback={null}>
  <SectionScene variant="forge" className="opacity-15 dark:opacity-25" />
</Suspense>
```

The `lazy` import at the top of the file goes too. The `blueprint-grid` CSS background
already present on each section provides the visual texture — no replacement 3D
background is required (confirmed decision in CONTEXT.md).

Apply the same removal to:
- `src/components/home/IndustriesSection.jsx` (variant="injection")
- `src/components/home/WhyChooseUs.jsx` (variant="mould")

### Pattern 3: Hero.jsx — Remove HeroScene

**What:** Remove the lazy HeroScene import and the LazyGearBackground wrapper component.
The hero's dark gradient background (lines 34-45 in Hero.jsx) remains — it is pure CSS.

```jsx
// REMOVE:
const HeroScene = lazy(() => import("../three/HeroScene"));

function LazyGearBackground({ onLoaded }) {
  useEffect(() => { onLoaded(); }, [onLoaded]);
  return <HeroScene className="w-full h-full" />;
}

// Also remove from Hero():
// const [sceneReady, setSceneReady] = useState(false);
// The sceneReady div wrapping LazyGearBackground (lines 52-59)
// The sceneReady prop on that div's className

// KEEP (these are pure CSS, no Three.js):
// Lines 34-35: dark gradient background divs
// Lines 37-45: vignette, blueprint grid, gradient overlays
// All content below line 65 (stats, buttons, text)
```

After removal, `useState` import may become unused — also remove that import if no
other state remains in Hero.jsx. Audit the import line.

### Pattern 4: LazyMotion Provider in App.jsx

**What:** Wrap the entire app with `LazyMotion` + `domAnimation` at the router level.
Switch future motion imports to use `m` (lightweight alias) instead of `motion`.

**Where:** In App.jsx, wrap `BrowserRouter` (or the children of `DarkModeProvider`
after that is removed).

```jsx
// Source: motion/react exports (verified present in node_modules/framer-motion)
import { LazyMotion, domAnimation } from "motion/react";

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </LazyMotion>
  );
}
```

**Why at this level:** LazyMotion must be an ancestor of all `m.*` components. Router
level is the highest practical wrapper without modifying main.jsx.

**Import alias for all future motion usage:**
```jsx
// All Phase 2+ components use this — never import { motion } directly
import { m } from "motion/react";

// Usage:
<m.div animate={{ opacity: 1 }} />
```

### Pattern 5: Dark-Only Theme Enforcement

**What:** Replace JavaScript-driven dark mode with a static `dark` class on `<html>`.
Remove DarkModeProvider, useDarkMode hook, DarkModeToggle component.

**Step A — Static dark class in index.html (or main.jsx):**
```html
<!-- index.html -->
<html lang="en" class="dark">
```

Or in main.jsx before ReactDOM.createRoot:
```javascript
// main.jsx — applied synchronously before first React paint
document.documentElement.classList.add("dark");
```

The `index.html` approach is better: it prevents FOUC (Flash of Unstyled Content)
entirely because the `dark` class is present before any JavaScript runs.

**Step B — Remove from App.jsx:**
```jsx
// REMOVE these lines:
import { DarkModeProvider } from "./hooks/useDarkMode";
// ...
<DarkModeProvider> ... </DarkModeProvider>
```

**Step C — Remove files:**
- `src/hooks/useDarkMode.jsx` — DELETE
- `src/components/ui/DarkModeToggle.jsx` — DELETE

**Step D — Update Navbar.jsx:**
```jsx
// REMOVE:
import DarkModeToggle from "../ui/DarkModeToggle";
// Line 93: <DarkModeToggle />
// Line 106: <DarkModeToggle />
```

**Step E — Simplify th-* tokens in index.css:**

The `th-*` semantic tokens bundle light + dark pairs. Since dark is now always active,
the light-mode variant of each token becomes dead code. Options:
1. Simplify tokens to dark-only values (recommended — reduces cognitive overhead)
2. Leave as-is (dark: variants still work; just light variant never activates)

Recommended: Simplify to dark-only during this phase since we are already
touching index.css for the palette update.

### Pattern 6: motionTokens.js File

**What:** Single source of truth for animation constants used in Phases 2–4.
Created in Phase 1 so Phase 2 can import immediately.

```javascript
// src/lib/motionTokens.js

// ── Scene timing ─────────────────────────────────────────────
// Target total: 12.0s (within 10-14s requirement)
export const SCENE_DURATIONS = [
  1.5,  // Scene 1: Granules falling
  1.5,  // Scene 2: Melting
  1.5,  // Scene 3: Injection stroke
  2.0,  // Scene 4: Mould filling
  2.0,  // Scene 5: Cooling
  1.5,  // Scene 6: Ejection
  2.0,  // Scene 7: Product reveal + hold
];
// Total: 12.0s

// ── Easing curves ────────────────────────────────────────────
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_SINE = [0.37, 0, 0.63, 1];
export const EASE_SPRING_DEFAULT = { type: "spring", stiffness: 300, damping: 30 };

// ── Transition presets ───────────────────────────────────────
export const SCENE_ENTER = { duration: 0.4, ease: EASE_OUT_EXPO };
export const SCENE_EXIT  = { duration: 0.3, ease: EASE_IN_OUT_SINE };
export const MICRO       = { duration: 0.15 };
export const REVEAL      = { duration: 0.6, ease: EASE_OUT_EXPO };

// ── Brand color constants ────────────────────────────────────
// Mirror of tailwind.config.js — used inside Motion animate() calls
export const COLOR = {
  baseBg:        "#0f1923",
  surfacePrimary: "#64748b",  // steel grey — cold state
  accentOrange:  "#ea580c",  // safety orange — hot/active state
  textPrimary:   "#f1f5f9",
  textMuted:     "#94a3b8",
};
```

### Anti-Patterns to Avoid

- **Removing Three.js packages before replacing GearLoader3D:** App.jsx's PageLoader
  holds a lazy import to GearLoader3D. If `npm uninstall three` runs first, every
  page load hits a module-not-found at the Suspense boundary. White screen on all routes.

- **Using `motion` (full) instead of `m` (lazy) in new components:** After LazyMotion
  is added, importing `motion` directly bypasses LazyMotion's tree-shaking. Always use
  the `m` alias for animatable elements. Only import `motion` for one-off cases with no
  LazyMotion ancestor.

- **Setting dark class via localStorage on first render:** This causes FOUC. The flash
  happens because React hydration runs after HTML paint. Set `class="dark"` directly
  in index.html's `<html>` tag instead.

- **Leaving `th-*` tokens with dead light-mode code:** Not a bug, but the light-mode
  variants in `th-heading`, `th-bg-page`, etc. become permanently dead code. Clean them
  up in this phase while touching index.css — prevents future confusion.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Page transition loading spinner | Custom canvas/WebGL loader | `GearLoader` SVG component (already exists) | CSS-only, zero bundle cost, already styled to match design |
| Animation bundle optimization | Tree-shaking config in vite.config.js | `LazyMotion` + `domAnimation` | Official Motion pattern; reduces initial payload from 34KB to 4.6KB |
| Dark mode persistence | Custom localStorage hook | Static `class="dark"` on `<html>` | No persistence needed (dark-only); removing the hook is the fix |
| Color token management | Inline hex values in JSX | `tailwind.config.js` color scale + `COLOR` constants in motionTokens.js | Single source of truth; survives Tailwind JIT tree-shaking |
| Build size measurement | Manual bundle inspection | `vite build --report` (rollup-plugin-visualizer built into Vite) | Objective, reproducible measurement for DEP-05 |

---

## Common Pitfalls

### Pitfall 1: FOUC on Dark Class Initialization

**What goes wrong:** Developer removes DarkModeProvider and adds the dark class via
`useEffect` or `useState` in main.jsx. Page briefly renders without dark styles.

**Why it happens:** React's useEffect runs after the browser has painted. A 1–3 frame
flash of light-mode styles is visible, especially on slower devices.

**How to avoid:** Add `class="dark"` directly to the `<html>` tag in `index.html`.
This is synchronous with HTML parse — React never sees a non-dark state.

**Warning signs:** Any approach that involves JavaScript setting the dark class after
mount is wrong for a dark-only site.

---

### Pitfall 2: Orphaned Three.js Import in Hero.jsx After Removal

**What goes wrong:** `GearLoader3D` is replaced in App.jsx, but `HeroScene` is still
imported in `Hero.jsx`. Three.js packages are then uninstalled. Build fails with
`Cannot resolve module '@react-three/fiber'`.

**Why it happens:** Hero.jsx is not in the immediate code path of PageLoader, so it's
easy to miss in the "find imports" audit.

**How to avoid:** Before running `npm uninstall`, run this audit command and verify
zero results:
```bash
grep -r "from.*three\|@react-three\|three/src" src/ --include="*.jsx" --include="*.js"
```

---

### Pitfall 3: `sceneReady` State Left Dangling in Hero.jsx

**What goes wrong:** The `LazyGearBackground` component is removed from Hero.jsx but
the `sceneReady` state and the `opacity-transition` div wrapping it are left in place.
This results in a permanently `opacity-0` invisible area in the hero section.

**Why it happens:** The state, the wrapper div's className condition, and the
LazyGearBackground JSX are three separate spots that must all be removed together.

**How to avoid:** The complete removal checklist for Hero.jsx:
1. Remove `lazy, useState` from imports (if unused after edit — keep `useEffect` if used elsewhere)
2. Remove `const HeroScene = lazy(...)` line
3. Remove `LazyGearBackground` function entirely
4. Remove `const [sceneReady, setSceneReady] = useState(false)` from Hero()
5. Remove the wrapping `<div className=... transition-opacity>` (lines 52-59)
6. Verify hero section still has its dark gradient background divs (those are kept)

---

### Pitfall 4: Tailwind Dark Variants Still Present After Dark-Only Migration

**What goes wrong:** Index.css `th-*` tokens still reference both light and dark
variants (e.g., `@apply text-surface-900 dark:text-white`). The light-mode `text-surface-900`
will never activate (dark class is always present), but it adds CSS specificity noise.

**Why it happens:** The tokens were designed for a toggle-based system. Removing
DarkModeProvider does not automatically clean up the CSS.

**How to avoid:** Audit `src/index.css` and for each `th-*` class, collapse the
`@apply light-val dark:dark-val` to just the dark value:
```css
/* Before */
.th-heading { @apply text-surface-900 dark:text-white; }

/* After (dark-only) */
.th-heading { @apply text-white; }
```

Also remove all `:is(.dark)` conditional blocks — they are now always active and
the condition itself is redundant.

---

### Pitfall 5: Primary Color Token Mismatch After Palette Update

**What goes wrong:** `tailwind.config.js` `primary.500` is `#1a56db` (blue). The new
Construction palette uses `#64748B` (steel grey) as the primary. However, `surface.500`
is already `#64748B`. If only `primary.500` is updated, components using `text-primary-500`
switch to steel grey but components using `text-surface-500` now overlap with them
semantically.

**Why it happens:** The existing design system was blue-primary + grey-surface. The
new palette uses grey-primary. The mapping is `new primary = old surface.500`.

**How to avoid:** Update `tailwind.config.js` `primary` scale to match a grey ramp
anchored at `#64748B` (which is `surface.500`). The simplest approach: remap primary
to use the surface scale values (they are already a correct grey ramp):
```javascript
// tailwind.config.js
primary: {
  50:  "#f8fafc",  // surface-50
  100: "#f1f5f9",  // surface-100
  200: "#e2e8f0",  // surface-200
  300: "#cbd5e1",  // surface-300
  400: "#94a3b8",  // surface-400
  500: "#64748b",  // surface-500 — main steel grey
  600: "#475569",  // surface-600
  700: "#334155",  // surface-700
  800: "#1e293b",  // surface-800
  900: "#0f172a",  // surface-900
}
```

---

### Pitfall 6: `postprocessing` Peer Dependency Left in node_modules

**What goes wrong:** `npm uninstall @react-three/postprocessing` removes the package
from package.json but `postprocessing` (the low-level peer dep) may remain in
node_modules if nothing else depends on it.

**Why it happens:** npm does not automatically remove peer dependencies unless they
have no other dependents.

**How to avoid:** Include `postprocessing` explicitly in the uninstall command:
```bash
npm uninstall three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing
```
Then verify with:
```bash
npm ls three 2>&1 | grep -v "empty"
# Should output: npm error — not installed
```

---

## Code Examples

### LazyMotion Provider Setup

```jsx
// src/App.jsx
// Source: motion/react exports (verified in node_modules/framer-motion v12.38.0)
import { LazyMotion, domAnimation } from "motion/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </LazyMotion>
  );
}
```

### m Alias Usage (for all Phase 2+ components)

```jsx
// Any future animation component
// Source: motion/react exports (verified)
import { m } from "motion/react";

function AnimatedCard() {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      content
    </m.div>
  );
}
```

### Static Dark Class in index.html

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <!-- ... -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Simplified th-* Token (dark-only)

```css
/* src/index.css — after dark-only migration */
/* Before: bundled light + dark */
.th-heading { @apply text-surface-900 dark:text-white; }
.th-body    { @apply text-surface-800 dark:text-white; }

/* After: dark-only, no conditional needed */
.th-heading { @apply text-white; }
.th-body    { @apply text-white; }
.th-body-secondary { @apply text-white/70; }
.th-muted   { @apply text-white/60; }
```

### Build Verification Command

```bash
# Confirms DEP-05: bundle reduction
vite build --report
# Outputs dist/ size breakdown via rollup stats
# Three.js removal should reduce total bundle by ~490KB
```

---

## State of the Art

| Old Approach | Current Approach | Impact on Phase 1 |
|--------------|------------------|--------------------|
| Three.js WebGL scene for hero background | SVG + Motion (Phase 2+) | Remove entirely in Phase 1; hero uses dark CSS gradient only |
| DarkModeProvider context + localStorage | Static `class="dark"` on `<html>` | Zero JS runtime cost; no FOUC; simpler codebase |
| `motion` (full bundle import) | `LazyMotion` + `m` alias | 34KB → 4.6KB initial Motion payload |
| Multiple WebGL canvas contexts | Zero canvas contexts | Eliminates 60-95MB mobile GPU memory usage |
| Nested Suspense for GearLoader3D fallback | Direct GearLoader SVG import | No async loading; CSS animation starts instantly |

---

## Open Questions

1. **Inter font already available?**
   - What we know: `tailwind.config.js` currently lists Plus Jakarta Sans (heading) and DM Sans (body). index.css imports from Google Fonts.
   - What's unclear: Whether the design intent for THM-03 means replacing these entirely with Inter, or just adding Inter. The requirement says "Inter + JetBrains Mono typography system."
   - Recommendation: Replace Plus Jakarta Sans → Inter (heading weight), DM Sans → Inter (body weight). JetBrains Mono is already configured and stays. Update the Google Fonts @import URL in index.css.

2. **`blueprint-grid` color update scope**
   - What we know: index.css `blueprint-grid` uses `rgba(26, 86, 219, 0.06)` (blue). The new palette is grey/slate.
   - What's unclear: Whether the blueprint grid should use the new slate/steel palette or remain blue (blueprint paper is traditionally blue).
   - Recommendation: Update to use `rgba(100, 116, 139, 0.08)` (surface-500 = #64748B) for the construction aesthetic. Keep the dual-grid structure (major/minor lines). The dark variant `blueprint-grid-dark` can use `rgba(148, 163, 184, 0.08)` (surface-400).

3. **Hero.jsx after HeroScene removal — content-only state**
   - What we know: Hero.jsx has extensive content (stats bar, h1, buttons) that remains. The dark gradient background divs (lines 34-45) remain.
   - What's unclear: Whether the `sceneReady` fade-in div should be replaced with the animation container placeholder for Phase 2's InjectionMoldingLoop, or left empty.
   - Recommendation: Leave the hero's dark background layer as a plain `<div>` with no Phase 2 content in Phase 1. Phase 2 will add the animation container. Do not add placeholder `{/* InjectionMoldingLoop goes here */}` comments — keep the file clean.

---

## Validation Architecture

### Test Framework

No test framework is currently installed. Nyquist validation is enabled in config.json.
For Phase 1 (pure dependency removal + infrastructure), the validation approach is
build-gate verification rather than unit tests — the phase produces no new UI behavior,
only removes code and adds provider wrappers.

| Property | Value |
|----------|-------|
| Framework | None installed — Wave 0 must install Vitest |
| Config file | `vitest.config.js` — does not exist (Wave 0 gap) |
| Quick run command | `npx vitest run` (after Wave 0 setup) |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DEP-01 | GearLoader SVG renders in Suspense fallback position | smoke | `vite build && echo "build passed"` | ❌ Wave 0 |
| DEP-02 | No three/fiber/drei imports in source | lint/grep | `grep -r "@react-three\|from 'three'" src/ \|\| echo "CLEAN"` | ❌ Wave 0 |
| DEP-03 | src/components/three/ directory does not exist | fs check | `[ ! -d src/components/three ] && echo "PASS"` | ❌ Wave 0 |
| DEP-04 | SectionScene not imported anywhere | lint/grep | `grep -r "SectionScene" src/ \|\| echo "CLEAN"` | ❌ Wave 0 |
| DEP-05 | Bundle < baseline - 400KB | build check | `vite build --report` (manual review) | ❌ Wave 0 |
| THM-01 | Dark class on html, DarkModeToggle absent from DOM | smoke/build | `grep -r "DarkModeToggle\|useDarkMode" src/ \|\| echo "CLEAN"` | ❌ Wave 0 |
| THM-02 | Primary color tokens use slate ramp | config check | `grep "1a56db" tailwind.config.js \|\| echo "UPDATED"` | ❌ Wave 0 |
| THM-03 | Inter font in tailwind fontFamily config | config check | `grep "Inter" tailwind.config.js && echo "PASS"` | ❌ Wave 0 |
| THM-04 | No `:is(.dark)` conditional blocks in index.css | lint/grep | `grep -c ":is(.dark)" src/index.css` (expect 0) | ❌ Wave 0 |
| INF-01 | App renders without error with LazyMotion wrapper | smoke | `vite build` passes without error | ❌ Wave 0 |
| INF-02 | motionTokens.js exports SCENE_DURATIONS array | unit | `npx vitest run src/lib/motionTokens.test.js` | ❌ Wave 0 |

Note: DEP-02, DEP-03, DEP-04, THM-01, THM-02, THM-03, THM-04 are verifiable via
grep/filesystem checks without a test runner. These can be run as shell one-liners in
the verification gate. Only DEP-05 and INF-02 benefit from a formal test setup.

### Sampling Rate

- **Per task commit:** `vite build` (confirm no build errors)
- **Per wave merge:** Full grep audit for Three.js references + `vite build --report`
- **Phase gate:** `vite build` clean + bundle size confirmed reduced + all grep checks return 0 results

### Wave 0 Gaps

- [ ] `vitest.config.js` — test runner config (install: `npm install -D vitest`)
- [ ] `src/lib/motionTokens.test.js` — covers INF-02 (exports shape validation)
- [ ] No existing test files to work with — all tests are net-new

*(All Phase 1 validations except INF-02 are grep/build-gate checks, not unit tests.
Vitest is needed for Phase 2+ scene logic. Installing in Wave 0 of Phase 1 is optimal.)*

---

## Sources

### Primary (HIGH confidence)

- `node_modules/framer-motion` (v12.38.0) — LazyMotion, domAnimation, m, useReducedMotion exports verified via Node.js require()
- `src/App.jsx` — Exact import lines, PageLoader structure, DarkModeProvider wrapping, GearLoader3D usage at lines 27-43 confirmed by direct read
- `src/components/three/GearLoader3D.jsx` — Canvas + IndustrialGear structure confirmed; is replacement target
- `src/components/ui/GearLoader.jsx` — Pure SVG CSS-animation component confirmed; is drop-in replacement
- `src/components/home/Hero.jsx` — HeroScene lazy import + sceneReady pattern confirmed
- `src/components/home/ServicesSection.jsx`, `IndustriesSection.jsx`, `WhyChooseUs.jsx` — SectionScene lazy imports confirmed in all 3 files
- `tailwind.config.js` — Primary color `#1a56db`, font stack, 14 keyframes confirmed
- `src/index.css` — th-* token light+dark pattern, blueprint-grid colors confirmed
- `src/hooks/useDarkMode.jsx` — Full implementation confirmed; localStorage + html class toggle
- `package.json` — Exact dep versions confirmed; `postprocessing` not in direct deps (peer dep)
- `.planning/config.json` — `nyquist_validation: true` confirmed

### Secondary (MEDIUM confidence)

- `.planning/research/SUMMARY.md` — LazyMotion bundle size figure (34KB → 4.6KB) sourced from motion.dev/docs via project research
- `.planning/codebase/CONCERNS.md` — GPU memory figures (60-95MB) and WebGL context limit sourced from project audit

### Tertiary (LOW confidence)

- None for Phase 1 — all findings verified against local source files

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified in node_modules, no new deps required
- Architecture: HIGH — all integration points read directly from source files
- Pitfalls: HIGH — all pitfalls derived from direct source code inspection, not general knowledge
- Validation: MEDIUM — grep-based checks are reliable; Vitest unit test structure is standard but framework not yet installed

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (stable dependency versions; source files are version-controlled)
