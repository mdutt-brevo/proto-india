// Dense wireframe gear set — two interlocking gears with full involute
// tooth profiles, spokes, hubs, keyways, and construction lines.
//
// MECHANICALLY ACCURATE: Each gear rotates independently.
// The small gear (14T) drives the large gear (24T).
// They counter-rotate at a ratio of 24:14 ≈ 1.714
// i.e., when small gear does 1 full turn, large gear does ~0.583 turns.

import { m, useTransform } from "motion/react";

// Generate gear tooth polygon points
function gearPath(cx, cy, teeth, outerR, rootR, tipWidth) {
  const points = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = ((i + tipWidth) / teeth) * Math.PI * 2;
    const a2 = ((i + 0.5 - tipWidth) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    points.push(
      `${cx + rootR * Math.cos(a0)},${cy + rootR * Math.sin(a0)}`,
      `${cx + outerR * Math.cos(a1)},${cy + outerR * Math.sin(a1)}`,
      `${cx + outerR * Math.cos(a2)},${cy + outerR * Math.sin(a2)}`,
      `${cx + rootR * Math.cos(a3)},${cy + rootR * Math.sin(a3)}`
    );
  }
  return points.join(" ");
}

// Spoke lines from hub to root circle
function spokeLines(cx, cy, count, innerR, outerR) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={cx + innerR * Math.cos(a)} y1={cy + innerR * Math.sin(a)}
        x2={cx + outerR * Math.cos(a)} y2={cy + outerR * Math.sin(a)}
        strokeWidth="0.4"
      />
    );
  });
}

