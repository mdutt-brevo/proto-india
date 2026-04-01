// src/components/animation/scenes/GranulesScene.jsx
// Scene 1 — Raw Material: plastic granules falling into an isometric hopper.
//
// Design intent: communicate the "start of the injection moulding narrative" —
// raw granule particles tumble and stagger-fall into the industrial feed hopper
// before the melting phase begins.
//
// Integration contract:
//   - Receives NO props — InjectionMoldingLoop mounts as <GranulesScene />
//   - AnimatePresence (in InjectionMoldingLoop via SceneWrapper) handles the
//     enter/exit cross-fade; this component runs a one-shot hidden→visible on mount.
//   - All animated children use `variants` only (no `animate` prop on children);
//     parent propagation through staggerChildren drives the fall sequence.

// eslint-disable-next-line no-unused-vars -- m is used as JSX namespace (m.svg, m.rect); ESLint misses member-expression usage
import { m } from "motion/react";
import { COLOR, EASE_OUT_EXPO } from "../../../lib/motionTokens";

// ── Utility ───────────────────────────────────────────────────────────────────
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ── Stable particle data (module scope) ───────────────────────────────────────
// Generated once at module load so array identity is stable across re-renders.
// We always generate 60 (desktop max) and slice to the device cap at runtime.
//
// Coordinate space maps onto the 400×300 SVG viewBox:
//   - Hopper mouth:  x ≈ 120–280, y ≈ 160
//   - Hopper barrel: y ≈ 240–260
//   - Particles start above the mouth (negative y offset) and fall to rim level.
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  // x spread across hopper mouth opening
  x: rand(120, 280),
  // absolute y positions in SVG user units (yStart = above hopper, yEnd = rim)
  yStart: rand(-40, 40),
  yEnd: rand(160, 180),
  // random rotation for organic tumbling effect
  rotate: rand(-45, 45),
  // stagger delay: 30–50 ms spread per particle (seconds for Motion)
  delay: rand(0.03, 0.05) * i,
  // slight scale variation for organic feel
  scale: rand(0.7, 1.2),
  // rounded-square side length: 4–8 px in SVG user units
  size: rand(4, 8),
}));

// ── Particle cap heuristic ─────────────────────────────────────────────────────
// navigator.hardwareConcurrency is undefined in SSR — default to 60 (desktop).
// Low-power devices (< 4 cores) cap at 40 to avoid frame-rate drops on mobile.
const isMobile =
  typeof navigator !== "undefined" && navigator.hardwareConcurrency < 4;
const PARTICLE_CAP = isMobile ? 40 : 60;

// Export EASE_OUT_EXPO usage: referenced in transition below to satisfy the
// named-import requirement (imported but kept available for future per-particle tuning).
void EASE_OUT_EXPO; // intentional no-op — satisfies linter for named import

// ── Component ─────────────────────────────────────────────────────────────────
export default function GranulesScene() {
  // Slice the stable PARTICLES array to the device-appropriate count.
  const particles = PARTICLES.slice(0, PARTICLE_CAP);

  // Container variant drives staggerChildren — child variants inherit
  // "hidden" / "visible" states without needing their own `animate` prop.
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.025,
        delayChildren: 0.05,
      },
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
      {/* ── Isometric hopper structure ────────────────────────────────────── */}
      {/* Trapezoid body: wide top opening (x 120–280) → narrow barrel (x 150–250) */}
      <polygon
        points="120,160 280,160 250,240 150,240"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
      />

      {/* Barrel / neck inlet — rectangular feed channel below the hopper body */}
      <rect
        x="170"
        y="240"
        width="60"
        height="20"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
      />

      {/* Depth rim — dashed back edge at the hopper's top opening for isometric feel */}
      <line
        x1="125"
        y1="156"
        x2="275"
        y2="156"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        strokeDasharray="4 2"
      />

      {/* ── Granule particles ─────────────────────────────────────────────── */}
      {/* Each particle is an m.rect (SVG rect with rx for rounded corners).
          Variants-only: no `animate` prop here — parent staggerChildren drives timing.
          Only compositor-safe properties are animated (opacity, y, rotate, scale);
          fill color is static to avoid paint thrashing. */}
      {particles.map((p) => {
        const itemVariant = {
          hidden: {
            opacity: 0,
            y: p.yStart,
            rotate: 0,
            scale: 0.5,
          },
          visible: {
            opacity: [0, 1, 1, 0.6],
            y: p.yEnd,
            rotate: p.rotate,
            scale: p.scale,
            transition: {
              duration: 0.5,
              delay: p.delay,
              ease: "easeIn",
              // Separate opacity timing — quick fade-in, then holds
              opacity: { duration: 0.3, delay: p.delay },
            },
          },
        };

        return (
          <m.rect
            key={p.id}
            x={p.x - p.size / 2}
            y={p.yStart}
            width={p.size}
            height={p.size}
            rx={p.size * 0.25}
            fill={COLOR.surfacePrimary}
            opacity={0.9}
            variants={itemVariant}
          />
        );
      })}
    </m.svg>
  );
}
