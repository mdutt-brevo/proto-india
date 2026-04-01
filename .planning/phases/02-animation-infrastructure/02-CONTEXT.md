# Phase 2: Animation Infrastructure - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the animation state machine, scene orchestration shell, and reduced-motion fallback — all independently testable before any scene SVG is written. This phase creates the scaffolding that Phases 3-4 fill with actual scene content.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — infrastructure phase. Key constraints from project research:

- **useMoldingLoop hook**: Single `sceneIndex` integer state (0-6), advanced via `setTimeout` using `SCENE_DURATIONS` array from `src/lib/motionTokens.js` (already created in Phase 1, sums to 12.0s). Loops back to 0 after scene 6.
- **SceneWrapper component**: Uses `AnimatePresence mode="wait"` with `key={sceneIndex}`. Each scene component gets `initial="hidden" animate="visible" exit="exit"` variants. Cross-fade transitions using `SCENE_ENTER` and `SCENE_EXIT` presets from motionTokens.js.
- **InjectionMoldingStatic**: Static SVG showing the final product (Scene 7 frozen frame). Rendered when `useReducedMotion()` returns true. Must be a meaningful fallback, not blank.
- **Import from `motion/react`**: All Motion imports use this path (LazyMotion already set up in Phase 1).
- **File locations**: Hook in `src/hooks/useMoldingLoop.js`, components in `src/components/animation/`.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/motionTokens.js` — SCENE_DURATIONS (7-element array, 12.0s total), SCENE_ENTER, SCENE_EXIT, EASE_OUT_EXPO, COLOR constants (created Phase 1)
- `src/App.jsx` — LazyMotion with domAnimation already wrapping BrowserRouter (created Phase 1)
- `src/hooks/useInView.js` — existing custom hook pattern to follow

### Established Patterns
- Custom hooks in `src/hooks/` directory
- Functional components with named exports
- Tailwind CSS for layout, Motion for animation

### Integration Points
- `src/lib/motionTokens.js` — SCENE_DURATIONS consumed by useMoldingLoop
- Future: `src/components/home/Hero.jsx` will import the orchestrator (Phase 5)
- Future: Scenes 1-7 components will slot into SceneWrapper (Phases 3-4)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase

</deferred>
