import { ShieldCheck, Clock, Users } from "lucide-react";
import { m } from "motion/react";
import { WHY_CHOOSE_US } from "../../data/siteData";
import { EASE_SPRING_DEFAULT } from "../../lib/motionTokens";
import SectionHeading from "../ui/SectionHeading";
import ToolpathDivider from "../ui/ToolpathDivider";

const ICON_MAP = { ShieldCheck, Clock, Users };

const cardVariants = {
  hidden: { opacity: 0, y: -20, scale: 1.15 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...EASE_SPRING_DEFAULT, delay: i * 0.15 },
  }),
};

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white dark:bg-surface-900 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 blueprint-grid dark:blueprint-grid-dark opacity-40" />

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
                className="group text-center p-8 rounded-2xl border border-surface-100 dark:border-white/10
                  hover:border-primary-100 dark:hover:border-primary-500/30
                  hover:shadow-xl hover:shadow-primary-500/5 dark:hover:shadow-primary-500/10
                  transition-all duration-300 relative overflow-hidden
                  metallic-surface dark:bg-white/[0.03] dark:backdrop-blur-sm"
              >
                {/* Corner brackets */}
                <svg className="absolute top-3 left-3 w-6 h-6 text-primary-500/10 dark:text-primary-400/15" viewBox="0 0 24 24">
                  <path d="M0,8 L0,0 L8,0" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
                <svg className="absolute bottom-3 right-3 w-6 h-6 text-primary-500/10 dark:text-primary-400/15" viewBox="0 0 24 24">
                  <path d="M24,16 L24,24 L16,24" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>

                <div className="w-14 h-14 mx-auto rounded-xl bg-primary-50 dark:bg-primary-500/10 group-hover:bg-primary-500 flex items-center justify-center transition-colors duration-300 relative">
                  <Icon className="w-7 h-7 text-primary-500 dark:text-primary-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-surface-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-surface-800/60 dark:text-white/50 leading-relaxed">
                  {item.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-amber-400 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </m.div>
            );
          })}
        </div>

        <ToolpathDivider className="mt-8" />
      </div>
    </section>
  );
}
