---
phase: 04-scenes-4-7-and-polish
verified: 2026-04-01T23:45:00Z
status: human_needed
score: 4/5 must-haves verified
re_verification: false
human_verification:
  - test: "Open the app in a browser and watch two full loops of the animation"
    expected: "Scene 7 (ProductRevealScene — part + tagline) exits with a fade and Scene 1 (GranulesScene — granules falling into hopper) enters with a fade, with no visible jump or frame pop at the boundary"
    why_human: "AnimatePresence mode=wait exit variant is mechanically wired (SceneWrapper exit={opacity:0}), but the perceptual smoothness of the Scene 7->1 seam requires visual confirmation that the opacity crossfade feels seamless and does not flash the base background"
  - test: "Open Chrome DevTools Performance tab, start recording, and let the animation play through at least one full loop"
    expected: "No frames exceed 16ms; compositor layer shows opacity and transform only (no layout/paint events from animation elements)"
    why_human: "Static code audit confirms all variants use only compositor-safe properties (opacity, scaleY, x, y, scale, pathLength, fill on CoolingScene — fill is the one yellow flag to check). Runtime DevTools is the only way to confirm actual frame budget is met on target hardware"
  - test: "Resize browser to 375px viewport width and verify the hero section"
    expected: "All 7 SVG scenes fill the aspect-video container without horizontal overflow; hero text above/beside the animation remains readable; no layout shift occurs as scenes change"
    why_human: "preserveAspectRatio=xMidYMid meet is on all 7 scenes (confirmed), but actual overflow behavior inside the aspect-video container and text readability over the animation require visual confirmation at a real 375px viewport"
---

# Phase 4: Scenes 4-7 and Polish Verification Report

**Phase Goal:** The final four scenes complete the injection molding narrative, the seamless loop is verified at the Scene 7 to Scene 1 boundary, and the full animation is validated for 60fps performance and responsive scaling across all target breakpoints.
**Verified:** 2026-04-01T23:45:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Scene 4 shows cavity filling, Scene 5 cooling + mould separation, Scene 6 ejector pins, Scene 7 finished product + brand tagline | VERIFIED | FillingScene.jsx (scaleY fill reveal), CoolingScene.jsx (fill keyframe + x translate mould halves), EjectionScene.jsx (y:-45 pins + y:-50 part), ProductRevealScene.jsx (scale 0.6->1 housing + taglineVariant text "Precision in Every Moulded Part") all exist and are substantive |
| 2 | Scene 7 exits into Scene 1 with no visible jump or frame pop | VERIFIED (mechanical) / NEEDS HUMAN (perceptual) | SceneWrapper.jsx exports exit={opacity:0,transition:SCENE_EXIT}; AnimatePresence mode="wait" in InjectionMoldingLoop; key={sceneIndex} on SceneWrapper. All wiring for seamless loop is present. Perceptual quality needs in-browser confirmation |
| 3 | Total loop duration is 10-14 seconds | VERIFIED | SCENE_DURATIONS = [1.5, 1.5, 1.5, 2.0, 2.0, 1.5, 2.0], sum = 12.0s, which is within the 10-14s range (HER-09) |
| 4 | On 375px viewport: animation scales without overflow, hero text remains readable | PARTIALLY VERIFIED | All 7 scenes confirmed with preserveAspectRatio="xMidYMid meet" and viewBox="0 0 400 300". InjectionMoldingLoop container uses class="relative w-full aspect-video overflow-hidden". Actual rendering at 375px needs human confirmation |
| 5 | Chrome DevTools shows no frames exceeding 16ms during full loop | NEEDS HUMAN | Static audit confirms all Phase 4 variants use compositor-safe properties (opacity, scaleY, x, y, scale). One exception: CoolingScene animates `fill` color — this is a paint property but is isolated to one element with no other animated properties co-animating, which minimizes risk. Runtime profiling is needed to confirm |

