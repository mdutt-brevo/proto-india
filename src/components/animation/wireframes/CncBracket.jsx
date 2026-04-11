// Isometric CNC-machined bracket with dimension lines, tolerances,
// mounting holes, and chamfer callouts.
// Pure wireframe: thin strokes, no fill, monochrome.

export default function CncBracket({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Isometric L-bracket — base plate */}
      <path d="M30,120 L90,90 L190,90 L130,120 Z" />
      {/* Base plate thickness */}
      <path d="M30,120 L30,130 L90,100 L90,90" />
      <path d="M130,120 L130,130 L190,100 L190,90" />
      <line x1="30" y1="130" x2="130" y2="130" />

      {/* Vertical plate */}
      <path d="M90,90 L90,30 L100,25 L100,85" strokeWidth="0.5" />
      <path d="M190,90 L190,30 L100,25" strokeDasharray="2,2" />
      <line x1="90" y1="30" x2="190" y2="30" />

      {/* Mounting holes — base */}
      <ellipse cx="70" cy="105" rx="6" ry="3" />
      <ellipse cx="155" cy="105" rx="6" ry="3" />

      {/* Mounting holes — vertical plate */}
      <ellipse cx="130" cy="52" rx="5" ry="6" />
      <line x1="125" y1="52" x2="135" y2="52" strokeWidth="0.2" />
      <line x1="130" y1="46" x2="130" y2="58" strokeWidth="0.2" />

      {/* Chamfer on top edge */}
      <path d="M92,32 L95,30" strokeWidth="0.3" />
      <text x="82" y="28" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.4">C2</text>

      {/* Fillet on inner corner */}
      <path d="M90,88 Q90,82 96,82" strokeWidth="0.3" strokeDasharray="1,1" />
      <text x="75" y="82" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.4">R3</text>

      {/* Dimension — base width */}
      <line x1="30" y1="145" x2="130" y2="145" strokeWidth="0.3" />
      <line x1="30" y1="142" x2="30" y2="148" strokeWidth="0.3" />
      <line x1="130" y1="142" x2="130" y2="148" strokeWidth="0.3" />
      <text x="68" y="150" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">100.0</text>

      {/* Dimension — height */}
      <line x1="200" y1="30" x2="200" y2="90" strokeWidth="0.3" />
      <line x1="197" y1="30" x2="203" y2="30" strokeWidth="0.3" />
      <line x1="197" y1="90" x2="203" y2="90" strokeWidth="0.3" />
      <text x="195" y="65" fontSize="4" fill="currentColor" stroke="none" opacity="0.4" transform="rotate(-90, 195, 65)">60.0</text>

      {/* Tolerance annotation */}
      <text x="140" y="150" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">
        {"±0.02"}
      </text>

      {/* Surface finish symbol */}
      <g transform="translate(45, 78)" opacity="0.4">
        <path d="M0,8 L4,0 L8,8" strokeWidth="0.4" fill="none" />
        <line x1="0" y1="8" x2="10" y2="8" strokeWidth="0.3" />
        <text x="12" y="9" fontSize="3.5" fill="currentColor" stroke="none">Ra 1.6</text>
      </g>
    </svg>
  );
}
