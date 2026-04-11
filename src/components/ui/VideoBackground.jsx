import { useState } from "react";

/**
 * VideoBackground — ambient looping video with dark overlay.
 * Falls back to a gradient if video fails to load.
 *
 * Used behind hero sections and CTAs for cinematic industrial feel.
 * Videos are muted + autoplay + loop — pure atmosphere, no audio.
 */
export default function VideoBackground({
  src,
  fallbackSrc,
  overlay = "bg-black/50",
  className = "",
}) {
  const [error, setError] = useState(false);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {!error ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* Primary source */}
          <source src={src} type="video/mp4" />
          {/* Fallback source */}
          {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
        </video>
      ) : (
        /* Gradient fallback if video fails */
        <div className="absolute inset-0 bg-gradient-to-br from-iron-900 via-iron-950 to-iron-900" />
      )}

      {/* Dark overlay — ensures text readability */}
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  );
}
