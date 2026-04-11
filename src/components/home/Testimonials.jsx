import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../data/siteData";
import { VIDEOS } from "../../data/videoSources";
import { useInView } from "../../hooks/useInView";
import SectionHeading from "../ui/SectionHeading";
import VideoBackground from "../ui/VideoBackground";

export default function Testimonials() {
  const [ref, isInView] = useInView();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Factory floor ambient video — always visible (dark section) */}
      <VideoBackground
        src={VIDEOS.factory}
        fallbackSrc={VIDEOS.factoryHD}
        overlay="bg-black/75"
      />

      {/* No separate blueprint grid or riveted edge — page-level background handles this */}

      <div className="container-max relative">
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Trusted by industry leaders for quality and reliability"
          className="[&_h2]:text-white [&_p]:text-white/60"
        />

        <div ref={ref} className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`bg-white/[0.06] backdrop-blur-md rounded-2xl p-6 lg:p-8
                border border-white/10 flex flex-col relative overflow-hidden
                hover:border-white/20 hover:bg-white/[0.1] transition-all duration-300
                ${isInView ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-white/[0.05]" />

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-5 h-5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <blockquote className="text-sm text-white/70 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="font-bold text-white text-sm">
                  {t.author}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {t.role}, {t.company}
                </p>
              </div>

              <svg className="absolute bottom-3 left-3 w-5 h-5 text-white/10" viewBox="0 0 20 20">
                <path d="M0,8 L0,0 L8,0" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
