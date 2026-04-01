import { m } from "motion/react";
import Button from "../ui/Button";
import BlueprintOverlay from "../ui/BlueprintOverlay";
import { STATS } from "../../data/siteData";
import InjectionMoldingLoop from "../animation/InjectionMoldingLoop";
import { REVEAL, EASE_SPRING_DEFAULT } from "../../lib/motionTokens";

// ── Motion variant definitions ─────────────────────────────────────────────────
// All above-fold elements use initial/animate (fire on mount, not scroll).
// Stats cards use whileInView since they sit below the fold in the stats bar.

// Badge pill — simple opacity fade
const badgeVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: REVEAL },
};

// Headline + body text — slide up from 24px below
const slideUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: REVEAL },
};

// CTA row — same slide up with an additional 0.3s delay to stagger after body
const ctaVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { ...REVEAL, delay: 0.3 } },
};

// Stats cards — spring-based overshoot ("stamp") entrance, staggered by index i
const stampVariants = {
  hidden: { opacity: 0, y: -20, scale: 1.15 },
  show: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...EASE_SPRING_DEFAULT, delay: i * 0.12 },
  }),
};

export default function Hero() {

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

      {/* Gradient overlay — ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1923]/90 via-[#0f1923]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923]/80 via-transparent to-[#0f1923]/40 pointer-events-none" />

      <BlueprintOverlay />

      {/* ============================================================
          CONTENT LAYER: Text + image float above the 3D background
          ============================================================ */}
      <div className="container-max section-padding !pt-20 !pb-12 lg:!pt-32 lg:!pb-20 relative flex-1 flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
          {/* LEFT COLUMN: headline, body, tags, CTAs */}
          <div className="max-w-2xl lg:max-w-3xl">
            <m.p
              variants={badgeVariants}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-semibold mb-6 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-glow" />
              Your Trusted Tooling Partner
            </m.p>

            <m.h1
              variants={slideUpVariants}
              initial="hidden"
              animate="show"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight"
            >
              Precision Moulds,{" "}
              <span className="bg-gradient-to-r from-slate-300 to-blue-300 bg-clip-text text-transparent">
                CNC Machining
              </span>{" "}
              &amp; Injection Molding
            </m.h1>

            <m.p
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { ...REVEAL, delay: 0.1 } } }}
              initial="hidden"
              animate="show"
              className="mt-6 text-lg lg:text-xl text-slate-400 leading-relaxed max-w-xl"
            >
              Engineering excellence with 15+ years of experience in precision
              injection mould design &amp; manufacturing
            </m.p>

            {/* Capability tags — monospace, technical */}
            <m.div
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { ...REVEAL, delay: 0.25 } } }}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-2 mt-5"
            >
              {["SolidWorks", "AutoCAD", "CNC", "EDM", "ISO 9001"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </m.div>

            <m.div
              variants={ctaVariants}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-3 mt-8"
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
            </m.div>
          </div>

          {/* RIGHT COLUMN: InjectionMoldingLoop animation (lg+ only) */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-lg">
              <InjectionMoldingLoop />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          STATS BAR: Sits at the bottom of the hero, over the dark bg
          ============================================================ */}
      <div className="relative border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="container-max px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {STATS.map((stat, i) => (
            <m.div
              key={stat.label}
              variants={stampVariants}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-heading font-extrabold text-slate-200">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 font-medium mt-1">
                {stat.label}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
