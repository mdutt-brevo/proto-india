---
phase: 03-scenes-1-3
verified: 2026-04-01T18:00:00Z
status: passed
score: 4/4 must-haves verified
re_verification: false
human_verification:
  - test: "Load the hero section and watch Scene 1 play"
    expected: "Granule particles (small rounded squares) visibly fall and tumble into the hopper mouth with staggered timing. On a device with < 4 CPU cores the count should be <= 40."
    why_human: "Particle count cap uses navigator.hardwareConcurrency at runtime — cannot verify on a real mobile device programmatically. Visual quality of tumble and stagger requires eyes."
  - test: "Watch Scene 2 play"
    expected: "The barrel appears, then an orange glow sweeps left-to-right across it while granule squares inside shrink and fade out. The orange glow should pulse subtly."
    why_human: "Progressive heat-sweep is a visual timing effect — correctness of the orange fade and granule compression sequence requires human observation."
  - test: "Watch Scene 3 play"
    expected: "A thick orange stroke visibly draws from the nozzle tip across to the mould gate over ~1.2 seconds. The nozzle glow dot should appear just before the stroke starts."
    why_human: "pathLength stroke draw is a visual animation — correct draw direction and timing requires human confirmation."
  - test: "Watch the loop transition Scene 3 -> Scene 4 (stub)"
    expected: "No visual jump or flash at the scene boundary. AnimatePresence mode='wait' should produce a clean cross-fade."
    why_human: "AnimatePresence exit/enter sequencing with mixed real-scene and SceneStub content needs visual confirmation."
---

# Phase 3: Scenes 1-3 Verification Report

**Phase Goal:** The first three injection molding scenes (Granules, Melting, Injection) are built as fully-animated SVG components — establishing particle, color-shift, and pathLength patterns that all subsequent scenes reuse.
**Verified:** 2026-04-01T18:00:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                                                    | Status     | Evidence                                                                                                                                                       |
|----|--------------------------------------------------------------------------------------------------------------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | Scene 1 shows granule particles falling into a hopper — particles are Motion animated elements, capped at 40 on mobile  | VERIFIED   | `GranulesScene.jsx` line 54: `PARTICLE_CAP = isMobile ? 40 : 60`; 60 `m.rect` elements sliced to cap; fall animation via `y`/`opacity`/`rotate`/`scale` variants |
| 2  | Scene 2 shows granules moving through a barrel with a visible orange-red heat color transition                           | VERIFIED   | `MeltingScene.jsx`: `linearGradient` with `COLOR.accentOrange` stops; animated `m.rect` sweeps `x: -160 → 160`; barrel glow via `opacity` keyframe on orange `m.rect`; five granules compress via `scaleX`/`scaleY` keyframes |
| 3  | Scene 3 shows a pathLength stroke animation of molten plastic flowing through nozzle into the mould                     | VERIFIED   | `InjectionScene.jsx` lines 34-43: `drawVariant` with `pathLength: 0 → 1`, `duration: 1.2`, `ease: "easeOut"`, `delay: 0.25`; `m.path` element with `stroke={COLOR.accentOrange}` and `strokeWidth="5"` |
| 4  | All three scenes are inline JSX SVG components compatible with Motion pathLength animations                              | VERIFIED   | Each scene exports a default function returning `<m.svg>` with inline JSX children; no external SVG files; `m` imported from `motion/react`; `InjectionMoldingLoop` mounts them as `<GranulesScene />`, `<MeltingScene />`, `<InjectionScene />` inside `<AnimatePresence>` |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact                                                              | Expected                                  | Status   | Details                                                                                     |
|-----------------------------------------------------------------------|-------------------------------------------|----------|---------------------------------------------------------------------------------------------|
| `src/components/animation/scenes/GranulesScene.jsx`                  | Scene 1 — hopper with particle fall       | VERIFIED | 163 lines; substantive implementation with `PARTICLES` array, `PARTICLE_CAP`, container variant, stagger animation |
| `src/components/animation/scenes/MeltingScene.jsx`                   | Scene 2 — barrel with heat sweep         | VERIFIED | 169 lines; `<defs>` with `linearGradient`, animated `heatSweepVariant`, `barrelGlowVariant`, 5 granule dissolve variants |
| `src/components/animation/scenes/InjectionScene.jsx`                 | Scene 3 — pathLength stroke nozzle-to-mould | VERIFIED | 164 lines; `drawVariant` with `pathLength 0→1`; `m.path` from nozzle tip `M 115 150` to mould gate `L 276 150` |
| `src/components/animation/InjectionMoldingLoop.jsx` (wiring)         | Orchestrator mounts scenes at indices 0-2 | VERIFIED | Lines 9-11: three imports; lines 76-78: conditional JSX `sceneIndex === 0/1/2`; `sceneIndex >= 3` falls back to `SceneStub` |
| `src/lib/motionTokens.js`                                             | Shared COLOR and easing constants         | VERIFIED | Exports `COLOR` object with `accentOrange`, `surfacePrimary`, `textMuted`, `baseBg`; exports `EASE_OUT_EXPO`, `EASE_IN_OUT_SINE` |

### Key Link Verification

