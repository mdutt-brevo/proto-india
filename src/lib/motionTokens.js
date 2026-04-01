// src/lib/motionTokens.js
// Single source of truth for all animation constants used across Phases 2-4.
// Scene components import from here — never hardcode animation values inline.

// ── Scene timing ──────────────────────────────────────────────────────────────
// Total: 12.0 seconds (within the 10-14s INF-02 / HER-09 requirement).
// useMoldingLoop in Phase 2 reads this array to advance scene index.
export const SCENE_DURATIONS = [
  1.5,  // Scene 1: Raw Material — granule particles falling into hopper
  1.5,  // Scene 2: Melting — granules through barrel with heat color shift
  1.5,  // Scene 3: Injection — pathLength stroke through nozzle into mould
  2.0,  // Scene 4: Mould Filling — clipPath cavity reveal
  2.0,  // Scene 5: Cooling — glow reduction, mould halves separating
  1.5,  // Scene 6: Ejection — ejector pins pushing finished part out
  2.0,  // Scene 7: Product Reveal — final part + "Precision in Every Moulded Part"
];
// Sum: 12.0s

// ── Easing curves (cubic-bezier arrays) ───────────────────────────────────────
export const EASE_OUT_EXPO    = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_SINE = [0.37, 0, 0.63, 1];

// ── Spring preset ─────────────────────────────────────────────────────────────
export const EASE_SPRING_DEFAULT = { type: "spring", stiffness: 300, damping: 30 };

// ── Transition presets (use as Motion transition prop) ────────────────────────
export const SCENE_ENTER = { duration: 0.4, ease: EASE_OUT_EXPO };
export const SCENE_EXIT  = { duration: 0.3, ease: EASE_IN_OUT_SINE };
export const MICRO       = { duration: 0.15 };
export const REVEAL      = { duration: 0.6, ease: EASE_OUT_EXPO };

// ── Brand color constants ──────────────────────────────────────────────────────
// These mirror tailwind.config.js values. Motion animate() calls do not go
// through Tailwind JIT, so hex values must be explicit here.
export const COLOR = {
  baseBg:         "#0f1923",
  surfacePrimary: "#64748b",
  accentOrange:   "#ea580c",
  textPrimary:    "#f1f5f9",
  textMuted:      "#94a3b8",
};
