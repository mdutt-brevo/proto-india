// Top-down view of a sprue + runner + gate system layout.
// Shows the flow path from sprue bushing to four cavity gates.
// Pure wireframe: thin strokes, no fill, monochrome.

export default function SprueSystem({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Mould plate outline */}
      <rect x="10" y="10" width="180" height="180" rx="3" />

      {/* Center sprue bushing */}
      <circle cx="100" cy="100" r="8" />
      <circle cx="100" cy="100" r="4" />
      <line x1="96" y1="100" x2="104" y2="100" strokeWidth="0.3" />
      <line x1="100" y1="96" x2="100" y2="104" strokeWidth="0.3" />

      {/* Primary runners — cross pattern to four cavities */}
      {/* Top runner */}
      <line x1="100" y1="92" x2="100" y2="50" strokeWidth="0.8" />
      {/* Bottom runner */}
      <line x1="100" y1="108" x2="100" y2="150" strokeWidth="0.8" />
      {/* Left runner */}
      <line x1="92" y1="100" x2="50" y2="100" strokeWidth="0.8" />
      {/* Right runner */}
      <line x1="108" y1="100" x2="150" y2="100" strokeWidth="0.8" />

      {/* Sub-runners — angled to cavities */}
      <line x1="50" y1="100" x2="35" y2="55" strokeWidth="0.5" />
      <line x1="50" y1="100" x2="35" y2="145" strokeWidth="0.5" />
      <line x1="150" y1="100" x2="165" y2="55" strokeWidth="0.5" />
      <line x1="150" y1="100" x2="165" y2="145" strokeWidth="0.5" />

      {/* Gate symbols — small triangles at runner ends */}
      {[
        [100, 50, 0], [100, 150, 180],
        [35, 55, -30], [35, 145, 30],
        [165, 55, 30], [165, 145, -30],
      ].map(([gx, gy, rot], i) => (
        <g key={i} transform={`translate(${gx},${gy}) rotate(${rot})`}>
          <polygon points="-3,-3 3,-3 0,3" strokeWidth="0.4" />
        </g>
      ))}

      {/* Cavity outlines — four rectangular pockets */}
      <rect x="80" y="25" width="40" height="20" rx="2" strokeDasharray="2,2" />
      <rect x="80" y="155" width="40" height="20" rx="2" strokeDasharray="2,2" />
      <rect x="18" y="35" width="30" height="30" rx="2" strokeDasharray="2,2" />
      <rect x="18" y="135" width="30" height="30" rx="2" strokeDasharray="2,2" />
      <rect x="152" y="35" width="30" height="30" rx="2" strokeDasharray="2,2" />
      <rect x="152" y="135" width="30" height="30" rx="2" strokeDasharray="2,2" />

      {/* Flow direction arrows on runners */}
      {[
        [100, 70, -90], [100, 130, 90],
        [70, 100, 180], [130, 100, 0],
      ].map(([ax, ay, rot], i) => (
        <g key={`arrow-${i}`} transform={`translate(${ax},${ay}) rotate(${rot})`} opacity="0.4">
          <polygon points="0,-2 5,0 0,2" fill="currentColor" stroke="none" />
        </g>
      ))}

      {/* Runner balance annotation */}
      <text x="110" y="75" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">R4.0</text>
      <text x="120" y="102" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">R4.0</text>

      {/* Title block corner */}
      <line x1="140" y1="192" x2="192" y2="192" strokeWidth="0.3" opacity="0.3" />
      <line x1="140" y1="192" x2="140" y2="200" strokeWidth="0.3" opacity="0.3" />
      <text x="142" y="198" fontSize="3" fill="currentColor" stroke="none" opacity="0.3">RUNNER LAYOUT 4-CAV</text>
    </svg>
  );
}
