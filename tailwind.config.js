/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#1a56db",
          600: "#1648c0",
          700: "#1239a3",
          800: "#0e2d87",
          900: "#0a1f5c",
        },
        accent: {
          400: "#f97316",
          500: "#ea580c",
          600: "#c2410c",
        },
        surface: {
          50: "#f8fafc",
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
        steel: {
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
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
