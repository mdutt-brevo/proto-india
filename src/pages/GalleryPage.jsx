import { useState } from "react";
import { GALLERY_ITEMS, FEATURED_PROJECTS } from "../data/siteData";
import { useInView } from "../hooks/useInView";
import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";

const FILTERS = ["All", "CNC Machining", "Moulds", "Manufacturing"];
const FILTER_MAP = {
  "All": null,
  "CNC Machining": "cnc",
  "Moulds": "mould",
  "Manufacturing": "manufacturing",
};

function PageHero() {
  return (
    <section className="relative overflow-hidden gradient-mesh th-bg-page">
      <div className="container-max section-padding !pb-12 text-center">
        <p className="text-sm font-semibold text-primary-500 mb-3">Gallery</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold th-heading leading-tight animate-slide-up">
          Our Work Gallery
        </h1>
        <p className="mt-4 text-lg th-muted max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Showcasing Precision, Quality &amp; Craftsmanship
        </p>
      </div>
    </section>
  );
}

function GalleryGrid() {
  const [active, setActive] = useState("All");
  const [ref, isInView] = useInView();

  const filtered = FILTER_MAP[active]
    ? GALLERY_ITEMS.filter((item) => item.category === FILTER_MAP[active])
    : GALLERY_ITEMS;

  return (
    <section className="section-padding th-bg-page">
      <div className="container-max">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                active === f
                  ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                  : "th-bg-inset th-muted hover:bg-surface-100 dark:hover:bg-white/10 border th-border-subtle"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Image Grid — using colored placeholders with overlay text */}
        <div
          ref={ref}
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {filtered.map((item, i) => {
            return (
              <div
                key={`${item.title}-${i}`}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <p className="text-white font-bold text-sm drop-shadow-lg">
                    {item.title}
                  </p>
                  <span className="mt-2 text-[10px] uppercase tracking-wider text-white/80 font-semibold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const [ref, isInView] = useInView();

  return (
    <section className="section-padding th-bg-alt">
      <div className="container-max">
        <SectionHeading title="Featured Projects" />
        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-8 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {FEATURED_PROJECTS.map((project) => (
            <div
              key={project.title}
              className="th-bg-card rounded-2xl overflow-hidden border th-border card-hover"
            >
              {/* Project image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-3 left-4 text-white/90 font-heading font-bold text-sm uppercase tracking-wider drop-shadow-lg">
                  {project.specs.Industry}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold th-heading">{project.title}</h3>
                <p className="mt-2 text-sm th-muted leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Object.entries(project.specs).map(([key, val]) => (
                    <div key={key} className="text-xs">
                      <span className="font-bold th-subtle">{key}:</span>{" "}
                      <span className="th-body-secondary">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="th-bg-card rounded-2xl p-8 border th-border max-w-lg mx-auto">
            <h3 className="text-xl font-bold th-heading">Want to See More?</h3>
            <p className="text-sm th-muted mt-2">
              Contact us to discuss your project and see more examples
            </p>
            <div className="mt-6">
              <Button href="/contact" variant="primary" id="gallery-cta-get-in-touch">
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GalleryPage() {
  return (
    <>
      <PageHero />
      <GalleryGrid />
      <FeaturedProjects />
    </>
  );
}
