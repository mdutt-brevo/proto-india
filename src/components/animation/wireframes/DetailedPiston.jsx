// Detailed piston with connecting rod — mechanically accurate animation.
// The piston HEAD reciprocates up/down (simulating stroke).
// The connecting rod PIVOTS at the small end (wrist pin) as the piston moves.
// The big end stays relatively fixed (attached to crank journal off-screen).
//
// Motion: scroll drives crank angle → piston Y follows sin curve →
//         rod angle follows arcsin of offset.

import { m, useTransform } from "motion/react";

export default function DetailedPiston({ className = "", scrollYProgress }) {
  // Piston stroke: reciprocates ±30px over 3 cycles during full page scroll
  const pistonY = useTransform(
    scrollYProgress,
    [0, 0.083, 0.167, 0.25, 0.333, 0.417, 0.5, 0.583, 0.667, 0.75, 0.833, 0.917, 1],
    [0, -30, 0, 30, 0, -30, 0, 30, 0, -30, 0, 30, 0]
  );

  // Connecting rod slight angular rock (±4°) — rod pivots at wrist pin
  const rodRotation = useTransform(
    scrollYProgress,
    [0, 0.083, 0.167, 0.25, 0.333, 0.417, 0.5, 0.583, 0.667, 0.75, 0.833, 0.917, 1],
    [0, -4, 0, 4, 0, -4, 0, 4, 0, -4, 0, 4, 0]
  );

  return (
    <svg
      viewBox="0 0 200 380"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* ═══ STATIC: Dimensions and annotations ═══ */}
      {/* Bore dimension */}
      <line x1="35" y1="2" x2="165" y2="2" strokeWidth="0.3" />
      <line x1="35" y1="0" x2="35" y2="5" strokeWidth="0.3" />
      <line x1="165" y1="0" x2="165" y2="5" strokeWidth="0.3" />
      <text x="88" y="1" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">{"∅86.0"}</text>

      {/* Rod length dimension */}
      <line x1="185" y1="95" x2="185" y2="320" strokeWidth="0.3" />
      <line x1="182" y1="95" x2="188" y2="95" strokeWidth="0.3" />
      <line x1="182" y1="320" x2="188" y2="320" strokeWidth="0.3" />
      <text x="180" y="210" fontSize="4" fill="currentColor" stroke="none" opacity="0.4" transform="rotate(-90,180,210)">C-C 225.0</text>

      {/* Pin bore */}
      <text x="125" y="92" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">{"∅28H7"}</text>
      {/* Big end bore */}
      <text x="105" y="365" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">{"∅52H6"}</text>
      {/* Section label */}
      <text x="5" y="375" fontSize="4" fill="currentColor" stroke="none" opacity="0.3">SEC A-A</text>
      <line x1="30" y1="372" x2="50" y2="372" strokeWidth="0.3" opacity="0.3" />
      {/* Center line */}
      <line x1="100" y1="5" x2="100" y2="355" strokeDasharray="8,3,2,3" strokeWidth="0.2" opacity="0.25" />

      {/* ═══ ANIMATED: Piston head (reciprocates up/down) ═══ */}
      <m.g style={{ y: pistonY }}>
        {/* Crown */}
        <path d="M35,20 Q40,10 100,10 Q160,10 165,20" strokeWidth="0.6" />
        {/* Combustion bowl */}
        <path d="M65,20 Q80,30 100,30 Q120,30 135,20" strokeDasharray="2,1" strokeWidth="0.3" />

        {/* Walls */}
        <line x1="35" y1="20" x2="35" y2="105" strokeWidth="0.6" />
        <line x1="165" y1="20" x2="165" y2="105" strokeWidth="0.6" />

        {/* Ring grooves — 3 compression + 1 oil */}
        {[30, 40, 50, 65].map((y, i) => (
          <g key={`ring${i}`}>
            <line x1="33" y1={y} x2="35" y2={y} strokeWidth="0.3" />
            <line x1="33" y1={y + 6} x2="35" y2={y + 6} strokeWidth="0.3" />
            <line x1="33" y1={y} x2="33" y2={y + 6} strokeWidth="0.3" />
            <rect x="31" y={y + 1} width="4" height="4" rx="0.5" strokeWidth="0.2" />
            <line x1="165" y1={y} x2="167" y2={y} strokeWidth="0.3" />
            <line x1="165" y1={y + 6} x2="167" y2={y + 6} strokeWidth="0.3" />
            <line x1="167" y1={y} x2="167" y2={y + 6} strokeWidth="0.3" />
            <rect x="165" y={y + 1} width="4" height="4" rx="0.5" strokeWidth="0.2" />
          </g>
        ))}
        {/* Oil drain holes */}
        <circle cx="40" cy="68" r="1.5" strokeWidth="0.2" />
        <circle cx="160" cy="68" r="1.5" strokeWidth="0.2" />

        {/* Skirt */}
        <path d="M35,105 Q35,115 40,115 L40,125" strokeWidth="0.5" />
        <path d="M165,105 Q165,115 160,115 L160,125" strokeWidth="0.5" />

        {/* Gudgeon pin bore */}
        <circle cx="100" cy="95" r="14" strokeWidth="0.5" />
        <circle cx="100" cy="95" r="10" strokeDasharray="2,1" strokeWidth="0.3" />
        <circle cx="100" cy="95" r="12.5" strokeDasharray="0.5,3" strokeWidth="0.2" />

        {/* Section hatching — walls */}
        {Array.from({ length: 25 }, (_, i) => (
          <line key={`hl${i}`} x1="36" y1={22 + i * 3.2} x2="50" y2={20 + i * 3.2} strokeWidth="0.12" opacity="0.25" />
        ))}
        {Array.from({ length: 25 }, (_, i) => (
          <line key={`hr${i}`} x1="150" y1={22 + i * 3.2} x2="164" y2={20 + i * 3.2} strokeWidth="0.12" opacity="0.25" />
        ))}
        {/* Crown hatching */}
        {Array.from({ length: 30 }, (_, i) => (
          <line key={`hc${i}`} x1={38 + i * 4.3} y1="12" x2={40 + i * 4.3} y2="19" strokeWidth="0.1" opacity="0.2" />
        ))}
        {/* Oil gallery */}
        <path d="M50,22 Q50,16 60,16 L140,16 Q150,16 150,22" strokeDasharray="1.5,1.5" strokeWidth="0.3" />
      </m.g>

      {/* ═══ ANIMATED: Connecting rod (pivots at wrist pin) ═══ */}
      <m.g style={{ rotate: rodRotation, transformOrigin: "100px 109px" }}>
        {/* Small end transition */}
        <path d="M85,109 L80,125 L80,130" strokeWidth="0.5" />
        <path d="M115,109 L120,125 L120,130" strokeWidth="0.5" />

        {/* I-beam */}
        <line x1="80" y1="130" x2="80" y2="270" strokeWidth="0.5" />
        <line x1="120" y1="130" x2="120" y2="270" strokeWidth="0.5" />
        <rect x="78" y="130" width="44" height="5" rx="1" strokeWidth="0.3" />
        {/* Web sections */}
        {[160, 190, 220, 250].map((y) => (
          <line key={y} x1="85" y1={y} x2="115" y2={y} strokeDasharray="1,2" strokeWidth="0.15" opacity="0.3" />
        ))}

        {/* Rod bolt bosses */}
        <path d="M80,270 L72,278 L72,295" strokeWidth="0.5" />
        <path d="M120,270 L128,278 L128,295" strokeWidth="0.5" />

        {/* Big end */}
        <ellipse cx="100" cy="320" rx="38" ry="32" strokeWidth="0.5" />
        <ellipse cx="100" cy="320" rx="32" ry="26" strokeDasharray="2,1" strokeWidth="0.3" />
        <ellipse cx="100" cy="320" rx="22" ry="18" strokeWidth="0.5" />
        <circle cx="100" cy="302" r="2" strokeWidth="0.3" />
        <line x1="62" y1="320" x2="138" y2="320" strokeDasharray="4,2" strokeWidth="0.3" />
        {/* Cap bolts */}
        <circle cx="72" cy="305" r="4" strokeWidth="0.4" />
        <circle cx="128" cy="305" r="4" strokeWidth="0.4" />
        <line x1="70" y1="305" x2="74" y2="305" strokeWidth="0.2" />
        <line x1="72" y1="303" x2="72" y2="307" strokeWidth="0.2" />
        <line x1="126" y1="305" x2="130" y2="305" strokeWidth="0.2" />
        <line x1="128" y1="303" x2="128" y2="307" strokeWidth="0.2" />
        {/* Big end hatching */}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`bh${i}`} x1={65 + i * 3.5} y1="312" x2={67 + i * 3.5} y2="328" strokeWidth="0.12" opacity="0.25" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`bhr${i}`} x1={110 + i * 3.5} y1="312" x2={112 + i * 3.5} y2="328" strokeWidth="0.12" opacity="0.25" />
        ))}
      </m.g>
    </svg>
  );
}
