# Phase 3: Scenes 1-3 - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the first three injection molding scene components (Granules, Melting, Injection) as inline JSX SVG components. These establish the hardest animation patterns — particles, color-shift, and pathLength — that Phases 4's scenes will reuse. Each scene replaces a SceneStub in InjectionMoldingLoop by index.

</domain>

<decisions>
## Implementation Decisions

### Visual Style
- Technical isometric SVG style — clean geometric paths with slight 3D perspective via isometric transforms
- Matches existing blueprint design language (blueprint-grid, crosshairs, toolpath-divider)
- Transparent backgrounds — scenes float on the hero section's dark gradient
- All colors via COLOR constants from motionTokens.js

### Scene 1 — Raw Material (Granules)
- Granule particles are motion.div elements (rounded squares) with tumble rotation + scale variation
- Eased gravity fall (ease-in) with random 30-50ms stagger per particle
- Capped at 40 particles on mobile (navigator.hardwareConcurrency < 4 heuristic), 60 on desktop
- Hopper shape: isometric technical drawing, clean lines, slate/steel coloring

### Scene 2 — Melting
- Progressive heat glow: radial gradient sweeps left-to-right following screw direction over 1.5s
- Subtle orange pulsing on the barrel exterior to convey heat
- Granules visually compress/merge as they move through the barrel
- Uses CSS radial-gradient animated via Motion for the glow effect

### Scene 3 — Injection
- Powerful stroke draw: pathLength 0→1 in 1.2s ease-out
- Thick nozzle line that feels forceful and precise
- SVG path from nozzle tip into mould cavity entrance
- COLOR.accent (#EA580C) for the molten material color

### Animation Timing
- Scene transitions: crossfade via opacity using existing SceneWrapper FADE variants
- SCENE_DURATIONS already locked: [1.5, 1.5, 1.5, 2.0, 2.0, 1.5, 2.0] = 12.0s total
- Scenes 1-3 each get 1.5s (indices 0, 1, 2 in SCENE_DURATIONS)

### Claude's Discretion
- Exact SVG path coordinates and isometric transform values
- Particle spawn/despawn lifecycle implementation
- Barrel interior detail level
- How compressed granules look transitioning from Scene 1 to Scene 2 visual style

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/animation/InjectionMoldingLoop.jsx` — orchestrator with SceneStub placeholders (Phase 2)
- `src/components/animation/SceneWrapper.jsx` — AnimatePresence envelope with FADE variants (Phase 2)
- `src/hooks/useMoldingLoop.js` — scene state machine (Phase 2)
- `src/lib/motionTokens.js` — SCENE_DURATIONS, SCENE_ENTER, SCENE_EXIT, COLOR, easing presets (Phase 1)

### Established Patterns
- Import `{ m }` from `motion/react` (not `motion`) — leverages LazyMotion 4.6KB bundle
- Variants propagation: root `m.svg` has `initial/animate`, descendants only declare `variants`
- Scene components receive no props — they read timing from motionTokens.js directly

### Integration Points
- Each scene component is imported into InjectionMoldingLoop.jsx and rendered by sceneIndex
- Scene components must export a default function component
- SVG must use viewBox for responsive scaling

</code_context>

<specifics>
## Specific Ideas

- Isometric perspective should convey the manufacturing equipment as technical diagrams
- The granule fall should feel like raw material being fed into industrial machinery
- The heat glow should build progressively like real barrel heating
- The injection stroke should feel powerful and precise — "Precision in Every Moulded Part"

</specifics>

<deferred>
## Deferred Ideas

- Annotation labels on scenes (v2 requirement POL-01)
- Progress indicator bar (v2 requirement POL-02)
- Scene-aware color palette shifts (v2 requirement POL-05)

</deferred>
