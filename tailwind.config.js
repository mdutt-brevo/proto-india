/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ── Iron + Copper palette ────────────────────────────────────
      // 4-color system: dark iron base, off-white text, copper accent,
      // cool slate for wireframes/borders/secondary elements.
      colors: {
        // Iron — dark backgrounds, surfaces, and cards
        iron: {
          50:  "#f8fafb",
          100: "#eef1f5",
          200: "#d8dde6",
          300: "#b0b9c6",
          400: "#7a8597",
          500: "#556170",
          600: "#3a4553",
          700: "#252e3a",
          800: "#1a2230",
          900: "#0f1923",
          950: "#0a1119",
        },
        // Copper — the sole accent. CTAs, highlights, hover states.
        copper: {
          50:  "#fdf6ee",
          100: "#f9e8d0",
          200: "#f2cfa0",
          300: "#e5ad66",
          400: "#d9923e",
          500: "#c97d3c",
          600: "#b06830",
          700: "#8f4f27",
          800: "#764026",
          900: "#623522",
        },
        // Slate — wireframes, muted text, borders, secondary UI
        slate: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Aliases — backwards compatibility for existing Tailwind classes
        // TODO: remove these once all components are migrated
        primary: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        accent: {
          400: "#d9923e",
          500: "#c97d3c",
          600: "#b06830",
        },
        surface: {
          50:  "#f8fafb",
          100: "#eef1f5",
          200: "#d8dde6",
          300: "#b0b9c6",
          400: "#7a8597",
          500: "#556170",
          600: "#3a4553",
          700: "#252e3a",
          800: "#1a2230",
          900: "#0f1923",
        },
      },
      fontFamily: {
        heading: ["Inter", "system-ui", "sans-serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
        mono:    ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "count-up": "countUp 0.4s ease-out forwards",
        // Industrial animations
        "gear-spin": "gearSpin 3s linear infinite",
        "gear-spin-reverse": "gearSpin 3s linear infinite reverse",
        "stamp-in": "stampIn 0.5s cubic-bezier(0.22, 0.61, 0.36, 1.4) forwards",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "draw-line": "drawLine 1.5s ease-out forwards",
        "molten-flow": "moltenFlow 3s ease-in-out infinite",
        "spark": "spark 0.8s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "wipe-right": "wipeRight 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1.2) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Interlocking gear rotation
        gearSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // Hydraulic press stamp effect — overshoot then settle
        stampIn: {
          "0%": { opacity: "0", transform: "translateY(-30px) scale(1.3)" },
          "60%": { opacity: "1", transform: "translateY(4px) scale(0.97)" },
          "80%": { transform: "translateY(-2px) scale(1.01)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // Light sweep across metallic surfaces
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        // SVG path draw animation
        drawLine: {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        // Molten metal gradient flow
        moltenFlow: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        // Spark burst particle
        spark: {
          "0%": { opacity: "1", transform: "translate(0, 0) scale(1)" },
          "100%": { opacity: "0", transform: "translate(var(--spark-x, 20px), var(--spark-y, -30px)) scale(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        // Mechanical wipe reveal
        wipeRight: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
