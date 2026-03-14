import { lazy, Suspense, useState, useEffect } from "react";
import Button from "../ui/Button";
import BlueprintOverlay from "../ui/BlueprintOverlay";
import SparkBurst from "../ui/SparkBurst";
import { STATS } from "../../data/siteData";
import { useInView } from "../../hooks/useInView";

// Lazy-load 3D scene — content renders immediately,
// gear background fades in once Three.js is ready
const HeroScene = lazy(() => import("../three/HeroScene"));

/**
 * Wrapper that renders HeroScene and signals when it's loaded.
 * The scene starts invisible, then fades in over 1.5s once mounted.
 */
function LazyGearBackground({ onLoaded }) {
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  return <HeroScene className="w-full h-full" />;
}

export default function Hero() {
  const [statsRef, statsInView] = useInView();
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col">
      {/* ============================================================
          BACKGROUND LAYER: Dark cinematic base
          Deep charcoal-to-dark-blue gradient — the "canvas" everything sits on.
          Matches the Haidlmair dark, moody feel.
          ============================================================ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1923] via-[#141e2b] to-[#0d1520]" />

      {/* Subtle vignette — darker edges, draws eye to center */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Blueprint grid — very faint, just enough to hint at engineering */}
      <div className="absolute inset-0 blueprint-grid-dark opacity-30" />

      {/* ============================================================
          3D GEAR LAYER: Loads lazily, fades in when ready.
          Runs as ambient background — gears drift behind everything.
          ============================================================ */}
      <div
        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-out ${
          sceneReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <Suspense fallback={null}>
          <LazyGearBackground onLoaded={() => setSceneReady(true)} />
        </Suspense>
      </div>

      {/* Gradient overlay on top of 3D — ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1923]/90 via-[#0f1923]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923]/80 via-transparent to-[#0f1923]/40 pointer-events-none" />

      <BlueprintOverlay />

      {/* ============================================================
          CONTENT LAYER: Text + image float above the 3D background
          ============================================================ */}
      <div className="container-max section-padding !pt-20 !pb-12 lg:!pt-32 lg:!pb-20 relative flex-1 flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">

          {/* Left — text content */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-semibold mb-6 animate-fade-in backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-glow" />
              Your Trusted Tooling Partner
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight animate-slide-up">
              Precision Moulds,{" "}
              <span className="bg-gradient-to-r from-slate-300 to-blue-300 bg-clip-text text-transparent">
                CNC Machining
              </span>{" "}
              &amp; Injection Molding
            </h1>

            <p
              className="mt-6 text-lg lg:text-xl text-slate-400 leading-relaxed max-w-xl lg:mx-0 mx-auto animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Engineering excellence with 15+ years of experience in precision
              injection mould design &amp; manufacturing
            </p>

            {/* Capability tags — monospace, technical */}
            <div
              className="flex flex-wrap justify-center lg:justify-start gap-2 mt-5 animate-fade-in"
              style={{ animationDelay: "0.25s" }}
            >
              {["SolidWorks", "AutoCAD", "CNC", "EDM", "ISO 9001"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div
              className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                href="/quote"
                variant="accent"
                arrow
                id="hero-get-quote-cta"
                className="text-base px-8 py-3.5 press-effect"
              >
                Get a Quote
              </Button>
              <Button
                href="/gallery"
                variant="outline"
                id="hero-view-work-cta"
                className="text-base px-8 py-3.5 !border-white/20 !text-white/80 hover:!bg-white/10 hover:!text-white"
              >
                View Our Work
              </Button>
            </div>
          </div>

          {/* Right — hero image (now a smaller inset over the 3D bg) */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {/* Dimension lines */}
            <div className="absolute -top-6 left-4 right-4 flex items-center gap-2 opacity-20">
              <div className="h-px flex-1 bg-slate-400/30" />
              <span className="text-[10px] font-mono text-slate-500">480mm</span>
              <div className="h-px flex-1 bg-slate-400/30" />
            </div>
            <div className="absolute -right-8 top-4 bottom-4 flex flex-col items-center gap-2 opacity-20">
              <div className="w-px flex-1 bg-slate-400/30" />
              <span className="text-[10px] font-mono text-slate-500 [writing-mode:vertical-rl]">420mm</span>
              <div className="w-px flex-1 bg-slate-400/30" />
            </div>

            {/* Image with dark treatment — sits over the 3D, not replacing it */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30 animate-wipe-right" style={{ animationDelay: "0.5s" }}>
              <div className="relative">
                <img
                  src="/assets/hero/hero-bg.webp"
                  alt="Industrial manufacturing at Sharma Tools"
                  className="w-full h-[380px] object-cover"
                />
                {/* Dark wash over image to blend with the dark bg */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/30 to-transparent" />
                <div className="absolute inset-0 bg-[#0f1923]/20 mix-blend-multiply" />
                <div className="absolute inset-0 blueprint-grid-dark opacity-15" />
              </div>
            </div>

            {/* Accent glow behind image */}
            <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full rounded-2xl bg-gradient-to-br from-blue-900/20 to-slate-800/20" />

            <SparkBurst active className="z-20" />
          </div>
        </div>
      </div>

      {/* ============================================================
          STATS BAR: Sits at the bottom of the hero, over the dark bg
          ============================================================ */}
      <div className="relative border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div
          ref={statsRef}
          className="container-max px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 relative"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${statsInView ? "animate-stamp-in" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="text-3xl lg:text-4xl font-heading font-extrabold text-slate-200">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
