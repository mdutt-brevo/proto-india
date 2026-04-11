// Cam and follower mechanism — mechanically accurate animation.
// The cam ROTATES on scroll. The follower TRANSLATES up/down based
// on where the cam lobe is — when the lobe faces the follower,
// it pushes up; when the base circle faces it, spring pulls down.

import { m, useTransform } from "motion/react";

export default function CamMechanism({ className = "", scrollYProgress }) {
  // Cam rotates continuously with scroll (2 full turns per page scroll)
  const camRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);

  // Follower displacement — follows cam profile shape.
  // Maps to a rise-dwell-fall-dwell pattern per cam revolution.
  // Two cycles since cam does 2 full turns.
  const followerY = useTransform(
    scrollYProgress,
    [0, 0.08, 0.15, 0.25, 0.33, 0.5, 0.58, 0.65, 0.75, 0.83, 1],
    [0, -22,   -22,   -8,    0,    0,   -22,  -22,  -8,    0,   0]
  );

  return (
    <svg
      viewBox="0 0 140 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={className}
      aria-hidden="true"
    >
      {/* ═══ STATIC: Guide housing + spring seat ═══ */}
      <rect x="58" y="15" width="24" height="30" rx="2" />
      <rect x="62" y="18" width="16" height="24" rx="1" strokeDasharray="2,2" />

      {/* Dimension — lift */}
      <line x1="125" y1="60" x2="125" y2="140" strokeWidth="0.3" />
      <line x1="122" y1="60" x2="128" y2="60" strokeWidth="0.3" />
      <line x1="122" y1="140" x2="128" y2="140" strokeWidth="0.3" />
      <text x="120" y="105" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.4" transform="rotate(-90,120,105)">LIFT 22</text>

      {/* Label */}
      <text x="10" y="195" fontSize="3.5" fill="currentColor" stroke="none" opacity="0.3">CAM-DWF-01</text>

      {/* Rotation arrow hint */}
      <path d="M100,168 Q118,155 110,135" fill="none" strokeWidth="0.3" opacity="0.3" />
      <polygon points="111,137 110,133 106,136" fill="currentColor" stroke="none" opacity="0.3" />

      {/* ═══ ANIMATED: Cam body (rotates) ═══ */}
      <m.g style={{ rotate: camRotation, transformOrigin: "70px 140px" }}>
        {/* Cam shaft */}
        <circle cx="70" cy="140" r="8" />
        <line x1="62" y1="140" x2="78" y2="140" strokeWidth="0.3" />
        <line x1="70" y1="132" x2="70" y2="148" strokeWidth="0.3" />

        {/* Cam profile — egg-shaped lobe */}
        <path
          d="M70,100 Q100,100 105,120 Q110,140 95,155 Q80,170 60,155 Q35,140 40,120 Q45,100 70,100"
          strokeWidth="0.6"
        />
        {/* Base circle */}
        <circle cx="70" cy="140" r="30" strokeDasharray="3,3" strokeWidth="0.3" />

        {/* Cam nose marker */}
        <circle cx="70" cy="102" r="3" strokeDasharray="1,1" strokeWidth="0.3" />
      </m.g>

      {/* ═══ ANIMATED: Follower assembly (translates Y) ═══ */}
      <m.g style={{ y: followerY }}>
        {/* Follower roller — rides on cam */}
        <circle cx="70" cy="82" r="8" />
        <circle cx="70" cy="82" r="3" strokeWidth="0.3" />

        {/* Follower stem */}
        <rect x="66" y="40" width="8" height="35" rx="1" />

        {/* Spring — stretches/compresses with follower movement */}
        <path d="M64,40 L76,38 L64,36 L76,34 L64,32 L76,30 L64,28 L76,26" strokeWidth="0.4" />
      </m.g>
    </svg>
  );
}
