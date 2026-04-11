import {
  Smartphone, Car, Zap, Refrigerator, Package, Heart,
} from "lucide-react";
import { m } from "motion/react";
import { INDUSTRIES } from "../../data/siteData";
import { REVEAL } from "../../lib/motionTokens";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";

const ICON_MAP = { Smartphone, Car, Zap, Refrigerator, Package, Heart };

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { ...REVEAL, delay: i * 0.06 },
  }),
};

export default function IndustriesSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-max relative">
        <SectionHeading
          title="Industries We Serve"
          subtitle="Trusted by leading companies across diverse sectors"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ICON_MAP[ind.icon];
            return (
              <m.div
                key={ind.id}
                variants={cardVariants}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="group bg-white/[0.04] backdrop-blur-sm rounded-2xl overflow-hidden
                  hover:bg-white/[0.07] card-hover relative"
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
                  <div className="w-10 h-10 mx-auto -mt-9 relative z-10 rounded-lg bg-iron-800 shadow-md flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-5 h-5 text-copper-400" />
                  </div>
                  <h3 className="mt-2 font-bold text-white text-sm lg:text-base">
                    {ind.title}
                  </h3>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-copper-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </m.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button href="/industries" variant="outline" id="home-explore-industries-cta">
            Explore All Industries
          </Button>
        </div>

      </div>
    </section>
  );
}
