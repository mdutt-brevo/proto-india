// src/components/animation/scenes/MeltingScene.jsx
// Scene 2 — barrel heating and granule melt animation.
//
// Narrative: plastic granules inside the injection barrel are progressively
// heated left-to-right; they shrink and fade as they liquefy, while an orange
// radial glow sweeps across the barrel exterior.
//
// Animation contract:
//   - No props — driven entirely by internal variants.
//   - Root m.svg owns initial="hidden" / animate="visible".
//   - All children use `variants` only (no `animate` prop on children).
//   - Colors: COLOR.* constants only — no bare hex literals.
//   - Granule shrink: scaleX/scaleY keyframes (never width/height).

// eslint-disable-next-line no-unused-vars -- m is used as JSX namespace (m.svg, m.rect etc.); ESLint misses member-expression usage
import { m } from "motion/react";
import { COLOR, EASE_OUT_EXPO, EASE_IN_OUT_SINE } from "../../../lib/motionTokens";

export default function MeltingScene() {
  // ── Stagger container ───────────────────────────────────────────────────────
  // Delays child entry by 0.08s between siblings so barrel structure appears
  // before the granules and heat effects kick in.
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  // ── Barrel structural elements (fade in quickly) ────────────────────────────
  const barrelVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // ── Heat sweep: gradient rect moves left-to-right across the barrel ─────────
  // SVG gradient attributes (cx/cy) are not directly animatable via Motion.
  // Instead a rect filled with a linearGradient translates along x, producing
  // the same progressive reveal effect.
  const heatSweepVariant = {
    hidden: { x: -160, opacity: 0 },
    visible: {
      x: 160,
      opacity: [0, 0.8, 0.8, 0],
      transition: { duration: 1.5, ease: EASE_OUT_EXPO },
    },
  };

  // ── Barrel exterior orange glow (ambient pulse) ──────────────────────────────
  // Mimics the Tailwind animate-pulse-glow keyframe using a Motion opacity
  // keyframe array. Never apply both CSS keyframe animation AND Motion variants
  // to the same element — compositor fights result in dropped frames.
  const barrelGlowVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0.4, 0.2, 0.5, 0.2],
      transition: { duration: 1.5, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1] },
    },
  };

  return (
    <m.svg
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <defs>
        {/* Left-to-right heat sweep gradient: transparent → orange → transparent.
            The animated m.rect below sweeps this across the barrel width. */}
        <linearGradient id="heatGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor={COLOR.baseBg}      stopOpacity="0" />
          <stop offset="30%"  stopColor={COLOR.accentOrange} stopOpacity="0.3" />
          <stop offset="70%"  stopColor={COLOR.accentOrange} stopOpacity="0.6" />
          <stop offset="100%" stopColor={COLOR.baseBg}       stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── Barrel body — isometric horizontal cylinder shape ─────────────── */}

      {/* Main barrel rectangle */}
      <m.rect
        x="60" y="120" width="280" height="60"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="4"
        variants={barrelVariant}
      />

      {/* Feed throat — left end cap (where granules enter) */}
      <m.rect
        x="50" y="115" width="20" height="70"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="3"
        variants={barrelVariant}
      />

      {/* Nozzle side — right end cap (where molten plastic exits) */}
      <m.rect
        x="330" y="125" width="30" height="50"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="3"
        variants={barrelVariant}
      />

      {/* Screw thread centerline — dashed, static, conveys internal mechanism */}
      <m.line
        x1="80" y1="150" x2="320" y2="150"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        strokeDasharray="6 4"
        variants={barrelVariant}
      />

      {/* ── Granule shapes inside barrel ──────────────────────────────────── */}
      {/* Five granule squares spaced along the barrel, each with a per-item
          delay so they dissolve left-to-right in sync with the heat sweep.
          scaleX/scaleY keyframes (not width/height) to avoid layout thrashing. */}
      {[90, 120, 150, 180, 210].map((x, i) => (
        <m.rect
          key={x}
          x={x - 5} y="140"
          width="8" height="8"
          rx="2"
          fill={COLOR.surfacePrimary}
          variants={{
            hidden: { opacity: 0.8, scaleX: 1, scaleY: 1 },
            visible: {
              opacity: [0.8, 0.6, 0.2, 0],
              scaleX:  [1,   0.7, 0.3, 0],
              scaleY:  [1,   0.9, 0.6, 0],
              transition: {
                duration: 1.1,
                ease: EASE_IN_OUT_SINE,
                delay: 0.2 + i * 0.07,
              },
            },
          }}
        />
      ))}

      {/* ── Barrel exterior orange glow overlay ───────────────────────────── */}
      {/* Separate element from the barrel stroke so the pulse doesn't fight
          with the structural fade-in variant on the same node. */}
      <m.rect
        x="60" y="118" width="280" height="64"
        fill={COLOR.accentOrange}
        rx="4"
        variants={barrelGlowVariant}
      />

      {/* ── Heat sweep rect — moves left→right over 1.5s ─────────────────── */}
      {/* Filled with linearGradient; x translation drives the progressive reveal.
          clipPath overflow is handled by the parent container (overflow-hidden). */}
      <m.rect
        x="60" y="120" width="160" height="60"
        fill="url(#heatGradient)"
        rx="4"
        variants={heatSweepVariant}
      />
    </m.svg>
  );
}
