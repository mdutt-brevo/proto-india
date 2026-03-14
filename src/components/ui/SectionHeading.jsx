import { useInView } from "../../hooks/useInView";

export default function SectionHeading({ title, subtitle, center = true, className = "" }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`mb-12 lg:mb-16 ${center ? "text-center" : ""} ${className}
        transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {/* Technical accent line above title */}
      <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
        <div className="w-8 h-px bg-accent-500/60" />
        <div className="w-2 h-2 rotate-45 border border-accent-500/40" />
        <div className="w-8 h-px bg-accent-500/60" />
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-surface-900 dark:text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-surface-800/70 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
