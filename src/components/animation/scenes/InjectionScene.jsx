// src/components/animation/scenes/InjectionScene.jsx
// Scene 3: Injection — molten plastic forced from nozzle tip into mould gate.
// Narrative: "Precision in Every Moulded Part" — a thick orange stroke draws
// from left to right under high pressure, ending at the mould cavity entrance.
//
// Animation pattern: pathLength 0→1 (Motion normalised stroke draw).
// Motion computes getTotalLength() internally — never use stroke-dasharray manually.

// eslint-disable-next-line no-unused-vars -- m is used as JSX namespace (m.svg, m.path, etc.); ESLint doesn't track JSX member-expression usage
import { m } from "motion/react";
import { COLOR, EASE_OUT_EXPO } from "../../../lib/motionTokens";

// ── Container variant ────────────────────────────────────────────────────────
// Staggers background shapes first, then lets the injection stroke draw.
// delayChildren: 0.1 — nozzle + mould frames appear before stroke begins.
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// ── Frame shapes (nozzle housing, mould block) ───────────────────────────────
// Quick fade-in so the structural context is visible before the stroke animates.
const frameVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

// ── Injection stroke ─────────────────────────────────────────────────────────
// pathLength: 0→1 is the canonical Motion stroke-draw pattern.
// Duration 1.2s ease-out per user decision (HER-03).
// delay: 0.25 — background shapes are visible before the stroke fires.
// opacity transition is faster (0.15s) so the line appears crisply before drawing.
const drawVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, ease: "easeOut", delay: 0.25 },
      opacity:    { duration: 0.15, delay: 0.2 },
    },
  },
};

// ── Nozzle glow dot ──────────────────────────────────────────────────────────
// Small orange circle at the nozzle tip pulses into view before the stroke
// starts, signalling that molten material is about to be injected.
const nozzleGlowVariant = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: [0, 1, 0.6],
    scale: [0, 1.3, 1],
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
};

// ── Component ────────────────────────────────────────────────────────────────
// Receives no props — sceneIndex contract from InjectionMoldingLoop is managed
// by SceneWrapper + AnimatePresence, not this component.
export default function InjectionScene() {
  return (
    <m.svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* ── Nozzle housing — barrel end, short rectangular body ───────────── */}
      <m.rect
        x="40" y="130" width="60" height="40"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="3"
        variants={frameVariant}
      />

      {/* Nozzle tip — tapering polygon towards the injection point */}
      <m.polygon
        points="100,138 115,145 115,155 100,162"
        fill={COLOR.surfacePrimary}
        variants={frameVariant}
      />

      {/* ── Mould block — main isometric rectangular body ─────────────────── */}
      <m.rect
        x="280" y="105" width="80" height="90"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="2"
        variants={frameVariant}
      />

      {/* Mould cavity interior outline (dashed) — shows the hollow void */}
      <m.rect
        x="295" y="118" width="50" height="64"
        fill="none"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        strokeDasharray="3 2"
        variants={frameVariant}
      />

      {/* Gate plug — small filled rectangle on the mould's left face,
          marking the entry point where the injection stroke terminates */}
      <m.rect
        x="276" y="143" width="6" height="14"
        fill={COLOR.surfacePrimary}
        variants={frameVariant}
      />

      {/* ── Isometric depth — top-face parallelogram hint ─────────────────── */}
      {/* These three lines give the mould block a 3-D isometric illusion. */}
      <m.line
        x1="280" y1="105" x2="296" y2="92"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        variants={frameVariant}
      />
      <m.line
        x1="360" y1="105" x2="376" y2="92"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        variants={frameVariant}
      />
      <m.line
        x1="296" y1="92" x2="376" y2="92"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        variants={frameVariant}
      />

      {/* ── Orange nozzle glow — appears before stroke draws ──────────────── */}
      {/* Scale + opacity keyframe animation signals "pressure building". */}
      <m.circle
        cx="115" cy="150" r="5"
        fill={COLOR.accentOrange}
        variants={nozzleGlowVariant}
      />

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* THE INJECTION STROKE — main animation event                         */}
      {/* Thick orange path from nozzle tip to mould gate.                    */}
      {/* pathLength 0→1 in 1.2s ease-out per user decision (HER-03).         */}
      {/* strokeWidth 5 for forceful, high-pressure feel.                     */}
      {/* stroke={COLOR.accentOrange} is a static SVG attribute — NOT         */}
      {/* animated through Motion variants (SVG stroke color is a repaint).   */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <m.path
        d="M 115 150 L 276 150"
        stroke={COLOR.accentOrange}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        variants={drawVariant}
      />
    </m.svg>
  );
}
