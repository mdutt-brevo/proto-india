import Button from "../ui/Button";
import SparkBurst from "../ui/SparkBurst";
import VideoBackground from "../ui/VideoBackground";
import { VIDEOS } from "../../data/videoSources";
import { useInView } from "../../hooks/useInView";

export default function HomeCTA() {
  const [ref, isInView] = useInView();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Welding sparks ambient video */}
      <VideoBackground
        src={VIDEOS.sparks}
        fallbackSrc={VIDEOS.sparksHD}
        overlay="bg-gradient-to-br from-iron-800/85 via-iron-900/90 to-iron-950/95"
      />

      {/* Blueprint grid on top */}
      <div className="absolute inset-0 blueprint-grid-dark opacity-30" />

      {/* Mould-cavity circle outlines */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full border border-white/5 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-white/[0.03] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-white/5 translate-y-1/2 -translate-x-1/3" />

      <SparkBurst active={isInView} />

      <div
        ref={ref}
        className={`container-max text-center relative z-10 transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-mono text-white/50 border border-white/10 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-copper-400 animate-pulse-glow" />
          PROJECT INQUIRY
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          Ready to Start Your Project?
        </h2>
        <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
          Get a free consultation and quote today
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button
            href="/quote"
            variant="accent"
            arrow
            id="home-cta-request-quote"
            className="text-base px-8 py-3.5 press-effect"
          >
            Request a Quote
          </Button>
          <Button
            href="/contact"
            className="btn-white text-base px-8 py-3.5"
            id="home-cta-contact-us"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
