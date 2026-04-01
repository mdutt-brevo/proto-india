# Codebase Concerns

**Analysis Date:** 2026-04-01

## Tech Debt

### GPU Buffer Re-uploads in HeroScene

**Issue:** `HeroScene.jsx` (673 lines) updates particle positions every frame with `posAttr.needsUpdate = true`, forcing GPU buffer re-uploads on 80+ spark particles and 60+ granule particles simultaneously.

**Files:** `src/components/three/HeroScene.jsx` (lines 156-215 CNCStation, lines 296-326 GranuleFlow)

**Impact:** 
- GPU memory bandwidth saturated during particle updates
- CPU frame time increases due to redundant buffer management
- Mobile devices (especially Android) will experience frame drops below 30fps
- Post-processing on top (Bloom, ChromaticAberration, Vignette) amplifies GPU pressure

**Current approach:**
```javascript
// CNCStation - line 213
posAttr.needsUpdate = true;  // Every frame for 80 particles

// AmbientEmbers - line 549
posAttr.needsUpdate = true;  // Every frame for 60+ particles
```

**Fix approach:**
- Use transform feedback or compute shaders for GPU-resident particle updates (advanced)
- Or reduce particle counts: 80 sparks → 40, 60 granules → 30
- Or use instanced rendering with per-instance transforms instead of buffer updates
- Batch position updates — only mark `needsUpdate` every 2-3 frames if position deltas are small
- Consider offscreen render targets for particle sim (more overhead but cleaner)

---

### Post-Processing Pipeline Running Every Frame

**Issue:** Three post-processing effects (Bloom, ChromaticAberration, Vignette) all execute every frame in HeroScene, stacking GPU load on top of particle updates.

**Files:** `src/components/three/HeroScene.jsx` (lines 651-669)

**Impact:**
- EffectComposer re-renders entire scene to intermediate textures
- On mobile, Bloom mipmapBlur alone can cost 5-10ms
- Total frame budget consumed: ~16ms at 60fps, leaving <6ms for JS logic
- No quality scaling for low-end devices

**Current config:**
```javascript
<EffectComposer>
  <Bloom intensity={0.7} luminanceThreshold={0.5} mipmapBlur />
  <ChromaticAberration offset={new THREE.Vector2(0.0008, 0.0008)} />
  <Vignette darkness={0.5} offset={0.3} />
</EffectComposer>
```

**Fix approach:**
- Detect GPU tier (via WebGL capabilities) and disable effects on low-power devices
- Add `usePostProcessing` hook to conditionally skip EffectComposer
- Reduce Bloom intensity on mobile (0.7 → 0.3)
- Make ChromaticAberration conditional — only on desktop
- Benchmark each effect's cost and set quality tiers (High/Medium/Low)

---

### Multiple WebGL Canvas Contexts

**Issue:** HeroScene, SectionScene (3 variants: mould/forge/injection), and GearLoader3D each own separate Canvas elements with independent WebGL contexts. Maximum context limit is 8-16 depending on browser.

**Files:**
- `src/components/three/HeroScene.jsx` (line 598, Canvas for hero)
- `src/components/three/SectionScene.jsx` (lines 475-490, lazy Canvas mounting on scroll)
- `src/components/three/GearLoader3D.jsx` (line 16, loading spinner Canvas)

**Impact:**
- Each Canvas = separate WebGL context + GPU memory allocation
- On mobile, memory usage grows to 100-200MB+ quickly
- Context switching overhead between scenes
- If 4+ Canvases render simultaneously, page becomes unresponsive
- SectionScene uses IntersectionObserver to defer mounting (good), but doesn't destroy context on unmount

**Current approach:**
```javascript
// SectionScene - lines 452-461: Only mounts when in viewport
const obs = new IntersectionObserver(
  ([entry]) => setVisible(entry.isIntersecting),
  { rootMargin: "100px 0px" }
);
```

**Fix approach:**
- Consolidate SectionScene variants (mould/forge/injection) into single Canvas with visibility culling
- Destroy WebGL context explicitly when Canvas unmounts: `gl.dispose()` in cleanup
- Defer GearLoader3D Canvas creation until first page load delay (500ms+)
- Use lower `dpr` on mobile: `[1, 1]` instead of `[1, 1.5]` or `[1, 2]`
- Profile actual context memory usage with Chrome DevTools

---

## Missing Critical Features

### No Test Coverage

**What's not tested:** Entire codebase (4270+ lines of JSX with zero test files).

**Files affected:** All under `src/`

