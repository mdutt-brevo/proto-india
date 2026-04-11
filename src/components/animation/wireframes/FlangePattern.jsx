// Top-down bolt circle / flange face pattern.
// Shows bolt holes, gasket surface, bore, and PCD annotations.
// Clean geometric pattern — works well for slow rotation.

export default function FlangePattern({ className = "" }) {
  const cx = 80;
  const cy = 80;
  const boltR = 55; // bolt circle radius
  const bolts = 8;

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Outer flange face */}
      <circle cx={cx} cy={cy} r="72" />

      {/* Raised face / gasket surface */}
      <circle cx={cx} cy={cy} r="48" strokeDasharray="2,2" />

      {/* Center bore */}
      <circle cx={cx} cy={cy} r="20" strokeWidth="0.6" />

      {/* Keyway in bore */}
      <rect x="74" y="60" width="12" height="8" rx="1" strokeWidth="0.3" />

      {/* Bolt circle — dashed */}
      <circle cx={cx} cy={cy} r={boltR} strokeDasharray="4,4" strokeWidth="0.3" />

      {/* Bolt holes */}
      {Array.from({ length: bolts }, (_, i) => {
        const angle = (i / bolts) * Math.PI * 2 - Math.PI / 2;
        const bx = cx + boltR * Math.cos(angle);
        const by = cy + boltR * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={bx} cy={by} r="5" />
            <line x1={bx - 2} y1={by} x2={bx + 2} y2={by} strokeWidth="0.2" />
            <line x1={bx} y1={by - 2} x2={bx} y2={by + 2} strokeWidth="0.2" />
          </g>
        );
      })}

      {/* Center crosshair */}
      <line x1={cx - 10} y1={cy} x2={cx + 10} y2={cy} strokeWidth="0.3" />
      <line x1={cx} y1={cy - 10} x2={cx} y2={cy + 10} strokeWidth="0.3" />

      {/* PCD dimension */}
      <line x1={cx} y1={cy} x2={cx + boltR} y2={cy} strokeWidth="0.3" strokeDasharray="1,2" opacity="0.4" />
      <text x={cx + 25} y={cy - 4} fontSize="3.5" fill="currentColor" stroke="none" opacity="0.4">PCD 110</text>

      {/* Bolt spec */}
      <text x="105" y="150" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">8x M10</text>
      <text x="5" y="155" fontSize="3" fill="currentColor" stroke="none" opacity="0.3">ANSI B16.5 CL150</text>
    </svg>
  );
}
