import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import GearLoader from "./components/ui/GearLoader";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CadBackground from "./components/ui/CadBackground";

// Lazy-load pages for fast initial paint
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const IndustriesPage = lazy(() => import("./pages/IndustriesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const QuotePage = lazy(() => import("./pages/QuotePage"));

// Reset scroll on route change — like pressing `gg` in vim
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// SVG gear animation for page loading — no Three.js dependency
function PageLoader() {
  return <GearLoader />;
}

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen relative">
      <ScrollToTop />

      {/* ── Global industrial background ─────────────────────────────
          These fixed layers create the continuous dark iron canvas
          visible on EVERY page. Content floats above them.
          ──────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0f1923] via-[#111d29] to-[#0a1119]" style={{ zIndex: -30 }} />
      <div className="fixed inset-0 blueprint-grid-dark opacity-20" style={{ zIndex: -20 }} />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -20,
          background: "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <CadBackground />

      {/* ── App chrome + content ──────────────────────────────────── */}
      <Navbar />
      <main className={`flex-1 relative ${isHome ? "" : "pt-[72px]"}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quote" element={<QuotePage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </LazyMotion>
  );
}
