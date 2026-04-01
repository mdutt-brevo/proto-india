// src/components/animation/scenes/FillingScene.jsx
// Scene 4 — Mould Filling: molten plastic rises through the cavity from the gate.
//
// Design intent: a clipPath rect grows upward from cavity bottom to top,
// revealing a static orange fill rect beneath — creating the illusion of
// liquid plastic filling the mould under injection pressure.
//
// Animation pattern: clipPath reveal (clip rect y/height animate, not fill opacity).
// clipPath + clipPath content are inside <defs>; the orange fill rect sits below
// and is revealed through the growing clip window.
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

// ── Clip rect (fill reveal) ──────────────────────────────────────────────────
// The clip rect starts at cavity bottom (y=215, height=0) and grows upward
// (y=85, height=130) over 1.4s, revealing the static orange fill rect below.
// delay: 0.3 — mould frame shapes are visible before the fill starts.
const clipRectVariant = {
  hidden: { y: 215, height: 0 },
  visible: {
    y: 85,
    height: 130,
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
      {/* ── Definitions ───────────────────────────────────────────────────── */}
      {/* clipPath "fillClip" controls what part of the orange fill rect is visible.
          The m.rect inside grows from y=215,h=0 → y=85,h=130 over 1.4s,
          revealing the fill from bottom to top (liquid rising). */}
      <defs>
        <clipPath id="fillClip">
          <m.rect
            x="155"
            width="90"
            variants={clipRectVariant}
          />
        </clipPath>
      </defs>

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
      {/* ORANGE FILL RECT — main animation event (via clipPath reveal)       */}
      {/* Always present at full cavity size; only the visible area grows.    */}
      {/* fill is a static SVG attribute — no color animation here.           */}
      {/* clipPath="url(#fillClip)" restricts what portion is rendered.       */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <rect
        x="155"
        y="85"
        width="90"
        height="130"
        fill={COLOR.accentOrange}
        clipPath="url(#fillClip)"
      />
    </m.svg>
  );
}
