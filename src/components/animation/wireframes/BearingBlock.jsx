// Pillow-block bearing housing — isometric view showing
// the housing, bearing bore, bolt slots, and grease fitting.
// Technical drawing with hidden lines and dimension callouts.

export default function BearingBlock({ className = "" }) {
  return (
    <svg
      viewBox="0 0 180 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* Base plate */}
      <path d="M10,95 L50,75 L170,75 L130,95 Z" />
      <path d="M10,95 L10,105 L50,85 L50,75" />
      <path d="M130,95 L130,105 L170,85 L170,75" />
      <line x1="10" y1="105" x2="130" y2="105" />

      {/* Bolt slots — elongated holes */}
      <ellipse cx="35" cy="88" rx="8" ry="3" />
      <ellipse cx="145" cy="88" rx="8" ry="3" />
      <line x1="35" y1="85" x2="35" y2="91" strokeWidth="0.2" />
      <line x1="145" y1="85" x2="145" y2="91" strokeWidth="0.2" />

      {/* Housing body — arched top */}
      <path d="M45,75 L45,40 Q90,5 135,40 L135,75" />
      {/* Housing sides — thickness */}
      <path d="M50,75 L50,42 Q90,12 130,42 L130,75" strokeDasharray="2,2" />

      {/* Bearing bore — circle in housing */}
      <circle cx="90" cy="52" r="20" />
      <circle cx="90" cy="52" r="16" strokeDasharray="2,2" />

      {/* Shaft cross-section */}
      <circle cx="90" cy="52" r="10" />
      <line x1="80" y1="52" x2="100" y2="52" strokeWidth="0.3" />
      <line x1="90" y1="42" x2="90" y2="62" strokeWidth="0.3" />

      {/* Grease fitting — top */}
      <line x1="90" y1="32" x2="90" y2="22" strokeWidth="0.8" />
      <circle cx="90" cy="20" r="3" strokeWidth="0.5" />

      {/* Split line */}
      <line x1="45" y1="52" x2="135" y2="52" strokeDasharray="4,3" strokeWidth="0.3" />

      {/* Cap bolts */}
      <circle cx="55" cy="52" r="2.5" />
      <circle cx="125" cy="52" r="2.5" />

      {/* Dimension — bore */}
      <line x1="70" y1="130" x2="110" y2="130" strokeWidth="0.3" />
      <line x1="70" y1="127" x2="70" y2="133" strokeWidth="0.3" />
      <line x1="110" y1="127" x2="110" y2="133" strokeWidth="0.3" />
      <text x="82" y="135" fontSize="4" fill="currentColor" stroke="none" opacity="0.4">{"∅40H7"}</text>

      {/* Part number */}
      <text x="5" y="130" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.3">UCP-208</text>
    </svg>
  );
}
