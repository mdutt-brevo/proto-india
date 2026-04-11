// Front-view gear/cog with tooth geometry, pitch circle, bore, and keyway.
// Rotated slightly for visual interest via parent CSS transform.
// Pure wireframe: thin strokes, no fill, monochrome.

export default function GearProfile({ className = "" }) {
  // Generate gear tooth points around a circle
  const teeth = 12;
  const outerR = 70;
  const innerR = 58;
  const cx = 80;
  const cy = 80;

  const toothPath = Array.from({ length: teeth }, (_, i) => {
    const angle1 = (i / teeth) * Math.PI * 2;
    const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const angle3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const angle4 = ((i + 0.8) / teeth) * Math.PI * 2;

    return [
      `${cx + innerR * Math.cos(angle1)},${cy + innerR * Math.sin(angle1)}`,
      `${cx + outerR * Math.cos(angle2)},${cy + outerR * Math.sin(angle2)}`,
      `${cx + outerR * Math.cos(angle3)},${cy + outerR * Math.sin(angle3)}`,
      `${cx + innerR * Math.cos(angle4)},${cy + innerR * Math.sin(angle4)}`,
    ].join(" ");
  }).join(" ");

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Gear tooth profile */}
      <polygon points={toothPath} />

      {/* Pitch circle — dashed */}
      <circle cx={cx} cy={cy} r="64" strokeDasharray="3,3" strokeWidth="0.3" />

      {/* Root circle */}
      <circle cx={cx} cy={cy} r={innerR} strokeWidth="0.3" strokeDasharray="1,2" />

      {/* Center bore */}
      <circle cx={cx} cy={cy} r="14" />

      {/* Keyway */}
      <rect x="74" y="66" width="12" height="14" rx="1" />

      {/* Center crosshair */}
      <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} strokeWidth="0.3" />
      <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} strokeWidth="0.3" />

      {/* Dimension — pitch diameter */}
      <line x1="10" y1={cy} x2="16" y2={cy} strokeWidth="0.3" />
      <line x1="144" y1={cy} x2="150" y2={cy} strokeWidth="0.3" />
      <line x1="16" y1={cy} x2="16" y2="20" strokeWidth="0.3" strokeDasharray="1,2" />
      <text x="5" y="18" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">PCD 128</text>

      {/* Module annotation */}
      <text x="110" y="150" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">M2.5 Z12</text>
    </svg>
  );
}
