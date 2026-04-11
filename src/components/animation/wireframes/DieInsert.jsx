// Exploded isometric view of a die insert assembly — core pin,
// insert block, retainer plate, and alignment dowels shown separated.
// Pure wireframe: thin strokes, no fill, monochrome.

export default function DieInsert({ className = "" }) {
  return (
    <svg
      viewBox="0 0 180 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* === Top: Core pin === */}
      <g>
        {/* Pin shaft */}
        <rect x="75" y="10" width="30" height="45" rx="1" />
        {/* Pin tip — tapered */}
        <path d="M75,10 L82,2 L98,2 L105,10" />
        {/* Cooling channel inside pin — dashed */}
        <line x1="90" y1="5" x2="90" y2="50" strokeDasharray="2,2" strokeWidth="0.3" />
        {/* Head flange */}
        <rect x="70" y="55" width="40" height="8" rx="1" />
      </g>

      {/* Explode gap indicator — dashed leader */}
      <line x1="90" y1="63" x2="90" y2="78" strokeDasharray="1.5,1.5" strokeWidth="0.3" />

      {/* === Middle: Insert block === */}
      <g>
        {/* Block body — isometric */}
        <rect x="45" y="80" width="90" height="55" rx="2" />
        {/* Cavity pocket */}
        <path d="M60,80 L60,105 Q90,120 120,105 L120,80" strokeDasharray="2,1" />
        {/* Pin bore — where core pin seats */}
        <rect x="82" y="80" width="16" height="30" rx="1" strokeDasharray="1.5,1.5" />
        {/* Cooling circuit */}
        <path d="M50,100 L65,100 L65,115 L115,115 L115,100 L130,100" strokeDasharray="2,2" strokeWidth="0.3" />
        {/* Dowel holes */}
        <circle cx="55" cy="90" r="3" />
        <circle cx="125" cy="90" r="3" />
      </g>

      {/* Explode gap indicator */}
      <line x1="90" y1="135" x2="90" y2="150" strokeDasharray="1.5,1.5" strokeWidth="0.3" />

      {/* === Bottom: Retainer plate === */}
      <g>
        {/* Plate */}
        <rect x="35" y="155" width="110" height="20" rx="2" />
        {/* Bolt holes */}
        <circle cx="55" cy="165" r="4" />
        <circle cx="125" cy="165" r="4" />
        {/* Cross pattern in bolt holes */}
        <line x1="53" y1="165" x2="57" y2="165" strokeWidth="0.3" />
        <line x1="55" y1="163" x2="55" y2="167" strokeWidth="0.3" />
        <line x1="123" y1="165" x2="127" y2="165" strokeWidth="0.3" />
        <line x1="125" y1="163" x2="125" y2="167" strokeWidth="0.3" />
        {/* Alignment dowel positions — dashed */}
        <circle cx="55" cy="165" r="6" strokeDasharray="1,1.5" strokeWidth="0.3" />
        <circle cx="125" cy="165" r="6" strokeDasharray="1,1.5" strokeWidth="0.3" />
      </g>

      {/* Assembly line — vertical center */}
      <line x1="90" y1="0" x2="90" y2="220" strokeWidth="0.15" strokeDasharray="6,4" opacity="0.3" />

      {/* Part labels */}
      <text x="112" y="8" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">CORE PIN</text>
      <text x="140" y="108" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">INSERT</text>
      <text x="150" y="165" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.35">PLATE</text>

      {/* BOM callout */}
      <text x="5" y="215" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.3">DI-2400 REV.B</text>
    </svg>
  );
}
