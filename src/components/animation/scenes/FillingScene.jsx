// src/components/animation/scenes/FillingScene.jsx
// Scene 4 — Mould Filling: molten plastic rises through the cavity from the gate.
//
// Design intent: orange fill rect grows upward (liquid rising) inside the mould cavity.
//
// Animation pattern: scaleY 0→1 with transformOrigin="bottom center" on the fill rect.
// This is compositor-safe (GPU transform only). The previous clipPath y/height approach
// triggered main-thread SVG layout recalc per frame and was replaced in PRF-02 audit.
//
// Integration contract:
//   - Receives NO props — InjectionMoldingLoop mounts as <FillingScene />
//   - AnimatePresence (in InjectionMoldingLoop via SceneWrapper) handles enter/exit
//   - All animated children use `variants` only (no `animate` prop on children)

// eslint-disable-next-line no-unused-vars -- m is used as JSX namespace (m.svg, m.rect, etc.); ESLint doesn't track JSX member-expression usage
import { m } from "motion/react";
import { COLOR, EASE_OUT_EXPO } from "../../../lib/motionTokens";

// ── Container variant ────────────────────────────────────────────────────────
// Staggers mould frame shapes in before the fill reveal begins.
// delayChildren: 0.1 — structural shapes appear first for context.
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// ── Frame shapes (mould block, cavity outline) ───────────────────────────────
// Quick fade-in so the mould structure is visible before the fill starts.
const frameVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

// ── Fill reveal variant ──────────────────────────────────────────────────────
// PRF-02 compliance: SVG rect y/height animation (inside a clipPath) forces
// main-thread layout recalc per frame. Replaced with scaleY + transformOrigin
// on the fill rect directly — compositor-safe transform only.
//
// scaleY: 0→1 with transformOrigin="bottom center" grows the rect upward,
// matching the original clipPath "liquid rising" visual without layout cost.
// delay: 0.3 — mould frame shapes are visible before the fill starts.
const fillRevealVariant = {
  hidden: { scaleY: 0, opacity: 0.9 },
  visible: {
    scaleY: 1,
    opacity: 0.9,
    transition: { duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.3 },
  },
};

// ── Component ────────────────────────────────────────────────────────────────
// Receives no props — sceneIndex contract from InjectionMoldingLoop is managed
// by SceneWrapper + AnimatePresence, not this component.
export default function FillingScene() {
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
      {/* ── No clipPath needed — fill reveal uses scaleY transform ─────────── */}
      {/* PRF-02: clipPath y/height animation was replaced with scaleY on the
          fill rect itself, eliminating the SVG attribute animation that triggered
          main-thread layout recalc. The <defs> block is intentionally removed. */}

      {/* ── Mould outer block ──────────────────────────────────────────────── */}
      {/* Large rectangular block — represents the two-half injection mould */}
      <m.rect
        x="130" y="60" width="140" height="180"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="3"
        variants={frameVariant}
      />

      {/* ── Mould cavity interior ──────────────────────────────────────────── */}
      {/* Dashed outline shows the hollow void before and during filling */}
      <m.rect
        x="155" y="85" width="90" height="130"
        fill="none"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        strokeDasharray="3 2"
        variants={frameVariant}
      />

      {/* ── Gate entry mark ───────────────────────────────────────────────── */}
      {/* Small filled rect on the left face of the mould — marks where
          molten material enters from the injection barrel (gate point) */}
      <m.rect
        x="126" y="145" width="6" height="10"
        fill={COLOR.surfacePrimary}
        variants={frameVariant}
      />

      {/* ── Isometric depth lines ─────────────────────────────────────────── */}
      {/* Three lines at the top-left corner of the mould block create a
          3-D isometric illusion (top face parallelogram hint) */}
      <m.line
        x1="130" y1="60" x2="146" y2="47"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        variants={frameVariant}
      />
      <m.line
        x1="270" y1="60" x2="286" y2="47"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        variants={frameVariant}
      />
      <m.line
        x1="146" y1="47" x2="286" y2="47"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        variants={frameVariant}
      />

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ORANGE FILL RECT — main animation event (via scaleY transform)      */}
      {/* scaleY: 0→1, transformOrigin: bottom center — grows upward like     */}
      {/* liquid rising. Compositor-safe: no SVG attribute mutation.          */}
      {/* fill is a static SVG attribute — no color animation here.           */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <m.rect
        x="155"
        y="85"
        width="90"
        height="130"
        fill={COLOR.accentCopper}
        style={{ transformOrigin: "bottom center" }}
        variants={fillRevealVariant}
      />
    </m.svg>
  );
}
