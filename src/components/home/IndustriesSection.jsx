import { lazy, Suspense } from "react";
import {
  Smartphone, Car, Zap, Refrigerator, Package, Heart,
} from "lucide-react";
import { INDUSTRIES } from "../../data/siteData";
import { useInView } from "../../hooks/useInView";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import ToolpathDivider from "../ui/ToolpathDivider";

const SectionScene = lazy(() => import("../three/SectionScene"));

const ICON_MAP = { Smartphone, Car, Zap, Refrigerator, Package, Heart };

export default function IndustriesSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="section-padding bg-surface-50 dark:bg-surface-900/80 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 blueprint-grid dark:blueprint-grid-dark opacity-20" />

      {/* 3D Background — injection molding with granule flow */}
      <Suspense fallback={null}>
        <SectionScene variant="injection" className="opacity-15 dark:opacity-25" />
      </Suspense>

      <div className="container-max relative">
        <SectionHeading
          title="Industries We Serve"
          subtitle="Trusted by leading companies across diverse sectors"
        />

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ICON_MAP[ind.icon];
            return (
              <div
                key={ind.id}
                className={`group bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm rounded-2xl overflow-hidden
                  border border-surface-100 dark:border-white/10 card-hover relative
                  ${isInView ? "animate-stamp-in" : "opacity-0"}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={ind.image}
                    alt={ind.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute inset-0 blueprint-grid-dark opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </div>

                <div className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto -mt-9 relative z-10 rounded-lg bg-white dark:bg-surface-800 shadow-md flex items-center justify-center border border-surface-100 dark:border-white/10 group-hover:border-primary-200 dark:group-hover:border-primary-500/30 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                  </div>
                  <h3 className="mt-2 font-bold text-surface-900 dark:text-white text-sm lg:text-base">
                    {ind.title}
                  </h3>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button href="/industries" variant="outline" id="home-explore-industries-cta">
            Explore All Industries
          </Button>
        </div>

        <ToolpathDivider className="mt-4" />
      </div>
    </section>
  );
}
