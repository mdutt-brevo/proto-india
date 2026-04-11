// Section view of a spring-loaded valve assembly — valve seat,
// stem, spring, retainer, and housing. Drawn in technical cross-section
// style with section hatching.

export default function SpringValve({ className = "" }) {
  return (
    <svg
      viewBox="0 0 100 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Valve housing — outer */}
      <rect x="15" y="10" width="70" height="200" rx="3" />
      {/* Housing bore */}
      <rect x="25" y="15" width="50" height="190" rx="2" strokeDasharray="2,2" />

      {/* Valve seat — bottom */}
      <path d="M30,185 L42,175 L58,175 L70,185" strokeWidth="0.6" />
      <line x1="30" y1="190" x2="70" y2="190" />
      {/* Seat angle hatching */}
      {[177, 179, 181, 183].map((y) => (
        <line key={y} x1="35" y1={y} x2="42" y2={y - 2} strokeWidth="0.2" opacity="0.3" />
      ))}
      {[177, 179, 181, 183].map((y) => (
        <line key={`r${y}`} x1="58" y1={y - 2} x2="65" y2={y} strokeWidth="0.2" opacity="0.3" />
      ))}

      {/* Valve disc */}
      <ellipse cx="50" cy="172" rx="14" ry="4" strokeWidth="0.6" />

      {/* Valve stem */}
      <rect x="47" y="70" width="6" height="102" rx="0.5" />

      {/* Spring retainer — top plate */}
      <rect x="32" y="62" width="36" height="8" rx="2" />

      {/* Coil spring */}
      <path d="M35,62 L65,56 L35,50 L65,44 L35,38 L65,32 L35,26" strokeWidth="0.6" />

      {/* Upper retainer / spring seat */}
      <rect x="30" y="18" width="40" height="8" rx="2" />

      {/* Keeper / collet */}
      <path d="M45,62 L45,70" strokeWidth="0.8" />
      <path d="M55,62 L55,70" strokeWidth="0.8" />

      {/* Stem seal */}
      <rect x="44" y="26" width="12" height="4" rx="1" strokeDasharray="1,1" />

      {/* Flow arrows */}
      <g opacity="0.3">
        <line x1="50" y1="210" x2="50" y2="195" strokeWidth="0.3" />
        <polygon points="48,195 52,195 50,191" fill="currentColor" stroke="none" />
      </g>

      {/* Section line markers */}
      <text x="2" y="110" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">B</text>
      <text x="90" y="110" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">B</text>
      <line x1="7" y1="112" x2="15" y2="112" strokeWidth="0.3" opacity="0.4" />
      <line x1="85" y1="112" x2="93" y2="112" strokeWidth="0.3" opacity="0.4" />

      {/* Part number */}
      <text x="20" y="218" fontSize="3" fill="currentColor" stroke="none" opacity="0.3">VLV-SS-016</text>
    </svg>
  );
}
