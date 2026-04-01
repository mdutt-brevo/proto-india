# Phase 4: Scenes 4-7 and Polish - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the final four injection molding scenes (Fill, Cooling, Ejection, Product Reveal), seal the loop seam (Scene 7 → Scene 1), and validate performance (60fps) and responsive scaling (375px → 1440px+). This completes the animation narrative.

</domain>

<decisions>
## Implementation Decisions

### Scene 4 — Mould Filling
- clipPath rect reveal expanding upward inside mould cavity over ~1.5s
- Isometric mould cross-section showing cavity being filled
- Fill color: COLOR.accent (orange molten material)

### Scene 5 — Cooling
- Glow color shift from orange → slate (COLOR.primary) to show cooling
- Mould halves translate apart smoothly
- Duration per SCENE_DURATIONS[4] = 2.0s

### Scene 6 — Ejection
- Ejector pins translateY push finished part upward out of mould
- Clean mechanical motion — feels precise and industrial
- Duration per SCENE_DURATIONS[5] = 1.5s

### Scene 7 — Product Reveal
- Finished part scale+fade center reveal
- Brand tagline "Precision in Every Moulded Part" appears with text fade-in
- Duration per SCENE_DURATIONS[6] = 2.0s — slightly longer for impact

### Loop Seam
- Scene 7 exit: opacity → 0 matches Scene 1 initial state (opacity = 0)
- SceneWrapper crossfade handles the transition naturally
- No special cross-scene logic needed — AnimatePresence mode="wait" does the work

### Performance
- Same hardwareConcurrency heuristic for mobile particle reduction
- All animations use transform/opacity only
- Target: no frames >16ms in Chrome DevTools Performance panel

### Responsive
- SVG viewBox="0 0 400 300" with preserveAspectRatio="xMidYMid meet"
- Hero text remains readable over animation at all breakpoints
- Consistent viewBox across all 7 scenes for seamless transitions

### Visual Style
- Same technical isometric style as Scenes 1-3
- Transparent backgrounds
- All colors from COLOR constants in motionTokens.js
- Import `{ m }` from `motion/react`

### Claude's Discretion
- Exact SVG path coordinates for mould cross-section, ejector pins, finished part
- clipPath animation timing details
- Ejector pin count and spacing
- Product shape design (should be recognizable as an injection-moulded housing)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/animation/scenes/GranulesScene.jsx` — particle pattern to reuse
- `src/components/animation/scenes/MeltingScene.jsx` — gradient animation pattern
- `src/components/animation/scenes/InjectionScene.jsx` — pathLength pattern
- `src/components/animation/InjectionMoldingLoop.jsx` — orchestrator (SceneStubs at indices 3-6)
- `src/lib/motionTokens.js` — all timing, easing, color constants

### Integration Points
- InjectionMoldingLoop.jsx — replace SceneStub at indices 3-6 with real scene components
- Loop seam validated by watching Scene 7 → Scene 1 transition in browser

</code_context>

<specifics>
## Specific Ideas

- The mould filling should look like liquid rising in a container — clipPath is perfect for this
- Cooling should feel like the energy leaving the part — color desaturation conveys this well
- Ejection should be mechanical and precise — ejector pins are a real manufacturing element
- Product reveal is the money shot — the tagline ties the whole loop back to the brand

</specifics>

<deferred>
## Deferred Ideas

- Annotation labels (v2 POL-01)
- Progress indicator bar (v2 POL-02)
- Scene-aware color shifts (v2 POL-05)

</deferred>
