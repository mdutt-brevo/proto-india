import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  MouldCavity, GearProfile, InjectionNozzle, CncBracket,
  DieInsert, SprueSystem, PistonRod, GearTrain, BearingBlock,
  Crankshaft, CamMechanism, FlangePattern, SpringValve,
  DetailedGearSet, DetailedPiston, EngineCrossSection,
} from "../animation/wireframes";

// ── Motion types ──────────────────────────────────────────────────────────────
// Each element gets a motion type that determines how it moves on scroll:
//
// "parallax"    — translateY only (drifts vertically)
// "rotate"      — continuous rotation (gears, flanges)
// "oscillateY"  — pumps up and down (pistons, valves)
// "oscillateX"  — sways side to side (crankshafts, nozzles)
// "scaleZ"      — scales in/out to simulate z-depth approach/retreat
// "combined"    — rotation + parallax together

// ── Element placement ─────────────────────────────────────────────────────────
// 16 elements total — mix of complex hero pieces and simpler accents.
// Complex wireframes (DetailedGearSet, DetailedPiston, EngineCrossSection)
// are placed prominently with higher opacity. Simpler ones fill gaps.
const ELEMENTS = [
  // ── Top region (0–25%) — first things visitors see ─────────────────────────
  {
    // HERO ELEMENT: Large detailed gear set — each gear rotates independently
    // Small gear drives large gear at correct ratio (mechanical motion)
    Component: DetailedGearSet,
    className: "w-64 lg:w-[420px]",
    style: { top: "2%", right: "2%" },
    rotate: "",
    opacity: 0.25,
    motion: "mechanical",
    speed: 0,
  },
  {
    Component: MouldCavity,
    className: "w-40 lg:w-56",
    style: { top: "5%", left: "3%" },
    rotate: "rotateX(10deg) rotateY(-15deg) rotateZ(3deg)",
    opacity: 0.22,
    motion: "parallax",
    speed: 0.15,
  },
  {
    // Detailed piston — piston reciprocates, rod pivots (mechanical motion)
    Component: DetailedPiston,
    className: "w-20 lg:w-32",
    style: { top: "8%", left: "80%" },
    rotate: "",
    opacity: 0.24,
    motion: "mechanical",
    speed: 0,
    hideOnMobile: true,
  },

  // ── Upper-mid (25–45%) ─────────────────────────────────────────────────────
  {
    // HERO ELEMENT: Engine cross-section — large, left side
    Component: EngineCrossSection,
    className: "w-48 lg:w-[360px]",
    style: { top: "24%", left: "2%" },
    rotate: "rotateY(8deg)",
    opacity: 0.20,
    motion: "parallax",
    speed: 0.25,
    hideOnMobile: true,
  },
  {
    // Cam rotates, follower pumps in response (mechanical motion)
    Component: CamMechanism,
    className: "w-28 lg:w-40",
    style: { top: "30%", right: "5%" },
    rotate: "rotateY(12deg)",
    opacity: 0.24,
    motion: "mechanical",
    speed: 0,
  },
  {
    Component: FlangePattern,
    className: "w-32 lg:w-48",
    style: { top: "20%", left: "45%" },
    rotate: "",
    opacity: 0.20,
    motion: "rotate",
    speed: 0.25,
    hideOnMobile: true,
  },

  // ── Mid (45–65%) ───────────────────────────────────────────────────────────
  {
    // Crankshaft ROTATES around its main journal axis (not sway)
    Component: Crankshaft,
    className: "w-64 lg:w-[480px]",
    style: { top: "48%", right: "1%" },
    rotate: "rotateX(-4deg) rotateZ(2deg)",
    opacity: 0.22,
    motion: "rotate",
    speed: 0.5,
    hideOnMobile: true,
  },
  {
    Component: DieInsert,
    className: "w-36 lg:w-52",
    style: { top: "46%", left: "6%" },
    rotate: "rotateX(8deg) rotateY(-18deg) rotateZ(4deg)",
    opacity: 0.26,
    motion: "scaleZ",
    speed: 1,
  },
  {
    Component: BearingBlock,
    className: "w-36 lg:w-52",
    style: { top: "55%", left: "38%" },
    rotate: "rotateX(6deg) rotateY(10deg)",
    opacity: 0.20,
    motion: "parallax",
    speed: 0.3,
    hideOnMobile: true,
  },
  {
    // Second gear set — counter-rotating, mid-page
    Component: GearTrain,
    className: "w-48 lg:w-72",
    style: { top: "58%", right: "35%" },
    rotate: "",
    opacity: 0.18,
    motion: "rotate",
    speed: -0.35,
    hideOnMobile: true,
  },

  // ── Lower (65–85%) ─────────────────────────────────────────────────────────
  {
    // Second piston — piston reciprocates + rod pivots (mechanical motion)
    Component: DetailedPiston,
    className: "w-28 lg:w-44",
    style: { top: "66%", right: "8%" },
    rotate: "",
    opacity: 0.24,
    motion: "mechanical",
    speed: 0,
  },
  {
    Component: SpringValve,
    className: "w-20 lg:w-28",
    style: { top: "72%", left: "20%" },
    rotate: "",
    opacity: 0.24,
    motion: "oscillateY",
    speed: 2.2,
    hideOnMobile: true,
  },
  {
    Component: InjectionNozzle,
    className: "w-48 lg:w-68",
    style: { top: "76%", left: "2%" },
    rotate: "rotateX(-4deg) rotateY(-10deg) rotateZ(2deg)",
    opacity: 0.20,
    motion: "oscillateX",
    speed: 0.6,
    hideOnMobile: true,
  },

  // ── Bottom (85–100%) ───────────────────────────────────────────────────────
  {
    // Large gear profile — slow rotation at bottom
    Component: GearProfile,
    className: "w-44 lg:w-64",
    style: { top: "86%", left: "10%" },
    rotate: "",
    opacity: 0.22,
    motion: "rotate",
    speed: 0.6,
  },
  {
    Component: CncBracket,
    className: "w-40 lg:w-56",
    style: { top: "88%", right: "5%" },
    rotate: "rotateX(-6deg) rotateY(18deg) rotateZ(-3deg)",
    opacity: 0.22,
    motion: "scaleZ",
    speed: -1,
    hideOnMobile: true,
  },
  {
    Component: SprueSystem,
    className: "w-40 lg:w-56",
    style: { top: "94%", left: "40%" },
    rotate: "rotateX(5deg) rotateY(-8deg)",
    opacity: 0.18,
    motion: "rotate",
    speed: -0.15,
    hideOnMobile: true,
  },
];

