// src/components/animation/InjectionMoldingStatic.jsx
// No motion imports — this component is intentionally animation-free.
// Rendered exclusively when useReducedMotion() returns true (see InjectionMoldingLoop).
// COLOR constants keep visual consistency with animated scenes in Phases 3-4.

import { COLOR } from "../../lib/motionTokens";

export default function InjectionMoldingStatic() {
  return (
    <div
      className="w-full aspect-video flex items-center justify-center"
      role="img"
      aria-label="Finished injection-moulded plastic part"
    >
      <svg
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-full h-full"
      >
        {/* Dark background matching baseBg token */}
        <rect width="400" height="300" fill={COLOR.baseBg} />

        {/* Mould outline — two halves closed, representing the completed process */}
        <rect x="80" y="60" width="240" height="20" rx="3"
          fill={COLOR.surfacePrimary} opacity="0.6" />
        <rect x="80" y="220" width="240" height="20" rx="3"
          fill={COLOR.surfacePrimary} opacity="0.6" />

        {/* Finished part body */}
        <rect x="120" y="80" width="160" height="140" rx="8"
          fill="none" stroke={COLOR.surfacePrimary} strokeWidth="2" />

        {/* Internal rib detail lines — injection moulded parts have structural ribs */}
        <line x1="140" y1="110" x2="260" y2="110"
          stroke={COLOR.textMuted} strokeWidth="1" />
        <line x1="140" y1="140" x2="260" y2="140"
          stroke={COLOR.textMuted} strokeWidth="1" />
        <line x1="140" y1="170" x2="260" y2="170"
          stroke={COLOR.textMuted} strokeWidth="1" />

        {/* Gate mark — the small bump where plastic entered the mould */}
        <circle cx="200" cy="80" r="4"
          fill={COLOR.accentOrange} opacity="0.8" />

        {/* Orange accent edge highlight — brand identity stripe */}
        <rect x="120" y="80" width="8" height="140" rx="4"
          fill={COLOR.accentOrange} opacity="0.5" />

        {/* Brand tagline — matches HER-07 Scene 7 copy */}
        <text
          x="200" y="260"
          textAnchor="middle"
          fill={COLOR.textMuted}
          fontSize="11"
          fontFamily="monospace"
          letterSpacing="0.05em"
        >
          Precision in Every Moulded Part
        </text>
      </svg>
    </div>
  );
}
