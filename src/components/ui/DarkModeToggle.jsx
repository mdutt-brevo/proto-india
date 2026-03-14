import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

/**
 * DarkModeToggle — industrial-styled sun/moon toggle.
 * Rotates the icon on switch like a lathe chuck changing position.
 */
export default function DarkModeToggle({ className = "" }) {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className={`relative p-2 rounded-lg border transition-all duration-300
        ${isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10 text-amber-400"
          : "border-surface-200 bg-surface-50 hover:bg-surface-100 text-surface-600"
        } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      id="dark-mode-toggle"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun icon — visible in dark mode (click to go light) */}
        <Sun
          className={`w-5 h-5 absolute inset-0 transition-all duration-300
            ${isDark ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
        />
        {/* Moon icon — visible in light mode (click to go dark) */}
        <Moon
          className={`w-5 h-5 absolute inset-0 transition-all duration-300
            ${isDark ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
        />
      </div>
    </button>
  );
}
