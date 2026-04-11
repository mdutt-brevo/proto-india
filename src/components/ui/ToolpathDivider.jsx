import { useInView } from "../../hooks/useInView";

/**
 * ToolpathDivider — an SVG line that draws itself on scroll,
 * like a CNC machine tracing a toolpath across the workpiece.
 * Used as a section separator between content blocks.
 */
export default function ToolpathDivider({ className = "" }) {
  const [ref, isInView] = useInView();

  return (
    <div ref={ref} className={`w-full overflow-hidden py-4 ${className}`}>
      <svg
        viewBox="0 0 1200 20"
        className="w-full h-5"
        preserveAspectRatio="none"
      >
        {/* Main toolpath line */}
        <path
          d="M0,10 L200,10 L220,4 L240,16 L260,4 L280,16 L300,10 L600,10 L620,4 L640,16 L660,4 L680,16 L700,10 L1200,10"
          fill="none"
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth="1.5"
          pathLength="1"
          className={isInView ? "toolpath-divider" : ""}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: isInView ? undefined : 1,
          }}
        />

        {/* Crosshair markers at key points */}
        {[200, 600, 1000].map((x) => (
          <g key={x} opacity={isInView ? 0.3 : 0}>
            <line
              x1={x - 8} y1="10" x2={x + 8} y2="10"
              stroke="#94a3b8" strokeWidth="0.5"
              className="transition-opacity duration-1000"
            />
            <line
              x1={x} y1="2" x2={x} y2="18"
              stroke="#94a3b8" strokeWidth="0.5"
              className="transition-opacity duration-1000"
            />
            <circle
              cx={x} cy="10" r="2"
              fill="none" stroke="#94a3b8" strokeWidth="0.5"
              className="transition-opacity duration-1000"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
