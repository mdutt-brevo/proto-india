// Section-cut view of an injection moulding nozzle assembly showing
// barrel, heater bands, torpedo, and melt channel.
// Pure wireframe: thin strokes, no fill, monochrome.

export default function InjectionNozzle({ className = "" }) {
  return (
    <svg
      viewBox="0 0 240 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Barrel outer wall */}
      <rect x="10" y="20" width="160" height="60" rx="3" />

      {/* Barrel inner bore */}
      <rect x="15" y="32" width="150" height="36" rx="1" strokeDasharray="2,2" />

      {/* Heater bands — evenly spaced rings */}
      {[35, 70, 105, 140].map((x) => (
        <g key={x}>
          <line x1={x} y1="16" x2={x} y2="20" strokeWidth="0.8" />
          <line x1={x} y1="80" x2={x} y2="84" strokeWidth="0.8" />
          <rect x={x - 4} y="14" width="8" height="4" rx="1" strokeWidth="0.3" />
          <rect x={x - 4} y="82" width="8" height="4" rx="1" strokeWidth="0.3" />
        </g>
      ))}

      {/* Nozzle tip — tapered */}
      <path d="M170,28 L210,42 L210,58 L170,72" />
      <path d="M210,42 L225,47 L225,53 L210,58" />

      {/* Nozzle orifice */}
      <circle cx="228" cy="50" r="3" />

      {/* Torpedo / check ring — inside barrel */}
      <path d="M120,36 L140,45 L140,55 L120,64" strokeDasharray="2,1" />
      <line x1="140" y1="38" x2="140" y2="62" strokeWidth="0.8" />

      {/* Melt flow arrows */}
      {[50, 90, 160].map((x) => (
        <g key={x} opacity="0.4">
          <line x1={x} y1="50" x2={x + 12} y2="50" strokeWidth="0.3" />
          <polygon
            points={`${x + 12},48 ${x + 15},50 ${x + 12},52`}
            fill="currentColor"
            stroke="none"
          />
        </g>
      ))}

      {/* Section cut indicators — hatched ends */}
      <line x1="10" y1="8" x2="10" y2="14" strokeWidth="0.3" />
      <line x1="170" y1="8" x2="170" y2="14" strokeWidth="0.3" />
      <line x1="10" y1="8" x2="170" y2="8" strokeWidth="0.3" strokeDasharray="4,2" />
      <text x="80" y="7" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">A — A</text>

      {/* Dimension — barrel length */}
      <line x1="10" y1="94" x2="170" y2="94" strokeWidth="0.3" />
      <line x1="10" y1="91" x2="10" y2="97" strokeWidth="0.3" />
      <line x1="170" y1="91" x2="170" y2="97" strokeWidth="0.3" />
      <text x="78" y="98" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">160.0</text>
    </svg>
  );
}
