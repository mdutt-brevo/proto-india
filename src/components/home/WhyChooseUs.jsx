import { ShieldCheck, Clock, Users } from "lucide-react";
import { m } from "motion/react";
import { WHY_CHOOSE_US } from "../../data/siteData";
import { REVEAL } from "../../lib/motionTokens";
import SectionHeading from "../ui/SectionHeading";

const ICON_MAP = { ShieldCheck, Clock, Users };

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { ...REVEAL, delay: i * 0.1 },
  }),
};

export default function WhyChooseUs() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-max relative">
        <SectionHeading
          title="Why Choose Sharma Tools?"
          subtitle="We combine technical expertise with commitment to quality and customer satisfaction"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <m.div
                key={item.title}
                variants={cardVariants}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="group text-center p-8 rounded-2xl
                  bg-white/[0.03] backdrop-blur-sm
                  hover:bg-white/[0.06]
                  hover:shadow-xl hover:shadow-copper-500/10
                  transition-all duration-300 relative overflow-hidden"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-copper-500/10 group-hover:bg-copper-500 flex items-center justify-center transition-colors duration-300 relative">
                  <Icon className="w-7 h-7 text-copper-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {item.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-copper-700 via-copper-400 to-copper-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </m.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