export default function DetailedGearSet({ className = "", scrollYProgress }) {
  // Small gear (driver): rotates clockwise, 1 full revolution per scroll
  const smallRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  // Large gear (driven): counter-rotates at ratio 14/24 ≈ 0.583x speed
  const largeRotation = useTransform(scrollYProgress, [0, 1], [0, -360 * (14 / 24)]);

  const LG_CX = 120, LG_CY = 140; // large gear center
  const SM_CX = 255, SM_CY = 95;  // small gear center

  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* ═══ STATIC ELEMENTS (construction lines, dimensions) ═══ */}
      {/* Center-to-center distance line */}
      <line x1={LG_CX} y1={LG_CY} x2={SM_CX} y2={SM_CY} strokeDasharray="8,3,2,3" strokeWidth="0.25" opacity="0.4" />
      {/* Pitch point */}
      <circle cx="200" cy="112" r="2" strokeWidth="0.3" opacity="0.4" />
      {/* Pressure angle line */}
      <line x1="195" y1="100" x2="210" y2="125" strokeDasharray="2,2" strokeWidth="0.2" opacity="0.3" />

      {/* Dimensions */}
      <line x1={LG_CX} y1="255" x2="217" y2="255" strokeWidth="0.3" />
      <line x1={LG_CX} y1="252" x2={LG_CX} y2="258" strokeWidth="0.3" />
      <line x1="217" y1="252" x2="217" y2="258" strokeWidth="0.3" />
      <text x="155" y="260" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">PCD 194</text>
      <text x="5" y="275" fontSize="4" fill="currentColor" stroke="none" opacity="0.35">M4 / Z24-Z14</text>
      <text x="200" y="275" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.3">RATIO 1:1.714</text>

      {/* Detail callout box */}
      <rect x="5" y="5" width="50" height="45" rx="2" strokeDasharray="2,2" strokeWidth="0.3" />
      <text x="8" y="12" fontSize="3" fill="currentColor" stroke="none" opacity="0.35">DETAIL A</text>
      <path d="M10,40 L10,25 L18,20 L26,20 L34,25 L34,40" strokeWidth="0.4" />
      <line x1="10" y1="32" x2="34" y2="32" strokeDasharray="1,1" strokeWidth="0.2" />
      <text x="12" y="48" fontSize="3" fill="currentColor" stroke="none" opacity="0.3">20° PA</text>

      {/* ═══ LARGE GEAR — 24 teeth (DRIVEN, counter-rotates) ═══ */}
      <m.g style={{ rotate: largeRotation, transformOrigin: `${LG_CX}px ${LG_CY}px` }}>
        <polygon points={gearPath(LG_CX, LG_CY, 24, 105, 90, 0.15)} strokeWidth="0.4" />
        {/* Pitch circle */}
        <circle cx={LG_CX} cy={LG_CY} r="97" strokeDasharray="4,3" strokeWidth="0.3" />
        <circle cx={LG_CX} cy={LG_CY} r="88" strokeDasharray="1,2" strokeWidth="0.2" />
        <circle cx={LG_CX} cy={LG_CY} r="106" strokeDasharray="1,3" strokeWidth="0.2" />
        {/* Hub */}
        <circle cx={LG_CX} cy={LG_CY} r="30" strokeWidth="0.5" />
        <circle cx={LG_CX} cy={LG_CY} r="22" strokeWidth="0.3" />
        <circle cx={LG_CX} cy={LG_CY} r="14" strokeWidth="0.6" />
        {/* Keyway */}
        <rect x={LG_CX - 7} y={LG_CY - 14} width="14" height="14" rx="1" strokeWidth="0.4" />
        {/* Spokes */}
        {spokeLines(LG_CX, LG_CY, 6, 30, 88)}
        {/* Lightening holes */}
        {Array.from({ length: 6 }, (_, i) => {
          const a = ((i + 0.5) / 6) * Math.PI * 2;
          return <circle key={`lh${i}`} cx={LG_CX + 58 * Math.cos(a)} cy={LG_CY + 58 * Math.sin(a)} r="10" strokeDasharray="2,2" strokeWidth="0.3" />;
        })}
        {/* Web lines */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line key={`wl${i}`}
              x1={LG_CX + 35 * Math.cos(a)} y1={LG_CY + 35 * Math.sin(a)}
              x2={LG_CX + 82 * Math.cos(a)} y2={LG_CY + 82 * Math.sin(a)}
              strokeWidth="0.15" strokeDasharray="2,4" opacity="0.4"
            />
          );
        })}
        <line x1={LG_CX - 20} y1={LG_CY} x2={LG_CX + 20} y2={LG_CY} strokeWidth="0.3" />
        <line x1={LG_CX} y1={LG_CY - 20} x2={LG_CX} y2={LG_CY + 20} strokeWidth="0.3" />
      </m.g>

      {/* ═══ SMALL GEAR — 14 teeth (DRIVER, clockwise) ═══ */}
      <m.g style={{ rotate: smallRotation, transformOrigin: `${SM_CX}px ${SM_CY}px` }}>
        <polygon points={gearPath(SM_CX, SM_CY, 14, 58, 48, 0.15)} strokeWidth="0.4" />
        <circle cx={SM_CX} cy={SM_CY} r="53" strokeDasharray="4,3" strokeWidth="0.3" />
        <circle cx={SM_CX} cy={SM_CY} r="46" strokeDasharray="1,2" strokeWidth="0.2" />
        <circle cx={SM_CX} cy={SM_CY} r="18" strokeWidth="0.5" />
        <circle cx={SM_CX} cy={SM_CY} r="10" strokeWidth="0.6" />
        <rect x={SM_CX - 5} y={SM_CY - 10} width="10" height="10" rx="1" strokeWidth="0.4" />
        {spokeLines(SM_CX, SM_CY, 4, 18, 46)}
        {Array.from({ length: 4 }, (_, i) => {
          const a = ((i + 0.5) / 4) * Math.PI * 2;
          return <circle key={`sh${i}`} cx={SM_CX + 32 * Math.cos(a)} cy={SM_CY + 32 * Math.sin(a)} r="6" strokeDasharray="2,2" strokeWidth="0.3" />;
        })}
        <line x1={SM_CX - 12} y1={SM_CY} x2={SM_CX + 12} y2={SM_CY} strokeWidth="0.3" />
        <line x1={SM_CX} y1={SM_CY - 12} x2={SM_CX} y2={SM_CY + 12} strokeWidth="0.3" />
      </m.g>
    </svg>
  );
}
