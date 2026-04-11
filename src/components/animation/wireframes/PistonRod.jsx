// Front-view piston with connecting rod and wrist pin.
// Technical drawing style with dimension lines and section hatching.
// Designed to oscillate vertically (pumping motion) on scroll.

export default function PistonRod({ className = "" }) {
  return (
    <svg
      viewBox="0 0 120 260"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Piston crown — top */}
      <rect x="20" y="10" width="80" height="12" rx="2" />
      {/* Ring grooves */}
      <line x1="22" y1="26" x2="98" y2="26" strokeWidth="0.3" />
      <line x1="22" y1="32" x2="98" y2="32" strokeWidth="0.3" />
      <line x1="22" y1="38" x2="98" y2="38" strokeWidth="0.3" />

      {/* Piston skirt */}
      <path d="M20,22 L20,70 Q20,75 25,75 L95,75 Q100,75 100,70 L100,22" />

      {/* Wrist pin bore */}
      <circle cx="60" cy="58" r="8" />
      <line x1="52" y1="58" x2="68" y2="58" strokeWidth="0.3" />
      <line x1="60" y1="50" x2="60" y2="66" strokeWidth="0.3" />

      {/* Connecting rod — I-beam section */}
      <path d="M52,66 L48,80 L48,185 L42,190 L42,200" />
      <path d="M68,66 L72,80 L72,185 L78,190 L78,200" />
      {/* Web between flanges */}
      <line x1="55" y1="85" x2="65" y2="85" strokeWidth="0.3" strokeDasharray="1,1" />
      <line x1="55" y1="120" x2="65" y2="120" strokeWidth="0.3" strokeDasharray="1,1" />
      <line x1="55" y1="155" x2="65" y2="155" strokeWidth="0.3" strokeDasharray="1,1" />

      {/* Big end — crank bore */}
      <ellipse cx="60" cy="220" rx="25" ry="22" />
      <ellipse cx="60" cy="220" rx="14" ry="12" />
      {/* Bolt holes */}
      <circle cx="40" cy="205" r="3" />
      <circle cx="80" cy="205" r="3" />
      {/* Cap split line */}
      <line x1="35" y1="220" x2="85" y2="220" strokeDasharray="3,2" strokeWidth="0.3" />

      {/* Dimension — rod length */}
      <line x1="110" y1="58" x2="110" y2="220" strokeWidth="0.3" />
      <line x1="107" y1="58" x2="113" y2="58" strokeWidth="0.3" />
      <line x1="107" y1="220" x2="113" y2="220" strokeWidth="0.3" />
      <text x="106" y="145" fontSize="4" fill="currentColor" stroke="none" opacity="0.4" transform="rotate(-90,106,145)">162.0</text>

      {/* Dimension — bore */}
      <line x1="20" y1="3" x2="100" y2="3" strokeWidth="0.3" />
      <line x1="20" y1="0" x2="20" y2="6" strokeWidth="0.3" />
      <line x1="100" y1="0" x2="100" y2="6" strokeWidth="0.3" />
      <text x="50" y="2" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">80.0</text>
    </svg>
  );
}
