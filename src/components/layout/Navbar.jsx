import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, COMPANY } from "../../data/siteData";
import Button from "../ui/Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On homepage: navbar starts transparent over the dark hero,
  // then solidifies on scroll. On other pages: always solid.
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-iron-900/70 backdrop-blur-md"
      }`}
    >
      {/* Thin accent line — hidden when transparent */}
      <div
        className={`h-0.5 bg-gradient-to-r from-copper-700 via-copper-500 to-copper-700 transition-opacity duration-300 ${
          isTransparent ? "opacity-0" : "opacity-100"
        }`}
      />

      <nav className="container-max flex items-center justify-between h-16 lg:h-[72px] px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-copper-500 to-copper-700 flex items-center justify-center shadow-md shadow-copper-500/20">
            <span className="text-white font-heading font-extrabold text-sm tracking-tight">
              {COMPANY.shortName}
            </span>
          </div>
          <div className="leading-none">
            <span
              className="font-heading font-extrabold text-lg tracking-tight text-white"
            >
              {COMPANY.name.split(" ")[0].toUpperCase()}
            </span>
            <span
              className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-copper-400"
            >
              {COMPANY.name.split(" ")[1]}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-copper-400 bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            href="/quote"
            variant="accent"
            id="nav-get-quote-cta"
            className="text-sm px-5 py-2.5"
          >
            Get a Quote
          </Button>
        </div>

        {/* Mobile: Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            className="p-2 -mr-2 rounded-lg transition-colors text-white hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-iron-900/95 backdrop-blur-md animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium
                  ${
                    location.pathname === link.href
                      ? "text-copper-400 bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 mt-3">
              <Button
                href="/quote"
                variant="accent"
                id="nav-mobile-get-quote-cta"
                className="w-full text-sm"
              >
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
