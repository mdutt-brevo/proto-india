import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import { STATS } from "../../data/siteData";
import { useInView } from "../../hooks/useInView";

export default function Hero() {
  const [statsRef, statsInView] = useInView();

  return (
    <section className="relative overflow-hidden">
      {/* Background — clean gradient mesh (no image wash) */}
      <div className="absolute inset-0 gradient-mesh" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-max section-padding !pt-16 !pb-8 lg:!pt-24 lg:!pb-16 relative">
        {/* Split layout: text left, image right */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — text content */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-semibold mb-6 animate-fade-in">
              Your Trusted Tooling Partner
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 leading-[1.08] tracking-tight animate-slide-up">
              Precision Moulds,{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                CNC Machining
              </span>{" "}
              &amp; Injection Molding
            </h1>

            <p
              className="mt-6 text-lg lg:text-xl text-surface-800/70 leading-relaxed max-w-xl lg:mx-0 mx-auto animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Engineering excellence with 15+ years of experience in precision
              injection mould design &amp; manufacturing
            </p>

            <div
              className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                href="/quote"
                variant="accent"
                arrow
                id="hero-get-quote-cta"
                className="text-base px-8 py-3.5"
              >
                Get a Quote
              </Button>
              <Button
                href="/gallery"
                variant="outline"
                id="hero-view-work-cta"
                className="text-base px-8 py-3.5"
              >
                View Our Work
              </Button>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10 border border-surface-200/50">
              <img
                src="/assets/hero/hero-bg.webp"
                alt="Industrial manufacturing at Sharma Tools"
                className="w-full h-[420px] object-cover"
              />
            </div>
            {/* Decorative accent behind image */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
          </div>
        </div>

        {/* Stats Bar */}
        <div
          ref={statsRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-surface-200/60
            transition-all duration-700 ${statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-heading font-extrabold text-primary-500">
                {stat.value}
              </div>
              <div className="text-sm text-surface-800/50 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative blobs */}
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-500/5 blur-3xl" />
    </section>
  );
}