// ── Motion resolver ───────────────────────────────────────────────────────────
// Returns a style object with Motion values based on the element's motion type.

function useElementMotion(scrollYProgress, motionType, speed, reducedMotion) {
  // All transforms use scroll progress [0, 1] mapped to different ranges
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -300 * speed]);

  // Rotation: 0 → N full turns (speed controls direction and count)
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360 * speed]);

  // Oscillation: sin-wave simulated via keyframe mapping
  // Maps scroll 0→1 to 0 → +peak → 0 → -peak → 0 (two full oscillations)
  const oscY = useTransform(
    scrollYProgress,
    [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    [0, -20 * speed, 0, 20 * speed, 0, -20 * speed, 0, 20 * speed, 0]
  );
  const oscX = useTransform(
    scrollYProgress,
    [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    [0, 15 * speed, 0, -15 * speed, 0, 15 * speed, 0, -15 * speed, 0]
  );

  // Scale: breathe in/out to simulate z-axis movement
  const scaleVal = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    speed > 0
      ? [1, 1.08, 1, 0.92, 1]
      : [1, 0.92, 1, 1.08, 1]
  );

  if (reducedMotion) return {};

  switch (motionType) {
    case "rotate":
      return { rotate: rotation, y: parallaxY };
    case "oscillateY":
      return { y: oscY };
    case "oscillateX":
      return { x: oscX, y: parallaxY };
    case "scaleZ":
      return { scale: scaleVal, y: parallaxY };
    case "combined":
      return { rotate: rotation, y: parallaxY, scale: scaleVal };
    case "parallax":
    default:
      return { y: parallaxY };
  }
}

// ── Individual element ────────────────────────────────────────────────────────

function ParallaxElement({ element, scrollYProgress, reducedMotion }) {
  const {
    Component, className, style, rotate, opacity,
    motion: motionType, speed, hideOnMobile,
  } = element;

  const motionStyle = useElementMotion(scrollYProgress, motionType, speed, reducedMotion);
  const responsiveClass = hideOnMobile ? "hidden lg:block" : "";

  // "mechanical" components handle their own internal animation.
  // They receive scrollYProgress and animate sub-parts independently
  // (e.g., gears counter-rotating, piston pumping + rod pivoting).
  if (motionType === "mechanical") {
    return (
      <div
        className={`fixed ${responsiveClass} ${className}`}
        style={{
          ...style,
          transform: rotate ? `perspective(800px) ${rotate}` : undefined,
          opacity,
          color: "#cbd5e1",
        }}
      >
        <Component
          className="w-full h-auto"
          scrollYProgress={scrollYProgress}
        />
      </div>
    );
  }

  return (
    <div
      className={`fixed ${responsiveClass} ${className}`}
      style={{
        ...style,
        transform: rotate ? `perspective(800px) ${rotate}` : undefined,
        opacity,
        color: "#cbd5e1",
      }}
    >
      <m.div
        style={{
          ...motionStyle,
          willChange: reducedMotion ? "auto" : "transform",
        }}
      >
        <Component className="w-full h-auto" />
      </m.div>
    </div>
  );
}

// ── CadBackground ─────────────────────────────────────────────────────────────

export default function CadBackground({ className = "" }) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ zIndex: -10 }}
    >
      {ELEMENTS.map((element, i) => (
        <ParallaxElement
          key={i}
          element={element}
          scrollYProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
