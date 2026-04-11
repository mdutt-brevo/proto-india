// Engine block cross-section — cylinder bore, head gasket, valves,
// combustion chamber, coolant passages, and head bolts. Dense technical
// drawing with section hatching and hidden lines throughout.

export default function EngineCrossSection({ className = "" }) {
  return (
    <svg
      viewBox="0 0 260 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* ═══ CYLINDER BLOCK ═══ */}
      {/* Outer block wall — left */}
      <line x1="20" y1="100" x2="20" y2="310" strokeWidth="0.6" />
      {/* Outer block wall — right */}
      <line x1="240" y1="100" x2="240" y2="310" strokeWidth="0.6" />
      {/* Block bottom */}
      <line x1="20" y1="310" x2="240" y2="310" strokeWidth="0.6" />

      {/* Cylinder bore — left */}
      <line x1="50" y1="100" x2="50" y2="295" strokeWidth="0.5" />
      {/* Cylinder bore — right */}
      <line x1="210" y1="100" x2="210" y2="295" strokeWidth="0.5" />

      {/* Cylinder liner — thin lines */}
      <line x1="55" y1="102" x2="55" y2="290" strokeDasharray="2,2" strokeWidth="0.2" />
      <line x1="205" y1="102" x2="205" y2="290" strokeDasharray="2,2" strokeWidth="0.2" />

      {/* Block wall hatching — left */}
      {Array.from({ length: 35 }, (_, i) => (
        <line key={`bl${i}`} x1="22" y1={105 + i * 6} x2="48" y2={102 + i * 6} strokeWidth="0.12" opacity="0.25" />
      ))}
      {/* Block wall hatching — right */}
      {Array.from({ length: 35 }, (_, i) => (
        <line key={`br${i}`} x1="212" y1={105 + i * 6} x2="238" y2={102 + i * 6} strokeWidth="0.12" opacity="0.25" />
      ))}

      {/* Coolant passages — circles in block walls */}
      <circle cx="35" cy="130" r="6" strokeDasharray="1.5,1.5" strokeWidth="0.3" />
      <circle cx="35" cy="180" r="6" strokeDasharray="1.5,1.5" strokeWidth="0.3" />
      <circle cx="35" cy="230" r="6" strokeDasharray="1.5,1.5" strokeWidth="0.3" />
      <circle cx="225" cy="155" r="6" strokeDasharray="1.5,1.5" strokeWidth="0.3" />
      <circle cx="225" cy="205" r="6" strokeDasharray="1.5,1.5" strokeWidth="0.3" />

      {/* ═══ CYLINDER HEAD ═══ */}
      {/* Head deck surface */}
      <line x1="15" y1="100" x2="245" y2="100" strokeWidth="0.7" />
      {/* Head gasket */}
      <rect x="15" y="95" width="230" height="5" rx="0" strokeWidth="0.3" />
      {/* Gasket hatching */}
      {Array.from({ length: 23 }, (_, i) => (
        <line key={`g${i}`} x1={17 + i * 10} y1="95" x2={22 + i * 10} y2="100" strokeWidth="0.1" opacity="0.3" />
      ))}

      {/* Head casting */}
      <line x1="15" y1="95" x2="15" y2="20" strokeWidth="0.6" />
      <line x1="245" y1="95" x2="245" y2="20" strokeWidth="0.6" />
      <line x1="15" y1="20" x2="245" y2="20" strokeWidth="0.6" />

      {/* Combustion chamber — domed */}
      <path d="M50,95 Q80,75 130,70 Q180,75 210,95" strokeWidth="0.5" />

      {/* ═══ VALVES ═══ */}
      {/* Intake valve — left */}
      <line x1="85" y1="15" x2="85" y2="78" strokeWidth="0.4" />
      <path d="M75,78 L85,85 L95,78" strokeWidth="0.5" />
      {/* Valve seat */}
      <path d="M72,82 L78,78" strokeWidth="0.3" />
      <path d="M92,78 L98,82" strokeWidth="0.3" />
      {/* Valve spring */}
      <path d="M78,15 L92,12 L78,9 L92,6 L78,3" strokeWidth="0.3" />
      {/* Valve guide */}
      <rect x="82" y="30" width="6" height="35" rx="0.5" strokeDasharray="2,2" strokeWidth="0.2" />
      {/* Valve seal */}
      <rect x="80" y="28" width="10" height="4" rx="1" strokeWidth="0.2" />

      {/* Exhaust valve — right */}
      <line x1="175" y1="15" x2="175" y2="78" strokeWidth="0.4" />
      <path d="M165,78 L175,85 L185,78" strokeWidth="0.5" />
      <path d="M162,82 L168,78" strokeWidth="0.3" />
      <path d="M182,78 L188,82" strokeWidth="0.3" />
      {/* Spring */}
      <path d="M168,15 L182,12 L168,9 L182,6 L168,3" strokeWidth="0.3" />
      {/* Guide */}
      <rect x="172" y="30" width="6" height="35" rx="0.5" strokeDasharray="2,2" strokeWidth="0.2" />

      {/* ═══ INTAKE/EXHAUST PORTS ═══ */}
      {/* Intake port — curves left */}
      <path d="M85,28 Q60,25 40,35 Q25,45 20,60" strokeDasharray="2,2" strokeWidth="0.3" />
      <path d="M85,32 Q65,30 48,38 Q30,48 25,63" strokeDasharray="2,2" strokeWidth="0.3" />
      {/* Exhaust port — curves right */}
      <path d="M175,28 Q200,25 220,35 Q235,45 240,60" strokeDasharray="2,2" strokeWidth="0.3" />
      <path d="M175,32 Q195,30 215,38 Q232,48 236,63" strokeDasharray="2,2" strokeWidth="0.3" />

      {/* Head bolts */}
      {[30, 130, 230].map((x) => (
        <g key={`hb${x}`}>
          <circle cx={x} cy="55" r="5" strokeWidth="0.4" />
          <line x1={x - 2} y1="55" x2={x + 2} y2="55" strokeWidth="0.2" />
          <line x1={x} y1="53" x2={x} y2="57" strokeWidth="0.2" />
          {/* Bolt shank extending down */}
          <line x1={x} y1="60" x2={x} y2="100" strokeDasharray="2,3" strokeWidth="0.2" />
        </g>
      ))}

      {/* Head hatching */}
      {Array.from({ length: 18 }, (_, i) => (
        <line key={`hh${i}`} x1="17" y1={22 + i * 4} x2="48" y2={20 + i * 4} strokeWidth="0.1" opacity="0.2" />
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <line key={`hhr${i}`} x1="212" y1={22 + i * 4} x2="243" y2={20 + i * 4} strokeWidth="0.1" opacity="0.2" />
      ))}

      {/* ═══ PISTON (in bore) ═══ */}
      {/* Crown */}
      <rect x="55" y="200" width="150" height="10" rx="2" strokeWidth="0.4" />
      {/* Ring grooves */}
      <line x1="53" y1="215" x2="55" y2="215" strokeWidth="0.3" />
      <line x1="53" y1="222" x2="55" y2="222" strokeWidth="0.3" />
      <line x1="53" y1="229" x2="55" y2="229" strokeWidth="0.3" />
      <line x1="207" y1="215" x2="209" y2="215" strokeWidth="0.3" />
      <line x1="207" y1="222" x2="209" y2="222" strokeWidth="0.3" />
      <line x1="207" y1="229" x2="209" y2="229" strokeWidth="0.3" />
      {/* Skirt */}
      <line x1="55" y1="210" x2="55" y2="260" strokeWidth="0.4" />
      <line x1="205" y1="210" x2="205" y2="260" strokeWidth="0.4" />
      {/* Gudgeon pin */}
      <circle cx="130" cy="245" r="10" strokeWidth="0.4" />
      <circle cx="130" cy="245" r="6" strokeDasharray="1,1" strokeWidth="0.2" />

      {/* Connecting rod stub */}
      <line x1="120" y1="255" x2="115" y2="295" strokeWidth="0.4" />
      <line x1="140" y1="255" x2="145" y2="295" strokeWidth="0.4" />

      {/* ═══ ANNOTATIONS ═══ */}
      {/* Bore dimension */}
      <line x1="50" y1="150" x2="210" y2="150" strokeWidth="0.3" opacity="0.4" />
      <text x="115" y="148" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">{"∅92.0"}</text>

      {/* Center line */}
      <line x1="130" y1="5" x2="130" y2="300" strokeDasharray="8,3,2,3" strokeWidth="0.2" opacity="0.25" />

      {/* Section label */}
      <text x="5" y="315" fontSize="4" fill="currentColor" stroke="none" opacity="0.3">SEC C-C</text>
      <text x="170" y="315" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.3">1-CYL ASSY</text>
    </svg>
  );
}
