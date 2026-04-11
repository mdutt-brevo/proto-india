// Three meshed gears of different sizes — a gear reduction train.
// Wireframe style showing tooth profiles, pitch circles, and shafts.
// Designed to rotate as a group on scroll.

export default function GearTrain({ className = "" }) {
  // Generate tooth path for a gear
  function toothPath(cx, cy, teeth, outerR, innerR) {
    return Array.from({ length: teeth }, (_, i) => {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.25) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a4 = ((i + 0.75) / teeth) * Math.PI * 2;
      return [
        `${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)}`,
        `${cx + outerR * Math.cos(a2)},${cy + outerR * Math.sin(a2)}`,
        `${cx + outerR * Math.cos(a3)},${cy + outerR * Math.sin(a3)}`,
        `${cx + innerR * Math.cos(a4)},${cy + innerR * Math.sin(a4)}`,
      ].join(" ");
    }).join(" ");
  }

  return (
    <svg
      viewBox="0 0 260 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Large gear — 18 teeth */}
      <polygon points={toothPath(80, 100, 18, 72, 60)} />
      <circle cx="80" cy="100" r="66" strokeDasharray="3,3" strokeWidth="0.3" />
      <circle cx="80" cy="100" r="12" />
      <circle cx="80" cy="100" r="6" strokeDasharray="1,1" />
      <line x1="74" y1="100" x2="86" y2="100" strokeWidth="0.2" />
      <line x1="80" y1="94" x2="80" y2="106" strokeWidth="0.2" />

      {/* Medium gear — 12 teeth, meshed with large */}
      <polygon points={toothPath(185, 70, 12, 48, 40)} />
      <circle cx="185" cy="70" r="44" strokeDasharray="3,3" strokeWidth="0.3" />
      <circle cx="185" cy="70" r="8" />
      <line x1="181" y1="70" x2="189" y2="70" strokeWidth="0.2" />
      <line x1="185" y1="66" x2="185" y2="74" strokeWidth="0.2" />

      {/* Small gear — 8 teeth, meshed with medium */}
      <polygon points={toothPath(230, 140, 8, 30, 24)} />
      <circle cx="230" cy="140" r="27" strokeDasharray="3,3" strokeWidth="0.3" />
      <circle cx="230" cy="140" r="6" />

      {/* Shaft indicators */}
      <circle cx="80" cy="100" r="3" strokeWidth="0.8" />
      <circle cx="185" cy="70" r="3" strokeWidth="0.8" />
      <circle cx="230" cy="140" r="3" strokeWidth="0.8" />

      {/* Mesh lines — showing gear contact */}
      <line x1="140" y1="80" x2="148" y2="76" strokeDasharray="1,2" strokeWidth="0.3" opacity="0.5" />
      <line x1="208" y1="100" x2="215" y2="112" strokeDasharray="1,2" strokeWidth="0.3" opacity="0.5" />

      {/* Annotation */}
      <text x="60" y="195" fontSize="4" fill="currentColor" stroke="none" opacity="0.35">Z18 / Z12 / Z8</text>
    </svg>
  );
}