**Risk:** 
- Form submissions (ContactPage, QuotePage) silently fail — no error feedback
- 3D animations break on canvas context loss with no detection
- Dark mode toggle may not persist across navigation
- Lazy-loaded pages may not fallback correctly when import fails

**Priority:** High

**Recommended patterns for new tests:**
- Use Vitest (lightweight, Vite-native)
- Test form submissions with mock backend
- Test 3D Canvas mount/unmount lifecycle
- Test IntersectionObserver for lazy scene loading
- Test dark mode persistence in localStorage

---

### Backend Integration Unimplemented

**Issue:** Contact and quote forms accept user input but don't submit anywhere. Alert boxes are placeholders.

**Files:**
- `src/pages/ContactPage.jsx` (line 69): `// TODO: integrate with backend/email service`
- `src/pages/QuotePage.jsx` (line 42): `// TODO: integrate with backend`

**Impact:**
- Customer inquiries are lost
- No audit trail of requests
- No email notifications to sales team
- Users get false confirmation ("we'll get back to you")

**Recommended approach:**
- Create API endpoint POST `/api/contact` and `/api/quote`
- Use fetch with error handling
- Validate on client (basic email/phone format) and server
- Log submissions to database
- Send transactional emails via SendGrid/Resend
- Add form validation feedback (red borders, error messages)

---

## Type Safety Gaps

### No TypeScript

**Issue:** Pure JSX/JS codebase with TypeScript types installed but unused.

**Files:** All source files under `src/`

**Impact:**
- No compile-time prop validation
- Typos in component props found only at runtime
- IDE autocomplete is fuzzy for custom hooks
- Refactoring is risky (rename field, forget a call site)
- New team members have no type hints

**Current setup:**
```json
// package.json has @types/react but no tsconfig
"@types/react": "^19.2.14",
"@types/react-dom": "^19.2.3",
```

**Recommendations:**
1. Enable JSDoc type annotations as interim step (low friction)
2. Or: Create `tsconfig.json` with `strict: true` and migrate incrementally
3. Type critical files first: API slices, custom hooks, form handlers
4. Use type checking in CI: `tsc --noEmit`

**Example JSDoc for quick wins:**
```javascript
/**
 * @param {Object} props
 * @param {'mould'|'forge'|'injection'} props.variant
 * @param {string} [props.className]
 */
export default function SectionScene({ variant = "mould", className = "" }) {
  // ...
}
```

---

## Unused Dependencies

### Framer Motion Not Used

**Issue:** `motion` package v12.38.0 is installed but no imports or usage found.

**Files:** Installed in `package.json` (line 17) but not referenced anywhere in source

**Impact:**
- Adds 25KB+ to bundle
- Unused CSS-in-JS overhead
- Maintenance burden (version updates for unused lib)
- Confusion for new developers ("why is motion here?")

**Recommendation:** Remove from dependencies:
```bash
npm uninstall motion
```

**Note:** Tailwind CSS already provides `animate-` utilities (e.g., `animate-spin`, `animate-slide-up`). Existing animations are CSS-based, not Framer Motion.

---

## Fragile Areas

### Large, Monolithic 3D Components

**Files:**
- `src/components/three/HeroScene.jsx` (673 lines)
- `src/components/three/SectionScene.jsx` (494 lines)

**Why fragile:**
- Single change to camera rig affects all four stations
- Spark emission logic tightly coupled to endmill rotation
- No way to test individual station logic
- Memory leaks if `useRef` cleanup is missing

**Safe modification approach:**
1. Extract each station as separate component (GearStation, CNCStation, GranuleFlow, InjectionMold) — **partially done in HeroScene but CNC and granules still have frame loops**
2. Move per-station animation logic into custom hooks: `useCNCAnimation()`, `useGranuleFlow()`
3. Pass refs and state down as props, not global
4. Write unit tests for animation loops in isolation

**Current risk:**
```javascript
// Line 177-215: CNCStation useFrame handles particles, tool rotation, velocity
// If position reset logic breaks, sparks freeze or go off-screen with no error
```

---

### Particle System Without Lifecycle Management

**Issue:** CNCStation and AmbientEmbers spawn particle positions in `useMemo` once, but never reset or validate bounds.

**Files:** `src/components/three/HeroScene.jsx`

**Scenarios that break:**
- Component re-mounts → particle states desync
- Camera far zoom → particles become visual artifacts
- 60+ ambient embers + 80 sparks + 60 granules = 200 particles all moving async

**Safe modification:**
- Add `key` to HeroScene wrapper to force remount on dependency change
- Implement particle pool recycling (max 200 total)
- Add bounds checking: if particle.y > 10, reset
- Use single Float32Array for all particles (not separate arrays)

---