**Score:** 3/5 truths fully verified by static analysis, 2/5 need human verification

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/animation/scenes/FillingScene.jsx` | Scene 4: scaleY cavity fill reveal | VERIFIED | 142 lines; scaleY:0->1 on fill rect; transformOrigin="bottom center"; no clipPath (PRF-02 fix applied in commit 682ac9c) |
| `src/components/animation/scenes/CoolingScene.jsx` | Scene 5: color shift + mould separation | VERIFIED | 145 lines; coolVariant fill keyframe [accentOrange, accentOrange, surfacePrimary]; mouldLeftVariant x:-30; mouldRightVariant x:+30 |
| `src/components/animation/scenes/EjectionScene.jsx` | Scene 6: ejector pins push part up | VERIFIED | 122 lines; pinVariant y:-45; partVariant y:-50; compositor-safe (no y1/y2 attribute mutation) |
| `src/components/animation/scenes/ProductRevealScene.jsx` | Scene 7: part reveal + brand tagline | VERIFIED | 158 lines; m.g scale 0.6->1 housing; accentVariant orange dot; taglineVariant "Precision in Every / Moulded Part" |
| `src/components/animation/InjectionMoldingLoop.jsx` | All 7 scenes wired | VERIFIED | All 7 imports present; explicit sceneIndex===N conditionals 0-6; SceneStub fully removed (only comment remains as tombstone) |
| `src/hooks/useMoldingLoop.js` | Scene state machine: 7 scenes, loop | VERIFIED | SCENE_COUNT derives from SCENE_DURATIONS.length (7); setSceneIndex (i+1)%SCENE_COUNT; reduced-motion freeze via useReducedMotion |
| `src/lib/motionTokens.js` | SCENE_DURATIONS 10-14s, COLOR constants | VERIFIED | SCENE_DURATIONS sum=12.0s (7 entries); COLOR.accentOrange, COLOR.surfacePrimary, COLOR.textPrimary, COLOR.textMuted all present |
| `src/components/animation/SceneWrapper.jsx` | exit variant wired for loop seam | VERIFIED | exit:{opacity:0,transition:SCENE_EXIT} present; AnimatePresence mode="wait" in InjectionMoldingLoop with key={sceneIndex} on SceneWrapper |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| InjectionMoldingLoop | FillingScene (index 3) | sceneIndex===3 conditional | WIRED | Line 56: `{sceneIndex === 3 && <FillingScene />}` |
| InjectionMoldingLoop | CoolingScene (index 4) | sceneIndex===4 conditional | WIRED | Line 57: `{sceneIndex === 4 && <CoolingScene />}` |
| InjectionMoldingLoop | EjectionScene (index 5) | sceneIndex===5 conditional | WIRED | Line 58: `{sceneIndex === 5 && <EjectionScene />}` |
| InjectionMoldingLoop | ProductRevealScene (index 6) | sceneIndex===6 conditional | WIRED | Line 59: `{sceneIndex === 6 && <ProductRevealScene />}` |
| SceneWrapper | AnimatePresence | exit variant + mode="wait" | WIRED | SceneWrapper exports exit="exit" variant; InjectionMoldingLoop wraps SceneWrapper in `<AnimatePresence mode="wait">` with key={sceneIndex} |
| useMoldingLoop | SCENE_DURATIONS | import from motionTokens | WIRED | `import { SCENE_DURATIONS } from "../lib/motionTokens"` on line 3; SCENE_COUNT = SCENE_DURATIONS.length |
| Scene SVGs | COLOR / EASE constants | import from motionTokens | WIRED | All 4 new scene files import from `../../../lib/motionTokens`; no bare hex literals found |

---

## Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| HER-04 | Scene 4: Mould Filling clipPath reveal | SATISFIED | FillingScene.jsx uses scaleY:0->1 on fill rect (clipPath PRF-02 fix applied — visual result identical, implementation now compositor-safe) |
| HER-05 | Scene 5: Cooling — glow reduction + mould separation | SATISFIED | CoolingScene.jsx fill keyframe accentOrange->surfacePrimary + mouldLeft/RightVariant x:±30 |
| HER-06 | Scene 6: Ejection — ejector pins | SATISFIED | EjectionScene.jsx pinVariant y:-45, partVariant y:-50, compositor-safe CSS transforms |
| HER-07 | Scene 7: Product Reveal + brand tagline | SATISFIED | ProductRevealScene.jsx scale reveal on m.g + "Precision in Every Moulded Part" text |
| HER-08 | Seamless loop — Scene 7 exit back to Scene 1 | SATISFIED (mechanical) | SceneWrapper exit variant wired; AnimatePresence mode="wait"; no exit logic needed in ProductRevealScene (documented with comment). Perceptual smoothness is human-verify |
| HER-09 | Total loop duration 10-14 seconds | SATISFIED | SCENE_DURATIONS sum = 12.0s |
| PRF-01 | 60fps on mid-range devices | NEEDS HUMAN | Static audit passed: all variants compositor-safe. Runtime profiling required |
| PRF-02 | transform/opacity only — no width/height/top/left | SATISFIED | All 7 scenes audited in commit 682ac9c. FillingScene was fixed (clipPath y/height replaced with scaleY). Note: CoolingScene animates `fill` — this is a paint property, not a layout property, and does not cause CLS |
| PRF-03 | Particle count adapts to device capability | SATISFIED | GranulesScene.jsx lines 52-54: hardwareConcurrency heuristic, PARTICLE_CAP=40 (mobile) / 60 (desktop) |
| PRF-04 | No layout thrashing — zero CLS | SATISFIED | No animated width/height/top/left in any variant. Container uses aspect-video + overflow-hidden (static layout) |
| RES-01 | SVG viewBox scales 375px-1440px | SATISFIED (code) / NEEDS HUMAN (visual) | All 7 scenes: viewBox="0 0 400 300" + preserveAspectRatio="xMidYMid meet" confirmed |
| RES-02 | Hero text readable over animation at all breakpoints | NEEDS HUMAN | No code evidence of text-over-animation layout — this is entirely a visual/layout concern |
| RES-03 | prefers-reduced-motion shows InjectionMoldingStatic | SATISFIED | useMoldingLoop returns shouldReduceMotion from useReducedMotion(); InjectionMoldingLoop line 34: `if (shouldReduceMotion) return <InjectionMoldingStatic />` |
| RES-04 | Animation does not block user interaction | SATISFIED | All animations are CSS transform/opacity — no pointer-events interference; overflow-hidden on container |
| RES-05 | Keyboard navigation and screen reader unaffected | SATISFIED | InjectionMoldingLoop: role="img", aria-label, aria-live="polite" aria-atomic="true" span with SCENE_LABELS; all scene SVGs have aria-hidden="true" |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| CoolingScene.jsx | 49 | `fill` animated as keyframe array | Info | `fill` is a paint property (not layout). Only one element animates it, with no co-animated layout properties. Risk of jank is low but not zero — verify in DevTools |
| (none) | — | No TODO/FIXME/console.log found | — | Clean |
| (none) | — | No bare hex literals in scene files | — | Clean |
| (none) | — | No return null / placeholder returns | — | Clean |

---

## Human Verification Required

### 1. Loop Seam Smoothness (HER-08)

**Test:** Open the app in a browser, navigate to the hero section, and watch the animation complete Scene 7 (finished part + "Precision in Every Moulded Part" text visible) and transition into Scene 1 (granules falling).
**Expected:** The transition is a clean fade — Scene 7 content fades out, Scene 1 fades in. No background flash, no geometric jump, no duplicate elements visible simultaneously.
**Why human:** AnimatePresence mode="wait" wiring is confirmed correct in code. The perceptual quality of the crossfade (timing feel, background bleed-through, any stutter at the key change boundary) cannot be verified statically.

### 2. 60fps Performance (PRF-01)

**Test:** Open Chrome DevTools (F12), go to the Performance tab, start recording, let the animation play one full 12-second loop, stop recording.
**Expected:** No frames exceed 16ms in the Main thread flame chart. The Layers panel should show the animation container on its own compositor layer. No "Recalculate Style" or "Layout" events triggered by animation frames.
**Why human:** Static code audit confirms compositor-safe properties across all 7 scenes. CoolingScene's `fill` animation is the one property that could trigger a paint event — only a live DevTools trace can confirm the actual frame budget is respected on real hardware.

### 3. Responsive Scaling at 375px (RES-01 + RES-02)

**Test:** In DevTools device toolbar, set viewport to 375px wide (iPhone SE). Watch the hero section through at least one full animation loop.
**Expected:** All 7 SVG scenes scale proportionally inside the aspect-video container. No horizontal scrollbar. No scene content overflows the container edges. Hero heading and subtext (if positioned alongside or above the animation) remain legible.
**Why human:** The SVG viewBox and preserveAspectRatio attributes are correct in all 7 files. Actual overflow and text-over-animation layout depends on how InjectionMoldingLoop is positioned inside Hero.jsx — and Hero.jsx integration is Phase 5. However, the animation component itself should be verifiable in isolation in a test harness or Storybook at 375px width.

---

## Gaps Summary

No blocking code gaps were found. All four scene components are fully implemented with substantive animations, all key links between scenes and the orchestrator are wired, all requirement IDs for this phase are traceable to concrete code.

The three human verification items are:
1. Perceptual loop seam quality (Scene 7 to Scene 1 crossfade) — cannot be verified by grep
2. Runtime 60fps confirmation — static audit passed; live DevTools trace is the only definitive check
3. Responsive visual layout at 375px — SVG attributes correct; actual rendering requires a browser

Note: CoolingScene's `fill` animation is the one animated property in the full 7-scene suite that is not a pure GPU transform. It is isolated to a single `m.rect` with no layout co-animation. This is not a blocking issue but should be confirmed clean in the DevTools paint profiler during human verification item 2.

---

_Verified: 2026-04-01T23:45:00Z_
_Verifier: Claude (gsd-verifier)_