| From                        | To                                    | Via                                              | Status   | Details                                                                                 |
|-----------------------------|---------------------------------------|--------------------------------------------------|----------|-----------------------------------------------------------------------------------------|
| `GranulesScene.jsx`         | `motionTokens.js`                     | `import { COLOR, EASE_OUT_EXPO }`                | WIRED    | Line 17; `COLOR.surfacePrimary` used in 3 static SVG stroke attributes                 |
| `MeltingScene.jsx`          | `motionTokens.js`                     | `import { COLOR, EASE_OUT_EXPO, EASE_IN_OUT_SINE }` | WIRED | Line 17; `COLOR.accentOrange` used for glow and gradient stops; `EASE_OUT_EXPO` used in `heatSweepVariant` |
| `InjectionScene.jsx`        | `motionTokens.js`                     | `import { COLOR, EASE_OUT_EXPO }`                | WIRED    | Lines 11-12; `COLOR.accentOrange` on stroke and nozzle glow; `EASE_OUT_EXPO` in `nozzleGlowVariant` |
| `InjectionMoldingLoop.jsx`  | `GranulesScene`, `MeltingScene`, `InjectionScene` | named imports + conditional JSX render | WIRED | Lines 9-11 import; lines 76-78 render at `sceneIndex === 0`, `1`, `2` inside `<SceneWrapper>` |
| `InjectionMoldingLoop.jsx`  | `SceneWrapper` + `AnimatePresence`    | Existing orchestrator shell from Phase 2         | WIRED    | `<AnimatePresence mode="wait">` wraps `<SceneWrapper key={sceneIndex}>` — scenes mounted inside this envelope |

### Requirements Coverage

| Requirement | Source Plan | Description                                                                         | Status    | Evidence                                                                                           |
|-------------|------------|-------------------------------------------------------------------------------------|-----------|----------------------------------------------------------------------------------------------------|
| HER-01      | 03-01      | Scene 1 — granule particles falling into hopper, max 40 on mobile                   | SATISFIED | `GranulesScene.jsx`: `PARTICLE_CAP = isMobile ? 40 : 60`; `m.rect` particles with fall + stagger. REQUIREMENTS.md shows "Pending" but the implementation is complete — the tracking file was not updated by the plan agent. |
| HER-02      | 03-02      | Scene 2 — granules through barrel with heat color transition (orange-red glow)       | SATISFIED | `MeltingScene.jsx`: `linearGradient` with `COLOR.accentOrange` stops; `heatSweepVariant` x-translate; barrel glow pulse |
| HER-03      | 03-03      | Scene 3 — molten plastic through nozzle, pathLength animation                        | SATISFIED | `InjectionScene.jsx`: `drawVariant` `pathLength: 0→1`, 1.2s ease-out; orange stroke from nozzle to mould gate |
| HER-10      | 03-04      | All scene SVGs inline as JSX (required for Motion pathLength)                        | SATISFIED | All three scenes are `m.svg` JSX components, no external SVG files. `InjectionMoldingLoop` mounts them inline inside `AnimatePresence` |

**Note on REQUIREMENTS.md tracking:** HER-01 still shows "Pending" in the traceability table and the `[ ]` checkbox in REQUIREMENTS.md. The implementation is complete and wired — this is a documentation-only discrepancy in the requirements file, not a code gap.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | No TODO/FIXME/PLACEHOLDER comments found | — | — |
| None | — | No empty handler or stub return patterns found | — | — |
| None | — | No bare hex literals in scene files | — | — |

No anti-patterns detected. All three scene files are substantive implementations with no stub indicators.

**One note — SUMMARY 03-01 uses imprecise language:** The summary says "particles are motion.div rounded squares" but the implementation correctly uses `m.rect` (SVG rect elements) inside an `m.svg`. This is proper SVG usage and matches the success criterion intent. The SUMMARY was imprecise, the code is correct.

### Human Verification Required

The automated checks all pass. The following items require visual/device verification:

#### 1. Mobile particle cap

**Test:** Open the page on a device with < 4 CPU cores (low-end Android phone or equivalent). Count visible granule particles in Scene 1.
**Expected:** At most 40 particles visible; animation remains smooth at 60fps.
**Why human:** `navigator.hardwareConcurrency < 4` evaluates at runtime in the browser — cannot be confirmed without a real low-power device.

#### 2. Scene 2 visual heat sweep

**Test:** Watch Scene 2 play from start to finish.
**Expected:** The barrel structure fades in first, then an orange gradient wash sweeps left-to-right across the barrel while the five granule squares shrink and disappear. A separate orange glow on the barrel exterior pulses throughout.
**Why human:** The interplay of three simultaneous staggered animations (structure, sweep, granule dissolve) needs visual confirmation that timing feels correct and the "melting" narrative reads clearly.

#### 3. Scene 3 pathLength draw direction

**Test:** Watch Scene 3 play from start to finish.
**Expected:** The nozzle glow dot (small orange circle at the nozzle tip) appears first, then a thick orange stroke visibly draws from left to right — starting at the nozzle tip and ending at the mould gate. The mould block and nozzle housing should be visible before the stroke starts.
**Why human:** pathLength draw direction and the nozzle glow pre-flash timing need visual confirmation.

#### 4. Scene transitions (3 to 4 boundary)

**Test:** Watch the loop cycle from Scene 3 to Scene 4 (which is a SceneStub).
**Expected:** Clean AnimatePresence fade-out of InjectionScene before the stub fades in. No flash or frame pop at the boundary.
**Why human:** Mixed real scene + SceneStub wiring inside AnimatePresence mode="wait" requires visual verification that the exit animation plays before the stub mounts.

### Gaps Summary

No automated gaps found. All four success criteria are met by substantive, wired implementations.

The only discrepancy is a documentation stale state: `REQUIREMENTS.md` and the ROADMAP.md progress table still show HER-01 as Pending and Phase 3 as "Not started." This is a tracking artifact — the code is complete and correct. The requirements file should be updated to mark HER-01 as complete and Phase 3 as complete, but this does not block phase goal achievement.

---

_Verified: 2026-04-01T18:00:00Z_
_Verifier: Claude (gsd-verifier)_
