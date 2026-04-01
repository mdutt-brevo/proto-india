// src/components/animation/scenes/ProductRevealScene.jsx
// Scene 7: Product Reveal — the finished injection-moulded part scales into view
// at centre, followed by the Protolabs brand tagline fading up beneath it.
//
// SCENE_DURATIONS[6] = 2.0s — all motion completes comfortably within this window.
//
// Loop seam contract (HER-08):
//   SceneWrapper wraps this component in an m.div with an exit variant (opacity: 0).
//   AnimatePresence mode="wait" in InjectionMoldingLoop triggers that exit before
//   Scene 1 mounts. No special exit logic is needed inside this component —
//   the SceneWrapper exit handles the seamless Scene 7 → Scene 1 transition.
//   This component only needs a clean enter animation (opacity 0 → 1).

// eslint-disable-next-line no-unused-vars -- m is used as JSX namespace (m.svg, m.g, etc.); ESLint doesn't track JSX member-expression usage
import { m } from "motion/react";
import { COLOR, EASE_OUT_EXPO } from "../../../lib/motionTokens";

// ── Container variant ────────────────────────────────────────────────────────
// All children inherit "hidden"/"visible" states via variant propagation.
// delayChildren: 0.1 — brief settle before any element enters.
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// ── Housing group (main part silhouette) ─────────────────────────────────────
// Scales from 0.6 to 1.0 while fading in — "money shot" reveal of the finished part.
// Duration 0.7s is the dominant visual event; delay 0.1 gives container time to settle.
const partRevealVariant = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 },
  },
};

// ── Orange accent dot ─────────────────────────────────────────────────────────
// Small Protolabs-style "P" glyph accent — pulses in after the housing is visible.
// scale 0→1 with delay 0.65 so it appears as the housing settles into place.
const accentVariant = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.65 },
  },
};

// ── Brand tagline text ────────────────────────────────────────────────────────
// Both lines share this variant: fade up (y: 8→0) after the part is fully revealed.
// delay: 0.8 — housing and accent are stable before text enters.
const taglineVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.8 },
  },
};

// ── Component ────────────────────────────────────────────────────────────────
// Accepts no props — SceneWrapper + AnimatePresence manage mount/unmount timing.
export default function ProductRevealScene() {
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
      {/* ── Finished part housing — injection-moulded component silhouette ─── */}
      {/* m.g groups all housing shapes so partRevealVariant scales them        */}
      {/* from a shared transform-origin (center of the group).                */}
      <m.g variants={partRevealVariant}>
        {/* Outer shell — main housing body */}
        <m.rect
          x="135" y="70" width="130" height="100"
          rx="10"
          fill="none"
          stroke={COLOR.surfacePrimary}
          strokeWidth="2.5"
        />

        {/* Inner detail — three connector ports (left, centre, right) */}
        <m.rect
          x="155" y="95" width="20" height="15"
          rx="2"
          fill="none"
          stroke={COLOR.textMuted}
          strokeWidth="1"
        />
        <m.rect
          x="185" y="95" width="20" height="15"
          rx="2"
          fill="none"
          stroke={COLOR.textMuted}
          strokeWidth="1"
        />
        <m.rect
          x="215" y="95" width="20" height="15"
          rx="2"
          fill="none"
          stroke={COLOR.textMuted}
          strokeWidth="1"
        />

        {/* Main body recess — shows internal volume / recessed panel */}
        <m.rect
          x="155" y="125" width="80" height="30"
          rx="3"
          fill="none"
          stroke={COLOR.textMuted}
          strokeWidth="1"
        />
      </m.g>

      {/* ── Protolabs accent dot ─────────────────────────────────────────────── */}
      {/* Small orange circle at the base of the housing acts as the            */}
      {/* brand "P" glyph accent — marks the ejection point and brand identity. */}
      <m.circle
        cx="200" cy="155" r="4"
        fill={COLOR.accentOrange}
        variants={accentVariant}
      />

      {/* ── Brand tagline ─────────────────────────────────────────────────────── */}
      {/* Two lines to fit the narrow viewBox without overflowing.               */}
      {/* Both share taglineVariant — same delay so they enter as one unit.      */}
      <m.text
        x="200" y="210"
        textAnchor="middle"
        fontSize="14"
        fontFamily="JetBrains Mono, monospace"
        fill={COLOR.textPrimary}
        letterSpacing="0.05em"
        variants={taglineVariant}
      >
        Precision in Every
      </m.text>
      <m.text
        x="200" y="228"
        textAnchor="middle"
        fontSize="14"
        fontFamily="JetBrains Mono, monospace"
        fill={COLOR.textPrimary}
        letterSpacing="0.05em"
        variants={taglineVariant}
      >
        Moulded Part
      </m.text>
    </m.svg>
  );
}
