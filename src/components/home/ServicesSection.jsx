import {
  PenTool, Layers, Cog, Wrench, Factory, Lightbulb, ArrowRight,
} from "lucide-react";
import { m } from "motion/react";
import { Link } from "react-router-dom";
import { SERVICES } from "../../data/siteData";
import { REVEAL } from "../../lib/motionTokens";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";

const ICON_MAP = { PenTool, Layers, Cog, Wrench, Factory, Lightbulb };

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { ...REVEAL, delay: i * 0.08 },
  }),
};

export default function ServicesSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-max relative">
        <SectionHeading
          title="Our Services"
          subtitle="Comprehensive tooling solutions from design to production"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon];
            return (
              <m.div
                key={service.id}
                variants={cardVariants}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="group bg-white/[0.04] backdrop-blur-sm rounded-2xl overflow-hidden
                  hover:bg-white/[0.07] card-hover relative"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute inset-0 blueprint-grid-dark opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur-sm text-[10px] font-mono text-white/70 rounded">
                    {service.capabilities?.split(",")[0] || "Precision"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <ul className="mt-4 space-y-1.5">
                    {service.features.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-white/60"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-copper-500 dark:bg-copper-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-copper-500 dark:text-copper-400 hover:text-copper-600 dark:hover:text-copper-300 transition-colors group/link"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-copper-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </m.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button href="/services" variant="outline" id="home-view-all-services-cta">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
