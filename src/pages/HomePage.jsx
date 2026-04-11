import Hero from "../components/home/Hero";
import WhyChooseUs from "../components/home/WhyChooseUs";
import ServicesSection from "../components/home/ServicesSection";
import IndustriesSection from "../components/home/IndustriesSection";
import Testimonials from "../components/home/Testimonials";
import HomeCTA from "../components/home/HomeCTA";

// Background layers (dark gradient, blueprint grid, vignette, CAD wireframes)
// are rendered at the App level in App.jsx — visible on ALL pages.
// HomePage only needs to render its content sections.

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <ServicesSection />
      <IndustriesSection />
      <Testimonials />
      <HomeCTA />
    </>
  );
}