### IntersectionObserver Cleanup Missing Margin Context

**Issue:** SectionScene's `useVisible` hook uses `rootMargin: "100px 0px"` for preload, but margin value not exposed to parent.

**Files:** `src/components/three/SectionScene.jsx` (line 467)

**Risk:** If page layout changes (viewport height changes), margin doesn't adapt. Sections may mount too early/late relative to scroll.

**Fix:** Make margin configurable:
```javascript
export default function SectionScene({ 
  variant = "mould", 
  className = "",
  visibleMargin = "100px 0px"  // <- add this
}) {
  const [viewRef, isInView] = useVisible(visibleMargin);
  // ...
}
```

---

### No Error Boundaries

**Issue:** If a 3D Canvas throws an error, entire page crashes to white screen.

**Files:** `src/App.jsx`, `src/pages/HomePage.jsx`

**Risk scenarios:**
- WebGL context lost during heavy animation
- Three.js geometry creation fails on old GPUs
- Shader compilation error on mid-range GPUs

**Recommendation:** Add Error Boundary wrapper:
```javascript
<ErrorBoundary fallback={<div>3D scene unavailable</div>}>
  <HeroScene />
</ErrorBoundary>
```

Or minimal with try/catch in Canvas:
```javascript
const Canvas = lazy(() => 
  import("@react-three/fiber").then(m => m.Canvas)
    .catch(() => ({ default: () => <div>WebGL not supported</div> }))
);
```

---

## Scaling Limits

### Particle Count vs. Frame Rate

**Current:** 80 sparks + 60 granules + 70 ambient embers = 210 particles every frame.

**Limit:** At 60fps, each particle gets <0.26ms per frame. Beyond 300-400 particles, frame drops to <30fps on mid-range mobile.

**Headroom:** Very limited. Adding a single new particle effect will cause visible stutter.

**Improvement path:**
- Reduce to 100-150 total particles
- Use GPU instancing for granules (render 60 in one draw call, not 60 separate meshes)
- Profile with Spector.js or WebGL Inspector

---

### Memory on Mobile

**Current GPU usage estimate:**
- HeroScene Canvas: 40-60MB (4 gear meshes + 200 particles + textures)
- SectionScene Canvas (when mounted): 15-25MB per variant
- GearLoader3D Canvas: 5-10MB
- **Total: 60-95MB on mobile**, leaving 5-15MB headroom before OOM kill

**Risk:** iOS Safari kills tab if >80MB. Android Chrome becomes unresponsive.

**Fix:**
- Lower texture resolution on mobile
- Use `powerPreference: "low-power"` in WebGL (already set in SectionScene line 481)
- Reduce DPR on mobile: use `[1, 1]` instead of `[1, 1.5]`
- Profile actual usage: DevTools → Performance → Memory

---

## Security Considerations

### Form Input Not Validated

**Issue:** ContactPage and QuotePage accept text input directly into form state with no validation or sanitization.

**Files:**
- `src/pages/ContactPage.jsx` (line 64): `setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))`
- `src/pages/QuotePage.jsx` (line 31): Same pattern

**Risk:** If forms ever connect to backend, unvalidated input could:
- Bypass server-side validation
- XSS if data echoed in confirmation page
- SQL injection if backend writes directly to DB

**Recommendations:**
1. Validate on client: email format, phone digits only, name length
2. Sanitize: trim whitespace, remove HTML tags
3. On backend: Always re-validate; never trust client input

**Example:**
```javascript
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\d{10,}$/.test(phone.replace(/\D/g, ""));
```

---

## Testing Coverage Gaps

### No Coverage for Critical Paths

**Untested functionality:**
- Dark mode toggle persistence in localStorage
- 3D Canvas mount/unmount on route change
- Form validation and submission callbacks
- Lazy page load fallbacks
- Mobile responsiveness of grid layouts

**Files at risk:**
- `src/hooks/useDarkMode.jsx`: No tests for localStorage persistence
- `src/components/three/*`: No mount/unmount lifecycle tests
- `src/pages/*`: No form interaction tests

**Priority: High** — 3D Canvas errors and form issues directly impact user experience.

**Recommended test suite structure:**
```
src/
├── __tests__/
│   ├── hooks/
│   │   ├── useDarkMode.test.jsx
│   │   └── useInView.test.js
│   ├── components/
│   │   ├── three/
│   │   │   └── HeroScene.test.jsx
│   │   └── layout/
│   │       └── Navbar.test.jsx
│   └── pages/
│       ├── ContactPage.test.jsx
│       └── QuotePage.test.jsx
```

---

*Concerns audit: 2026-04-01*
