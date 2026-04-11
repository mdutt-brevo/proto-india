/**
 * BlueprintOverlay — decorative SVG elements that evoke
 * technical drawings / AutoCAD blueprints.
 *
 * Renders corner brackets, crosshairs, and dimension markers
 * over the parent container. Pure decoration, no semantic content.
 */
export default function BlueprintOverlay({ className = "" }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Top-left corner bracket */}
      <svg className="absolute top-6 left-6 w-12 h-12 text-copper-500/10" viewBox="0 0 48 48">
        <path d="M0,16 L0,0 L16,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="2" fill="currentColor" />
      </svg>

      {/* Top-right corner bracket */}
      <svg className="absolute top-6 right-6 w-12 h-12 text-copper-500/10" viewBox="0 0 48 48">
        <path d="M48,16 L48,0 L32,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="48" cy="0" r="2" fill="currentColor" />
      </svg>

      {/* Bottom-left corner bracket */}
      <svg className="absolute bottom-6 left-6 w-12 h-12 text-copper-500/10" viewBox="0 0 48 48">
        <path d="M0,32 L0,48 L16,48" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="0" cy="48" r="2" fill="currentColor" />
      </svg>

      {/* Bottom-right corner bracket */}
      <svg className="absolute bottom-6 right-6 w-12 h-12 text-copper-500/10" viewBox="0 0 48 48">
        <path d="M48,32 L48,48 L32,48" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="48" cy="48" r="2" fill="currentColor" />
      </svg>

      {/* Center crosshair — barely visible, just enough to hint at precision */}
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-copper-500/[0.05]" viewBox="0 0 64 64">
        <line x1="0" y1="32" x2="64" y2="32" stroke="currentColor" strokeWidth="0.5" />
        <line x1="32" y1="0" x2="32" y2="64" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}
