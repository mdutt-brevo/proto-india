// Isometric cross-section of a mould cavity + core — two halves with
// internal cavity profile, parting line, and cooling channels.
// Pure wireframe: thin strokes, no fill, monochrome.

export default function MouldCavity({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Outer mould block — top half (cavity) */}
      <rect x="30" y="10" width="140" height="70" rx="2" />
      {/* Inner cavity profile — curved pocket */}
      <path d="M60,80 Q70,40 100,35 Q130,40 140,80" />
      {/* Cavity detail — step feature */}
      <path d="M75,80 L75,55 Q100,45 125,55 L125,80" strokeDasharray="2,2" />

      {/* Parting line */}
      <line x1="20" y1="80" x2="180" y2="80" strokeWidth="0.8" strokeDasharray="4,3" />
      <text x="182" y="83" fontSize="5" fill="currentColor" stroke="none" opacity="0.5">PL</text>

      {/* Outer mould block — bottom half (core) */}
      <rect x="30" y="80" width="140" height="70" rx="2" />
      {/* Core insert profile */}
      <path d="M65,80 L65,110 Q100,125 135,110 L135,80" />
      {/* Core detail */}
      <path d="M80,80 L80,100 Q100,112 120,100 L120,80" strokeDasharray="2,2" />

      {/* Cooling channels — dashed circles */}
      <circle cx="50" cy="45" r="6" strokeDasharray="1.5,1.5" />
      <circle cx="150" cy="45" r="6" strokeDasharray="1.5,1.5" />
      <circle cx="50" cy="115" r="6" strokeDasharray="1.5,1.5" />
      <circle cx="150" cy="115" r="6" strokeDasharray="1.5,1.5" />

      {/* Sprue channel — center top */}
      <line x1="100" y1="0" x2="100" y2="35" strokeDasharray="3,2" />
      <polygon points="96,35 104,35 100,40" strokeWidth="0.3" />

      {/* Ejector pins — bottom */}
      <line x1="85" y1="150" x2="85" y2="125" />
      <line x1="115" y1="150" x2="115" y2="125" />
      <circle cx="85" cy="152" r="2" />
      <circle cx="115" cy="152" r="2" />

      {/* Dimension line — width */}
      <line x1="30" y1="170" x2="170" y2="170" strokeWidth="0.3" />
      <line x1="30" y1="167" x2="30" y2="173" strokeWidth="0.3" />
      <line x1="170" y1="167" x2="170" y2="173" strokeWidth="0.3" />
      <text x="88" y="175" fontSize="4.5" fill="currentColor" stroke="none" opacity="0.4">140.0</text>
    </svg>
  );
}
