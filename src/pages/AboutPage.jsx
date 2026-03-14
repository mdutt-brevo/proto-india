import {
  Award, Clock, Lightbulb, Shield,
} from "lucide-react";
import {
  ABOUT_STORY, CORE_VALUES, TIMELINE, STATS,
} from "../data/siteData";
import { useInView } from "../hooks/useInView";
import SectionHeading from "../components/ui/SectionHeading";

const VALUE_ICONS = { Award, Clock, Lightbulb, Shield };

function PageHero() {
  return (
    <section className="relative overflow-hidden gradient-mesh th-bg-page">
      <div className="container-max section-padding !pb-12 text-center">
        <p className="text-sm font-semibold text-primary-500 mb-3">About Us</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold th-heading leading-tight animate-slide-up">
          About Sharma Tools
        </h1>
        <p className="mt-4 text-lg th-muted max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Precision, Reliability, Continuous Improvement
        </p>
      </div>
    </section>
  );
}

function StorySection() {
  const [ref, isInView] = useInView();
  return (
    <section className="section-padding th-bg-page">
      <div className="container-max">
        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-10 items-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Factory image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/assets/about/factory-workshop.webp"
              alt="Sharma Tools factory workshop"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold th-heading mb-6">Our Story</h2>
            {ABOUT_STORY.paragraphs.map((p, i) => (
              <p key={i} className="th-body-secondary leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  const [ref, isInView] = useInView();
  return (
    <section className="section-padding th-bg-alt">
      <div
        ref={ref}
        className={`container-max transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        {/* Team image banner */}
        <div className="rounded-2xl overflow-hidden mb-8 h-56 relative">
          <img
            src="/assets/about/team-engineering.webp"
            alt="Sharma Tools engineering team"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-900/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">What Drives Us</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="th-bg-card rounded-2xl p-8 border th-border">
            <h3 className="text-xl font-bold th-heading mb-4">Our Mission</h3>
            <p className="th-body-secondary leading-relaxed">{ABOUT_STORY.mission}</p>
          </div>
          <div className="th-bg-card rounded-2xl p-8 border th-border">
            <h3 className="text-xl font-bold th-heading mb-4">Our Vision</h3>
            <p className="th-body-secondary leading-relaxed">{ABOUT_STORY.vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoreValuesSection() {
  const [ref, isInView] = useInView();
  return (
    <section className="section-padding th-bg-page">
      <div className="container-max">
        <SectionHeading title="Our Core Values" />
        <div
          ref={ref}
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {CORE_VALUES.map((val) => {
            const Icon = VALUE_ICONS[val.icon];
            return (
              <div key={val.title} className="text-center p-6 rounded-2xl border th-border hover:shadow-lg transition-shadow th-bg-card">
                <div className="w-12 h-12 mx-auto rounded-xl th-bg-primary-soft flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <h4 className="font-bold th-heading text-sm">{val.title}</h4>
                <p className="text-xs th-subtle mt-1">{val.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const [ref, isInView] = useInView();
  return (
    <section className="section-padding th-bg-alt">
      <div className="container-max">
        <SectionHeading title="Our Journey" />
        <div
          ref={ref}
          className={`max-w-3xl mx-auto transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-primary-100 dark:bg-primary-500/20" />

            {TIMELINE.map((item, i) => (
              <div key={item.year} className="relative flex gap-6 mb-10 last:mb-0">
                {/* Circle on the line */}
                <div className="relative z-10 w-14 h-14 shrink-0 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <span className="text-white font-heading font-bold text-xs">{item.year}</span>
                </div>
                <div className="pt-3">
                  <h4 className="font-bold th-heading">{item.title}</h4>
                  <p className="text-sm th-muted mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const [ref, isInView] = useInView();
  return (
    <section className="section-padding bg-primary-500">
      <div
        ref={ref}
        className={`container-max transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2 className="text-2xl font-extrabold text-white text-center mb-10">Our Track Record</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-heading font-extrabold text-white">{stat.value}</div>
              <div className="text-sm text-white/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero />
      <StorySection />
      <MissionVision />
      <CoreValuesSection />
      <TimelineSection />
      <StatsSection />
    </>
  );
}
