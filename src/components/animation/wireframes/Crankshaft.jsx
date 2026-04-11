// Side-view crankshaft showing journals, throws, counterweights,
// and oil passages. Technical drawing with hidden lines.

export default function Crankshaft({ className = "" }) {
  return (
    <svg
      viewBox="0 0 280 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Main journal 1 */}
      <ellipse cx="20" cy="60" rx="10" ry="18" />
      <line x1="20" y1="42" x2="45" y2="42" />
      <line x1="20" y1="78" x2="45" y2="78" />

      {/* Web/cheek 1 */}
      <rect x="45" y="38" width="12" height="44" rx="2" />

      {/* Crank pin 1 — offset upward */}
      <ellipse cx="70" cy="30" rx="8" ry="14" strokeDasharray="2,1" />
      <line x1="57" y1="20" x2="83" y2="20" />
      <line x1="57" y1="40" x2="70" y2="40" />

      {/* Counterweight 1 */}
      <path d="M57,78 Q57,100 70,100 Q83,100 83,78" />
      {/* Hatching for counterweight */}
      {[82, 86, 90, 94, 98].map((y) => (
        <line key={y} x1="60" y1={y} x2="80" y2={y - 4} strokeWidth="0.2" opacity="0.3" />
      ))}

      {/* Web/cheek 2 */}
      <rect x="83" y="38" width="12" height="44" rx="2" />

      {/* Main journal 2 */}
      <line x1="95" y1="42" x2="120" y2="42" />
      <line x1="95" y1="78" x2="120" y2="78" />
      <ellipse cx="108" cy="60" rx="6" ry="18" strokeDasharray="2,2" strokeWidth="0.3" />

      {/* Web/cheek 3 */}
      <rect x="120" y="38" width="12" height="44" rx="2" />

      {/* Crank pin 2 — offset downward (opposite throw) */}
      <ellipse cx="145" cy="90" rx="8" ry="14" strokeDasharray="2,1" />
      <line x1="132" y1="80" x2="145" y2="80" />
      <line x1="132" y1="100" x2="158" y2="100" />

      {/* Counterweight 2 — top */}
      <path d="M132,38 Q132,16 145,16 Q158,16 158,38" />

      {/* Web/cheek 4 */}
      <rect x="158" y="38" width="12" height="44" rx="2" />

      {/* Main journal 3 */}
      <line x1="170" y1="42" x2="195" y2="42" />
      <line x1="170" y1="78" x2="195" y2="78" />

      {/* Flywheel flange end */}
      <ellipse cx="210" cy="60" rx="12" ry="24" />
      <line x1="195" y1="36" x2="210" y2="36" />
      <line x1="195" y1="84" x2="210" y2="84" />
      <circle cx="210" cy="60" r="8" strokeDasharray="1.5,1.5" />
      {/* Bolt holes on flange */}
      <circle cx="210" cy="42" r="2" />
      <circle cx="210" cy="78" r="2" />
      <circle cx="224" cy="60" r="2" />
      <circle cx="196" cy="60" r="2" />

      {/* Oil passage — dashed through journal */}
      <line x1="20" y1="60" x2="70" y2="30" strokeDasharray="1.5,2" strokeWidth="0.3" opacity="0.4" />
      <line x1="108" y1="60" x2="145" y2="90" strokeDasharray="1.5,2" strokeWidth="0.3" opacity="0.4" />

      {/* Center line */}
      <line x1="0" y1="60" x2="230" y2="60" strokeDasharray="8,3,2,3" strokeWidth="0.2" opacity="0.3" />

      {/* Dimension — overall length */}
      <line x1="10" y1="115" x2="222" y2="115" strokeWidth="0.3" />
      <line x1="10" y1="112" x2="10" y2="118" strokeWidth="0.3" />
      <line x1="222" y1="112" x2="222" y2="118" strokeWidth="0.3" />
      <text x="100" y="113" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">212.0</text>
    </svg>
  );
}
