// src/components/animation/scenes/CoolingScene.jsx
// Scene 5 — Cooling: heat drains from the part, then the mould halves separate.
//
// Design intent: communicate TWO events in sequence within 2.0s:
//   (a) color cools — part fill transitions from accentCopper to surfacePrimary
//   (b) mould halves pull apart — left half translates -30px, right +30px
//
// The split mould layout uses a parting line at x=200 (center of viewBox).
// Left half:  x=50  (110px wide, ends at x=160 — gap to part at x=165)
// Right half: x=240 (110px wide, starts at x=240 — gap from part at x=235)
//
// Integration contract:
//   - Receives NO props — InjectionMoldingLoop mounts as <CoolingScene />
//   - AnimatePresence (in InjectionMoldingLoop via SceneWrapper) handles enter/exit
//   - All animated children use `variants` only (no `animate` prop on children)

// eslint-disable-next-line no-unused-vars -- m is used as JSX namespace (m.svg, m.rect, etc.); ESLint doesn't track JSX member-expression usage
import { m } from "motion/react";
import { COLOR, EASE_OUT_EXPO, EASE_IN_OUT_SINE } from "../../../lib/motionTokens";

// ── Container variant ────────────────────────────────────────────────────────
// Tight stagger — elements appear nearly simultaneously; the color-shift
// and separation animations are the visual focus, not the entry stagger.
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

// ── Frame shapes (parting line, static decorations) ──────────────────────────
// Quick fade-in for supporting geometry that does not animate beyond entry.
const frameVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

// ── Part rect — cooling color shift ─────────────────────────────────────────
// fill keyframe: accentCopper → accentCopper (hold) → surfacePrimary
// times: [0, 0.3, 1] — color holds at orange for first 30% then cools.
// delay: 0.2 — part is visible before transition fires.
// IMPORTANT: fill color animation is safe here because it is the ONLY
// animated property on this element — no layout thrashing risk.
const coolVariant = {
  hidden: { opacity: 0, fill: COLOR.accentCopper },
  visible: {
    opacity: 1,
    fill: [COLOR.accentCopper, COLOR.accentCopper, COLOR.surfacePrimary],
    transition: {
      opacity: { duration: 0.3 },
      fill: { duration: 1.2, ease: EASE_IN_OUT_SINE, delay: 0.2, times: [0, 0.3, 1] },
    },
  },
};

// ── Left mould half — translates left after cooling ──────────────────────────
// delay: 0.9 — fires after the color shift has largely completed (~0.2 + 0.7s).
const mouldLeftVariant = {
  hidden: { opacity: 0, x: 0 },
  visible: {
    opacity: 1,
    x: -30,
    transition: {
      opacity: { duration: 0.3 },
      x: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.9 },
    },
  },
};

// ── Right mould half — translates right after cooling ────────────────────────
// Mirrors mouldLeftVariant timing for simultaneous symmetric separation.
const mouldRightVariant = {
  hidden: { opacity: 0, x: 0 },
  visible: {
    opacity: 1,
    x: 30,
    transition: {
      opacity: { duration: 0.3 },
      x: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.9 },
    },
  },
};

// ── Component ────────────────────────────────────────────────────────────────
// Receives no props — sceneIndex contract from InjectionMoldingLoop is managed
// by SceneWrapper + AnimatePresence, not this component.
export default function CoolingScene() {
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
      {/* ── Left mould half ───────────────────────────────────────────────── */}
      {/* Translates -30px on separation. The half spans x=50 to x=160,
          leaving a small gap to the part (which sits at x=165). */}
      <m.rect
        x="50" y="60" width="110" height="180"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="3"
        variants={mouldLeftVariant}
      />

      {/* ── Right mould half ──────────────────────────────────────────────── */}
      {/* Translates +30px on separation. Spans x=240 to x=350,
          leaving a small gap from the part (which ends at x=235). */}
      <m.rect
        x="240" y="60" width="110" height="180"
        fill="none"
        stroke={COLOR.surfacePrimary}
        strokeWidth="2"
        rx="3"
        variants={mouldRightVariant}
      />

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PART RECT — main cooling animation event                            */}
      {/* fill transitions accentCopper → surfacePrimary over 1.2s            */}
      {/* Sits centered in the mould cavity at x=165, width=70                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <m.rect
        x="165" y="95" width="70" height="110"
        rx="4"
        stroke="none"
        variants={coolVariant}
      />

      {/* ── Parting line ──────────────────────────────────────────────────── */}
      {/* Vertical dashed line at x=200 (viewBox center) marks where the two
          mould halves meet — the split plane */}
      <m.line
        x1="200" y1="60" x2="200" y2="240"
        stroke={COLOR.textMuted}
        strokeWidth="1"
        strokeDasharray="4 3"
        variants={frameVariant}
      />
    </m.svg>
  );
}
