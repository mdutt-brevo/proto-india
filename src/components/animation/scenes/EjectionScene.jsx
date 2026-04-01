// src/components/animation/scenes/EjectionScene.jsx
// Scene 6: Ejection — ejector pins push the finished part upward out of the mould.
// Narrative: After cooling, three vertical ejector pins translate upward in unison,
// lifting the moulded part clear of the mould base.
//
// SCENE_DURATIONS[5] = 1.5s — all motion completes within this window.
// Animation is compositor-safe: y transforms on m.line / m.rect, never animating
// SVG attributes (y1, y2, x, y) directly.

// eslint-disable-next-line no-unused-vars -- m is used as JSX namespace (m.svg, m.rect, etc.); ESLint doesn't track JSX member-expression usage
import { m } from "motion/react";
import { COLOR, EASE_OUT_EXPO } from "../../../lib/motionTokens";

// ── Container variant ────────────────────────────────────────────────────────
// Small stagger so mould base appears first, then pins fire together, then part follows.
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

// ── Mould base ───────────────────────────────────────────────────────────────
// Quick fade-in establishes structural context before pins animate.
const frameVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

// ── Ejector pins ─────────────────────────────────────────────────────────────
// Pins translate upward (y: -45) — CSS transform, NOT y1/y2 attribute mutation.
// Motion applies transform: translateY() so this stays on the compositor thread.
// delay: 0.25 — mould base is visible before pins fire.
const pinVariant = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: -45,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.25 },
  },
};

// ── Ejected part ─────────────────────────────────────────────────────────────
// Part follows the pins upward (y: -50, slightly farther than pins for natural motion).
// Brightens from invisible to full opacity as it clears the mould.
// delay: 0.3 — pins lead by 50ms so the "push" relationship is visible.
const partVariant = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: -50,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.3 },
  },
};

// ── Component ────────────────────────────────────────────────────────────────
// Accepts no props — SceneWrapper + AnimatePresence manage mount/unmount timing.
export default function EjectionScene() {
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
      {/* ── Mould base — rectangular housing the part was moulded in ──────── */}
      {/* frameVariant: fades in at 0.35s, giving structural context first.    */}
      <m.rect
        x="130" y="160" width="140" height="80"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="2"
        variants={frameVariant}
      />

      {/* ── Finished part outline ─────────────────────────────────────────── */}
      {/* Rounded housing silhouette sitting inside (then above) the mould.    */}
      {/* partVariant: translates y:-50 so it emerges above the mould opening. */}
      <m.rect
        x="150" y="80" width="100" height="75"
        rx="8"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        variants={partVariant}
      />

      {/* ── Ejector pins — three vertical lines ──────────────────────────── */}
      {/* y-translate via CSS transform (NOT y1/y2 attribute change).          */}
      {/* pinVariant: all three pins translate together (same variant).        */}
      {/* Pin 1 — left */}
      <m.line
        x1="170" y1="165" x2="170" y2="155"
        stroke={COLOR.textMuted}
        strokeWidth="3"
        strokeLinecap="round"
        variants={pinVariant}
      />

      {/* Pin 2 — centre */}
      <m.line
        x1="200" y1="165" x2="200" y2="155"
        stroke={COLOR.textMuted}
        strokeWidth="3"
        strokeLinecap="round"
        variants={pinVariant}
      />

      {/* Pin 3 — right */}
      <m.line
        x1="230" y1="165" x2="230" y2="155"
        stroke={COLOR.textMuted}
        strokeWidth="3"
        strokeLinecap="round"
        variants={pinVariant}
      />
    </m.svg>
  );
}
