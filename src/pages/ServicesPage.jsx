import {
  PenTool, Layers, Cog, Wrench, Factory, Lightbulb,
  MessageSquare, ClipboardCheck, Truck, Check,
} from "lucide-react";
import { SERVICES, PROCESS_STEPS } from "../data/siteData";
import { useInView } from "../hooks/useInView";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";

const ICON_MAP = {
  PenTool, Layers, Cog, Wrench, Factory, Lightbulb,
  MessageSquare, ClipboardCheck, Truck,
};

function PageHero() {
  return (
    <section className="relative overflow-hidden gradient-mesh th-bg-page">
      <div className="container-max section-padding !pb-12 text-center">
        <p className="text-sm font-semibold text-copper-500 mb-3">Services</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold th-heading leading-tight animate-slide-up">
          Our Services
        </h1>
        <p className="mt-4 text-lg th-muted max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Complete Tooling Solutions from Design to Production
        </p>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }) {
  const [ref, isInView] = useInView();
  const Icon = ICON_MAP[service.icon];
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-8 items-center transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Image side */}
      <div className={`${!isEven ? "md:order-2" : ""}`}>
        <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group/img">
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent`} />
          <div className={`absolute bottom-4 left-4 w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-xl`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Content side */}
      <div className={`${!isEven ? "md:order-1" : ""}`}>
        <h3 className="text-2xl font-extrabold th-heading">{service.title}</h3>
        <p className="mt-3 th-body-secondary leading-relaxed">{service.shortDesc}</p>

        <div className="mt-5">
          <p className="text-sm font-bold th-heading mb-2">Key Benefits:</p>
          <ul className="space-y-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm th-body-secondary">
                <Check className="w-4 h-4 text-copper-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {service.capabilities && (
          <div className="mt-4 p-3 rounded-lg th-bg-inset border th-border">
            <p className="text-xs font-bold th-subtle uppercase tracking-wider mb-1">
              Technical Capabilities
            </p>
            <p className="text-sm th-body-secondary">{service.capabilities}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProcessSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="section-padding th-bg-alt">
      <div className="container-max">
        <SectionHeading title="Our Process" />
        <div
          ref={ref}
          className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-4xl mx-auto transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {PROCESS_STEPS.map((step, i) => {
            const Icon = ICON_MAP[step.icon];
            return (
              <div key={step.step} className="flex md:flex-col items-center md:items-center gap-4 md:gap-0 flex-1 text-center relative">
                {/* Connector line (desktop) */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-copper-100 dark:bg-copper-500/20" />
                )}
                <div className="relative z-10 w-12 h-12 rounded-full bg-copper-500 flex items-center justify-center text-white font-heading font-bold shadow-lg shadow-copper-500/20 shrink-0">
                  {step.step}
                </div>
                <div className="md:mt-4">
                  <h4 className="font-bold th-heading text-sm">{step.title}</h4>
                  <p className="text-xs th-subtle mt-1 max-w-[160px]">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServicesCTA() {
  const [ref, isInView] = useInView();
  return (
    <section className="section-padding bg-gradient-to-br from-iron-800 via-iron-900 to-iron-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
      <div
        ref={ref}
        className={`container-max text-center relative z-10 transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="text-3xl font-extrabold text-white">Need a Custom Solution?</h2>
        <p className="mt-3 text-white/70 max-w-lg mx-auto">
          Our experts are ready to discuss your project requirements
        </p>
        <div className="mt-8">
          <Button href="/quote" variant="accent" arrow id="services-cta-request-quote" className="text-base px-8 py-3.5">
            Request a Quote
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHero />
      <section className="section-padding th-bg-page">
        <div className="container-max space-y-20">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </section>
      <ProcessSection />
      <ServicesCTA />
    </>
  );
}
